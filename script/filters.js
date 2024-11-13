document.addEventListener('DOMContentLoaded', () => {
    const recettesContainer = document.querySelector('.recipes');
    const selectIngredients = document.querySelector('select#ingredients');
    const selectAppareils = document.querySelector('select#appareils');
    const selectUstensiles = document.querySelector('select#ustensiles');
    const tagsContainer = document.querySelector('.tags-container');
    const recetteCount = document.querySelector('.filters span'); 

    let selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: []
    };

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

                // Bouton pour supprimer le tag
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

    // Filtrer les recettes en fonction des filtres sélectionnés
    function filterRecettes() {
        const recettesFiltrees = recettes.filter(recette => {
            const ingredients = recette.ingredients.map(ing => ing.ingredient);
            const appareils = recette.appliance ? [recette.appliance] : [];
            const ustensiles = recette.ustensils || [];

            return (
                selectedFilters.ingredients.every(ingredient => ingredients.includes(ingredient)) &&
                selectedFilters.appareils.every(appareil => appareils.includes(appareil)) &&
                selectedFilters.ustensiles.every(ustensile => ustensiles.includes(ustensile))
            );
        });
        afficherRecettes(recettesFiltrees);
    }

    // Écouteurs d'événements pour les sélecteurs
    selectIngredients.addEventListener('change', (e) => addFilter('ingredients', e.target.value));
    selectAppareils.addEventListener('change', (e) => addFilter('appareils', e.target.value));
    selectUstensiles.addEventListener('change', (e) => addFilter('ustensiles', e.target.value));
});