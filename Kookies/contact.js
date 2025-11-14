document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name && email && message) {
    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    this.reset();
  } else {
    alert("Please fill in all fields before submitting.");
  }
});

function updateCartCount() {
  // Load cart from localStorage (same as in cart.js)
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  // Calculate total quantity (sum of all item.qtys)
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  
  // Update the badge element (matches your HTML ID: cart-count)
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';  // Show if > 0, hide if 0
  }
}

// Call on page load to set the initial count
document.addEventListener('DOMContentLoaded', updateCartCount);