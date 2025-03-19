document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("mode-toggle");
    const body = document.body;
    
    // Sjekk om brukeren har en lagret preferanse
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", function () {
        if (this.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });




       
        });
 