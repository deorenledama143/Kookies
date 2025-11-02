document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     1. QUANTITY, TOTAL, CHECKBOX, DELETE SYSTEM
  ============================================================ */
// ======= Quantity handlers that always read current price =======
/*************** 1. QUANTITY HANDLERS & ROW TOTALS ***************/
const orderRows = document.querySelectorAll('.order-row');

orderRows.forEach(row => {
  const minusBtn = row.querySelector('.qty-btn.minus');
  const plusBtn = row.querySelector('.qty-btn.plus');
  const qtyInput = row.querySelector('.qty-input');
  const priceText = row.querySelector('.product-price');
  const totalText = row.querySelector('.order-total');
  const checkbox = row.querySelector('.order-select input[type="checkbox"]');

  function getUnitPrice() {
    return parseFloat(priceText.textContent.replace(/[₱,]/g, '')) || 0;
  }

  function updateRowTotalByQty(qty) {
    const unit = getUnitPrice();
    totalText.textContent = `₱${(unit * qty).toFixed(2)}`;

   

    updateGrandTotal();
    updateCheckoutCount();
  }

  minusBtn.addEventListener('click', () => {
    let qty = parseInt(qtyInput.value, 10) || 1;
    if (qty > 1) qty--;
    qtyInput.value = qty;
    updateRowTotalByQty(qty);
  });

  plusBtn.addEventListener('click', () => {
    let qty = parseInt(qtyInput.value, 10) || 1;
    qty++;
    qtyInput.value = qty;
    updateRowTotalByQty(qty);
  });

  // Optional: direct input change
  qtyInput.addEventListener('input', () => {
    let qty = parseInt(qtyInput.value, 10) || 1;
    if (qty < 1) qty = 1;
    qtyInput.value = qty;
    updateRowTotalByQty(qty);
  });
});


  // Delete buttons
  document.querySelectorAll('.delete-icon').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.order-row');
      const name = row.querySelector('.product-name')?.textContent || "this product";
      if (confirm(`🗑️ Delete ${name}?`)) {
        row.remove();
        updateGrandTotal();
        updateCheckoutCount();
      }
    });
  });

  //SEARCH BAR
  
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('productSearch');
  const productRows = document.querySelectorAll('.order-row');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase().trim();

    productRows.forEach(row => {
      const dropdown = row.querySelector('.variation-dropdown');
      if (!dropdown) return;

      const options = Array.from(dropdown.options).map(opt => opt.text.toLowerCase());

      // Reset display and highlight
      row.style.display = '';           // show row by default
      row.classList.remove('highlight'); // remove previous highlight

      if (query === '') return;         // if empty, just show all

      // Check if any variation starts with the query
      const matches = options.some(opt => opt.startsWith(query));

      if (matches) {
        row.classList.add('highlight'); // highlight matching row
        row.style.display = '';         // show row
      } else {
        row.style.display = 'none';     // hide non-matching row
      }
    });
  });
  






  // Checkbox updates
 document.querySelectorAll('.order-select input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', e => {
    const row = e.target.closest('.order-row');
    const qtyInput = row.querySelector('.qty-input');
    const priceText = row.querySelector('.product-price');
    const totalText = row.querySelector('.order-total');

    const unit = parseFloat(priceText.textContent.replace(/[₱,]/g, '')) || 0;
    const qty = parseInt(qtyInput.value, 10) || 1;
    totalText.textContent = `₱${(unit * qty).toFixed(2)}`;

    updateGrandTotal();
    updateCheckoutCount();
  });
});

  /* ============================================================
   IMAGE UPDATE WHEN VARIATION CHANGES
============================================================ */
  const productData = {
    "Brk Cookie": { name: "Brk Cookie", price: 120, image: "products/brk.jpg" },
    "Churro Cookie": { name: "Churro Cookie", price: 130, image: "products/chu.jpg" },
    "Galaxy Cookie": { name: "Galaxy Cookie", price: 140, image: "products/galaxy.jpg" },
    "Ice Cream Cookie": { name: "Ice Cream Cookie", price: 130, image: "products/ice.jpg" },
    "Milk & Cookies": { name: "Milk & Cookies", price: 120, image: "products/milk.jpg" },
    "Monday Blue": { name: "Monday Blue", price: 140, image: "products/mon.jpg" },
    "Oreo-stuffed": { name: "Oreo-stuffed", price: 150, image: "products/oreo.jpg" },
    "White Chocolate": { name: "White Chocolate", price: 130, image: "products/white chocolate.jpg" },
    "Red Cookie": { name: "Red Cookie", price: 120, image: "products/red.jpg" }, 
    "Raspberry Cookie": { name: "Raspberry Cookie", price: 140, image: "products/ras.jpg" },
    "Biscoff Cookie": { name: "Biscoff Cookie", price: 150, image: "products/biscoff.jpg" },
    "Dark Chocolate": { name: "Dark Chocolate", price: 130, image: "products/DarkChocolate.jpg" },
    "Assorted Cookie (4pcs)": { name: "Assorted Cookie (4pcs)", price: 480, image: "products/4assorted.png" },
    "Assorted Cookie (6pcs)": { name: "Assorted Cookie (6pcs)", price: 680, image: "products/6 assorted.jpg" }
  };

document.querySelectorAll('.variation-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', event => {
      const selected = event.target.value;
      const row = event.target.closest('.order-row');
      const img = row.querySelector('.product-img');
      const priceEl = row.querySelector('.product-price');
      const nameEl = row.querySelector('.product-name');
      const qtyInput = row.querySelector('.qty-input');
      const totalEl = row.querySelector('.order-total');

      const product = productData[selected]; 
      if (productData[selected]) {
      const newPrice = productData[selected].price;
      const qty = parseInt(qtyInput.value, 10) || 1;

      // Update image and price text
      img.src = productData[selected].image;
      img.alt = productData[selected].name;
      priceEl.textContent = `₱${newPrice.toFixed(2)}`;

      // Update name
      if (nameEl) nameEl.textContent = product.name;

      // Update total for that row
      const newTotal = newPrice * qty;
      totalEl.textContent = `₱${newTotal.toFixed(2)}`;
    }

    // ✅ Always recalc totals *after* price change
    updateGrandTotal();
    updateCheckoutCount();
  });
});


  //SEARCH BAR
 




  /* ============================================================
     2. VOUCHER SYSTEM
  ============================================================ */
  let activeVoucher = null;
  const voucherBtn = document.querySelector('.voucher-btn');
  const voucherModal = document.getElementById('voucherModal');
  const applyVoucherBtn = document.getElementById('applyVoucherBtn');
  const closeVoucherBtn = document.getElementById('closeVoucherBtn');

  if (voucherBtn) {
    voucherBtn.addEventListener('click', () => voucherModal.style.display = 'block');
  }
  if (closeVoucherBtn) {
    closeVoucherBtn.addEventListener('click', () => voucherModal.style.display = 'none');
  }
  if (applyVoucherBtn) {
    applyVoucherBtn.addEventListener('click', () => {
      const selected = voucherModal.querySelector('input[name="voucher"]:checked');
      activeVoucher = selected ? selected.value : null;
      voucherModal.style.display = 'none';
      updateGrandTotal();

      const appliedVoucherText = document.getElementById('appliedVoucherText');
      if (appliedVoucherText) {
        appliedVoucherText.textContent = activeVoucher ? `Applied: ${activeVoucher}` : '';
      }
      voucherBtn.textContent = activeVoucher ? 'Change voucher' : 'Select voucher';
    });
  }

  /* ============================================================
     3. GRAND TOTAL + CHECKOUT COUNT
  ============================================================ */
  function updateGrandTotal() {
    let total = 0;
    document.querySelectorAll('.order-row').forEach(row => {
      const cb = row.querySelector('.order-select input[type="checkbox"]');
      const orderTotal = parseFloat(row.querySelector('.order-total').textContent.replace(/[₱,]/g, '')) || 0;

      if (cb && cb.checked) total += orderTotal;
    });

    

    // Apply voucher
    if (activeVoucher === '₱10') total -= 10;
    else if (activeVoucher === '₱20') total -= 20;
    else if (activeVoucher === '₱50') total -= 50;
    total = Math.max(total, 0);

    const grandTotalDisplay = document.querySelector('#grandTotal');
    if (grandTotalDisplay) grandTotalDisplay.textContent = `₱${total.toFixed(2)}`;
  }

  const checkoutBtn = document.querySelector('.checkout-btn');

  function updateCheckoutCount() {
    const count = document.querySelectorAll('.order-select input[type="checkbox"]:checked').length;
    if (checkoutBtn) checkoutBtn.textContent = `Checkout (${count})`;
  }

  updateGrandTotal();
  updateCheckoutCount();

  

  /* ============================================================
     4. CHECKOUT BUTTON
  ============================================================ */
 
  // ✅ Checkout button click
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const checkedRows = document.querySelectorAll('.order-select input[type="checkbox"]:checked');
    if (checkedRows.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }

    // Gather selected order details
    const orderSummary = [];
    checkedRows.forEach(cb => {
      const row = cb.closest('.order-row');
      const name = row.querySelector('.product-name')?.textContent.trim() || "";
      const price = parseFloat(row.querySelector('.product-price')?.textContent.replace(/[₱,]/g, '')) || 0;
      const qty = parseInt(row.querySelector('.qty-input')?.value) || 1;
      const total = price * qty;
      orderSummary.push({ name, price, qty, total });
    });

    // Compute subtotal
    let subtotal = orderSummary.reduce((sum, item) => sum + item.total, 0);

    // Apply voucher discount
    let discount = 0;
    if (activeVoucher === '₱10') discount = 10;
    else if (activeVoucher === '₱20') discount = 20;
    else if (activeVoucher === '₱50') discount = 50;

    // Compute final total
    const total = Math.max(subtotal - discount, 0);

    // ✅ Save data to localStorage for checkout page
    localStorage.setItem('cartItems', JSON.stringify(orderSummary));
    localStorage.setItem('subtotal', subtotal.toFixed(2));
    localStorage.setItem('discount', discount.toFixed(2));
    localStorage.setItem('total', total.toFixed(2));

    // ✅ Redirect to checkout page
    window.location.href = "checkout.html";
  });
}

});


