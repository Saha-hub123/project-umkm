document.addEventListener('DOMContentLoaded', () => {
    // Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Re-trigger animation
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // WhatsApp Form Submission
    const orderForm = document.getElementById('orderForm');
    
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kategori = document.getElementById('kategori').value;
        const deskripsi = document.getElementById('deskripsi').value;
        
        // Dummy number
        const waNumber = '6281234567890';
        
        let message = `Halo KreasiVisual, saya tertarik untuk memesan desain!\n\n`;
        message += `*Nama/Usaha:* ${nama}\n`;
        message += `*Kategori Desain:* ${kategori}\n`;
        message += `*Deskripsi Kebutuhan:*\n${deskripsi}\n\n`;
        message += `Mohon info lebih lanjut mengenai proses dan harganya. Terima kasih!`;
        
        const encodedMessage = encodeURIComponent(message);
        const waURL = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        
        window.open(waURL, '_blank');
    });
});
