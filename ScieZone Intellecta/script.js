document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop() || "ScieZoneIntellectaDefault.html";
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href === currentPath || (href === "ScieZoneIntellectaDefault.html" && (currentPath === "" || currentPath === "index.html"))) {
      link.classList.add("active");
    }
  });

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const updateNavbar = () => navbar.classList.toggle("navbar-shrink", window.scrollY > 50);
    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});