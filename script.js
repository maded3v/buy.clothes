document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.querySelector(".cart");
  const cartPanel = document.getElementById("cart-panel");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountSpan = document.getElementById("cart-count");
  const cartCountIcon = document.querySelector(".count-cart");
  const cartTotalSpan = document.getElementById("cart-total");
  const titleEl = document.getElementById("title1");

  let cart = [];
  loadCart();

  cartBtn.addEventListener("click", () => cartPanel.classList.add("open"));
  closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("open"));
  document.addEventListener("click", e => {
    if (cartPanel.classList.contains("open") &&
        !cartPanel.contains(e.target) &&
        !cartBtn.contains(e.target)) {
      cartPanel.classList.remove("open");
    }
  });

  function addToCart(displayName, price, imgSrc, toastName = displayName) {
  const existing = cart.find(item => item.name === displayName);
  if (existing) existing.quantity++;
  else cart.push({ name: displayName, price, imgSrc, quantity: 1 });
  
  updateCartUI();
  showToast(`[${toastName}] added to cart!`);
}

  function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.classList.add('cart-item');
    li.innerHTML = `
      <div class="cart-item-left">
        <div class="cart-item-img"><img src="${item.imgSrc}" alt="${item.name}"></div>
        <div class="cart-item-name">${item.name}</div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">$${item.price}</div>
        <div class="cart-item-controls">
          <button class="decrease">-</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="increase">+</button>
          <img class="remove-item" src="trash.png" alt="Remove">
        </div>
      </div>
    `;

    // кнопка удаления
    li.querySelector(".remove-item").addEventListener("click", e => {
      e.stopPropagation();
      cart.splice(index, 1); // удаляем по индексу
      updateCartUI();
    });

    // кнопка увеличения
    li.querySelector(".increase").addEventListener("click", e => {
      e.stopPropagation();
      item.quantity++;
      updateCartUI();
    });

    // кнопка уменьшения
    li.querySelector(".decrease").addEventListener("click", e => {
      e.stopPropagation();
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(index, 1); // удаляем если 1
      }
      updateCartUI();
    });

    cartItemsContainer.appendChild(li);
  });

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountIcon.textContent = totalCount;
  cartCountSpan.textContent = totalCount;
  cartTotalSpan.textContent = `${total}`;

  saveCart();
}




  document.querySelectorAll(".item").forEach(item => {
    const addBtn = item.querySelector(".add-button");
    const nameEl = item.querySelector(".item-name");
    if (!addBtn || !nameEl) return;
    const originalName = nameEl.textContent;
    const price = parseInt(item.dataset.price || 20);
    const imgSrc = item.querySelector("img").src;

    addBtn.addEventListener("click", () => {
      if (item.classList.contains("trusi") || item.classList.contains("accessories")) {
        addToCart(originalName, price, imgSrc);
      } else {
        showSizeSelector(item, originalName, price, imgSrc);
      }
    });
  });

  const categoryButtons = document.querySelectorAll(".choose");
  const items = document.querySelectorAll(".item");

  const defaultCategory = document.getElementById("all");
  if (defaultCategory) defaultCategory.classList.add("active");
  items.forEach(item => item.style.display = "flex");

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const category = button.id;
      items.forEach(item => {
        item.style.display = category === "all" || item.classList.contains(category) ? "flex" : "none";
      });
    });
  });

  function showSizeSelector(item, originalName, price, imgSrc) {
  const addButton = item.querySelector(".add-button");
  const nameEl = item.querySelector(".item-name");
  if (!addButton || !nameEl) return;

  nameEl.style.display = "none";
  addButton.style.display = "none";

  const sizeBox = document.createElement("div");
  sizeBox.classList.add("size-select-box");

  const labelWrapper = document.createElement("div");
  labelWrapper.classList.add("size-label-wrapper");

  const label = document.createElement("span");
  label.textContent = "? what size";

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close-size");
  closeBtn.textContent = "X";

  labelWrapper.appendChild(label);
  labelWrapper.appendChild(closeBtn);
  sizeBox.appendChild(labelWrapper);

  const sizeRow = document.createElement("div");
  sizeRow.classList.add("size-buttons");

  ["S","M","L"].forEach(size => {
    const btn = document.createElement("div");
    btn.classList.add("size-btn");
    btn.textContent = size;

    btn.addEventListener("click", () => {
      const displayName = `${originalName}[${size}]`;
      const toastName = originalName;
      addToCart(displayName, price, imgSrc, toastName);
      sizeBox.remove();
      nameEl.style.display = "block";
      addButton.style.display = "block";
    });

    sizeRow.appendChild(btn);
  });

  sizeBox.appendChild(sizeRow);
  item.appendChild(sizeBox);

  closeBtn.addEventListener("click", () => {
    sizeBox.remove();
    nameEl.style.display = "block";
    addButton.style.display = "block";
  });
}

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) {
      cart = JSON.parse(saved);
      updateCartUI();
    }
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function updateTitle() {
    if (window.innerWidth <= 1080) {
      titleEl.textContent = "buy.clothes";
    } else {
      titleEl.textContent = "made.dev / buy.clothes";
    }
  }

  updateTitle();
  window.addEventListener("resize", updateTitle);
});
