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

const reviewsCarousel = document.querySelector('.reviews-carousel');
const carouselContainer = document.querySelector('.carousel-container');
const prevButton = document.querySelector('.carousel-nav.prev');
const nextButton = document.querySelector('.carousel-nav.next');
let currentPosition = 0;
const itemWidth = 320; // Width of review item + margin

function createReviewElement(review) {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = `
        <i class="fas fa-thumbs-up"></i>
        <p>${review.text}</p>
        <p>${review.game} - ${review.date}</p>
        <p class="author">Por: ${review.author}</p>
    `;
    return reviewItem;
}

function populateCarousel() {
    reviews.forEach(review => {
        carouselContainer.appendChild(createReviewElement(review));
    });
}

function moveCarousel(direction) {
    const totalItems = reviews.length;
    const maxPosition = -(totalItems - 3) * itemWidth; // Show 3 items at a time

    if (direction === 'next') {
        currentPosition = Math.max(currentPosition - itemWidth, maxPosition);
    } else {
        currentPosition = Math.min(currentPosition + itemWidth, 0);
    }

    carouselContainer.style.transform = `translateX(${currentPosition}px)`;
}

function startCarousel() {
    let autoScrollInterval;
    let isHovered = false;

    // Add event listeners for navigation buttons
    prevButton.addEventListener('click', () => {
        moveCarousel('prev');
        resetAutoScroll();
    });

    nextButton.addEventListener('click', () => {
        moveCarousel('next');
        resetAutoScroll();
    });

    // Pause auto-scroll on hover
    carouselContainer.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    carouselContainer.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    function autoScroll() {
        if (!isHovered) {
            const totalItems = reviews.length;
            const maxPosition = -(totalItems - 3) * itemWidth;

            if (currentPosition <= maxPosition) {
                // Smooth transition back to start
                currentPosition = 0;
                carouselContainer.style.transition = 'none';
                carouselContainer.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    carouselContainer.style.transition = 'transform 0.5s ease';
                }, 50);
            } else {
                currentPosition -= itemWidth;
                carouselContainer.style.transform = `translateX(${currentPosition}px)`;
            }
        }
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(autoScroll, 3000); // Reduz para 3 segundos
    }

    // Inicia o auto-scroll
    resetAutoScroll();
}

// Initialize carousel after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    populateCarousel();
    startCarousel();
}); 