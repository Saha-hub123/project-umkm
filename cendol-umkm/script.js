document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // 3. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 5. Dynamic Price Calculation
    const sizeSelect = document.getElementById('size');
    const qtyInput = document.getElementById('qty');
    const totalPriceElement = document.getElementById('totalPrice');

    function calculateTotal() {
        const pricePerItem = parseInt(sizeSelect.value) || 0;
        const qty = parseInt(qtyInput.value) || 1;
        const total = pricePerItem * qty;
        
        // Format to Rupiah
        totalPriceElement.textContent = 'Rp ' + total.toLocaleString('id-ID');
    }

    sizeSelect.addEventListener('change', calculateTotal);
    qtyInput.addEventListener('input', calculateTotal);

    // 6. WhatsApp Order Form Logic
    const orderForm = document.getElementById('orderForm');
    
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const sizePrice = document.getElementById('size').value;
        const sizeText = document.getElementById('size').options[document.getElementById('size').selectedIndex].text;
        const qty = document.getElementById('qty').value;
        const variant = document.getElementById('variant').value;
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();
        
        // Validation
        if (!name || !sizePrice || !qty) {
            alert('Mohon lengkapi Nama, Ukuran, dan Jumlah Pesanan.');
            return;
        }

        // Calculate total string
        const total = parseInt(sizePrice) * parseInt(qty);
        const formattedTotal = 'Rp ' + total.toLocaleString('id-ID');
        
        // Construct WhatsApp Message
        let message = `Halo Cendol Si Poer, saya ingin memesan:\n\n`;
        message += `👤 *Nama:* ${name}\n`;
        message += `🥤 *Pesanan:* ${sizeText} (${qty} cup)\n`;
        message += `✨ *Varian:* ${variant}\n`;
        
        if (address) {
            message += `📍 *Alamat:* ${address}\n`;
        } else {
            message += `📍 *Alamat:* (Diambil sendiri/Sesuai kesepakatan)\n`;
        }

        if (notes) {
            message += `📝 *Catatan:* ${notes}\n`;
        }
        
        message += `\n💰 *Estimasi Total:* ${formattedTotal}\n`;
        message += `*(Belum termasuk ongkos kirim)*\n`;
        message += `\nMohon konfirmasi pesanannya ya. Terima kasih!`;
        
        // URL Encode the message
        const encodedMessage = encodeURIComponent(message);
        
        // Dummy WhatsApp Number
        const waNumber = '6281234567890'; 
        
        // Create WhatsApp API URL
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
    });
});
