const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

// Middleware para verificar o token JWT
exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, config.auth.jwtSecret);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar se o usuário é admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
    }
};

// Middleware para verificar se o usuário está autenticado
exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
    }
};

// Middleware para verificar se o usuário é o dono do recurso
exports.isOwner = (req, res, next) => {
    if (req.user && (req.user._id.toString() === req.params.userId || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar este recurso.' });
    }
}; 