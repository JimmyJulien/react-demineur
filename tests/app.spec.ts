import { expect, test } from "@playwright/test";
import { AppPage } from "./app.page";

test("Doit afficher un menu déroulant avec les options Débutant, Intermédiaire et Expert", async ({
  page,
}) => {
  const appPage = new AppPage(page);

  await appPage.goto();

  const listeOptionDifficulte = await appPage.listeOptionDifficulte();

  await expect(listeOptionDifficulte.length).toBe(3);
  await expect(listeOptionDifficulte[0]).toHaveText("Débutant");
  await expect(listeOptionDifficulte[1]).toHaveText("Intermédiaire");
  await expect(listeOptionDifficulte[2]).toHaveText("Expert");
});

test("Doit afficher un bouton 'Jouer'", async ({ page }) => {
  const appPage = new AppPage(page);

  await appPage.goto();

  const boutonJouer = await appPage.boutonJouer();

  await expect(boutonJouer).toBeVisible();
});

test("Doit bloquer le menu déroulant et le bouton 'Jouer' quand il a été cliqué", async ({
  page,
}) => {
  const appPage = new AppPage(page);

  await appPage.goto();

  await appPage.cliquerBoutonJouer();

  const boutonJouer = await appPage.boutonJouer();

  const selectionDifficulte = await appPage.selectionDifficulte();

  await expect(boutonJouer).toBeDisabled();
  await expect(selectionDifficulte).toBeDisabled();
});

test(
  "Doit afficher une grille 8x8 " +
    "quand la difficulté 'Débutant' est sélectionnée et le bouton 'Jouer' est cliqué",
  async ({ page }) => {
    const appPage = new AppPage(page);

    await appPage.jouer("Débutant");

    const listeBoutonGrille = await appPage.listeBoutonGrille();

    await expect(listeBoutonGrille.length).toBe(8 * 8);
  },
);

test(
  "Doit afficher une grille 16x16 " +
    "quand la difficulté 'Intermédiaire' est sélectionnée et le bouton 'Jouer' est cliqué",
  async ({ page }) => {
    const appPage = new AppPage(page);

    await appPage.jouer("Intermédiaire");

    const listeBoutonGrille = await appPage.listeBoutonGrille();

    await expect(listeBoutonGrille.length).toBe(16 * 16);
  },
);

test(
  "Doit afficher une grille 30x16 " +
    "quand la difficulté 'Expert' est sélectionnée et le bouton 'Jouer' est cliqué",
  async ({ page }) => {
    const appPage = new AppPage(page);

    await appPage.jouer("Expert");

    const listeBoutonGrille = await appPage.listeBoutonGrille();

    await expect(listeBoutonGrille.length).toBe(30 * 16);
  },
);

// Doit afficher la valeur de la case quand clic gauche sur cette case

// Doit poser un drapeau quand clic droit sur cette case

// Doit afficher "Gagné" quand toutes les cases sans mine ont été retournées

// Doit afficher "Perdu" quand une bombe est déclenchée

// Doit débloquer le menu déroulant et le bouton "Jouer" quand la partie est gagnée

// Doit débloquer le menu déroulant et le bouton "Jouer" quand la partie est perdue
