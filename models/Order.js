const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['pix', 'credit_card', 'boleto'],
        required: true
    },
    paymentDetails: {
        pixCode: String,
        boletoUrl: String,
        paymentUrl: String,
        transactionId: String
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

// Middleware para atualizar o updatedAt antes de salvar
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Método para marcar o pedido como pago
orderSchema.methods.markAsPaid = function() {
    this.status = 'paid';
    this.updatedAt = Date.now();
    return this.save();
};

// Método para marcar o pedido como concluído
orderSchema.methods.markAsCompleted = function() {
    this.status = 'completed';
    this.completedAt = Date.now();
    this.updatedAt = Date.now();
    return this.save();
};

// Método para cancelar o pedido
orderSchema.methods.cancel = function() {
    this.status = 'cancelled';
    this.updatedAt = Date.now();
    return this.save();
};

module.exports = mongoose.model('Order', orderSchema); 