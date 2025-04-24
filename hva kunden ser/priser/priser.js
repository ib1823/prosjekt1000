document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("mode-toggle");
    const body = document.body;

    // Optimalisert dark mode-håndtering
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    body.classList.toggle("dark-mode", isDarkMode);
    toggleSwitch.checked = isDarkMode;

    toggleSwitch.addEventListener("change", function () {
        body.classList.toggle("dark-mode", this.checked);
        localStorage.setItem("darkMode", this.checked ? "enabled" : "disabled");
    });

    // FAQ-akkordeon funksjonalitet
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            // Sjekk om dette elementet allerede er aktivt
            const isActive = answer.classList.contains('active');
            
            // Lukk alle andre svar først
            document.querySelectorAll('.faq-answer').forEach(el => {
                el.classList.remove('active');
            });
            
            document.querySelectorAll('.faq-question').forEach(el => {
                el.classList.remove('active');
                el.querySelector('i').className = 'fas fa-chevron-down';
            });
            
            // Åpne dette hvis det ikke var aktivt, ellers forblir det lukket
            if (!isActive) {
                answer.classList.add('active');
                question.classList.add('active');
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
    
    // Automatisk åpne første FAQ-element ved lasting
    setTimeout(() => {
        const firstFaqQuestion = document.querySelector('.faq-question');
        if (firstFaqQuestion) {
            firstFaqQuestion.click();
            setTimeout(() => {
                firstFaqQuestion.click(); // Klikk igjen for å lukke det etter en stund
            }, 2000);
        }
    }, 500);
});