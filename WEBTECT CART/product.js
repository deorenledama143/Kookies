document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
      0. PRODUCT DATA (Moved to top for scope)
    ============================================================ */
    // Used for updating image/price when variation dropdown changes
    const productData = {
        "Brk Cookie": { name: "Brk Cookie", price: 120, image: "Images/Cookies/brk.jpg" }, // Adjusted path based on earlier context
        "Churro Cookie": { name: "Churro Cookie", price: 130, image: "Images/Cookies/chu.jpg" },
        "Galaxy Cookie": { name: "Galaxy Cookie", price: 140, image: "Images/Cookies/galaxy.jpg" },
        "Ice Cream Cookie": { name: "Ice Cream Cookie", price: 130, image: "Images/Cookies/ice.jpg" },
        "Milk & Cookies": { name: "Milk & Cookies", price: 120, image: "Images/Cookies/milk.jpg" },
        "Monday Blue": { name: "Monday Blue", price: 140, image: "Images/Cookies/DarkChocolate.jpg" }, // Placeholder since "mon" not in list
        "Oreo-stuffed": { name: "Oreo-stuffed", price: 150, image: "Images/Cookies/oreo.jpg" },
        "White Chocolate": { name: "White Chocolate", price: 130, image: "Images/Cookies/white chocolate.jpg" },
        "Red Cookie": { name: "Red Cookie", price: 120, image: "Images/Cookies/red.jpg" }, 
        "Raspberry Cookie": { name: "Raspberry Cookie", price: 140, image: "Images/Cookies/ras.jpg" },
        "Biscoff Cookie": { name: "Biscoff Cookie", price: 150, image: "Images/Cookies/biscoff.jpg" },
        "Dark Chocolate": { name: "Dark Chocolate", price: 130, image: "Images/Cookies/DarkChocolate.jpg" },
        "Assorted Cookie (4pcs)": { name: "Assorted Cookie (4pcs)", price: 480, image: "Images/Cookies/assorted4.jpg" },
        "Assorted Cookie (6pcs)": { name: "Assorted Cookie (6pcs)", price: 680, image: "Images/Cookies/assorted6.jpg" }
    };
    
    // Global variables for cart state
    const cartItemsContainer = document.querySelector('.order-list');
    let activeVoucher = null;
    let currentCartItems = JSON.parse(localStorage.getItem('kookieCart')) || [];

    const checkoutBtn = document.querySelector('.checkout-btn');
    const grandTotalDisplay = document.querySelector('#grandTotal');


    /* ============================================================
      1. CORE CALCULATIONS (Combined from your sections 3 & 1)
    ============================================================ */

    function updateGrandTotal() {
        let total = 0;
        document.querySelectorAll('.order-list .order-row').forEach(row => {
            const cb = row.querySelector('.item-checkbox');
            // Get the current displayed total for the row
            const orderTotal = parseFloat(row.querySelector('.order-total').textContent.replace(/[₱,]/g, '')) || 0;

            if (cb && cb.checked) total += orderTotal;
        });

        // Apply voucher
        let discountAmount = 0;
        if (activeVoucher === '₱10') discountAmount = 10;
        else if (activeVoucher === '₱20') discountAmount = 20;
        else if (activeVoucher === '₱50') discountAmount = 50;

        total = Math.max(total - discountAmount, 0);

        if (grandTotalDisplay) grandTotalDisplay.textContent = `₱${total.toFixed(2)}`;
    }

    function updateCheckoutCount() {
        const count = document.querySelectorAll('.order-list .item-checkbox:checked').length;
        if (checkoutBtn) checkoutBtn.textContent = `Checkout (${count})`;
    }


    /* ============================================================
      2. DYNAMIC RENDERING (Load from localStorage)
    ============================================================ */

    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear the container first

        if (currentCartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #555;">Your cart is empty. Time to get some cookies!</p>';
            updateGrandTotal();
            updateCheckoutCount();
            return;
        }

        currentCartItems.forEach((item, index) => {
            const initialPrice = productData[item.name]?.price || item.price;
            const initialImage = productData[item.name]?.image || item.image;
            const itemTotal = (initialPrice * item.qty).toFixed(2);
            
            const row = document.createElement('section');
            row.classList.add('order-row');
            // We use the index of the item in the currentCartItems array for data lookup
            row.dataset.itemIndex = index; 

            // Create the variation options HTML based on productData keys
            let variationOptions = '';
            for (const key in productData) {
                const selected = (key === item.name) ? 'selected' : '';
                variationOptions += `<option value="${key}" ${selected}>${key}</option>`;
            }


            row.innerHTML = `
                <div class="order-inner">
                    <div class="order-select">
                        <input type="checkbox" class="item-checkbox" checked>
                    </div>

                    <div class="order-product">
                        <img src="${initialImage}" alt="${item.name}" class="product-img">
                        <div class="product-info">
                            <label class="variation-label">Variations:</label>
                            
                            <select class="variation-dropdown" data-item-index="${index}">
                                ${variationOptions}
                            </select>
                            
                            <div class="product-name">${item.name}</div>
                            <label class="product-label">Delicious Home-made Cookies! </label>
                            <div class="product-price">₱${initialPrice.toFixed(2)}</div>
                        </div>
                    </div>

                    <div class="order-quantity">
                        <button class="qty-btn minus" data-item-index="${index}"><img src="images/minus.png" alt="Minus"></button>
                        <input type="text" value="${item.qty}" class="qty-input" readonly>
                        <button class="qty-btn plus" data-item-index="${index}"><img src="images/plus.png" alt="Plus"></button>
                    </div>

                    <div class="order-total">₱${itemTotal}</div>

                    <div class="order-delete">
                        <img src="images/delete.png" alt="Delete" class="delete-icon" data-item-index="${index}">
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(row);
        });
        
        // After rendering all rows, attach listeners and update totals
        attachCartItemListeners();
        updateGrandTotal();
        updateCheckoutCount();
    }


    /* ============================================================
      3. EVENT ATTACHMENT (Your combined existing logic)
    ============================================================ */

    function attachCartItemListeners() {
        const orderRows = document.querySelectorAll('.order-list .order-row');

        orderRows.forEach(row => {
            const minusBtn = row.querySelector('.qty-btn.minus');
            const plusBtn = row.querySelector('.qty-btn.plus');
            const qtyInput = row.querySelector('.qty-input');
            const priceText = row.querySelector('.product-price');
            const totalText = row.querySelector('.order-total');
            const checkbox = row.querySelector('.item-checkbox');
            const deleteIcon = row.querySelector('.delete-icon');
            const dropdown = row.querySelector('.variation-dropdown');

            // --- Row Total Helper ---
            function getUnitPrice() {
                return parseFloat(priceText.textContent.replace(/[₱,]/g, '')) || 0;
            }

            function updateRowTotalByQty(qty) {
                const unit = getUnitPrice();
                const newTotal = unit * qty;
                totalText.textContent = `₱${newTotal.toFixed(2)}`;

                // Update the quantity in the localStorage array
                const index = parseInt(row.dataset.itemIndex);
                if (!isNaN(index) && currentCartItems[index]) {
                    currentCartItems[index].qty = qty;
                    // Note: Price update is handled by the dropdown listener
                }

                localStorage.setItem('kookieCart', JSON.stringify(currentCartItems));
                updateGrandTotal();
                updateCheckoutCount();
            }

            // --- Quantity Handlers ---
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

            // --- Delete Button ---
            deleteIcon.addEventListener('click', () => {
                const index = parseInt(row.dataset.itemIndex);
                const name = row.querySelector('.product-name')?.textContent || "this product";

                if (confirm(`🗑️ Delete ${name}?`)) {
                    currentCartItems.splice(index, 1); // Remove from array
                    localStorage.setItem('kookieCart', JSON.stringify(currentCartItems)); // Update storage
                    renderCartItems(); // Re-render the cart completely
                }
            });

            // --- Checkbox Handler ---
            checkbox.addEventListener('change', () => {
                updateGrandTotal();
                updateCheckoutCount();
            });

            // --- Variation Dropdown Handler ---
            dropdown.addEventListener('change', event => {
                const selected = event.target.value;
                const product = productData[selected]; 
                const index = parseInt(row.dataset.itemIndex);
                
                if (product) {
                    const newPrice = product.price;
                    const qty = parseInt(qtyInput.value, 10) || 1;

                    // Update image, price text, and name
                    row.querySelector('.product-img').src = product.image;
                    row.querySelector('.product-img').alt = product.name;
                    priceText.textContent = `₱${newPrice.toFixed(2)}`;
                    row.querySelector('.product-name').textContent = product.name;

                    // Update total for that row
                    const newTotal = newPrice * qty;
                    totalText.textContent = `₱${newTotal.toFixed(2)}`;

                    // Update item in currentCartItems array
                    if (!isNaN(index) && currentCartItems[index]) {
                        currentCartItems[index].name = product.name;
                        currentCartItems[index].price = newPrice;
                        currentCartItems[index].image = product.image;
                        localStorage.setItem('kookieCart', JSON.stringify(currentCartItems));
                    }
                }

                updateGrandTotal();
                updateCheckoutCount();
            });
        });

        // --- Search Bar (Needs to re-run search on dynamic rows) ---
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('productSearch');
        
        const handleSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            const allRows = document.querySelectorAll('.order-list .order-row');

            allRows.forEach(row => {
                const nameEl = row.querySelector('.product-name');
                const name = nameEl ? nameEl.textContent.toLowerCase() : '';
                
                row.style.display = '';           // show row by default
                row.classList.remove('highlight'); // remove previous highlight

                if (query === '') return;         // if empty, just show all

                if (name.startsWith(query)) {
                    row.classList.add('highlight'); // highlight matching row
                    row.style.display = '';         // show row
                } else {
                    row.style.display = 'none';     // hide non-matching row
                }
            });
        };

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('input', handleSearch); // Optional: search on input

    }


    /* ============================================================
      4. VOUCHER SYSTEM (Your existing code)
    ============================================================ */
    const voucherBtn = document.querySelector('.voucher-btn');
    const voucherModal = document.getElementById('voucherModal');
    const applyVoucherBtn = document.getElementById('applyVoucherBtn');
    const closeVoucherBtn = document.getElementById('closeVoucherBtn');
    const appliedVoucherText = document.getElementById('appliedVoucherText');

    if (voucherBtn) {
        voucherBtn.addEventListener('click', () => voucherModal.style.display = 'block');
    }
    if (closeVoucherBtn) {
        closeVoucherBtn.addEventListener('click', () => voucherModal.style.display = 'none');
    }
    if (applyVoucherBtn) {
        applyVoucherBtn.addEventListener('click', () => {
            const selected = voucherModal.querySelector('input[name="voucher"]:checked');
            // Store the value, e.g., "₱10"
            activeVoucher = selected ? selected.value : null; 
            voucherModal.style.display = 'none';
            updateGrandTotal();

            if (appliedVoucherText) {
                appliedVoucherText.textContent = activeVoucher ? `Applied: ${activeVoucher}` : '';
            }
            voucherBtn.textContent = activeVoucher ? 'Change voucher' : 'Select voucher';
        });
    }

    /* ============================================================
      5. SELECT ALL / DELETE ALL (New functionality)
    ============================================================ */
    const selectAllCheckbox = document.getElementById('select-all');
    const deleteAllBtn = document.querySelector('.delete-all-btn');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            document.querySelectorAll('.order-list .item-checkbox').forEach(cb => {
                cb.checked = selectAllCheckbox.checked;
            });
            updateGrandTotal();
            updateCheckoutCount();
        });
    }

    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', () => {
            const checkedRows = document.querySelectorAll('.order-list .item-checkbox:checked');
            if (checkedRows.length === 0) {
                alert("Please select item(s) to delete.");
                return;
            }

            if (confirm(`Are you sure you want to delete ${checkedRows.length} selected item(s)?`)) {
                // Determine which items to keep (the unchecked ones)
                const itemsToKeep = [];
                document.querySelectorAll('.order-list .order-row').forEach(row => {
                    const cb = row.querySelector('.item-checkbox');
                    const index = parseInt(row.dataset.itemIndex);
                    // Only keep the item if its checkbox is NOT checked
                    if (!cb.checked && currentCartItems[index]) {
                        itemsToKeep.push(currentCartItems[index]);
                    }
                });

                // Update the cart array and localStorage
                currentCartItems = itemsToKeep;
                localStorage.setItem('kookieCart', JSON.stringify(currentCartItems));
                
                // Re-render the cart
                renderCartItems();
            }
        });
    }


    /* ============================================================
      6. CHECKOUT BUTTON (Your existing code, modified for dynamic array)
    ============================================================ */
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const checkedRows = document.querySelectorAll('.order-list .item-checkbox:checked');
            if (checkedRows.length === 0) {
                alert("Please select at least one product to checkout.");
                return;
            }

            // Gather selected order details
            const orderSummary = [];
            let subtotal = 0;
            
            checkedRows.forEach(cb => {
                const row = cb.closest('.order-row');
                const name = row.querySelector('.product-name')?.textContent.trim() || "";
                const price = parseFloat(row.querySelector('.product-price')?.textContent.replace(/[₱,]/g, '')) || 0;
                const qty = parseInt(row.querySelector('.qty-input')?.value) || 1;
                const total = price * qty;
                
                orderSummary.push({ name, price, qty, total, image: row.querySelector('.product-img').src });
                subtotal += total;
            });

            // Apply voucher discount
            let discount = 0;
            if (activeVoucher === '₱10') discount = 10;
            else if (activeVoucher === '₱20') discount = 20;
            else if (activeVoucher === '₱50') discount = 50;

            // Compute final total
            const total = Math.max(subtotal - discount, 0);

            // ✅ Save data to localStorage for checkout page
            localStorage.setItem('checkoutItems', JSON.stringify(orderSummary));
            localStorage.setItem('checkoutSubtotal', subtotal.toFixed(2));
            localStorage.setItem('checkoutDiscount', discount.toFixed(2));
            localStorage.setItem('checkoutTotal', total.toFixed(2));

            // ✅ Redirect to checkout page
            window.location.href = "checkout.html";
        });
    }


    // --- FINAL INITIALIZATION ---
    renderCartItems();
});