document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Filter Category & Search Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('searchInput');

    function filterProducts() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const searchTerm = searchInput.value.toLowerCase().trim();

        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const productName = card.querySelector('h3').textContent.toLowerCase();
            
            const matchCategory = activeFilter === 'semua' || category === activeFilter;
            const matchSearch = productName.includes(searchTerm);

            if (matchCategory && matchSearch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            filterProducts();
        });
    });

    searchInput.addEventListener('input', filterProducts);

    // --- 1.5 Smooth Scrolling for Nav Links ---
    document.querySelectorAll('.nav-links a, .btn-primary').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header height (approx 120px with top bar)
                const headerOffset = 130;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 2. Shopping Cart Logic ---
    let cart = [];
    
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Toggle Sidebar
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Format Rupiah
    function formatRupiah(number) {
        return 'Rp ' + number.toLocaleString('id-ID');
    }

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Keranjang Anda masih kosong.</p>';
            cartCount.textContent = '0';
            cartTotalPrice.textContent = 'Rp 0';
            return;
        }

        cart.forEach((item, index) => {
            totalItems += item.qty;
            totalPrice += item.price * item.qty;

            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${formatRupiah(item.price)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus-btn" data-index="${index}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus-btn" data-index="${index}">+</button>
                        <button class="remove-btn" data-index="${index}">🗑️</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        cartCount.textContent = totalItems;
        cartTotalPrice.textContent = formatRupiah(totalPrice);
        
        // Add event listeners to new buttons
        attachCartEvents();
    }

    // Add to Cart
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseInt(e.target.getAttribute('data-price'));

            // Check if exist
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }

            // Animate button
            const originalText = e.target.textContent;
            e.target.textContent = 'Ditambahkan! ✓';
            e.target.style.backgroundColor = '#28a745';
            e.target.style.color = '#fff';
            e.target.style.borderColor = '#28a745';
            
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style = '';
            }, 1000);

            updateCartUI();
        });
    });

    // Cart Events (Plus, Minus, Remove)
    function attachCartEvents() {
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart[index].qty += 1;
                updateCartUI();
            });
        });

        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].qty > 1) {
                    cart[index].qty -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCartUI();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }

    // --- 3. Checkout via WhatsApp ---
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang belanja masih kosong!');
            return;
        }

        const buyerName = document.getElementById('buyerName').value.trim();
        const buyerAddress = document.getElementById('buyerAddress').value.trim();

        if (!buyerName) {
            alert('Mohon isi Nama Anda terlebih dahulu.');
            return;
        }

        let message = `Halo Toko Sembako Teh Dewi, saya ingin memesan:\n\n`;
        let totalPrice = 0;

        cart.forEach((item, i) => {
            const subtotal = item.price * item.qty;
            totalPrice += subtotal;
            message += `${i+1}. ${item.name} (${item.qty}x) = ${formatRupiah(subtotal)}\n`;
        });

        message += `\n💰 *Total Belanja: ${formatRupiah(totalPrice)}*\n`;
        
        message += `\n👤 *Nama:* ${buyerName}\n`;
        if (buyerAddress) {
            message += `📍 *Alamat Pengiriman:* ${buyerAddress}\n`;
        } else {
            message += `📍 *Alamat Pengiriman:* (Ambil sendiri di toko)\n`;
        }

        message += `\nMohon konfirmasi pesanannya. Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const waNumber = '6281234567890'; // Dummy number
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

        window.open(waUrl, '_blank');
    });

});
