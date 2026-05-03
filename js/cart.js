let products = JSON.parse(localStorage.getItem("cart")) || [];

function updateTotals() {
    let subtotal = 0;
    products.forEach(p => {
        const priceNum = parseFloat(p.price.replace('$', ''));
        subtotal += priceNum * p.quantity;
    });
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("total").innerText = subtotal.toFixed(2);
}

function renderProducts() {
    const container = document.getElementById("items");
    container.innerHTML = "";

    products.forEach((p, index) => {
        container.innerHTML += `
        <div class="product">
            <img src="../photos/${p.image}">
            
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>Size: ${p.size}</p>
                <p>${p.price}</p>

                <div class="qty-control">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span class="qty-number">${p.quantity}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>

            <span class="delete-btn" onclick="deleteProduct(${index})">🗑️</span>
        </div>`;
    });

    updateTotals();
}

function changeQty(index, amount) {
    products[index].quantity += amount;
    if (products[index].quantity < 1) products[index].quantity = 1;
    localStorage.setItem("cart", JSON.stringify(products));
    renderProducts();
}

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(products));
    renderProducts();
}

renderProducts();

document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && !e.target.classList.contains('checkout')) {
        let rect = e.target.getBoundingClientRect();
        e.target.style.setProperty("--x", e.clientX - rect.left + "px");
        e.target.style.setProperty("--y", e.clientY - rect.top + "px");
    }
});

document.querySelector('.checkout').addEventListener('click', () => {
    window.location.href = '../html/checkout.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const headerProfileImg = document.getElementById('header-profile-img');
  const savedData = JSON.parse(localStorage.getItem('profileData'));
  if (savedData && savedData.profilePic) {
    headerProfileImg.src = savedData.profilePic;
  }
});
