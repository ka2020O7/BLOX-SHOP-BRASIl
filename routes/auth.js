const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');

// Rota de registro
router.post('/cadastro', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Cria o novo usuário
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Gera o token JWT
        const token = jwt.sign(
            { userId: user._id },
            config.auth.jwtSecret,
            { expiresIn: config.auth.jwtExpiration }
        );

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca o usuário pelo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Verifica a senha
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Atualiza o último login
        user.lastLogin = Date.now();
        await user.save();

        // Gera o token JWT
        const token = jwt.sign(
            { userId: user._id },
            config.auth.jwtSecret,
            { expiresIn: config.auth.jwtExpiration }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
});

// Rota para obter o perfil do usuário
router.get('/perfil', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('orders');

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
    }
});

// Rota para atualizar o perfil do usuário
router.put('/perfil', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            message: 'Perfil atualizado com sucesso',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
});

// Rota para alterar a senha
router.put('/senha', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        // Verifica a senha atual
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        // Atualiza a senha
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: 'Erro ao alterar senha' });
    }
});

module.exports = router; 