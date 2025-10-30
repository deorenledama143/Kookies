document.addEventListener('DOMContentLoaded', () => {
  const orderListEl = document.getElementById('orderList');
  const subtotalEl = document.getElementById('subtotal');
  const voucherEl = document.getElementById('voucherDiscount');
  const finalTotalEl = document.getElementById('finalTotal');
  const confirmBtn = document.getElementById('confirmOrderBtn');

  // ✅ Match keys saved from cart.js
  const rawOrders = localStorage.getItem('cartItems');
  const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
  const discount = parseFloat(localStorage.getItem('discount')) || 0;
  const total = parseFloat(localStorage.getItem('total')) || 0;

  const orders = rawOrders ? JSON.parse(rawOrders) : [];

  // ✅ Render order items
  if (orders.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No items found. Go back to cart to add items.';
    orderListEl.appendChild(li);
  } else {
    orders.forEach(o => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${o.name}</strong><br>
          <small>Qty: ${o.qty}</small>
        </div>
        <div>₱${o.total.toFixed(2)}</div>
      `;
      orderListEl.appendChild(li);
    });
  }

  // ✅ Update totals
  subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
  voucherEl.textContent = `-₱${discount.toFixed(2)}`;
  finalTotalEl.textContent = `₱${total.toFixed(2)}`;


});
// When OK is clicked, go back to cart
  

document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.getElementById('confirmOrderBtn');
  const modal = document.getElementById('successModal');
  const okBtn = document.getElementById('okBtn');

  confirmBtn.addEventListener('click', (e) => {
    // 1️⃣ Check if payment method is selected
    const selectedPayment = document.querySelector('input[name="payment"]:checked');

    if (!selectedPayment) {
      e.preventDefault(); // Stop further execution
      alert('Please select a payment method before placing your order.');
      return; 
    }

    modal.style.display = 'flex';

    localStorage.removeItem('checkoutOrders');
    localStorage.removeItem('checkoutTotal');
    localStorage.removeItem('voucherDiscount');

    // 3️⃣ OK button closes modal and redirects
    okBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      window.location.href = 'cart.html';
    });
  });
});
