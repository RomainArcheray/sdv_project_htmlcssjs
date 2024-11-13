document.addEventListener('DOMContentLoaded', async () => {
    const recettesContainer = document.querySelector('.recipes');

    try {
        // Charge le fichier JSON contenant les recettes
        const response = await fetch('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
        const recettes = await response.json();

        /*recettesContainer.innerHTML = '';*/

        // Parcourir chaque recette et créer des cartes dynamiques
        recettes.forEach(recette => {
            const recetteCard = document.createElement('div');
            recetteCard.classList.add('recipe-card');

            // Ajoute une image
            const imagePlaceholder = document.createElement('div');
            imagePlaceholder.classList.add('image-placeholder');
            imagePlaceholder.style.backgroundImage = `url('contents/image_recette/${recette.image}')`;
            recetteCard.appendChild(imagePlaceholder);

            // Ajoute le nom de la recette
            const recetteTitle = document.createElement('h2');
            recetteTitle.textContent = recette.name;
            recetteCard.appendChild(recetteTitle);

            // Ajoute la description de la recette
            const recetteDescription = document.createElement('p');
            recetteDescription.classList.add('recipe-description');
            recetteDescription.textContent = `RECETTE: ${recette.description}`;
            recetteCard.appendChild(recetteDescription);

            // Ajoute la liste des ingrédients
            const ingredientsList = document.createElement('p');
            ingredientsList.classList.add('ingredients');
            ingredientsList.innerHTML = `INGRÉDIENTS:<br>` + 
                recette.ingredients.map(ingredient => `${ingredient.ingredient} ${ingredient.quantity || ''} ${ingredient.unit || ''}`).join(', ');
            recetteCard.appendChild(ingredientsList);

            // Ajoute la carte dans le conteneur principal
            recettesContainer.appendChild(recetteCard);
        });
    } catch (error) {
        console.error('Erreur de chargement des recettes:', error);
    }
});