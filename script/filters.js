document.addEventListener('DOMContentLoaded', () => {
    const recettesContainer = document.querySelector('.recipes');
    const selectIngredients = document.querySelector('select#ingredients');
    const selectAppareils = document.querySelector('select#appareils');
    const selectUstensiles = document.querySelector('select#ustensiles');
    const tagsContainer = document.querySelector('.tags-container');
    const recetteCount = document.querySelector('.filters span');
    const searchBar = document.querySelector('.search-bar input'); 

    let selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: []
    };

    let searchQuery = ""; // Variable pour stocker le texte de recherche

    document.addEventListener('recettesChargees', () => {
        afficherRecettes(recettes); 
    });

    // Fonction pour afficher les recettes filtrées
    function afficherRecettes(recettesFiltrees) {
        recettesContainer.innerHTML = '';
        recettesFiltrees.forEach(recette => {
            const recetteCard = document.createElement('div');
            recetteCard.classList.add('recipe-card');

            const imagePlaceholder = document.createElement('div');
            imagePlaceholder.classList.add('image-placeholder');
            recetteCard.appendChild(imagePlaceholder);

            const recetteTitle = document.createElement('h2');
            recetteTitle.textContent = recette.name;
            recetteCard.appendChild(recetteTitle);

            const recetteDescription = document.createElement('p');
            recetteDescription.classList.add('recipe-description');
            recetteDescription.textContent = `RECETTE: ${recette.description}`;
            recetteCard.appendChild(recetteDescription);

            const ingredientsList = document.createElement('p');
            ingredientsList.classList.add('ingredients');
            ingredientsList.innerHTML = `INGRÉDIENTS:<br>` + 
                recette.ingredients.map(ingredient => `${ingredient.ingredient} ${ingredient.quantity || ''} ${ingredient.unit || ''}`).join(', ');
            recetteCard.appendChild(ingredientsList);

            recettesContainer.appendChild(recetteCard);
        });
        recetteCount.textContent = `${recettesFiltrees.length} recette${recettesFiltrees.length > 1 ? 's' : ''}`;
    }

    // Fonction pour mettre à jour les tags affichés
    function updateTags() {
        tagsContainer.innerHTML = '';
        Object.keys(selectedFilters).forEach(filterType => {
            selectedFilters[filterType].forEach(item => {
                const tag = document.createElement('span');
                tag.classList.add('tag');
                tag.textContent = item;

                const closeButton = document.createElement('button');
                closeButton.textContent = 'X';
                closeButton.onclick = () => removeFilter(filterType, item);
                tag.appendChild(closeButton);

                tagsContainer.appendChild(tag);
            });
        });
        filterRecettes();
    }

    // Fonction pour ajouter un filtre sélectionné
    function addFilter(type, value) {
        if (!selectedFilters[type].includes(value) && value !== '') {
            selectedFilters[type].push(value);
            updateTags();
        }
    }

    // Fonction pour supprimer un filtre
    function removeFilter(type, value) {
        selectedFilters[type] = selectedFilters[type].filter(item => item !== value);
        updateTags();
    }

    // Fonction de filtrage des recettes
    function filterRecettes() {
        const recettesFiltrees = recettes.filter(recette => {
            const ingredients = recette.ingredients.map(ing => ing.ingredient);
            const appareils = recette.appliance ? [recette.appliance] : [];
            const ustensiles = recette.ustensils || [];

            const matchesFilters = (
                selectedFilters.ingredients.every(ingredient => ingredients.includes(ingredient)) &&
                selectedFilters.appareils.every(appareil => appareils.includes(appareil)) &&
                selectedFilters.ustensiles.every(ustensile => ustensiles.includes(ustensile))
            );

            // Filtrage par recherche
            const matchesSearch = searchQuery.length < 3 || recette.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilters && matchesSearch;
        });

        afficherRecettes(recettesFiltrees);
    }

    // Écouteur pour la barre de recherche
    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        filterRecettes();
    });

    // Écouteurs d'événements pour les sélecteurs de filtres
    selectIngredients.addEventListener('change', (e) => addFilter('ingredients', e.target.value));
    selectAppareils.addEventListener('change', (e) => addFilter('appareils', e.target.value));
    selectUstensiles.addEventListener('change', (e) => addFilter('ustensiles', e.target.value));
});