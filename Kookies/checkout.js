document.addEventListener('DOMContentLoaded', () => {
  const orderListEl = document.getElementById('orderList');
  const subtotalEl = document.getElementById('subtotal');
  const voucherEl = document.getElementById('voucherDiscount');
  const finalTotalEl = document.getElementById('finalTotal');
  const confirmBtn = document.getElementById('confirmOrderBtn');
  const modal = document.getElementById('successModal');
  const okBtn = document.getElementById('okBtn');
  const backBtn = document.getElementById('backBtn');

  // Read saved cart items and totals
  const orders = JSON.parse(localStorage.getItem('cartItems')) || [];
  const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
  const discount = parseFloat(localStorage.getItem('discount')) || 0;
  const total = parseFloat(localStorage.getItem('total')) || 0;

  // Display orders or empty message
  if (orders.length === 0) {
    orderListEl.innerHTML = '<li>No items found. Please add items to your cart.</li>';
  } else {
    orders.forEach(item => {
      const itemTotal = (item.price || 0) * (item.qty || 1);
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>Qty: ${item.qty}</small>
        </div>
        <div>₱${itemTotal.toFixed(2)}</div>
      `;
      orderListEl.appendChild(li);
    });
  }

  // Update totals display
  subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  voucherEl.textContent = discount > 0 ? `-₱${discount.toFixed(2)}` : '₱0.00';
  finalTotalEl.textContent = `₱${total.toFixed(2)}`;

  // When Place Order clicked
  confirmBtn.addEventListener('click', () => {
    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) {
      alert('Please select a payment method before placing your order.');
      return;
    }
    modal.style.display = 'flex';

    // Optionally, clear cart data on order success
    localStorage.removeItem('cartItems');
    localStorage.removeItem('subtotal');
    localStorage.removeItem('discount');
    localStorage.removeItem('total');
  });

  // Close modal and redirect back to cart
  okBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    window.location.href = 'index.html';
  });

  // Back button goes back to cart page
  backBtn.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
});

const discount = parseFloat(localStorage.getItem('discount')) || 0;
document.getElementById('voucherDiscount').textContent = discount > 0 
  ? `-₱${discount.toFixed(2)}` 
  : '₱0.00';
