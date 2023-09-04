import movies from "../data/movies.js";

/**
 * Classe App qui contient un jeu de données de films avec leurs métadonnées. Les méthodes définies sont displayMovies, displayFilters, toggleView, searchMovies, reinit, sortMovies et filterMovies.
 */
export default class App {
    #allMovies;
    #filteredMovies;

    constructor() {
        this.#allMovies = movies;
        this.#filteredMovies = [];
        this.#displayMovies();
        this.#displayFilters();
    }

    /**
    * Affichage de tous les films par défaut ou de ceux contenus dans le tableau passé en paramètre.
    * @param {array} listMovies - Tableau des films
    */
    #displayMovies(listMovies = this.#allMovies) {
        const mainEl = document.querySelector("main");
        mainEl.innerHTML = '';
        const sectionEl = document.createElement("section");

        if (listMovies.length != 0) {
            listMovies.forEach(movie => {
                const articleEl = document.createElement("article");
                articleEl.innerHTML = `
                <img src="${movie.image}" alt="Image for ${movie.title}">
                <div>
                    <h2>${movie.title}</h2>
                    <ul>
                        <li>Year: ${movie.year}</li>
                        <li>Release date: ${movie.releaseState}</li>
                        <li>Genre: ${movie.genres}</li>
                        <li>Stars: ${movie.stars}</li>
                    </ul>
                </div>
                `;
                sectionEl.appendChild(articleEl);
            });
        }
        else {
            mainEl.innerHTML = '<p>No match.</p>';
        }

        mainEl.appendChild(sectionEl);
    }


    /**
    * Affichage dynamique des filtres selon les genres et l'année inclut dans les métadonnées de tous les films
    */
    #displayFilters() {
        //alimenter tableaux tGenres et tYears avec toutes les occurences de genres et de dates classées par ordre alphabétique
        let tGenres = [];
        let tYears = [];

        this.#allMovies.forEach(movie => {
            let genres = movie.genres.split(', ');
            genres.forEach(genre => {
                if (!tGenres.includes(genre)) tGenres.push(genre);
            });
        });
        console.log(tGenres);
        tGenres.sort((a, b) => a.localeCompare(b, "en"));

        this.#allMovies.forEach(movie => {
            if (!tYears.includes(movie.year)) tYears.push(movie.year);
        });
        tYears.sort((a, b) => a.localeCompare(b));

        // contruire dynamiquement les filtres par genre et par année
        const formFilterEl = document.querySelector('[name="filterForm"]');

        // filter by genre
        const fieldsetGenreEl = document.createElement("fieldset");
        const legendGenreEl = document.createElement("legend");
        legendGenreEl.innerHTML = "Filter by genre: ";
        fieldsetGenreEl.appendChild(legendGenreEl);
        tGenres.forEach(genre => {
            const divEl = document.createElement("div");
            divEl.innerHTML = `
            <input type="checkbox" name="genres" value="${genre}" id="${genre}">
            <label for="${genre}">${genre}</label>
            `;
            fieldsetGenreEl.appendChild(divEl);
        })
        formFilterEl.appendChild(fieldsetGenreEl);

        // filter by year
        const fieldsetYearEl = document.createElement("fieldset");
        const legendYearEl = document.createElement("legend");
        legendYearEl.innerHTML = "Filter by date: ";
        fieldsetYearEl.appendChild(legendYearEl);
        tYears.forEach(year => {
            const divEl = document.createElement("div");
            divEl.innerHTML = `
            <input type="checkbox" name="years" value="${year}" id="${year}">
            <label for="${year}">${year}</label>
            `;
            fieldsetYearEl.appendChild(divEl);
        })
        formFilterEl.appendChild(fieldsetYearEl);
    }


    /**
     * Attribution de la classe list ou grid selon le bouton sélectionné
     * @param {"list" | "grid"} viewChoice - valeur du radio button sélectionné
     */
    toggleView(viewChoice) {
        const mainEl = document.querySelector('main');
        if (!mainEl.classList.contains(viewChoice)) {
            mainEl.classList.toggle('list');
            mainEl.classList.toggle('grid');
        }
    }


    /**
    * Recherche dans les champs titre et acteurs du jeu de données et affiche les résultats
    * @param {string} searchString - Chaine selon laquelle effectuer la recherche
    */
    searchMovies(searchString) {
        let results;
        let selection = (this.#filteredMovies.length === 0) ? this.#allMovies : this.#filteredMovies;
        results = selection.filter((movie) => {
            return movie.title.toLowerCase().includes(searchString.toLowerCase()) || movie.stars.toLowerCase().includes(searchString.toLowerCase());
        });
        this.#filteredMovies = results;
        this.#displayMovies(this.#filteredMovies);
    }


    /**
    * Réinitialisation de tous les formulaires et retour à l'affichage d'origine avec tous les films
    * @param {object} allCheckboxes - Objet Nodelist contenant tous les éléments checkbox
    */
    reinit(allCheckboxes) {
        searchForm.searchInput.value = '';
        sortForm.sortSelect.value = 'yearReleaseAsc';
        this.sortMovies('yearReleaseAsc');
        allCheckboxes.forEach(checkboxe => checkboxe.checked = false);
        this.#filteredMovies = [];
        this.#displayMovies();
        document.getElementById('list').checked = true;
        this.toggleView('list');
    }


    /**
    * Tri du tableau de films affichés selon les 4 critères du menu déroulant : Titre ascendant ou descendant, Date de sortie ascendante ou descendante
    * @param {string} sortString - Chaine selon laquelle effectuer le tri
    */
    sortMovies(sortString) {
        function compareValues(key, order = 'asc') {
            return function innerSort(a, b) {
                const varA = (key === 'releaseState') ? Date.parse(new Date(a[key])) : a[key].toUpperCase();
                const varB = (key === 'releaseState') ? Date.parse(new Date(b[key])) : b[key].toUpperCase();
                let comparison = 0;
                if (varA > varB) comparison = 1;
                else if (varA < varB) comparison = -1;
                return (order === 'desc') ? (comparison * -1) : comparison;
            };
        }

        let results;
        let selection = (this.#filteredMovies.length === 0) ? this.#allMovies : this.#filteredMovies;

        switch (sortString) {
            case 'yearReleaseAsc':
                results = selection.sort(compareValues('releaseState'));
                break;
            case 'yearReleaseDesc':
                results = selection.sort(compareValues('releaseState', 'desc'));
                break;
            case 'titleAsc':
                results = selection.sort(compareValues('title'));
                break;
            case 'titleDesc':
                results = selection.sort(compareValues('title', 'desc'));
                break;
        }

        this.#filteredMovies = results;
        this.#displayMovies(this.#filteredMovies);
    }


    /**
    * Filtre du tableau de films affichés selon les critères sélectionnés dans les genres ou l'année
    * @param {object} allCheckboxes - Objet Nodelist contenant tous les éléments checkbox
    */
    filterMovies(allCheckboxes) {
        // récupération des genres et des dates sélectionnés dans 2 tableaux distincts
        let genresFilterValues = [];
        let yearsFilterValues = [];
        allCheckboxes.forEach(checkboxe => {
            if (checkboxe.checked === true && checkboxe.name == 'genres') genresFilterValues.push(checkboxe.value);
            if (checkboxe.checked === true && checkboxe.name == 'years') yearsFilterValues.push(checkboxe.value);
        })

        // construction tableau results avec films triés selon checkbox sélectionnés
        let results;
        let selection = (this.#filteredMovies.length === 0) ? this.#allMovies : this.#filteredMovies;

        // quand on décoche tous les checkbox, on réinitialise le tableau filterdMovies car il contient les films triés selon le dernier checkbox coché. On réexécute les méthodes de recherche et de sort si des valeurs étaient présentes.
        if (genresFilterValues.length == 0 && yearsFilterValues.length == 0) {
            this.#filteredMovies = [];
            if (searchForm.searchInput.value != '') this.searchMovies(searchForm.searchInput.value);
            else if (sortForm.sortSelect.value != 'yearReleaseAsc') this.sortMovies(sortForm.sortSelect.value);
            else this.#displayMovies();
        }
        else {
            results = selection.filter(movie => {
                let checkGenres = genresFilterValues.every(value => {
                    return movie.genres.includes(value);
                });
                let checkYears = yearsFilterValues.every(value => {
                    return movie.year.includes(value);
                })
                return checkGenres && checkYears;
            });
            this.#filteredMovies = results;
            this.#displayMovies(this.#filteredMovies);
        }
    }
}