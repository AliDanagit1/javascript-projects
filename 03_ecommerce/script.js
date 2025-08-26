document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeSwitch = document.getElementById("theme-switch");
  
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  themeSwitch.checked = savedTheme === "dark";
  
  // Theme toggle event listener
  themeSwitch.addEventListener("change", () => {
    const theme = themeSwitch.checked ? "dark" : "light";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });

  const products = [
    { 
      id: 1, 
      name: "Wireless Headphones", 
      price: 29.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&crop=center",
      description: "Premium sound quality with noise cancellation"
    },
    { 
      id: 2, 
      name: "Smart Watch", 
      price: 49.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&crop=center",
      description: "Track fitness, notifications, and more"
    },
    { 
      id: 3, 
      name: "Laptop Stand", 
      price: 59.99,
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop&crop=center",
      description: "Ergonomic design for better posture"
    },
  ];

  // Fix: Declare cart variable and properly retrieve from localStorage
  let cart = JSON.parse(localStorage.getItem("products")) || [];

  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartmsg = document.getElementById("empty-cart");
  const carttotalmsg = document.getElementById("cart-total");
  const checkoutbtn = document.getElementById("checkout-btn");
  const totalpriceDisplay = document.getElementById("total-price");

  // Move renderCart() here after DOM elements are defined
  renderCart();

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <div class="product-info">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <span class="product-price">$${product.price.toFixed(2)}</span>
        </div>
      </div>
      <button data-id="${product.id}" class="add-to-cart-btn">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    `;
    productList.appendChild(productDiv);
  });
  productList.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const productid = parseInt(event.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productid);
      addtoCart(product);
    }
  });
  function addtoCart(product) {
    cart.push(product);
    renderCart();
    savecart();
  }
  function renderCart() {
    cartItems.innerHTML = "";
    let totalPrice = 0;
    if (cart.length > 0) {
      emptyCartmsg.classList.add("hidden");
      carttotalmsg.classList.remove("hidden");
      cart.forEach((item, index) => {
        totalPrice += item.price;
        const cartitem = document.createElement('div');
        cartitem.innerHTML = `
          <span>${item.name} - $${item.price.toFixed(2)}</span>
          <button data-index="${index}">
            <i class="fas fa-trash"></i> Remove
          </button>
        `;
        cartItems.appendChild(cartitem);
        totalpriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
        savecart();
      });
    } else {
      emptyCartmsg.classList.remove("hidden");
      totalpriceDisplay.textContent = "$0.00";
      carttotalmsg.classList.add('hidden');
    }
  }

  // event listener for remove button
  cartItems.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" || event.target.closest("button")) {
      const button = event.target.tagName === "BUTTON" ? event.target : event.target.closest("button");
      if (button.textContent.includes("Remove")) {
        const index = parseInt(button.getAttribute("data-index"));
        cart.splice(index, 1);
        renderCart();
        savecart();
      }
    }
  });

  // Add notification system
  function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add('notification-hide');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.add('notification-hide');
      setTimeout(() => notification.remove(), 300);
    });
  }

  checkoutbtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showNotification('Your cart is already empty!', 'info');
      return;
    }
    
    cart.length = 0;
    showNotification('🎉 Checkout successful! Your order has been placed.', 'success');
    renderCart();
    savecart();
  });
  function savecart() {
    localStorage.setItem("products", JSON.stringify(cart)); //Acces the local storage api
  }
});
