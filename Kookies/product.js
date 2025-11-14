document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.getElementById('orderList');
  const grandTotalEl = document.getElementById('grandTotal');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const selectAllCheckbox = document.getElementById('selectAll');
  const deleteAllBtn = document.getElementById('deleteAll');
  const voucherBtn = document.querySelector('.voucher-btn');
  const appliedVoucherText = document.getElementById('appliedVoucherText');
  const voucherModal = document.getElementById('voucherModal');
  const applyVoucherBtn = document.getElementById('applyVoucherBtn');
  const closeVoucherBtn = document.getElementById('closeVoucherBtn');
  const cartSection = document.getElementById('cartSection'); 

  // Load cart or start empty
  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Voucher discount value (resets on page load; persists via application)
  let activeVoucherValue = 0;

  // Ensure voucher modal is hidden on load
  function hideVoucherModal() {
    if (voucherModal) voucherModal.style.display = 'none';
  }
  hideVoucherModal();

// Renders cart items
function renderCart() {
  if (!orderList) return;  // Safety check
  orderList.innerHTML = '';  // Clear the list
  
  if (cart.length === 0) {
    // Show simple alert message for empty cart
    alert('Your cart is empty. Please select products to add to your cart.');
    // Optionally, redirect to shop page after alert (uncomment if desired)
    window.location.href = 'index.html';
  } else {
    // Render items if cart has content
    cart.forEach((item, idx) => {
      orderList.insertAdjacentHTML('beforeend', `
        <section class="order-row" data-index="${idx}">
          <div class="order-inner">
            <div class="order-select">
              <input type="checkbox" class="item-checkbox" ${item.checked ? 'checked' : ''}>
            </div>
            <div class="order-product">
              <img src="${item.image}" alt="${item.name}" class="product-img" />
              <div class="product-info">
                <div><strong>${item.name}</strong></div>
                <div class="product-desc">${item.desc || ''}</div>
                <div class="product-price">₱${item.price.toFixed(2)}</div>
              </div>
            </div>
            <div class="order-quantity">
              <img src="Images/minus.png" alt="Minus" class="qty-btn minus" style="cursor:pointer; width:20px; height:25px;">
              <input type="text" class="qty-input" value="${item.qty}" style="width: 35px; text-align: center;">
              <img src="Images/plus.png" alt="Plus" class="qty-btn plus" style="cursor:pointer; width:20px; height:25px;">
            </div>
            <div class="order-total">₱${(item.price * item.qty).toFixed(2)}</div>
            <div class="order-delete">
              <img src="Images/delete.png" alt="Delete" class="delete-icon" style="cursor:pointer; width:20px; height:22px; vertical-align: middle; margin: 0 35px;">
            </div>
          </div>
        </section>
      `);
    });
  }
  
  updateGrandTotal();
  updateCheckoutCount();
  updateSelectAllState();
  updateCartCount();  // If you have the cart count badge
  saveCartToStorage();
}


// ... (rest of your cart.js code)
  // Save cart to localStorage
  function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }

  // Update total of checked items minus voucher discount
  function updateGrandTotal() {
    let subtotal = 0;
    cart.forEach(item => {
      if (item.checked) {
        subtotal += (item.price || 0) * (item.qty || 1);
      }
    });
    
    let discount = activeVoucherValue || 0;
    if (discount > subtotal) discount = subtotal;  // Cap discount at subtotal
    
    const total = Math.max(subtotal - discount, 0);  // Ensure total isn't negative
    
    if (grandTotalEl) grandTotalEl.textContent = `₱${total.toFixed(2)}`;
  }

  // Update checkout button label
  function updateCheckoutCount() {
    const count = cart.filter(item => item.checked).length;
    if (checkoutBtn) checkoutBtn.textContent = `Checkout(${count})`;
  }

  // Sync Select All checkbox
  function updateSelectAllState() {
    if (!selectAllCheckbox) return;
    selectAllCheckbox.checked = cart.length > 0 && cart.every(item => item.checked);
  }

  // Event delegation for plus/minus/delete controls
  orderList.addEventListener('click', e => {
    const target = e.target;
    const row = target.closest('.order-row');
    if (!row) return;
    const idx = Number(row.dataset.index);
    if (isNaN(idx)) return;

    if (target.classList.contains('plus')) {
      cart[idx].qty++;
      renderCart();
    } else if (target.classList.contains('minus')) {
      if (cart[idx].qty > 1) {
        cart[idx].qty--;
        renderCart();
      }
    } else if (target.classList.contains('delete-icon')) {
      if (confirm(`Are you sure you want to remove "${cart[idx].name}"?`)) {
        cart.splice(idx, 1);
        renderCart();
      }
    }
  });

  // Delegate quantity input changes
  orderList.addEventListener('input', e => {
    if (!e.target.classList.contains('qty-input')) return;
    const row = e.target.closest('.order-row');
    if (!row) return;
    const idx = Number(row.dataset.index);
    if (isNaN(idx)) return;

    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    e.target.value = val;
    cart[idx].qty = val;

    const priceEl = row.querySelector('.product-price');
    const totalEl = row.querySelector('.order-total');
    const unitPrice = parseFloat(priceEl.textContent.replace(/[₱,]/g, ''));
    totalEl.textContent = `₱${(unitPrice * val).toFixed(2)}`;

    updateGrandTotal();
    saveCartToStorage();
  });

  // Delegate checkbox changes
  orderList.addEventListener('change', e => {
    if (!e.target.classList.contains('item-checkbox')) return;
    const row = e.target.closest('.order-row');
    if (!row) return;
    const idx = Number(row.dataset.index);
    if (isNaN(idx)) return;

    cart[idx].checked = e.target.checked;
    updateGrandTotal();
    updateCheckoutCount();
    updateSelectAllState();
    saveCartToStorage();
  });

  // Select All checkbox handler
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const checked = selectAllCheckbox.checked;
      cart.forEach(item => item.checked = checked);
      renderCart();
    });
  }

  // Delete All button handler
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', () => {
      if (confirm('Delete all items from cart?')) {
        cart = [];
        renderCart();
      }
    });
  }

  // Checkout button handler (UPDATED: Now calculates and saves totals)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const checkedItems = cart.filter(i => i.checked);
      if (checkedItems.length === 0) {
        alert('Please select at least one product to checkout.');
        return;
      }
      
      // Calculate subtotal from checked items
      let calculatedSubtotal = 0;
      checkedItems.forEach(item => {
        calculatedSubtotal += (item.price || 0) * (item.qty || 1);
      });
      
      // Get applied voucher discount
      let appliedVoucherDiscount = activeVoucherValue || 0;
      if (appliedVoucherDiscount > calculatedSubtotal) {
        appliedVoucherDiscount = calculatedSubtotal;  // Cap at subtotal
      }
      
      // Calculate final total
      const finalTotalAfterDiscount = Math.max(calculatedSubtotal - appliedVoucherDiscount, 0);
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(checkedItems));
      localStorage.setItem('subtotal', calculatedSubtotal.toFixed(2));
      localStorage.setItem('discount', appliedVoucherDiscount.toFixed(2));
      localStorage.setItem('total', finalTotalAfterDiscount.toFixed(2));
      
      // Redirect
      window.location.href = 'checkout.html';
    });
  }

  // Voucher modal handlers
  function showVoucherModal() {
    if (voucherModal) voucherModal.style.display = 'flex';
  }

  if (voucherBtn) voucherBtn.addEventListener('click', showVoucherModal);
  if (closeVoucherBtn) closeVoucherBtn.addEventListener('click', hideVoucherModal);

  // Apply voucher handler (CONSOLIDATED: Only one instance now)
  if (applyVoucherBtn) applyVoucherBtn.addEventListener('click', () => {
    const selectedRadio = voucherModal.querySelector('input[name="voucher"]:checked');
    if (!selectedRadio) {
      alert('Please select a voucher to apply.');
      return;
    }
    activeVoucherValue = parseFloat(selectedRadio.value) || 0;
    hideVoucherModal();
    if (appliedVoucherText) {
      appliedVoucherText.textContent = `Voucher Applied: ₱${activeVoucherValue.toFixed(0)} OFF`;
    }
    if (voucherBtn) voucherBtn.textContent = 'Change voucher';
    updateGrandTotal();  // Update cart total to reflect discount
  });

  // Close modal if clicking outside
  window.addEventListener('click', e => {
    if (e.target === voucherModal) hideVoucherModal();
  });

  // NEW: View Cart button handler (add a button with class 'view-cart-btn' in your HTML)
  document.addEventListener('click', e => {
    if (e.target.classList.contains('view-cart-btn')) {
      if (cartSection) {
        cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';  // Toggle visibility
        renderCart();  // Render cart when shown
      }
    }
  });

  // Initial render
  renderCart();
});

// Back button (unchanged)
document.querySelector('.back-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});