import { expect, test } from "@playwright/test";

test("a titre 'React demineur'", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/React demineur/);
});

// Doit afficher un menu déroulant avec les options Débutant, Intermédiaire et Expert

// Doit afficher un bouton "Jouer"

// Doit bloquer le menu déroulant et le bouton "Jouer" quand le bouton "Jouer" a été cliqué

// Doit afficher une grille avec le nombre de cases sélectionné quand clic sur bouton "Jouer"

// Doit afficher la valeur de la case quand clic gauche sur cette case

// Doit poser un drapeau quand clic droit sur cette case

// Doit afficher "Gagné" quand toutes les cases sans mine ont été retournées

// Doit afficher "Perdu" quand une bombe est déclenchée

// Doit débloquer le menu déroulant et le bouton "Jouer" quand la partie est gagnée

// Doit débloquer le menu déroulant et le bouton "Jouer" quand la partie est perdue
