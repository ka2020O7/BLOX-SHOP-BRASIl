const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        // Filtro por categoria
        if (category) {
            query.category = category;
        }

        // Busca por nome ou descrição
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Ordenação
        let sortOption = {};
        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ message: 'Erro ao listar produtos' });
    }
});

// Obter um produto específico
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro ao buscar produto' });
    }
});

// Criar um novo produto (apenas admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.status(201).json({
            message: 'Produto criado com sucesso',
            product
        });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro ao criar produto' });
    }
});

// Atualizar um produto (apenas admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json({
            message: 'Produto atualizado com sucesso',
            product
        });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
});

// Desativar um produto (apenas admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        product.isActive = false;
        await product.save();

        res.json({ message: 'Produto desativado com sucesso' });
    } catch (error) {
        console.error('Erro ao desativar produto:', error);
        res.status(500).json({ message: 'Erro ao desativar produto' });
    }
});

// Atualizar estoque (apenas admin)
router.patch('/:id/estoque', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        await product.updateStock(quantity);

        res.json({
            message: 'Estoque atualizado com sucesso',
            product
        });
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        res.status(500).json({ message: error.message || 'Erro ao atualizar estoque' });
    }
});

module.exports = router; 