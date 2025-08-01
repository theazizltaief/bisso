import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu"];

  connect() {
    console.log("Vitrine2 controller connecté");
    this.initFilterTabs();
    this.initScrollEffects();
  }

  toggleMenu() {
    this.menuTarget.classList.toggle("open");
    this.updateMenuToggle();
  }

  updateMenuToggle() {
    const toggle = document.querySelector(".menu-toggle-minimal");
    const lines = toggle.querySelectorAll(".line");
    
    if (this.menuTarget.classList.contains("open")) {
      lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      lines[1].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      lines[0].style.transform = "none";
      lines[1].style.transform = "none";
    }
  }

  initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const products = document.querySelectorAll('.product-minimal');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        // Filter products
        products.forEach(product => {
          if (filter === 'all' || product.dataset.category === filter) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.5s ease forwards';
          } else {
            product.style.display = 'none';
          }
        });
      });
    });
  }

  initScrollEffects() {
    const header = document.querySelector('.header-minimal');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }
    });

    // Animate stats on scroll
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStats();
        }
      });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const finalValue = stat.textContent;
      const isNumber = !isNaN(parseInt(finalValue));
      
      if (isNumber) {
        const target = parseInt(finalValue);
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = finalValue;
            clearInterval(timer);
          } else {
            stat.textContent = Math.floor(current) + '+';
          }
        }, 30);
      }
    });
  }
}