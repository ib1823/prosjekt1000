 // Dark mode toggle
 document.addEventListener('DOMContentLoaded', function() {
    const modeToggle = document.getElementById('mode-toggle');
    
    modeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });
});

