document.addEventListener("DOMContentLoaded", function () {
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

    // Booking-variabler for å spore valg
    let selectedSubject = null;
    let selectedTeacher = null;
    let selectedDate = null;
    let selectedTime = null;

    // Håndtere stegene i bookingprosessen
    const steps = document.querySelectorAll('.step');
    const panels = document.querySelectorAll('.booking-panel');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    // Dummy-data for lærere (i en virkelig applikasjon ville dette komme fra en database)
    const teachers = {
        "Matematikk": [
            { id: 1, name: "Kari Hansen", rating: 4.8, price: 450, image: "teacher1.jpg" },
            { id: 2, name: "Ole Jensen", rating: 4.6, price: 400, image: "teacher2.jpg" },
            { id: 3, name: "Siv Larsen", rating: 4.9, price: 500, image: "teacher3.jpg" }
        ],
        "Informatikk": [
            { id: 4, name: "Geir Olsen", rating: 4.7, price: 550, image: "teacher4.jpg" },
            { id: 5, name: "Nina Berg", rating: 4.5, price: 500, image: "teacher5.jpg" }
        ],
        "Fysikk": [
            { id: 6, name: "Lars Pedersen", rating: 4.8, price: 480, image: "teacher6.jpg" },
            { id: 7, name: "Emma Solberg", rating: 4.9, price: 520, image: "teacher7.jpg" }
        ],
        "Kjemi": [
            { id: 8, name: "Ida Nielsen", rating: 4.6, price: 450, image: "teacher8.jpg" }
        ],
        "Biologi": [
            { id: 9, name: "Thomas Lie", rating: 4.7, price: 470, image: "teacher9.jpg" },
            { id: 10, name: "Sofie Holm", rating: 4.8, price: 490, image: "teacher10.jpg" }
        ],
        "Økonomi": [
            { id: 11, name: "Martin Bakken", rating: 4.6, price: 550, image: "teacher11.jpg" },
            { id: 12, name: "Lise Wang", rating: 4.9, price: 600, image: "teacher12.jpg" }
        ]
    };

    // Aktivere steg og panel
    function activateStep(stepNumber) {
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.toggle('active', stepNum === stepNumber);
            step.classList.toggle('completed', stepNum < stepNumber);
        });

        panels.forEach(panel => {
            panel.classList.remove('active');
        });

        document.getElementById(`step-${stepNumber}-panel`).classList.add('active');
    }

    // Steg 1: Velg fagområde
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            subjectCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedSubject = this.dataset.subject;
            
            // Aktiver neste-knappen
            document.querySelector('[data-next="2"]').disabled = false;
        });
    });

    // Steg 2: Hent og vis lærere basert på valgt fag
    function loadTeachers() {
        const teacherList = document.getElementById('teacher-list');
        teacherList.innerHTML = '';
        
        if (selectedSubject && teachers[selectedSubject]) {
            teachers[selectedSubject].forEach(teacher => {
                const stars = '★'.repeat(Math.floor(teacher.rating)) + 
                           (teacher.rating % 1 >= 0.5 ? '½' : '') +
                           '☆'.repeat(5 - Math.ceil(teacher.rating));
                
                const teacherCard = document.createElement('div');
                teacherCard.classList.add('teacher-card');
                teacherCard.dataset.id = teacher.id;
                teacherCard.innerHTML = `
                    <img src="${teacher.image}" alt="${teacher.name}">
                    <h3>${teacher.name}</h3>
                    <div class="stars">${stars} (${teacher.rating})</div>
                    <p class="price">${teacher.price} kr/time</p>
                `;
                
                teacherCard.addEventListener('click', function() {
                    document.querySelectorAll('.teacher-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedTeacher = teacher;
                    
                    // Aktiver neste-knappen
                    document.querySelector('[data-next="3"]').disabled = false;
                });
                
                teacherList.appendChild(teacherCard);
            });
        }
    }

    // Steg 3: Kalender og timebestilling
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const monthNames = [
        "Januar", "Februar", "Mars", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Desember"
    ];
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7; // Konverterer 0 (søndag) til 7
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        const calendarDays = document.getElementById('calendar-days');
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
                // Simuler at noen dager har tilgjengelige timer (i en ekte app ville dette komme fra en database)
                if (Math.random() > 0.3) {
                    dayElement.classList.add('available');
                    
                    dayElement.addEventListener('click', function() {
                        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        selectedDate = new Date(currentYear, currentMonth, day);
                        document.getElementById('selected-date').textContent = 
                            `${day}. ${monthNames[currentMonth]} ${currentYear}`;
                        
                        // Vis tilgjengelige tidspunkter
                        showTimeSlots();
                    });
                } else {
                    dayElement.classList.add('disabled');
                }
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    function showTimeSlots() {
        const timeSlots = document.getElementById('time-slots');
        timeSlots.classList.add('active');
        
        const slotsGrid = document.querySelector('.slots-grid');
        slotsGrid.innerHTML = '';
        
        // Simuler tilgjengelige tidspunkter (i en ekte app ville dette komme fra en database)
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
                    selectedTime = time;
                    
                    // Aktiver neste-knappen
                    document.querySelector('[data-next="4"]').disabled = false;
                });
            } else {
                timeSlot.textContent = time;
                timeSlot.classList.add('unavailable');
            }
            
            slotsGrid.appendChild(timeSlot);
        });
    }
    
    // Navigasjon i kalenderen
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Steg 4: Oppsummering og bekreftelse
    function updateSummary() {
        document.getElementById('summary-subject').textContent = selectedSubject;
        document.getElementById('summary-teacher').textContent = selectedTeacher ? selectedTeacher.name : '';
        document.getElementById('summary-date').textContent = selectedDate ? 
            `${selectedDate.getDate()}. ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : '';
        document.getElementById('summary-time').textContent = selectedTime || '';
        document.getElementById('summary-price').textContent = selectedTeacher ? `${selectedTeacher.price} kr` : '';
    }
    
    // Håndtere betalingsalternativer
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Knapp for å bekrefte booking
    document.querySelector('.confirm-booking').addEventListener('click', function() {
        // Generer et tilfeldig referansenummer (i en ekte app ville dette komme fra en database)
        const bookingRef = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Oppdater modal med bookingdetaljer
        document.getElementById('booking-ref').textContent = bookingRef;
        document.getElementById('modal-subject').textContent = selectedSubject;
        document.getElementById('modal-teacher').textContent = selectedTeacher.name;
        document.getElementById('modal-datetime').textContent = 
            `${selectedDate.getDate()}. ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()} kl. ${selectedTime}`;
        
        // Vis bekreftelsesmodal
        document.getElementById('booking-success').classList.add('active');
    });
    
    // Lukk modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('booking-success').classList.remove('active');
    });
    
    // Gå til dashboard (i en ekte app ville dette navigere til brukerens dashboard)
    document.getElementById('go-to-dashboard').addEventListener('click', function() {
        document.getElementById('booking-success').classList.remove('active');
        window.location.href = "../dashboard/dashboard.html";
    });

    // Navigasjon mellom steg
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            
            // Utfør nødvendige handlinger før vi går til neste steg
            if (nextStep === 2) {
                loadTeachers();
            } else if (nextStep === 3) {
                renderCalendar();
            } else if (nextStep === 4) {
                updateSummary();
            }
            
            activateStep(nextStep);
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.prev);
            activateStep(prevStep);
        });
    });

    // Initialiser første steg
    activateStep(1);

    // Implementere energieffektive praksiser for Green Code
    // 1. Forsinkelse av ikke-kritiske operasjoner
    setTimeout(() => {
        // Forhåndslasting av lærerbilder (ville bare gjøres for de som er synlige i en ekte app)
        if (window.IntersectionObserver) {
            const lazyLoadImages = () => {
                const teacherImgs = document.querySelectorAll('.teacher-card img');
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            observer.unobserve(img);
                        }
                    });
                });
                
                teacherImgs.forEach(img => {
                    imageObserver.observe(img);
                });
            };
            
            // Denne koden ville bare kjøre når faktisk nødvendig
            document.querySelector('[data-next="2"]').addEventListener('click', lazyLoadImages, { once: true });
        }
    }, 1000);
    
    // 2. Optimalisere event listeners
    // Bruk delegert event handling for å redusere antall listeners
    document.addEventListener('click', function(e) {
        // Eksempel på delegering som kunne være implementert
        if (e.target && e.target.closest('.calendar-day')) {
            // Håndtere kalenderdag-klikk
        }
    }, { passive: true }); // Legg merke til passive flag for bedre scrolling-ytelse
    
    // 3. Minneeffektivisering
    // Fjerne unødvendige data når de ikke trengs lenger
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Rense unødvendige data når vi går videre
            if (parseInt(this.dataset.next) === 3) {
                // Når vi går fra lærere til kalender, kan vi fjerne ubrukte lærerdata
                Object.keys(teachers).forEach(subject => {
                    if (subject !== selectedSubject) {
                        // I en ekte app ville vi kunne frigjøre minne her
                    }
                });
            }
        });
    });
});