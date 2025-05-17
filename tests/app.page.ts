import { Page } from "@playwright/test";

export class AppPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async selectionDifficulte() {
    return this.page.getByTestId("select-difficulte");
  }

  async listeOptionDifficulte() {
    const selection = await this.selectionDifficulte();
    return selection.getByRole("option").all();
  }

  async boutonJouer() {
    return this.page.getByRole("button", { name: "Jouer" });
  }

  async grille() {
    return this.page.getByTestId("grille");
  }

  async listeBoutonGrille() {
    const grille = await this.grille();
    return grille.getByRole("button").all();
  }

  async selectionnerDifficulte(difficulte: string) {
    return (await this.selectionDifficulte()).selectOption(difficulte);
  }

  async cliquerBoutonJouer() {
    return (await this.boutonJouer()).click();
  }

  async jouer(difficulte: string) {
    await this.goto();
    await this.selectionnerDifficulte(difficulte);
    await this.cliquerBoutonJouer();
  }
}
