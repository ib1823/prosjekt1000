document.addEventListener("DOMContentLoaded", function () {
    // Dark mode toggle functionality
    const toggleSwitch = document.getElementById("mode-toggle");
    const body = document.body;
    
    // Check for saved dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleSwitch.checked = true;
    }

    // Listen for dark mode toggle changes
    toggleSwitch.addEventListener("change", function () {
        if (this.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // User dropdown menu toggle
    const userMenuTrigger = document.getElementById("userMenuTrigger");
    const userDropdown = document.getElementById("userDropdown");
    
    // Toggle dropdown on click
    userMenuTrigger.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent event from bubbling to document
        userDropdown.classList.toggle("active");
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
        if (!userMenuTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove("active");
        }
    });
    
    // Mobile menu toggle (if needed)
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector("nav ul");
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", function() {
            navMenu.classList.toggle("active");
        });
    }
    
    // Initialize course progress indicators
    const progressIndicators = document.querySelectorAll(".progress-indicator");
    progressIndicators.forEach(indicator => {
        // The width is set inline in the HTML for each element
    });
    
    // Add hover effect to cards with dynamic information
    const hoverCards = document.querySelectorAll(".course-progress-card, .recommended-course, .event-card");
    hoverCards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-5px)";
            this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
        });
        
        card.addEventListener("mouseleave", function() {
            this.style.transform = "";
            this.style.boxShadow = "";
        });
    });
});