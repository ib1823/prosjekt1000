document.addEventListener("DOMContentLoaded", function() {
    // Mørk modus håndtering (likt som i Hjem.js)
    const toggleSwitch = document.getElementById("mode-toggle");
    const body = document.body;

    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    body.classList.toggle("dark-mode", isDarkMode);
    toggleSwitch.checked = isDarkMode;

    toggleSwitch.addEventListener("change", function () {
        body.classList.toggle("dark-mode", this.checked);
        localStorage.setItem("darkMode", this.checked ? "enabled" : "disabled");
    });

    // Tab-navigasjon
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Fjern active-klassen fra alle knapper og paneler
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Legg til active-klassen på den klikka knappen
            this.classList.add('active');
            
            // Aktiver det tilsvarende panel
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });

    // Kalender for tilgjengelighet
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    
    const monthNames = [
        "Januar", "Februar", "Mars", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Desember"
    ];
    
    // Render kalender
    function renderCalendar() {
        const calendarDays = document.querySelector('.calendar-days');
        if (!calendarDays) return; // Sikrer at funksjonen bare kjører hvis kalenderen finnes
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7; // Konverterer 0 (søndag) til 7
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        calendarDays.innerHTML = '';
        
        // Legg til tomme celler for dager før første dag i måneden
        for(let i = 1; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarDays.appendChild(emptyDay);
        }
        
        // Legg til dager i måneden
        for(let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            const date = new Date(currentYear, currentMonth, day);
            
            // Deaktivere dager i fortiden
            if (date < new Date().setHours(0,0,0,0)) {
                dayElement.classList.add('disabled');
            } else {
                // Simuler at noen dager har tilgjengelige timer
                if (Math.random() > 0.3) {
                    dayElement.classList.add('available');
                    
                    dayElement.addEventListener('click', function() {
                        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        selectedDate = new Date(currentYear, currentMonth, day);
                        updateAvailableSlots();
                    });
                } else {
                    dayElement.classList.add('disabled');
                }
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Oppdater tilgjengelige tidspunkter
    function updateAvailableSlots() {
        const availabilitySlots = document.querySelector('.availability-slots');
        if (!availabilitySlots) return;
        
        // Fjern eksisterende innhold
        availabilitySlots.innerHTML = '';
        
        // Legg til header
        const header = document.createElement('h3');
        header.textContent = `Tilgjengelige timer ${selectedDate.getDate()}. ${monthNames[selectedDate.getMonth()]}`;
        availabilitySlots.appendChild(header);
        
        // Legg til tidspunkter
        const slotsGrid = document.createElement('div');
        slotsGrid.classList.add('slots-grid');
        
        // Simuler tilgjengelige tidspunkter
        const availableTimeSlots = [
            "08:00", "09:00", "10:00", "11:00", "12:00", 
            "13:00", "14:00", "15:00", "16:00", "17:00"
        ];
        
        availableTimeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            
            // Simuler at noen tidspunkter er opptatt
            if (Math.random() > 0.3) {
                timeSlot.textContent = time;
                
                timeSlot.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(ts => ts.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Vis booking-knapp
                    updateBookingAction(time);
                });
            } else {
                timeSlot.textContent = time;
                timeSlot.classList.add('unavailable');
            }
            
            slotsGrid.appendChild(timeSlot);
        });
        
        availabilitySlots.appendChild(slotsGrid);
        
        // Legg til booking action-container
        const bookingAction = document.createElement('div');
        bookingAction.classList.add('booking-action');
        availabilitySlots.appendChild(bookingAction);
    }
    
    // Oppdater booking-knapp
    function updateBookingAction(selectedTime) {
        const bookingAction = document.querySelector('.booking-action');
        if (!bookingAction) return;
        
        bookingAction.innerHTML = '';
        
        const bookButton = document.createElement('a');
        bookButton.href = `../booking/booking.html?teacher=kari-hansen&date=${selectedDate.toISOString()}&time=${selectedTime}`;
        bookButton.classList.add('book-now-btn');
        bookButton.textContent = 'Book denne timen';
        
        bookingAction.appendChild(bookButton);
    }
    
    // Navigasjon i kalenderen
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        // Initialiser kalenderen
        renderCalendar();
    }
    
    // "Se flere vurderinger"-knapp
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simuler lasting av flere vurderinger
            const reviewsList = document.querySelector('.reviews-list');
            
            // Eksempel på nye vurderinger (i en ekte app ville disse hentes fra en database)
            const newReviews = [
                {
                    name: "Emma Berg",
                    rating: 5,
                    date: "10. februar 2025",
                    text: "Kari er den beste matematikklæreren jeg har hatt! Hun forklarer komplekse konsepter på en måte som gjør dem enkle å forstå. Jeg har gått fra å hate matematikk til faktisk å like det nå. Anbefales på det sterkeste!"
                },
                {
                    name: "Lars Johansen",
                    rating: 5,
                    date: "22. januar 2025",
                    text: "Jeg tok privattimer med Kari før min siste matematikkeksamen og klarte å heve karakteren min betydelig. Hun er veldig tålmodig og forklarer ting på flere måter til du forstår det. Definitivt verdt pengene!"
                }
            ];
            
            // Legg til nye vurderinger
            newReviews.forEach(review => {
                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                reviewItem.innerHTML = `
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="../images/student4.jpg" alt="Student" class="reviewer-image">
                            <div>
                                <h4>${review.name}</h4>
                                <div class="review-rating">${stars}</div>
                            </div>
                        </div>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                `;
                
                // Sett inn før "Se flere"-knappen
                reviewsList.insertBefore(reviewItem, loadMoreBtn);
            });
            
            // Fjern "Se flere"-knappen etter at alle vurderinger er lastet
            loadMoreBtn.textContent = "Ingen flere vurderinger";
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = "0.5";
        });
    }
    
    // Green Code-prinsipp: Lazy loading av bilder
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.reviewer-image');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Bare last inn bildet når det er synlig i visningsporten
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            // Erstatt src med data-src for bilder som ikke er i visningsporten
            if (!img.dataset.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // Transparent placeholder
            }
            imageObserver.observe(img);
        });
    }
});