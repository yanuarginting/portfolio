// Ambil elemen checkbox
const themeToggle = document.getElementById("theme-toggle");

// Event listener untuk toggle
themeToggle.addEventListener("change", () => {
  // Jika di-check, kita ubah body ke dark-mode
  if (themeToggle.checked) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  } else {
    // Jika uncheck, ubah ke light-mode
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  }
});

// Ambil elemen tombol
const backToHomeBtn = document.getElementById("backToHome");

// Saat scroll, kita cek posisi scroll untuk menampilkan/menyembunyikan tombol
window.addEventListener("scroll", () => {
  // Jika scroll melewati 200px (misalnya), tombol muncul
  if (window.scrollY > 200) {
    backToHomeBtn.style.display = "flex"; 
  } else {
    backToHomeBtn.style.display = "none";
  }
});

// Saat tombol diklik, kembalikan scroll ke atas (homepage)
backToHomeBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});