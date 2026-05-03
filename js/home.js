let currentBrand = "nike";
function selectCategory(clickedButton) {
    const allButtons = document.querySelectorAll('.category-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
    currentBrand = clickedButton.getAttribute("data-brand");
    filterProducts(currentBrand);
}

function filterProducts(brand) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const pBrand = product.getAttribute("data-brand");
        if (pBrand === brand) {
            product.style.display = "block";
        }
        else {
            product.style.display = "none";
        }
    });
}

const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('data-product-id');
        localStorage.setItem('selectedProduct', id);
        window.location.href = 'html/product.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const headerProfileImg = document.getElementById('header-profile-img');
  const savedData = JSON.parse(localStorage.getItem('profileData'));
  if (savedData && savedData.profilePic) {
    headerProfileImg.src = savedData.profilePic;
  }
});
