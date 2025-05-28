const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { generatePixCode, generateBoleto, processCreditCard } = require('../services/payment');

// Listar pedidos do usuário
router.get('/meus-pedidos', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('product')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ message: 'Erro ao listar pedidos' });
    }
});

// Listar todos os pedidos (apenas admin)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('product')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ message: 'Erro ao listar pedidos' });
    }
});

// Criar um novo pedido
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { productId, paymentMethod } = req.body;

        // Verifica se o produto existe e está disponível
        const product = await Product.findById(productId);
        if (!product || !product.isAvailable()) {
            return res.status(400).json({ message: 'Produto não disponível' });
        }

        // Cria o pedido
        const order = new Order({
            user: req.user._id,
            product: productId,
            paymentMethod,
            amount: product.price
        });

        // Processa o pagamento de acordo com o método escolhido
        let paymentDetails = {};
        switch (paymentMethod) {
            case 'pix':
                paymentDetails = await generatePixCode(order);
                break;
            case 'boleto':
                paymentDetails = await generateBoleto(order);
                break;
            case 'credit_card':
                paymentDetails = await processCreditCard(order, req.body.cardDetails);
                break;
            default:
                return res.status(400).json({ message: 'Método de pagamento inválido' });
        }

        order.paymentDetails = paymentDetails;
        await order.save();

        // Atualiza o estoque do produto
        await product.updateStock(-1);

        res.status(201).json({
            message: 'Pedido criado com sucesso',
            order,
            paymentDetails
        });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ message: 'Erro ao criar pedido' });
    }
});

// Obter detalhes de um pedido
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Verifica se o usuário tem permissão para ver o pedido
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        res.json(order);
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
});

// Atualizar status do pedido (apenas admin)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        switch (status) {
            case 'paid':
                await order.markAsPaid();
                break;
            case 'completed':
                await order.markAsCompleted();
                break;
            case 'cancelled':
                await order.cancel();
                // Restaura o estoque do produto
                const product = await Product.findById(order.product);
                if (product) {
                    await product.updateStock(1);
                }
                break;
            default:
                return res.status(400).json({ message: 'Status inválido' });
        }

        res.json({
            message: 'Status do pedido atualizado com sucesso',
            order
        });
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
    }
});

module.exports = router; 