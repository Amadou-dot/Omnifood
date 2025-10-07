///////////////////////////////////////////////////////////
// Modern JavaScript for Omnifood - Improved with error handling and performance optimizations

'use strict';

// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  try {
    const flex = document.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";

    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));

    document.body.appendChild(flex);
    const isSupported = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);

    if (!isSupported) document.body.classList.add("no-flexbox-gap");
  } catch (error) {
    console.warn('Flexbox gap check failed:', error);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  checkFlexGap();
  initializeNavigation();
  initializeSmoothScrolling();
  initializeStickyNavigation();
  updateCopyrightYear();
});

// Navigation functionality with error handling
function initializeNavigation() {
  const menuBtn = document.querySelector(".btn-mobile-nav");
  const header = document.querySelector(".header");
  
  if (!menuBtn || !header) {
    console.warn('Navigation elements not found');
    return;
  }

  menuBtn.addEventListener("click", function () {
    header.classList.toggle("nav-open");
    
    // Update ARIA expanded state for accessibility
    const isOpen = header.classList.contains("nav-open");
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (!header.contains(e.target) && header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close mobile nav on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scrolling with improved performance
function initializeSmoothScrolling() {
  const allLinks = document.querySelectorAll("a[href^='#']");
  
  allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = link.getAttribute("href");
      const header = document.querySelector(".header");

      // Scroll back to top
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Scroll to section
      if (href.startsWith("#")) {
        const sectionEl = document.querySelector(href);
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: "smooth" });
        }
      }

      // Close mobile navigation
      if (link.classList.contains("main-nav-link") && header) {
        header.classList.remove("nav-open");
        const menuBtn = document.querySelector(".btn-mobile-nav");
        if (menuBtn) {
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

// Sticky navigation with Intersection Observer
function initializeStickyNavigation() {
  const sectionHeroEl = document.querySelector(".section-hero");
  
  if (!sectionHeroEl) {
    console.warn('Hero section not found for sticky navigation');
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      const [entry] = entries;
      const isSticky = !entry.isIntersecting;
      
      document.body.classList.toggle("sticky", isSticky);
      
      // Announce to screen readers when navigation becomes sticky
      const nav = document.querySelector('.main-nav');
      if (nav) {
        nav.setAttribute('aria-label', isSticky ? 'Main navigation (sticky)' : 'Main navigation');
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
    }
  );
  
  observer.observe(sectionHeroEl);
}

// Update copyright year
function updateCopyrightYear() {
  const yearEl = document.querySelector(".year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
