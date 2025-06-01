// Placeholder review data (replace with actual data fetching)
const reviews = [
    {
        text: "Otimo atendimento a entrega foi bem rapida",
        game: "Crescer Um Jardim",
        date: "29/05/25",
        author: "Endryo Silva"
    },
    {
        text: "Top demais",
        game: "Crescer Um Jardim",
        date: "29/05/25",
        author: "Lucas Diniz"
    },
    {
        text: "Ótimo",
        game: "Crescer Um Jardim",
        date: "29/05/25",
        author: "Luiz Brandão"
    },
    {
        text: "Amei a conta quando entrei estava tudo certinho do que estava",
        game: "Contas Blox Fruits",
        date: "29/05/25",
        author: "Kauã"
    },
    {
        text: "muito boa porque quase todas a lojas são golpes essa é a segunda",
        game: "Crescer Um Jardim",
        date: "28/05/25",
        author: "Luizeugenio"
    },
    {
        text: "Entrega bem rápida geralmente em 6 ou 4 minutos o Rodrigo me",
        game: "Toilet Tower Defense",
        date: "28/05/25",
        author: "Rafael Schumann"
    },
    // Add more reviews as needed
];

const carouselContainer = document.querySelector('.carousel-container');

function createReviewElement(review) {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = `
        <i class="fas fa-thumbs-up"></i>
        <p>${review.text}</p>
        <p class="author">${review.author} - ${review.date}</p>
    `;
    return reviewItem;
}

function populateCarousel() {
    // Primeiro adiciona todos os reviews originais
    reviews.forEach(review => {
        carouselContainer.appendChild(createReviewElement(review));
    });

    // Depois clona os primeiros reviews para criar o efeito infinito
    reviews.forEach(review => {
        carouselContainer.appendChild(createReviewElement(review));
    });
}

// Initialize carousel after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    populateCarousel();
}); 