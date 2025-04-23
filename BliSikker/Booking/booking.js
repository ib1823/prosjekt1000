/**
 * Bli Sikker Booking System
 * Implementing Green Code principles:
 * 1. Energy efficiency
 * 2. Reduced memory usage
 * 3. Optimized DOM operations
 * 4. Lazy loading
 * 5. Efficient event handling
 */

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM er lastet - starter initialisering");
    
    // Cache DOM elements to reduce DOM lookups
    const body = document.body;
    const toggleSwitch = document.getElementById("mode-toggle");
    const steps = document.querySelectorAll('.step');
    const panels = document.querySelectorAll('.booking-panel');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Booking state management (centralized state for better memory efficiency)
    const bookingState = {
      selectedSubject: null,
      selectedTeacher: null,
      selectedDate: null,
      selectedTime: null,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
    };
  
    // Constants (defined once to reduce memory allocation)
    const monthNames = [
      "Januar", "Februar", "Mars", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Desember"
    ];
    
    // Dark mode handling
    initDarkMode();
    
    // Initialize booking interface
    initBookingInterface();
    
    // Initialize event listeners using event delegation where possible
    initEventListeners();
    
    /**
     * Initialize dark mode functionality
     */
    function initDarkMode() {
      console.log("Initialiserer mørkt modus");
      // Sjekk om mørkt modus er lagret i localStorage
      const isDarkMode = localStorage.getItem("darkMode") === "enabled";
      
      // Sett mørkt modus hvis det er lagret
      if (isDarkMode) {
        body.classList.add("dark-mode");
        if (toggleSwitch) toggleSwitch.checked = true;
      }
  
      // Legg til event listener på toggle-bryteren
      if (toggleSwitch) {
        toggleSwitch.addEventListener("change", function() {
          console.log("Toggle mørkt modus:", this.checked);
          if (this.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
          } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
          }
        });
      } else {
        console.error("Fant ikke toggle-bryter med ID 'mode-toggle'");
      }
    }
    
    /**
     * Initialize the booking interface
     */
    function initBookingInterface() {
      console.log("Initialiserer booking-grensesnitt");
      // Activate the first step
      activateStep(1);
      
      // Initialize subject selection
      initSubjectSelection();
    }
    
    /**
     * Initialize event listeners using delegation where possible
     */
    function initEventListeners() {
      console.log("Setter opp event listeners");
      
      // Navigation buttons
      nextButtons.forEach(button => {
        button.addEventListener("click", handleNextButtonClick);
      });
      
      prevButtons.forEach(button => {
        button.addEventListener("click", handlePrevButtonClick);
      });
      
      // Calendar navigation
      const prevMonthBtn = document.getElementById('prev-month');
      const nextMonthBtn = document.getElementById('next-month');
      
      if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", navigatePrevMonth);
      }
      
      if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", navigateNextMonth);
      }
      
      // Modal events
      const closeModalBtn = document.querySelector('.close-modal');
      const goToDashboardBtn = document.getElementById('go-to-dashboard');
      
      if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
      }
      
      if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener("click", goToDashboard);
      }
      
      // Confirmation button
      const confirmBtn = document.querySelector('.confirm-booking');
      if (confirmBtn) {
        confirmBtn.addEventListener("click", confirmBooking);
      }
      
      // Payment method selection (using event delegation)
      const paymentMethods = document.querySelector('.payment-methods');
      if (paymentMethods) {
        paymentMethods.addEventListener("click", function(e) {
          const paymentMethod = e.target.closest('.payment-method');
          if (paymentMethod) {
            document.querySelectorAll('.payment-method').forEach(method => {
              method.classList.remove('active');
              method.setAttribute('aria-checked', 'false');
            });
            paymentMethod.classList.add('active');
            paymentMethod.setAttribute('aria-checked', 'true');
          }
        });
      }
      
      // Keyboard accessibility for payment methods
      document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.querySelectorAll('.payment-method').forEach(m => {
              m.classList.remove('active');
              m.setAttribute('aria-checked', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-checked', 'true');
          }
        });
      });
    }
    
    /**
     * Handle next button click
     */
    function handleNextButtonClick() {
      console.log("Neste-knapp klikket");
      const nextStep = parseInt(this.dataset.next);
      console.log("Går til steg:", nextStep);
      
      // Load necessary data based on the next step
      switch(nextStep) {
        case 2:
          loadTeachers();
          break;
        case 3:
          renderCalendar();
          break;
        case 4:
          updateSummary();
          break;
      }
      
      activateStep(nextStep);
    }
    
    /**
     * Handle previous button click
     */
    function handlePrevButtonClick() {
      console.log("Tilbake-knapp klikket");
      const prevStep = parseInt(this.dataset.prev);
      console.log("Går til steg:", prevStep);
      activateStep(prevStep);
    }
    
    /**
     * Navigate to previous month
     */
    function navigatePrevMonth() {
      console.log("Navigerer til forrige måned");
      bookingState.currentMonth--;
      if (bookingState.currentMonth < 0) {
        bookingState.currentMonth = 11;
        bookingState.currentYear--;
      }
      renderCalendar();
    }
    
    /**
     * Navigate to next month
     */
    function navigateNextMonth() {
      console.log("Navigerer til neste måned");
      bookingState.currentMonth++;
      if (bookingState.currentMonth > 11) {
        bookingState.currentMonth = 0;
        bookingState.currentYear++;
      }
      renderCalendar();
    }
    
    /**
     * Close success modal
     */
    function closeModal() {
      console.log("Lukker bekreftelses-modal");
      const modal = document.getElementById('booking-success');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
    
    /**
     * Go to dashboard
     */
    function goToDashboard() {
      console.log("Går til dashboard");
      closeModal();
      window.location.href = "../dashboard/dashboard.html";
    }
    
    /**
     * Confirm booking
     */
    function confirmBooking() {
      console.log("Bekrefter booking");
      // Generate a random reference number (would come from a database in a real app)
      const bookingRef = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Update modal with booking details
      const bookingRefEl = document.getElementById('booking-ref');
      const modalSubjectEl = document.getElementById('modal-subject');
      const modalTeacherEl = document.getElementById('modal-teacher');
      const modalDatetimeEl = document.getElementById('modal-datetime');
      
      if (bookingRefEl) bookingRefEl.textContent = bookingRef;
      if (modalSubjectEl) modalSubjectEl.textContent = bookingState.selectedSubject || '';
      if (modalTeacherEl && bookingState.selectedTeacher) {
        modalTeacherEl.textContent = bookingState.selectedTeacher.name;
      }
      
      if (modalDatetimeEl && bookingState.selectedDate && bookingState.selectedTime) {
        modalDatetimeEl.textContent = 
          `${bookingState.selectedDate.getDate()}. ${monthNames[bookingState.selectedDate.getMonth()]} ${bookingState.selectedDate.getFullYear()} kl. ${bookingState.selectedTime}`;
      }
      
      // Show confirmation modal
      const modal = document.getElementById('booking-success');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus on close button for accessibility
        setTimeout(() => {
          const closeBtn = document.querySelector('.close-modal');
          if (closeBtn) closeBtn.focus();
        }, 100);
      }
    }
    
    /**
     * Activate a step in the booking process
     * @param {number} stepNumber - The step number to activate
     */
    function activateStep(stepNumber) {
      console.log("Aktiverer steg:", stepNumber);
      // Update step indicators
      steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum === stepNumber) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
        
        if (stepNum < stepNumber) {
          step.classList.add('completed');
        } else {
          step.classList.remove('completed');
        }
      });
  
      // Show the active panel
      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      });
  
      const activePanel = document.getElementById(`step-${stepNumber}-panel`);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.setAttribute('aria-hidden', 'false');
        
        // Focus management for accessibility
        setTimeout(() => {
          const focusTarget = activePanel.querySelector('h2');
          if (focusTarget) {
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus();
            focusTarget.removeAttribute('tabindex');
          }
        }, 100);
      } else {
        console.error(`Fant ikke panel for steg ${stepNumber}`);
      }
    }
    
    /**
     * Initialize subject selection
     */
    function initSubjectSelection() {
      console.log("Initialiserer fagvalg");
      const subjectCards = document.querySelectorAll('.subject-card');
      const subjectGrid = document.querySelector('.subject-grid');
      
      if (!subjectGrid) {
        console.error("Fant ikke .subject-grid elementet");
        return;
      }
      
      // Direct click handling for subject cards
      subjectCards.forEach(card => {
        card.addEventListener('click', function() {
          console.log("Fag valgt:", this.dataset.subject);
          
          // Fjern 'selected' klassen fra alle kort
          subjectCards.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
          });
          
          // Legg til 'selected' klassen på valgt kort
          this.classList.add('selected');
          this.setAttribute('aria-pressed', 'true');
          
          // Oppdater booking state
          bookingState.selectedSubject = this.dataset.subject;
          
          // Aktiver neste-knappen
          const nextButton = document.querySelector('[data-next="2"]');
          if (nextButton) nextButton.disabled = false;
        });
      });
      
      // Keyboard accessibility
      subjectCards.forEach(card => {
        card.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Trigger click event
            this.click();
          }
        });
      });
    }
    
    /**
     * Load teachers based on selected subject
     * Green code approach: Only load data when needed
     */
    function loadTeachers() {
      console.log("Laster lærere for fag:", bookingState.selectedSubject);
      if (!bookingState.selectedSubject) {
        console.error("Ingen fag er valgt");
        return;
      }
      
      const teacherList = document.getElementById('teacher-list');
      if (!teacherList) {
        console.error("Fant ikke lærer-listen");
        return;
      }
      
      // Clear previous content
      teacherList.innerHTML = '';
      
      // Get teachers for the selected subject
      const subjectTeachers = getTeachersBySubject(bookingState.selectedSubject);
      
      if (!subjectTeachers || subjectTeachers.length === 0) {
        teacherList.innerHTML = '<p>Ingen lærere tilgjengelig for dette faget.</p>';
        return;
      }
      
      // Create teacher cards efficiently using DocumentFragment
      const fragment = document.createDocumentFragment();
      
      subjectTeachers.forEach(teacher => {
        const teacherCard = createTeacherCard(teacher);
        fragment.appendChild(teacherCard);
      });
      
      // Append all teachers at once to minimize reflows
      teacherList.appendChild(fragment);
      
      // Fjern eventuelle tidligere event listeners for å unngå minnelekasje
      const oldHandler = teacherList._clickHandler;
      if (oldHandler) {
        teacherList.removeEventListener('click', oldHandler);
      }
      
      // Opprett ny click handler
      const handleTeacherSelection = function(e) {
        const teacherCard = e.target.closest('.teacher-card');
        if (teacherCard) {
          console.log("Lærer valgt:", teacherCard.dataset.id);
          
          document.querySelectorAll('.teacher-card').forEach(card => {
            card.classList.remove('selected');
          });
          
          teacherCard.classList.add('selected');
          const teacherId = parseInt(teacherCard.dataset.id);
          
          // Find the selected teacher in the data
          bookingState.selectedTeacher = subjectTeachers.find(teacher => teacher.id === teacherId);
          
          // Enable next button
          const nextButton = document.querySelector('[data-next="3"]');
          if (nextButton) nextButton.disabled = false;
        }
      };
      
      // Lagre referanse til handleren for senere fjerning
      teacherList._clickHandler = handleTeacherSelection;
      
      // Legg til event listener
      teacherList.addEventListener('click', handleTeacherSelection);
    }
    
    /**
     * Create a teacher card element
     * @param {Object} teacher - The teacher data
     * @return {HTMLElement} - The teacher card element
     */
    function createTeacherCard(teacher) {
      console.log("Oppretter lærerkort for:", teacher.name);
      const stars = '★'.repeat(Math.floor(teacher.rating)) + 
                   (teacher.rating % 1 >= 0.5 ? '½' : '') +
                   '☆'.repeat(5 - Math.ceil(teacher.rating));
      
      const teacherCard = document.createElement('div');
      teacherCard.classList.add('teacher-card');
      teacherCard.dataset.id = teacher.id;
      teacherCard.setAttribute('tabindex', '0');
      teacherCard.setAttribute('role', 'button');
      
      // Use innerHTML once instead of multiple DOM operations
      teacherCard.innerHTML = `
        <img src="${teacher.image}" alt="${teacher.name}" width="80" height="80">
        <h3>${teacher.name}</h3>
        <div class="stars">${stars} (${teacher.rating})</div>
        <p class="price">${teacher.price} kr/time</p>
      `;
      
      return teacherCard;
    }
    
    /**
     * Render calendar for date selection
     */
    function renderCalendar() {
      console.log("Rendrer kalender");
      const firstDay = new Date(bookingState.currentYear, bookingState.currentMonth, 1).getDay() || 7; // Convert 0 (Sunday) to 7
      const daysInMonth = new Date(bookingState.currentYear, bookingState.currentMonth + 1, 0).getDate();
      
      // Update month display
      const currentMonthEl = document.getElementById('current-month');
      if (currentMonthEl) {
        currentMonthEl.textContent = `${monthNames[bookingState.currentMonth]} ${bookingState.currentYear}`;
      }
      
      const calendarDays = document.getElementById('calendar-days');
      if (!calendarDays) {
        console.error("Fant ikke kalenderdager-elementet");
        return;
      }
      
      // Clear previous content
      calendarDays.innerHTML = '';
      
      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      
      // Add empty cells for days before the first day of the month
      for (let i = 1; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        fragment.appendChild(emptyDay);
      }
      
      // Current date for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        dayElement.setAttribute('role', 'gridcell');
        
        const date = new Date(bookingState.currentYear, bookingState.currentMonth, day);
        
        // Disable days in the past
        if (date < today) {
          dayElement.classList.add('disabled');
          dayElement.setAttribute('aria-disabled', 'true');
        } else {
          // Simulate available days (in a real app, this would come from a database)
          // Using deterministic pattern based on date for demo purposes
          if ((day + bookingState.currentMonth) % 3 !== 0) {
            dayElement.classList.add('available');
            dayElement.setAttribute('tabindex', '0');
            
            // Add event using closure to capture the current day
            dayElement.addEventListener('click', createDayClickHandler(day, date));
            
            // Keyboard accessibility
            dayElement.addEventListener('keydown', function(e) {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
              }
            });
          } else {
            dayElement.classList.add('disabled');
            dayElement.setAttribute('aria-disabled', 'true');
          }
        }
        
        fragment.appendChild(dayElement);
      }
      
      // Append all calendar days at once
      calendarDays.appendChild(fragment);
    }
    
    /**
     * Create a day click handler
     * @param {number} day - The day number
     * @param {Date} date - The date object
     * @return {Function} - The click handler
     */
    function createDayClickHandler(day, date) {
      return function() {
        console.log("Dato valgt:", day, date);
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        this.classList.add('selected');
        
        bookingState.selectedDate = new Date(date);
        
        const selectedDateEl = document.getElementById('selected-date');
        if (selectedDateEl) {
          selectedDateEl.textContent = `${day}. ${monthNames[bookingState.currentMonth]} ${bookingState.currentYear}`;
        }
        
        // Show available time slots
        showTimeSlots();
      };
    }
    
    /**
     * Show available time slots
     */
    function showTimeSlots() {
      console.log("Viser tilgjengelige tidspunkter");
      const timeSlots = document.getElementById('time-slots');
      if (!timeSlots) {
        console.error("Fant ikke tidspunkt-elementet");
        return;
      }
      
      timeSlots.classList.add('active');
      
      const slotsGrid = document.querySelector('.slots-grid');
      if (!slotsGrid) {
        console.error("Fant ikke slots-grid elementet");
        return;
      }
      
      slotsGrid.innerHTML = '';
      
      // Available time slots (in a real app, this would come from a database)
      const availableTimeSlots = [
        "08:00", "09:00", "10:00", "11:00", "12:00", 
        "13:00", "14:00", "15:00", "16:00", "17:00"
      ];
      
      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      
      // Day of week deterministic pattern for demo purposes
      const dayOfWeek = bookingState.selectedDate.getDay();
      
      availableTimeSlots.forEach((time, index) => {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = time;
        timeSlot.setAttribute('role', 'button');
        timeSlot.setAttribute('tabindex', '0');
        
        // Make some time slots unavailable based on deterministic pattern
        if ((index + dayOfWeek) % 4 !== 0) {
          timeSlot.addEventListener('click', function() {
            console.log("Tidspunkt valgt:", time);
            document.querySelectorAll('.time-slot').forEach(ts => ts.classList.remove('selected'));
            this.classList.add('selected');
            bookingState.selectedTime = time;
            
            // Enable next button
            const nextButton = document.querySelector('[data-next="4"]');
            if (nextButton) nextButton.disabled = false;
          });
          
          // Keyboard accessibility
          timeSlot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
            }
          });
        } else {
          timeSlot.classList.add('unavailable');
          timeSlot.setAttribute('aria-disabled', 'true');
        }
        
        fragment.appendChild(timeSlot);
      });
      
      // Append all time slots at once
      slotsGrid.appendChild(fragment);
    }
    
    /**
     * Update booking summary
     */
    function updateSummary() {
      console.log("Oppdaterer oppsummering");
      
      const summarySubject = document.getElementById('summary-subject');
      const summaryTeacher = document.getElementById('summary-teacher');
      const summaryDate = document.getElementById('summary-date');
      const summaryTime = document.getElementById('summary-time');
      const summaryPrice = document.getElementById('summary-price');
      
      if (summarySubject) summarySubject.textContent = bookingState.selectedSubject || '';
      
      if (summaryTeacher && bookingState.selectedTeacher) {
        summaryTeacher.textContent = bookingState.selectedTeacher.name;
      } else if (summaryTeacher) {
        summaryTeacher.textContent = '';
      }
      
      if (summaryDate) {
        if (bookingState.selectedDate) {
          summaryDate.textContent = `${bookingState.selectedDate.getDate()}. ${monthNames[bookingState.selectedDate.getMonth()]} ${bookingState.selectedDate.getFullYear()}`;
        } else {
          summaryDate.textContent = '';
        }
      }
      
      if (summaryTime) summaryTime.textContent = bookingState.selectedTime || '';
      
      if (summaryPrice) {
        if (bookingState.selectedTeacher) {
          summaryPrice.textContent = `${bookingState.selectedTeacher.price} kr`;
        } else {
          summaryPrice.textContent = '';
        }
      }
    }
    
    /**
     * Get teachers by subject
     * @param {string} subject - The subject name
     * @return {Array} - Array of teachers
     */
    function getTeachersBySubject(subject) {
      console.log("Henter lærere for fag:", subject);
      // This would typically be an API call
      // Using static data for demo purposes
      const teachers = {
        "Matematikk": [
          { id: 1, name: "Kari Hansen", rating: 4.8, price: 450, image: "../bilder/teacher1.jpg" },
          { id: 2, name: "Ole Jensen", rating: 4.6, price: 400, image: "../bilder/teacher2.jpg" },
          { id: 3, name: "Siv Larsen", rating: 4.9, price: 500, image: "../bilder/teacher3.jpg" }
        ],
        "Informatikk": [
          { id: 4, name: "Geir Olsen", rating: 4.7, price: 550, image: "../bilder/teacher4.jpg" },
          { id: 5, name: "Nina Berg", rating: 4.5, price: 500, image: "../bilder/teacher5.jpg" }
        ],
        "Fysikk": [
          { id: 6, name: "Lars Pedersen", rating: 4.8, price: 480, image: "../bilder/teacher6.jpg" },
          { id: 7, name: "Emma Solberg", rating: 4.9, price: 520, image: "../bilder/teacher7.jpg" }
        ],
        "Kjemi": [
          { id: 8, name: "Ida Nielsen", rating: 4.6, price: 450, image: "../bilder/teacher8.jpg" }
        ],
        "Biologi": [
          { id: 9, name: "Thomas Lie", rating: 4.7, price: 470, image: "../bilder/teacher9.jpg" },
          { id: 10, name: "Sofie Holm", rating: 4.8, price: 490, image: "../bilder/teacher10.jpg" }
        ],
        "Økonomi": [
          { id: 11, name: "Martin Bakken", rating: 4.6, price: 550, image: "../bilder/teacher11.jpg" },
          { id: 12, name: "Lise Wang", rating: 4.9, price: 600, image: "../bilder/teacher12.jpg" }
        ]
      };
      
      // Hvis vi ikke har bilder, bruk placeholders
      const result = teachers[subject] || [];
      result.forEach(teacher => {
        // Sjekk om bildet eksisterer, ellers bruk en placeholder
        const img = new Image();
        img.onerror = function() {
          teacher.image = "https://via.placeholder.com/80";
        };
        img.src = teacher.image;
      });
      
      return result;
    }
  
    // Litt informasjon til brukeren i konsollen
    console.log("Booking-systemet er klart! Velg et fag for å komme i gang.");
});