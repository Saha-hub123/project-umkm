// Inisialisasi ikon Lucide
lucide.createIcons();

// Mengatur tahun hak cipta secara dinamis
document.getElementById("year").textContent = new Date().getFullYear();

// Logika Navbar OnScroll (tambah/hapus background kustom)
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.remove("bg-transparent", "py-6");
    navbar.classList.add("bg-zinc-950/90", "backdrop-blur-md", "border-b", "border-zinc-800", "py-4");
  } else {
    navbar.classList.add("bg-transparent", "py-6");
    navbar.classList.remove("bg-zinc-950/90", "backdrop-blur-md", "border-b", "border-zinc-800", "py-4");
  }
});

// Logika Mobile Menu (Buka / Tutup)
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");

menuBtn.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  if (isOpen) {
    mobileMenu.classList.add("hidden");
    menuIcon.setAttribute("data-lucide", "menu");
  } else {
    mobileMenu.classList.remove("hidden");
    menuIcon.setAttribute("data-lucide", "x");
  }
  lucide.createIcons(); // Menggambar ulang ikon untuk mengganti menu <-> x
});

// Menutup mobile menu secara otomatis ketika link navigasi diklik
const mobileLinks = document.querySelectorAll(".mobile-link");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuIcon.setAttribute("data-lucide", "menu");
    lucide.createIcons();
  });
});
