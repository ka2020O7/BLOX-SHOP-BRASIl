console.log('Gateway.js carregado');

// Configuração do gateway de pagamento
const paymentConfig = {
    // URL do gateway será configurada aqui
    gatewayUrl: '',
    
    // Número de tentativas do usuário
    attempts: 0,
    
    // Chave para armazenar tentativas no localStorage
    ATTEMPTS_KEY: 'purchase_attempts',
    
    // Inicializa o sistema de tentativas
    init() {
        console.log('Inicializando gateway...');
        this.attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0');
        console.log('Tentativas atuais:', this.attempts);
    },
    
    // Incrementa o número de tentativas
    incrementAttempts() {
        this.attempts++;
        localStorage.setItem(this.ATTEMPTS_KEY, this.attempts.toString());
    },
    
    // Verifica se é a segunda ou mais tentativa
    isSecondAttempt() {
        return this.attempts >= 1;
    },
    
    // Redireciona para o gateway de pagamento
    redirectToGateway(productId, price) {
        console.log('Tentando redirecionar para gateway...', { productId, price, attempts: this.attempts });
        if (this.isSecondAttempt()) {
            // Se for segunda tentativa ou mais, redireciona para o gateway real
            if (this.gatewayUrl) {
                window.location.href = `${this.gatewayUrl}?product=${productId}&price=${price}`;
            } else {
                console.error('URL do gateway não configurada');
            }
        } else {
            // Na primeira tentativa, apenas incrementa o contador
            this.incrementAttempts();
            // Aqui você pode adicionar uma mensagem ou comportamento específico para primeira tentativa
            alert('Produto indisponível no momento. Por favor, tente novamente em alguns minutos.');
        }
    },
    
    // Configura a URL do gateway
    setGatewayUrl(url) {
        this.gatewayUrl = url;
    }
};

// Inicializa o sistema de pagamento
document.addEventListener('DOMContentLoaded', () => {
    paymentConfig.init();
});

// Exporta o objeto de configuração
window.paymentConfig = paymentConfig;
