document.addEventListener('DOMContentLoaded', () => {
  let categoriasData = [];
  // Carregar categorias do JSON
  fetch('data/produtos.json')
    .then(res => res.json())
    .then(data => {
      categoriasData = data.categorias;
      renderCategorias(categoriasData);
    });

  // Busca
  document.getElementById('btn-search').onclick = () => {
    const termo = document.getElementById('search').value.toLowerCase();
    const filtradas = categoriasData.filter(cat =>
      cat.titulo.toLowerCase().includes(termo)
    );
    renderCategorias(filtradas);
    document.getElementById('produtos').style.display = 'none';
    document.getElementById('categorias').style.display = 'flex';
  };

  // Modal de pedidos
  const modal = document.getElementById('modal-pedidos');
  document.getElementById('meus-pedidos').onclick = () => {
    modal.classList.remove('hidden');
    document.getElementById('pedidos-lista').innerHTML = '<p>Simulação: Nenhum pedido encontrado.</p>';
  };
  modal.querySelector('.close').onclick = () => {
    modal.classList.add('hidden');
  };

  // Funções para a área do usuário (serão movidas para meus-pedidos.html)
  // const userButton = document.getElementById('userButton');
  // const userDropdown = document.getElementById('userDropdown');
  // const logoutButton = document.getElementById('logoutButton');
  // const userName = document.getElementById('userName');
  // const userEmail = document.getElementById('userEmail');

  // // Verifica se o usuário está logado
  // function checkUserLogin() {
  //   const userData = localStorage.getItem('userData');
  //   if (userData) {
  //     const user = JSON.parse(userData);
  //     userName.textContent = user.name || 'Usuário';
  //     userEmail.textContent = user.email || '';
  //     return true;
  //   }
  //   return false;
  // }

  // // Toggle do dropdown
  // userButton.addEventListener('click', function(e) {
  //   e.stopPropagation();
  //   if (!checkUserLogin()) {
  //     window.location.href = './html/login.html';
  //     return;
  //   }
  //   userDropdown.classList.toggle('hidden');
  // });

  // // Fecha o dropdown quando clicar fora
  // document.addEventListener('click', function(e) {
  //   if (!userDropdown.contains(e.target) && e.target !== userButton) {
  //     userDropdown.classList.add('hidden');
  //   }
  // });

  // // Função de logout
  // logoutButton.addEventListener('click', function(e) {
  //   e.preventDefault();
  //   localStorage.removeItem('userData');
  //   window.location.href = 'index.html';
  // });

  // // Adicionar evento de clique para o link de perfil (agora Minhas compras)
  // document.querySelector('.dropdown-menu a[href="#my-purchases"]').addEventListener('click', function(e) {
  //   e.preventDefault();
  //   document.getElementById('categorias').style.display = 'none';
  //   document.getElementById('produtos').style.display = 'none';
  //   document.getElementById('my-purchases').style.display = 'block'; // Garante que a seção Minhas compras seja exibida
  //   userDropdown.classList.add('hidden'); // Fechar dropdown
  // });

  // // Adicionar evento de clique para o link de Meus Pedidos no dropdown
  // document.querySelector('.dropdown-menu a[href="#orders"]').addEventListener('click', function(e) {
  //   e.preventDefault();
  //   // Aqui você pode adicionar a lógica para exibir a seção de pedidos, se houver
  //   // Por enquanto, apenas fechar o dropdown e mostrar uma mensagem ou a seção de pedidos existente
  //   userDropdown.classList.add('hidden'); // Fechar dropdown
  //   // Exemplo: mostrar a seção de pedidos existente (seção #produtos ou outra) ou um modal
  //   // document.getElementById('produtos').style.display = 'block'; 
  //   // document.getElementById('categorias').style.display = 'none';
  //   // document.getElementById('my-purchases').style.display = 'none';
  //   alert('Funcionalidade de Meus Pedidos ainda não implementada.');
  // });

  // Verifica o login ao carregar a página
  // checkUserLogin();
});

function renderCategorias(categorias) {
  const container = document.getElementById('categorias');
  container.innerHTML = '';
  categorias.forEach((cat) => {
    // Card igual ao exemplo do usuário
    const card = document.createElement('a');
    card.className = 'card-categoria-link';
    card.href = cat.link || '#';
    card.innerHTML = `
      <article>
        <div class="glow-animation image-glow-container">
          <img class="image-container" src="${cat.imagem}" alt="Imagem do jogo ${cat.titulo}">
          <div class="info-overlay">
            <p class="titulo">${cat.titulo}</p>
            <button class="btn-ofertas">VER OFERTAS</button>
          </div>
        </div>
      </article>
    `;
    // Se quiser manter o clique para mostrar produtos, pode usar preventDefault e chamar mostrarProdutos(cat)
    card.querySelector('.btn-ofertas').onclick = (e) => {
      e.preventDefault();
      mostrarProdutos(cat);
    };
    container.appendChild(card);
  });
}

function mostrarProdutos(categoria) {
  const secaoProdutos = document.getElementById('produtos');
  const secaoCategorias = document.getElementById('categorias');
  secaoCategorias.style.display = 'none';
  secaoProdutos.style.display = 'flex';
  document.getElementById('my-purchases').style.display = 'none'; // Oculta Minhas compras ao mostrar produtos
  secaoProdutos.innerHTML = `
    <button class="btn-voltar" style="margin-bottom:20px">&larr; Voltar</button>
    <h2 style="width:100%;text-align:center;color:#00ff66;">${categoria.titulo}</h2>
    <div class="produtos-lista"></div>
  `;
  const lista = secaoProdutos.querySelector('.produtos-lista');
  lista.style.display = 'flex';
  lista.style.flexWrap = 'wrap';
  lista.style.gap = '24px';
  lista.style.justifyContent = 'center';
  if (!categoria.produtos || categoria.produtos.length === 0) {
    lista.innerHTML = '<p style="color:#fff">Nenhum produto disponível nesta categoria.</p>';
  } else {
    categoria.produtos.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'card-produto';
      card.style.background = '#23242a';
      card.style.borderRadius = '16px';
      card.style.boxShadow = '0 2px 12px #0005';
      card.style.width = '260px';
      card.style.overflow = 'hidden';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.transition = 'transform 0.2s';
      card.innerHTML = `
        <img src="${prod.imagem}" alt="${prod.nome}" style="width:100%;height:120px;object-fit:cover;">
        <div style="font-size:1.1rem;font-weight:bold;margin:16px 0 8px 0;text-align:center;">${prod.nome}</div>
        <div style="color:#00ff66;font-size:1.1rem;margin-bottom:8px;">${prod.preco}</div>
        <button class="btn-oferta-produto" style="background:#00ff66;color:#18191c;border:none;border-radius:8px;padding:10px 24px;font-size:1rem;font-weight:bold;margin-bottom:16px;cursor:pointer;">Comprar</button>
      `;
      lista.appendChild(card);
    });
  }
  secaoProdutos.querySelector('.btn-voltar').onclick = () => {
    secaoProdutos.style.display = 'none';
    secaoCategorias.style.display = 'flex';
    document.getElementById('my-purchases').style.display = 'none'; // Oculta Minhas compras ao voltar para categorias
  };
} 