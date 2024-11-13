document.addEventListener('DOMContentLoaded', async () => {
    const recettesContainer = document.querySelector('.recipes');
    const selectIngredients = document.querySelector('#ingredients');
    const selectAppareils = document.querySelector('#appareils');
    const selectUstensiles = document.querySelector('#ustensiles');
    const tagsContainer = document.querySelector('.tags-container');
    const recetteCount = document.querySelector('.filters span');
    
    // Stockage des recettes
    let recettes = []; 
    let selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: []
    };

    try {
        const response = await fetch('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
        recettes = await response.json();
        afficherRecettes(recettes);
    } catch (error) {
        console.error('Erreur de chargement des recettes:', error);
    }

    // Fonction pour afficher les recettes
    function afficherRecettes(recettesFiltrees) {
        recettesContainer.innerHTML = '';
        recettesFiltrees.forEach(recette => {
            const recetteCard = document.createElement('div');
            recetteCard.classList.add('recipe-card');

            const imagePlaceholder = document.createElement('div');
            imagePlaceholder.classList.add('image-placeholder');
            recetteCard.appendChild(imagePlaceholder);
            imagePlaceholder.style.backgroundImage = `url('contents/image_recette/${recette.image}')`;


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

    // Ajoute un filtre
    function addFilter(type, value) {
        if (!selectedFilters[type].includes(value) && value !== '') {
            selectedFilters[type].push(value);
            updateTags();
        }
    }

    // Supprime un filtre
    function removeFilter(type, value) {
        selectedFilters[type] = selectedFilters[type].filter(item => item !== value);
        updateTags();
    }

    // Filtrer les recettes
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

    // Événements pour les sélecteurs
    selectIngredients.addEventListener('change', (e) => addFilter('ingredients', e.target.value));
    selectAppareils.addEventListener('change', (e) => addFilter('appareils', e.target.value));
    selectUstensiles.addEventListener('change', (e) => addFilter('ustensiles', e.target.value));
});