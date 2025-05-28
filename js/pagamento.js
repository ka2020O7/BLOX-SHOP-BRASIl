// Funções de autenticação
function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleText = document.getElementById('toggleAuthText');
    const toggleLink = document.getElementById('toggleAuthLink');

    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleText.textContent = 'Já tem uma conta?';
        toggleLink.textContent = 'Faça login';
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleText.textContent = 'Não tem uma conta?';
        toggleLink.textContent = 'Registre-se';
    }
}

// Função para fazer login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token no localStorage
            localStorage.setItem('token', data.token);
            // Mostra o formulário de pagamento
            showPaymentForm();
        } else {
            alert(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer login. Tente novamente.');
    }
}

// Função para registrar novo usuário
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }

    try {
        const response = await fetch('/api/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token no localStorage
            localStorage.setItem('token', data.token);
            // Mostra o formulário de pagamento
            showPaymentForm();
        } else {
            alert(data.message || 'Erro ao registrar');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao registrar. Tente novamente.');
    }
}

// Função para mostrar o formulário de pagamento
function showPaymentForm() {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('paymentForm').style.display = 'block';
}

// Função para processar o pagamento
async function handlePayment(event) {
    event.preventDefault();

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    if (!paymentMethod) {
        alert('Selecione um método de pagamento');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        return;
    }

    // Obtém o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const response = await fetch('/api/pagamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                paymentMethod
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Redireciona para a página de sucesso ou mostra instruções de pagamento
            if (paymentMethod === 'pix') {
                showPixInstructions(data.pixCode);
            } else if (paymentMethod === 'boleto') {
                showBoletoInstructions(data.boletoUrl);
            } else {
                // Redireciona para o gateway de pagamento do cartão
                window.location.href = data.paymentUrl;
            }
        } else {
            alert(data.message || 'Erro ao processar pagamento');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar pagamento. Tente novamente.');
    }
}

// Funções auxiliares para mostrar instruções de pagamento
function showPixInstructions(pixCode) {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.innerHTML = `
        <h2>Pagamento via PIX</h2>
        <div class="pix-instructions">
            <p>Escaneie o QR Code abaixo ou copie o código PIX:</p>
            <div class="pix-qr-code">
                <!-- Aqui você pode adicionar a geração do QR Code -->
            </div>
            <div class="pix-code">
                <p>Código PIX:</p>
                <input type="text" value="${pixCode}" readonly>
                <button onclick="copyPixCode('${pixCode}')">Copiar código</button>
            </div>
        </div>
    `;
}

function showBoletoInstructions(boletoUrl) {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.innerHTML = `
        <h2>Pagamento via Boleto</h2>
        <div class="boleto-instructions">
            <p>Clique no botão abaixo para visualizar e imprimir seu boleto:</p>
            <a href="${boletoUrl}" target="_blank" class="btn-primary">Visualizar Boleto</a>
        </div>
    `;
}

function copyPixCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert('Código PIX copiado!');
    }).catch(err => {
        console.error('Erro ao copiar código:', err);
    });
}

// Carrega as informações do produto ao iniciar a página
async function loadProductInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('Produto não encontrado');
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`/api/produtos/${productId}`);
        const product = await response.json();

        if (response.ok) {
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productPrice').textContent = `R$ ${product.price.toFixed(2)}`;
        } else {
            alert('Erro ao carregar informações do produto');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar informações do produto');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já está autenticado
    const token = localStorage.getItem('token');
    if (token) {
        showPaymentForm();
    }

    // Carrega as informações do produto
    loadProductInfo();

    // Adiciona os event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('paymentForm').addEventListener('submit', handlePayment);
    document.getElementById('toggleAuthLink').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForm();
    });
}); 