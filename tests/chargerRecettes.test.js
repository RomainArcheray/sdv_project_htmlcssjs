// tests/script.test.js

// Mocking de la fonction fetch
global.fetch = jest.fn();

// Nous devons importer ou inclure le fichier script.js pour que la fonction chargerRecettes soit exécutée
require('../script/script.js');  // Assurez-vous que ce chemin est correct

describe('chargerRecettes', () => {
    
    // Test lorsque la requête fetch réussit
    test('devrait charger les recettes et déclencher l\'événement "recettesChargees"', async () => {
        const mockData = [{ id: 1, name: "Recette 1" }, { id: 2, name: "Recette 2" }];
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(mockData)
        });

        const eventListener = jest.fn();
        document.addEventListener('recettesChargees', eventListener);

        await chargerRecettes();

        expect(fetch).toHaveBeenCalledWith('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
        expect(recettes).toEqual(mockData);
        expect(eventListener).toHaveBeenCalled();
    });

    // Test lorsque la requête fetch échoue
    test('devrait gérer les erreurs lors du chargement des recettes', async () => {
        fetch.mockRejectedValueOnce(new Error('Erreur de réseau'));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        await chargerRecettes();

        expect(fetch).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur de chargement des recettes:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });
});