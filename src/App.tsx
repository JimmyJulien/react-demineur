import { useState, type ChangeEvent } from "react";
import "./App.css";

type ValeurCellule = "💣" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

interface Cellule {
  estBalisee: boolean;
  estDecouverte: boolean;
  valeur: ValeurCellule;
}

type Difficulte = "Débutant" | "Intermédiaire" | "Expert";

interface Grille {
  hauteur: number;
  largeur: number;
  listeCellule: Cellule[];
}

export function App() {
  const optionsDifficulte: Difficulte[] = [
    "Débutant",
    "Intermédiaire",
    "Expert",
  ];

  const [difficulte, setDifficulte] = useState<Difficulte>("Débutant");

  const [
    estSelectionDifficulteDesactivee,
    setEstSelectionDifficulteDesactivee,
  ] = useState<boolean>(false);

  const [estBoutonJouerDesactive, setEstBoutonJouerDesactive] =
    useState<boolean>(false);

  const [grille, setGrille] = useState<Grille | null>(null);

  const [estGrilleAffichee, setEstGrilleAffichee] = useState<boolean>(false);

  function selectionnerDifficulte(event: ChangeEvent<HTMLSelectElement>) {
    setDifficulte(event.target.value as Difficulte);
  }

  function jouer() {
    setEstBoutonJouerDesactive(true);
    setEstSelectionDifficulteDesactivee(true);

    const listeBoutonGrille: Cellule[] = [];

    let hauteurGrille: number = 0;
    let largeurGrille: number = 0;

    if (difficulte === "Débutant") {
      hauteurGrille = 8;
      largeurGrille = 8;
    }

    if (difficulte === "Intermédiaire") {
      hauteurGrille = 16;
      largeurGrille = 16;
    }

    if (difficulte === "Expert") {
      hauteurGrille = 16;
      largeurGrille = 30;
    }

    for (let i = 0; i < largeurGrille * hauteurGrille; i++) {
      listeBoutonGrille.push({
        estBalisee: false,
        estDecouverte: false,
        valeur: "💣",
      });
    }

    setGrille({
      hauteur: hauteurGrille,
      largeur: largeurGrille,
      listeCellule: listeBoutonGrille,
    });

    setEstGrilleAffichee(true);
  }

  function decouvrirCellule(indexCellule: number) {
    if (grille) {
      const nouvelleListeCellule: Cellule[] = [];

      for (let i = 0; i < grille.listeCellule.length; i++) {
        const cellule = grille.listeCellule[i];

        if (i === indexCellule) {
          cellule.estDecouverte = true;
        }

        nouvelleListeCellule.push(cellule);
      }

      setGrille({
        ...grille,
        listeCellule: nouvelleListeCellule,
      });
    }
  }

  function baliserCellule(indexCellule: number) {
    if (grille) {
      const nouvelleListeCellule: Cellule[] = [];

      for (let i = 0; i < grille.listeCellule.length; i++) {
        const cellule = grille.listeCellule[i];

        if (i === indexCellule) {
          cellule.estBalisee = true;
        }

        nouvelleListeCellule.push(cellule);
      }

      setGrille({
        ...grille,
        listeCellule: nouvelleListeCellule,
      });
    }
  }

  return (
    <>
      <select
        disabled={estSelectionDifficulteDesactivee}
        name="difficulte"
        data-testid="select-difficulte"
        value={difficulte}
        onChange={selectionnerDifficulte}
      >
        {optionsDifficulte.map((difficulte) => (
          <option key={difficulte} value={difficulte}>
            {difficulte}
          </option>
        ))}
      </select>
      <button disabled={estBoutonJouerDesactive} onClick={jouer}>
        Jouer
      </button>

      {estGrilleAffichee && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${grille?.largeur ?? 1}, 1fr)`,
          }}
          data-testid="grille"
        >
          {grille?.listeCellule.map((cellule, i) => (
            <button
              key={i}
              onClick={() => decouvrirCellule(i)}
              onContextMenu={() => baliserCellule(i)}
            >
              {cellule.estBalisee
                ? "🚩"
                : cellule.estDecouverte
                  ? cellule.valeur
                  : ""}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
