import { chargerRecettes } from '../script/script.js';  // Assure-toi que le chemin d'importation est correct
import { vi } from 'vitest';  // Importer vi de Vitest

// Test unitaire pour vérifier le bon fonctionnement
describe('chargerRecettes', () => {
  
  it('devrait charger les recettes avec succès', async () => {
    // On prépare le mock pour la réponse de fetch
    vi.mockGlobal('fetch', vi.fn().mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 1, name: 'Recette Test' }])
    }));
    
    // Appel de la fonction à tester
    await chargerRecettes();

    // Vérifie que fetch a été appelé avec l'URL correcte
    expect(fetch).toHaveBeenCalledWith('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
  });

  it('devrait gérer les erreurs de chargement', async () => {
    // On prépare le mock pour simuler une erreur de fetch
    vi.mockGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Erreur de chargement')));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // On vérifie que la fonction lance une erreur
    await expect(chargerRecettes()).rejects.toThrow('Erreur de chargement');
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur de chargement des recettes:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

});