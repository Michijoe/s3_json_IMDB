import App from "./modules/App.js";

const app = new App();
const allCheckboxes = document.querySelectorAll('input[type=checkbox]');
const radioButtons = document.querySelectorAll('input[type=radio]');

// SEARCH
searchForm.searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    app.searchMovies(searchForm.searchInput.value);
});
// désactivation de l'envoi par la touche 'enter'
searchForm.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});

// REINIT
searchForm.reinitButton.addEventListener("click", (e) => {
    e.preventDefault();
    app.reinit(allCheckboxes);
});

// SORT
sortForm.sortSelect.addEventListener("change", () => {
    app.sortMovies(sortForm.sortSelect.value);
});

// FILTER
allCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        app.filterMovies(allCheckboxes);
    });
});

// DISPLAY VIEW
radioButtons.forEach(radio => {
    radio.addEventListener("change", (e) => {
        app.toggleView(e.value);
    })
})
