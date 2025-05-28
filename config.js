require('dotenv').config();

module.exports = {
    // Configurações do servidor
    port: process.env.PORT || 3000,
    
    // Configurações do banco de dados
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxshop',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    
    // Configurações de autenticação
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiration: '24h'
    },
    
    // Configurações de pagamento
    payment: {
        // Configurações do PIX
        pix: {
            merchantName: process.env.PIX_MERCHANT_NAME || 'Blox Shop Brasil',
            merchantCity: process.env.PIX_MERCHANT_CITY || 'SAO PAULO',
            pixKey: process.env.PIX_KEY
        },
        
        // Configurações do gateway de pagamento
        gateway: {
            apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
            sandbox: process.env.NODE_ENV !== 'production'
        }
    },
    
    // Configurações de email
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    },
    
    // Configurações de segurança
    security: {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        },
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 100 // limite de 100 requisições por janela
        }
    }
}; 