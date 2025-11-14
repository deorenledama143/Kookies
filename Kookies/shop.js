 // 🍪 Product Data (Kept the same for rich details)
    const products = [
        { id: 1, name:"Biscoff Cookie", price:120.00, desc:"Caramelized crunch with Biscoff spread.", detailedDesc: "Our signature cookie stuffed and topped with crunchy Biscoff cookies and creamy spread. A perfect balance of spice and sweet.", img:"Images/Cookies/biscoff.jpg", best:true, category:"Specialty & Stuffed", ingredients:"Flour, Biscoff Spread, Brown Sugar, Butter, Spices", calories:380, rating:4.8 },
        { id: 2, name:"Brookie Cookie", price:120.00, desc:"Crunchy & gooey chocolate cookie.", detailedDesc: "The ultimate hybrid! Half fudgy brownie, half chewy chocolate chip cookie. Pure decadence in a single bite.", img:"Images/Cookies/brk.jpg", best:false, category:"Premium Delights", ingredients:"Flour, Cocoa Powder, Semi-Sweet Chocolate Chips, Butter", calories:350, rating:4.5 },
        { id: 3, name:"Churro Cookie", price:110.00, desc:"Cinnamon-sugar, crispy edges.", detailedDesc: "Inspired by the classic Spanish treat. Rolled in a rich cinnamon-sugar mixture for a crispy exterior and soft, warm interior.", img:"Images/Cookies/chu.jpg", best:true, category:"Classic Flavors", ingredients:"Cinnamon, Flour, Sugar, Egg, Vanilla Extract", calories:310, rating:4.7 },
        { id: 4, name:"Dark Chocolate Lava", price:130.00, desc:"Rich cocoa flavor with dark chunks.", detailedDesc: "An intense, extra-dark chocolate cookie with a molten chocolate center that oozes when warm. For serious chocoholics only.", img:"Images/Cookies/DarkChocolate.jpg", best:true, category:"Premium Delights", ingredients:"Dark Cocoa, Callebaut Dark Chocolate Chunks, Butter, Sea Salt", calories:410, rating:4.9 },
        { id: 5, name:"Galaxy Cookie", price:130.00, desc:"Colorful candy-topped cookie.", detailedDesc: "A fun, vanilla-based sugar cookie loaded with colorful chocolate-coated candies, perfect for kids and the young at heart.", img:"Images/Cookies/galaxy.jpg", best:false, category:"Specialty & Stuffed", ingredients:"Flour, Sugar, Chocolate Candies, Sprinkles", calories:330, rating:4.2 },
        { id: 6, name:"Ice Cream Cookie Sandwich", price:140.00, desc:"Cookie sandwich with ice-cream vibe.", detailedDesc: "Two soft, chewy cookies hugging a generous layer of sweet, vanilla-flavored cream. Best served chilled!", img:"Images/Cookies/ice.jpg", best:false, category:"Specialty & Stuffed", ingredients:"Vanilla Cream, Chocolate Chips, Butter Cream", calories:450, rating:4.6 },
        { id: 7, name:"Milk Chocolate Chip", price:100.00, desc:"Classic milk-chocolate chip.", detailedDesc: "The timeless favourite. Perfectly chewy with generous chunks of sweet, creamy milk chocolate. Made with premium unsalted butter.", img:"Images/Cookies/milk.jpg", best:true, category:"Classic Flavors", ingredients:"Flour, Milk Chocolate Chips, Brown Sugar, Vanilla", calories:290, rating:4.8 },
        { id: 8, name:"Monster Cookie", price:160.00, desc:"Oats, peanut butter, M&Ms, and chocolate chips.", detailedDesc: "A truly massive and satisfying cookie loaded with everything: oats, creamy peanut butter, colorful M&Ms, and both semi-sweet and milk chocolate chips. It's a sweet feast!", img:"Images/Cookies/monster.jpg", best:false, category:"Specialty & Stuffed", ingredients:"Oats, Peanut Butter, M&Ms, Chocolate Chips, Brown Sugar", calories:550, rating:4.7 }, 
        { id: 9, name:"Raspberry Delight", price:125.00, desc:"Tart & sweet with raspberry.", detailedDesc: "A soft sugar cookie with a tart raspberry jam center and a delicate almond glaze. A refreshing balance of flavors.", img:"Images/Cookies/ras.jpg", best:false, category:"Classic Flavors", ingredients:"Raspberry Jam, Flour, Butter, Almond Extract", calories:320, rating:4.4 },
        { id: 10, name:"Red Velvet Cheesecake", price:145.00, desc:"Red velvet cookie with white chips.", detailedDesc: "Rich, deep red cocoa flavor stuffed with a tangy cream cheese filling. A bakery classic reimagined as a chewy cookie.", img:"Images/Cookies/red.jpg", best:false, category:"Premium Delights", ingredients:"Cocoa, Red Dye, White Choc Chips, Cream Cheese", calories:430, rating:4.7 },
        { id: 11, name:"Oreo-stuffed", price:150.00, desc:"Cookies & cream overload.", detailedDesc: "A whole Oreo cookie baked inside our classic dough, then topped with crushed Oreo pieces. Double the cream, double the fun!", img:"Images/Cookies/oreo.jpg", best:true, category:"Specialty & Stuffed", ingredients:"Oreo, Sugar, Flour, Cocoa, Cream Filling", calories:480, rating:4.9 },
        { id: 12, name:"White Chocolate Macadamia", price:155.00, desc:"White chocolate & macadamia.", detailedDesc: "Our most premium offering. Creamy Belgian white chocolate chunks paired with crunchy, roasted macadamia nuts. Unforgettable texture and flavour.", img:"Images/Cookies/white chocolate.jpg", best:true, category:"Premium Delights", ingredients:"White Chocolate Chunks, Macadamia Nuts, Butter, Vanilla", calories:460, rating:4.9 },
        { id: 13, name:"Assorted Box (4)", price:250.00, desc:"Assorted cookie box of 4 flavors.", detailedDesc: "Perfect for gifting or sampling! Includes one of each: Milk Chocolate Chip, Churro, Dark Chocolate Lava, and White Chocolate Macadamia.", img:"Images/Cookies/4 assorted.png", best:false, category:"Mix Boxes", ingredients:"Mix of 4 best flavors", calories:1500, rating:4.7 },
        { id: 14, name:"Assorted Box (6)", price:350.00, desc:"Assorted cookie box of 6 flavors.", detailedDesc: "The complete tasting experience! Includes all our best sellers: Milk Chocolate Chip, Churro, Dark Chocolate Lava, White Chocolate Macadamia, Biscoff, and Oreo-Stuffed.", img:"Images/Cookies/6 assorted.jpg", best:false, category:"Mix Boxes", ingredients:"Mix of 6 best flavors", calories:2200, rating:4.8 },
    ];

    const productRow = document.getElementById('productRow');
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    const sortSelect = document.getElementById('sortSelect');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    const modalElement = document.getElementById('viewModal');
    const modal = new bootstrap.Modal(modalElement);
    const toast = new bootstrap.Toast(document.getElementById('cartToast'), { delay: 1500 });

    let isList = false;
    let selectedProduct = null; // To hold the product data for "Add to Cart" from the modal

    function getStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? '<i class="bi bi-star-half"></i>' : '';
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return '<span class="rating-stars">' +
                '<i class="bi bi-star-fill"></i>'.repeat(fullStars) +
                halfStar +
                '<i class="bi bi-star"></i>'.repeat(emptyStars) +
                '</span>';
    }

    // --- Cart Functions (using localStorage) ---

    function updateCartIconCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = totalCount;
            cartCountEl.style.display = totalCount > 0 ? 'inline-block' : 'none';
        }
    }

    // Add to Cart function to be used everywhere
    function addToCart(product) {
        if (!product) return;
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                desc: product.desc,
                price: product.price,
                image: product.img,
                qty: 1
            });
        }
        localStorage.setItem('cartItems', JSON.stringify(cart));
        updateCartIconCounter();
        // Optionally show a toast notification here
        toast.show();
    }

    // --- Rendering, Filtering, Sorting Functions ---

    function renderProducts(filter = products) {
        productRow.innerHTML = '';
        const filterCategory = categoryFilter.value.toLowerCase();
        const visibleProducts = filter.filter(p => isList || filterCategory === 'mix boxes' || !p.category.toLowerCase().includes("box"));

        visibleProducts.forEach(p => {
            const col = document.createElement('div');
            col.className = isList ? 'col-lg-12' : 'col-xl-3 col-lg-4 col-md-6 col-sm-6';
            col.innerHTML = `
                <div class="card product-card h-100">
                    ${p.best ? '<span class="best-seller-badge"><i class="bi bi-star-fill"></i> Best Seller</span>' : ''}
                    <img src="${p.img}" alt="${p.name}" class="card-img-top">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <h6 class="fw-bold mb-0">${p.name}</h6>
                            <span class="fw-bold text-dark fs-5">₱${p.price.toFixed(2)}</span>
                        </div>
                        <p class="text-pink small fw-semibold mb-1">${p.category}</p>
                        <div class="mb-2">
                            ${getStars(p.rating)}
                        </div>
                        <p class="text-muted small mb-3">${p.desc}</p>
                        <div class="mt-auto d-flex justify-content-between">
                            <button class="btn btn-pink add-btn" data-product-id="${p.id}">Add to Cart</button>
                            <button class="btn btn-light-pink view-btn"
                                data-bs-toggle="modal" data-bs-target="#viewModal"
                                data-product-id="${p.id}">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>`;
            productRow.appendChild(col);
        });
    }
    
    function applyFiltersAndSort() {
        let filtered = [...products];

        const searchVal = searchInput.value.toLowerCase();
        if (searchVal) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal) || p.desc.toLowerCase().includes(searchVal));
        }

        const categoryVal = categoryFilter.value.toLowerCase();
        if (categoryVal !== 'all') {
            filtered = filtered.filter(p => p.category.toLowerCase().includes(categoryVal));
        }

        const sortVal = sortSelect.value;
        if (sortVal === 'high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'best') {
            filtered.sort((a, b) => (b.best ? 1 : 0) - (a.best ? 1 : 0));
        } else if (sortVal === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }
        
        renderProducts(filtered);
    }

    // Adding Events 
    // Controls change listeners
    sortSelect.addEventListener('change', applyFiltersAndSort);
    categoryFilter.addEventListener('change', applyFiltersAndSort);
    searchInput.addEventListener('input', applyFiltersAndSort);

    // View Toggle
    gridBtn.addEventListener('click', () => {
        isList = false;
        productRow.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        applyFiltersAndSort();
    });

    listBtn.addEventListener('click', () => {
        isList = true;
        productRow.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        applyFiltersAndSort();
    });

    // Add to Cart from Card Button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        }
    });

    // Modal Open Listener (View Details)
    modalElement.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const productId = parseInt(button.dataset.productId);
        const product = products.find(p => p.id === productId);

        // Store the product for the modal's Add to Cart button
        if (product) {
            selectedProduct = product; 
            document.getElementById('modalImg').src = product.img;
            document.getElementById('modalName').innerText = product.name;
            document.getElementById('modalCategory').innerText = product.category;
            document.getElementById('modalDetailedDesc').innerText = product.detailedDesc;
            document.getElementById('modalDesc').innerText = `Short Description: ${product.desc}`;
            document.getElementById('modalPrice').innerText = `₱${product.price.toFixed(2)}`;
            document.getElementById('modalIngredients').innerText = `Key Ingredients: ${product.ingredients}`;
            document.getElementById('modalCalories').innerText = `${product.calories} Kcal`;
            document.getElementById('modalRating').innerHTML = getStars(product.rating);
        }
    });

    // Add to Cart from Modal Button
    document.querySelector('.add-to-cart-modal-btn').addEventListener('click', () => {
        if (selectedProduct) {
            addToCart(selectedProduct);
            modal.hide(); // Close modal after adding to cart
        }
    });

    // Initial Load
    document.addEventListener('DOMContentLoaded', () => {
        applyFiltersAndSort();
        updateCartIconCounter();
    });