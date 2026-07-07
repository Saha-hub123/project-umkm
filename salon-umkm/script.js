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
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
            navbar.style.boxShadow = 'none';
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

    // 4. WhatsApp Booking Form Logic
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const notes = document.getElementById('notes').value.trim();
        
        // Validation (basic)
        if (!name || !service || !date || !time) {
            alert('Mohon lengkapi semua field yang diwajibkan.');
            return;
        }

        // Format Date to ID format
        const dateObj = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('id-ID', options);
        
        // Construct WhatsApp Message
        let message = `Halo Aura Salon,\nSaya ingin melakukan reservasi perawatan dengan detail berikut:\n\n`;
        message += `👤 *Nama:* ${name}\n`;
        message += `💆‍♀️ *Layanan:* ${service}\n`;
        message += `📅 *Tanggal:* ${formattedDate}\n`;
        message += `⏰ *Waktu:* ${time} WIB\n`;
        
        if (notes) {
            message += `📝 *Catatan:* ${notes}\n`;
        }
        
        message += `\nMohon konfirmasi ketersediaan jadwalnya. Terima kasih.`;
        
        // URL Encode the message
        const encodedMessage = encodeURIComponent(message);
        
        // Dummy WhatsApp Number (Format: 628...)
        const waNumber = '6281234567890'; 
        
        // Create WhatsApp API URL
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
        
        // Optional: Reset form after submit
        // bookingForm.reset();
    });
});
