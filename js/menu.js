// menu.js
document.addEventListener("DOMContentLoaded", function () {
    let isMobileView = null;  // Przechowuje informację, czy aktualnie mamy załadowane menu mobilne

    function loadMenu() {
        const isMobile = window.innerWidth <= 767; // Próg na 767px
        // Sprawdzamy, czy stan (mobile vs desktop) uległ zmianie
        if (isMobileView !== isMobile) {
            isMobileView = isMobile;
            // Wybieramy odpowiedni plik (desktop vs mobile)
            const menuFile = isMobile ? "menu_mobile.html" : "menu.html";

            fetch(menuFile)
                .then(response => response.text())
                .then(data => {
                    document.getElementById("menu-container").innerHTML = data;
                    // Po wczytaniu nowego menu – inicjujemy logikę z script.js
                    initMenu();
                })
                .catch(error => console.error('Błąd ładowania menu:', error));
        }
    }

    // Ładujemy menu pierwszy raz
    loadMenu();

    // Podpinamy się pod zdarzenie zmiany rozmiaru
    window.addEventListener('resize', loadMenu);
});
