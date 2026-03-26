const yearEl = document.getElementById("year");
const themeToggle = document.getElementById("theme-toggle");
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");
const reveals = document.querySelectorAll(".reveal");

yearEl.textContent = new Date().getFullYear();

// Theme Toggle Functionality
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

  if (!isDark) {
    document.body.classList.add("light-mode");
    updateThemeIcon(true);
  }
};

const updateThemeIcon = (isLight) => {
  if (isLight) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
};

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeIcon(isLight);
});

initializeTheme();

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("show"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((section) => observer.observe(section));

// Skill interaction
const skillItems = document.querySelectorAll(".skill-item");

skillItems.forEach((skill) => {
  skill.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // Remove active class from all skills
    skillItems.forEach((item) => item.classList.remove("active"));
    
    // Add active class to clicked skill
    skill.classList.add("active");
  });
});

// Click anywhere else to deactivate
document.addEventListener("click", () => {
  skillItems.forEach((item) => item.classList.remove("active"));
});
