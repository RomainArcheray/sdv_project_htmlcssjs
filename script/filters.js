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
        remplirSelects(); 
    });

    // Fonction pour afficher les recettes filtrées
    function afficherRecettes(recettesFiltrees) {
        recettesContainer.innerHTML = '';

        if (recettesFiltrees.length === 0) { // Si aucune recette trouvée
            const noResultMessage = document.createElement('p');
            noResultMessage.classList.add('no-result-message');
            noResultMessage.textContent = `Aucun résultat trouvé avec le mot "${searchQuery}"`;
            recettesContainer.appendChild(noResultMessage);
            recetteCount.textContent = '0 recette';
            return;
        }

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
            
            const recetteLabel = document.createElement('span');
            recetteLabel.classList.add('recipe-label');
            recetteLabel.textContent = "RECETTE:";
            
            recetteDescription.textContent = `${recette.description}`;
            recetteCard.appendChild(recetteLabel);
            recetteCard.appendChild(recetteDescription);

            const ingredientsTitle = document.createElement('p');
            ingredientsTitle.textContent = "INGRÉDIENTS:";
            recetteCard.appendChild(ingredientsTitle);

            const ingredientsList = document.createElement('ul');
            ingredientsList.classList.add('ingredients-list');

            recette.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = `${ingredient.ingredient} ${ingredient.quantity || ''} ${ingredient.unit || ''}`;
            ingredientsList.appendChild(ingredientItem);
            
            recetteCard.appendChild(ingredientsList);
            recettesContainer.appendChild(recetteCard);
        });
        recetteCount.textContent = `${recettesFiltrees.length} recette${recettesFiltrees.length > 1 ? 's' : ''}`;
    });
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

    
    // Fonction pour remplir les selects avec les valeurs uniques
    function remplirSelects() {
        const ingredientsSet = new Set();
        const appareilsSet = new Set();
        const ustensilesSet = new Set();

        recettes.forEach(recette => {
            recette.ingredients.forEach(ingredient => ingredientsSet.add(ingredient.ingredient));
            if (recette.appliance) appareilsSet.add(recette.appliance);
            recette.ustensils.forEach(ustensile => ustensilesSet.add(ustensile));
        });

        selectIngredients.innerHTML = '<option value="" disabled selected>Ingrédients</option>';
        selectAppareils.innerHTML = '<option value="" disabled selected>Appareils</option>';
        selectUstensiles.innerHTML = '<option value="" disabled selected>Ustensiles</option>';

        // Ajouter les options dans les selects
        ingredientsSet.forEach(ingredient => {
            const option = document.createElement('option');
            option.value = ingredient;
            option.textContent = ingredient;
            selectIngredients.appendChild(option);
        });

        appareilsSet.forEach(appareil => {
            const option = document.createElement('option');
            option.value = appareil;
            option.textContent = appareil;
            selectAppareils.appendChild(option);
        });

        ustensilesSet.forEach(ustensile => {
            const option = document.createElement('option');
            option.value = ustensile;
            option.textContent = ustensile;
            selectUstensiles.appendChild(option);
        });

         // Écouteurs d'événements pour les sélect
        selectIngredients.addEventListener('change', (e) => {
            addFilter('ingredients', e.target.value);
            e.target.selectedIndex = 0; 
        });
        selectAppareils.addEventListener('change', (e) => {
            addFilter('appareils', e.target.value);
            e.target.selectedIndex = 0;  
        });
        selectUstensiles.addEventListener('change', (e) => {
            addFilter('ustensiles', e.target.value);
            e.target.selectedIndex = 0; 
        });
    }
});


