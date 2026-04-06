document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.querySelector(".cart");
  const cartPanel = document.getElementById("cart-panel");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountSpan = document.getElementById("cart-count");
  const cartCountIcon = document.querySelector(".count-cart");
  const cartTotalSpan = document.getElementById("cart-total");
  const titleEl = document.getElementById("title1");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const paymentModal = document.getElementById("payment-modal");
  const paymentCloseBtn = document.getElementById("payment-close");
  const paymentForm = document.getElementById("payment-form");
  const paymentSubmitBtn = document.getElementById("payment-submit");
  const cardInput = document.getElementById("pay-card");
  const expInput = document.getElementById("pay-exp");
  const cvvInput = document.getElementById("pay-cvv");

  let cart = [];
  let paymentProcessing = false;
  let processingTimer = null;
  let processingTextTimer = null;
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

  function openPayment() {
    paymentModal.classList.add("open");
    paymentModal.setAttribute("aria-hidden", "false");
  }

  function closePayment() {
    if (paymentProcessing) return;
    paymentModal.classList.remove("open");
    paymentModal.setAttribute("aria-hidden", "true");
  }

  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) {
      showToast("cart is empty");
      return;
    }
    openPayment();
  });

  paymentCloseBtn.addEventListener("click", closePayment);

  paymentModal.addEventListener("click", e => {
    if (e.target === paymentModal) closePayment();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && paymentModal.classList.contains("open")) {
      closePayment();
    }
  });

  cardInput.addEventListener("input", () => {
    const digits = cardInput.value.replace(/\D/g, "").slice(0, 16);
    cardInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  expInput.addEventListener("input", () => {
    const digits = expInput.value.replace(/\D/g, "").slice(0, 4);
    expInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  cvvInput.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
  });

  paymentForm.addEventListener("submit", e => {
    e.preventDefault();
    if (paymentProcessing) return;

    const cardDigits = cardInput.value.replace(/\D/g, "");
    const expDigits = expInput.value.replace(/\D/g, "");
    const cvvDigits = cvvInput.value.replace(/\D/g, "");

    if (cardDigits.length !== 16 || expDigits.length !== 4 || cvvDigits.length !== 3) {
      showToast("check payment fields");
      return;
    }

    paymentProcessing = true;
    paymentSubmitBtn.disabled = true;

    const frames = ["processing", "processing.", "processing..", "processing..."];
    let frame = 0;
    paymentSubmitBtn.textContent = frames[frame];
    processingTextTimer = setInterval(() => {
      frame = (frame + 1) % frames.length;
      paymentSubmitBtn.textContent = frames[frame];
    }, 240);

    const delay = 800 + Math.floor(Math.random() * 401);
    processingTimer = setTimeout(() => {
      clearInterval(processingTextTimer);
      processingTextTimer = null;
      processingTimer = null;
      paymentProcessing = false;
      paymentSubmitBtn.disabled = false;
      paymentSubmitBtn.textContent = "pay now";

      showToast("demo payment success");
      cart = [];
      updateCartUI();
      paymentForm.reset();
      closePayment();
      cartPanel.classList.remove("open");
    }, delay);
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
  cartTotalSpan.textContent = `$${total}`;

  saveCart();
}




 document.querySelectorAll(".item").forEach(item => {
  const addBtn = item.querySelector(".add-button");
  const nameEl = item.querySelector(".item-name");
  const imgEl = item.querySelector("img");
  if (!addBtn || !nameEl || !imgEl) return;

  const originalName = nameEl.textContent;
  const price = parseInt(item.dataset.price || 20);
  const imgSrc = imgEl.src;

  // функция обработчик
  const handleClick = () => {
    if (item.classList.contains("trusi") || item.classList.contains("accessories")) {
      addToCart(originalName, price, imgSrc);
    } else {
      showSizeSelector(item, originalName, price, imgSrc);
    }
  };

  // клик по "+"
  addBtn.addEventListener("click", handleClick);

  // клик по названию
  nameEl.addEventListener("click", handleClick);

  // клик по картинке
  imgEl.addEventListener("click", handleClick);
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
  // если уже открыт выбор размера, выходим
  if (item.querySelector(".size-select-box")) return;

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
      setTimeout(() => toast.remove(), 500);
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
