// ─── CARRITO ───────────────────────────────────────────────
let cart = [];

const cartToggle  = document.getElementById('cartToggle');
const cartClose   = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsEl = document.getElementById('cartItems');
const cartEmpty   = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const toastEl     = document.getElementById('toast');

function openCart()  { cartSidebar.classList.add('open'); cartOverlay.classList.add('show'); }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('show'); }

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ─── AÑADIR AL CARRITO ─────────────────────────────────────
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;

  const name  = btn.dataset.name;
  const price = parseInt(btn.dataset.price);
  const icon  = btn.dataset.icon;

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, icon, qty: 1 });
  }

  renderCart();
  showToast(`${icon} ${name} añadido`);
});

// ─── RENDER CARRITO ────────────────────────────────────────
function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartSummary.style.display = 'none';
    cartItemsEl.appendChild(cartEmpty);
    cartCountEl.textContent = '0';
    return;
  }

  cartEmpty.style.display = 'none';
  cartSummary.style.display = 'block';

  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    totalItems += item.qty;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <span class="cart-item-icon">${item.icon}</span>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>$${(item.price).toLocaleString('es-CO')}</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
      </div>
      <button class="remove-btn" data-index="${index}">✕</button>
    `;
    cartItemsEl.appendChild(el);
  });

  cartTotalEl.textContent = '$' + total.toLocaleString('es-CO');
  cartCountEl.textContent = totalItems;
}

// ─── CONTROLES DE CANTIDAD ─────────────────────────────────
document.addEventListener('click', function(e) {
  const qtyBtn = e.target.closest('.qty-btn');
  if (qtyBtn) {
    const index  = parseInt(qtyBtn.dataset.index);
    const action = qtyBtn.dataset.action;
    if (action === 'increase') {
      cart[index].qty++;
    } else {
      cart[index].qty--;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    renderCart();
    return;
  }

  const removeBtn = e.target.closest('.remove-btn');
  if (removeBtn) {
    const index = parseInt(removeBtn.dataset.index);
    cart.splice(index, 1);
    renderCart();
  }
});

// ─── VACIAR CARRITO ────────────────────────────────────────
document.addEventListener('click', function(e) {
  if (e.target.closest('.btn-clear')) {
    cart = [];
    renderCart();
  }
});

// ─── TOAST ─────────────────────────────────────────────────
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ─── FILTRO DE CATEGORÍAS ──────────────────────────────────
const catCards    = document.querySelectorAll('.cat-card');
const productCards = document.querySelectorAll('.product-card');

catCards.forEach(card => {
  card.addEventListener('click', () => {
    catCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const cat = card.dataset.cat;
    productCards.forEach(p => {
      if (cat === 'todos' || p.dataset.cat === cat) {
        p.style.display = 'flex';
      } else {
        p.style.display = 'none';
      }
    });
  });
});
