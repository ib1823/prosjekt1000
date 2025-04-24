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

    const subjects = [
        { name: "Matematikk", students: 5023, icon: "📐" },
        { name: "Informatikk", students: 6820, icon: "💻" },
        { name: "Fysikk", students: 3241, icon: "🔬" },
        { name: "Kjemi", students: 2875, icon: "🧪" },
        { name: "Biologi", students: 4532, icon: "🌱" },
        { name: "Økonomi", students: 6210, icon: "📊" },
        { name: "Jus", students: 4102, icon: "⚖️" },
        { name: "Medisin", students: 5532, icon: "🏥" },
        { name: "Psykologi", students: 4782, icon: "🧠" },
        { name: "Historie", students: 2983, icon: "📜" },
        { name: "Sosiologi", students: 3521, icon: "👥" },
        { name: "Statsvitenskap", students: 2912, icon: "🏛️" },
        { name: "Litteratur", students: 2204, icon: "📖" },
        { name: "Ingeniørfag", students: 7843, icon: "⚙️" },
        { name: "Pedagogikk", students: 3257, icon: "🎓" }
    ];

    const subjectContainer = document.getElementById("subject-container");
    const toggleButton = document.getElementById("toggleButton");
    let showingAll = false;
    const visibleCount = 6;

    function renderSubjects() {
        subjectContainer.innerHTML = subjects
            .slice(0, showingAll ? subjects.length : visibleCount)
            .map(subject => `
                <div class="subject-card">
                    <div class="subject-icon">${subject.icon}</div>
                    <div class="subject-info">
                        <h3>${subject.name}</h3>
                        <p>${subject.students} studenter</p>
                    </div>
                </div>`).join("");
        toggleButton.textContent = showingAll ? "Vis mindre" : "Vis mer";
    }

    toggleButton.addEventListener("click", function () {
        showingAll = !showingAll;
        renderSubjects();
    });

    renderSubjects();
});
document.addEventListener("DOMContentLoaded", function () {
    const userTrigger = document.getElementById("userMenuTrigger");
    const userDropdown = document.getElementById("userDropdown");

    userTrigger.addEventListener("click", function () {
        userDropdown.classList.toggle("active");
    });

    // (valgfritt) Klikk utenfor meny lukker den
    document.addEventListener("click", function (event) {
        if (!userDropdown.contains(event.target) && !userTrigger.contains(event.target)) {
            userDropdown.classList.remove("active");
        }
    });
});
