const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome do produto é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Descrição do produto é obrigatória']
    },
    price: {
        type: Number,
        required: [true, 'Preço do produto é obrigatório'],
        min: [0, 'O preço não pode ser negativo']
    },
    image: {
        type: String,
        required: [true, 'Imagem do produto é obrigatória']
    },
    category: {
        type: String,
        required: [true, 'Categoria do produto é obrigatória'],
        enum: ['blox_fruits', 'blox_piece', 'other']
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: [0, 'O estoque não pode ser negativo']
    },
    features: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware para atualizar o updatedAt antes de salvar
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Método para verificar se o produto está disponível
productSchema.methods.isAvailable = function() {
    return this.isActive && this.stock > 0;
};

// Método para atualizar o estoque
productSchema.methods.updateStock = function(quantity) {
    if (this.stock + quantity < 0) {
        throw new Error('Quantidade insuficiente em estoque');
    }
    this.stock += quantity;
    return this.save();
};

module.exports = mongoose.model('Product', productSchema); 