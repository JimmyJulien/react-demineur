import { useEffect, useState } from "react";
import type { ConfigurationZone, Difficulte, Emplacement } from "./app.model";

export function useZone(difficulte: Difficulte) {
  const listeConfiguration = {
    Débutant: { hauteur: 9, largeur: 9, nombreMine: 10 },
    Intermédiaire: { hauteur: 16, largeur: 16, nombreMine: 40 },
    Expert: { hauteur: 16, largeur: 30, nombreMine: 99 },
  };

  const [configuration, setConfiguration] = useState<ConfigurationZone>(
    listeConfiguration[difficulte],
  );

  const [listeEmplacement, setListeEmplacement] = useState<Emplacement[]>([]);

  const nombreEmplacementBalise = listeEmplacement.filter(
    (emplacement) => emplacement.estBalise,
  ).length;

  const nombreBaliseDisponible =
    configuration.nombreMine - nombreEmplacementBalise;

  const estZoneDeminee = listeEmplacement.every((emplacement) => {
    return (
      (emplacement.valeur === "💣" && !emplacement.estDecouvert) ||
      (emplacement.valeur !== "💣" && emplacement.estDecouvert)
    );
  });

  const estZoneDetruite = listeEmplacement.some(
    (emplacement) => emplacement.valeur === "💣" && emplacement.estDecouvert,
  );

  useEffect(() => {
    definirZone(difficulte);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulte]);

  function definirZone(difficulte: Difficulte) {
    const configuration = definirConfigurationZone(difficulte);

    setConfiguration(configuration);

    const nombreEmplacement = configuration.largeur * configuration.hauteur;

    const listeEmplacement: Emplacement[] = Array(nombreEmplacement);

    definirEmplacementMines(configuration, listeEmplacement);

    definirNombreMinesAdjacentes(listeEmplacement, nombreEmplacement);

    setListeEmplacement(listeEmplacement);
  }

  function definirConfigurationZone(difficulte: Difficulte) {
    const listeConfiguration = [
      { difficulte: "Débutant", hauteur: 9, largeur: 9, nombreMine: 10 },
      { difficulte: "Intermédiaire", hauteur: 16, largeur: 16, nombreMine: 40 },
      { difficulte: "Expert", hauteur: 16, largeur: 30, nombreMine: 99 },
    ];

    const { hauteur, largeur, nombreMine } = listeConfiguration.find(
      (configuration) => configuration.difficulte === difficulte,
    )!;

    return { hauteur, largeur, nombreMine };
  }

  function definirEmplacementMines(
    configuration: ConfigurationZone,
    listeEmplacement: Emplacement[],
  ) {
    const listeIndexMine: number[] = [];

    const { hauteur, largeur, nombreMine } = configuration;

    const nombreEmplacement = hauteur * largeur;

    while (listeIndexMine.length < nombreMine) {
      const indexAleatoire = Math.ceil(Math.random() * nombreEmplacement - 1);

      if (!listeIndexMine.includes(indexAleatoire)) {
        listeIndexMine.push(indexAleatoire);
      }
    }

    for (let i = 0; i < nombreEmplacement; i++) {
      listeEmplacement[i] = {
        estBalise: false,
        estDecouvert: false,
        estPotentiellementDangereux: false,
        valeur: listeIndexMine.includes(i) ? "💣" : "",
        x: i % largeur,
        y: Math.floor(i / largeur),
      };
    }
  }

  function definirNombreMinesAdjacentes(
    listeEmplacement: Emplacement[],
    nombreEmplacement: number,
  ) {
    for (let i = 0; i < nombreEmplacement; i++) {
      const emplacement: Emplacement = listeEmplacement[i];

      if (emplacement.valeur === "") {
        const listeEmplacementAdjacent: Emplacement[] =
          recupererListeEmplacementAdjacent(listeEmplacement, emplacement);

        emplacement.valeur = String(
          listeEmplacementAdjacent.filter((e) => e.valeur === "💣").length,
        );

        listeEmplacement[i] = emplacement;
      }
    }
  }

  function baliserEmplacement(indexEmplacement: number) {
    if (!estZoneDetruite) {
      const nouvelleListeEmplacement: Emplacement[] = [];

      for (let i = 0; i < listeEmplacement.length; i++) {
        const emplacement = listeEmplacement[i];

        if (i === indexEmplacement && !emplacement.estDecouvert) {
          // Si potentiellement dangereux, on retire l'indicateur
          if (emplacement.estPotentiellementDangereux) {
            emplacement.estPotentiellementDangereux = false;
          }

          // Si balisé, l'emplacement est marqué comme potentiellement dangereux
          else if (emplacement.estBalise) {
            emplacement.estBalise = false;
            emplacement.estPotentiellementDangereux = true;
          }

          // Sinon on balise l'emplacement
          else {
            emplacement.estBalise = true;
          }
        }

        nouvelleListeEmplacement.push(emplacement);
      }

      setListeEmplacement(nouvelleListeEmplacement);
    }
  }

  function decouvrirEmplacement(indexEmplacement: number) {
    const nouvelleListeEmplacement: Emplacement[] = [...listeEmplacement];

    // On révèle l'emplacement
    nouvelleListeEmplacement[indexEmplacement].estDecouvert = true;

    // Si l'emplacement est vide,
    // on révèle en cascade les emplacements adjacents
    if (nouvelleListeEmplacement[indexEmplacement].valeur === "0") {
      decouvrirListeEmplacementAdjacent(
        listeEmplacement,
        nouvelleListeEmplacement,
        indexEmplacement,
      );
    }

    setListeEmplacement(nouvelleListeEmplacement);
  }

  function recupererListeEmplacementAdjacent(
    listeEmplacement: Emplacement[],
    emplacement: Emplacement,
  ): Emplacement[] {
    return listeEmplacement.filter((e) => {
      return (
        // haut-gauche
        (e.x === emplacement.x - 1 && e.y === emplacement.y - 1) ||
        // haut-milieu
        (e.x === emplacement.x && e.y === emplacement.y - 1) ||
        // haut-droite
        (e.x === emplacement.x + 1 && e.y === emplacement.y - 1) ||
        // milieu-gauche
        (e.x === emplacement.x - 1 && e.y === emplacement.y) ||
        // milieu-droite
        (e.x === emplacement.x + 1 && e.y === emplacement.y) ||
        // bas-gauche
        (e.x === emplacement.x - 1 && e.y === emplacement.y + 1) ||
        // bas-milieu
        (e.x === emplacement.x && e.y === emplacement.y + 1) ||
        // bas-droite
        (e.x === emplacement.x + 1 && e.y === emplacement.y + 1)
      );
    });
  }

  function decouvrirListeEmplacementAdjacent(
    listeEmplacementZone: Emplacement[],
    nouvelleListeEmplacement: Emplacement[],
    indexEmplacement: number,
  ) {
    // On examine les emplacements adjacents
    const listeEmplacementAdjacent: Emplacement[] =
      recupererListeEmplacementAdjacent(
        listeEmplacementZone,
        nouvelleListeEmplacement[indexEmplacement],
      );

    listeEmplacementAdjacent.forEach((emplacementAdjacent) => {
      const indexEmplacementAdjacent = nouvelleListeEmplacement.findIndex(
        (e) => e.x === emplacementAdjacent.x && e.y === emplacementAdjacent.y,
      );

      // Si l'emplacement adjacent a une valeur différente de 0 ou une mine,
      // il est découvert et on arrête la cascade
      if (
        emplacementAdjacent.valeur !== "0" &&
        emplacementAdjacent.valeur !== "💣"
      ) {
        nouvelleListeEmplacement[indexEmplacementAdjacent].estDecouvert = true;
      }

      // Si l'emplacement est vide et n'a pas été découvert, il est révélé
      // puis on examine ses emplacements adjacents
      if (
        !emplacementAdjacent.estDecouvert &&
        emplacementAdjacent.valeur === "0"
      ) {
        nouvelleListeEmplacement[indexEmplacementAdjacent].estDecouvert = true;

        decouvrirListeEmplacementAdjacent(
          listeEmplacementZone,
          nouvelleListeEmplacement,
          indexEmplacementAdjacent,
        );
      }
    });
  }

  return {
    baliserEmplacement,
    configuration,
    definirZone,
    decouvrirEmplacement,
    estZoneDeminee,
    estZoneDetruite,
    listeEmplacement,
    nombreBaliseDisponible,
  };
}
