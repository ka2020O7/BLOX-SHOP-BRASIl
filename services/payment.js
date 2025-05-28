const config = require('../config');
const { PIX } = require('pix-payment');
const { Boleto } = require('boleto-payment');
const { CreditCard } = require('credit-card-payment');

// Configuração do PIX
const pix = new PIX({
    merchantName: config.payment.pix.merchantName,
    merchantCity: config.payment.pix.merchantCity,
    pixKey: config.payment.pix.pixKey
});

// Configuração do Boleto
const boleto = new Boleto({
    apiKey: config.payment.gateway.apiKey,
    sandbox: config.payment.gateway.sandbox
});

// Configuração do Cartão de Crédito
const creditCard = new CreditCard({
    apiKey: config.payment.gateway.apiKey,
    sandbox: config.payment.gateway.sandbox
});

// Gerar código PIX
async function generatePixCode(order) {
    try {
        const pixData = {
            amount: order.amount,
            description: `Pedido #${order._id}`,
            externalId: order._id.toString()
        };

        const pixCode = await pix.generate(pixData);

        return {
            pixCode: pixCode.code,
            qrCode: pixCode.qrCode,
            expiresAt: pixCode.expiresAt
        };
    } catch (error) {
        console.error('Erro ao gerar código PIX:', error);
        throw new Error('Erro ao gerar código PIX');
    }
}

// Gerar boleto
async function generateBoleto(order) {
    try {
        const boletoData = {
            amount: order.amount,
            description: `Pedido #${order._id}`,
            customer: {
                name: order.user.name,
                email: order.user.email
            },
            externalId: order._id.toString()
        };

        const boletoResult = await boleto.generate(boletoData);

        return {
            boletoUrl: boletoResult.url,
            barcode: boletoResult.barcode,
            expiresAt: boletoResult.expiresAt
        };
    } catch (error) {
        console.error('Erro ao gerar boleto:', error);
        throw new Error('Erro ao gerar boleto');
    }
}

// Processar pagamento com cartão de crédito
async function processCreditCard(order, cardDetails) {
    try {
        const paymentData = {
            amount: order.amount,
            description: `Pedido #${order._id}`,
            card: {
                number: cardDetails.number,
                holder: cardDetails.holder,
                expiry: cardDetails.expiry,
                cvv: cardDetails.cvv
            },
            customer: {
                name: order.user.name,
                email: order.user.email
            },
            externalId: order._id.toString()
        };

        const paymentResult = await creditCard.process(paymentData);

        return {
            transactionId: paymentResult.id,
            status: paymentResult.status,
            paymentUrl: paymentResult.paymentUrl
        };
    } catch (error) {
        console.error('Erro ao processar pagamento com cartão:', error);
        throw new Error('Erro ao processar pagamento com cartão');
    }
}

// Verificar status do pagamento
async function checkPaymentStatus(order) {
    try {
        let status;
        switch (order.paymentMethod) {
            case 'pix':
                status = await pix.checkStatus(order.paymentDetails.pixCode);
                break;
            case 'boleto':
                status = await boleto.checkStatus(order.paymentDetails.barcode);
                break;
            case 'credit_card':
                status = await creditCard.checkStatus(order.paymentDetails.transactionId);
                break;
            default:
                throw new Error('Método de pagamento inválido');
        }

        return status;
    } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
        throw new Error('Erro ao verificar status do pagamento');
    }
}

module.exports = {
    generatePixCode,
    generateBoleto,
    processCreditCard,
    checkPaymentStatus
}; 