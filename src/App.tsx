import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import "./App.css";
import type { Difficulte, Emplacement } from "./app.model";
import { useZone } from "./useZone";

export function App() {
  const optionsDifficulte: Difficulte[] = [
    "Débutant",
    "Intermédiaire",
    "Expert",
  ];

  const [difficulte, setDifficulte] = useState<Difficulte>("Débutant");

  const {
    baliserEmplacement,
    configuration,
    decouvrirEmplacement,
    definirZone,
    estZoneDeminee,
    estZoneDetruite,
    listeEmplacement,
    nombreBaliseDisponible,
  } = useZone(difficulte);

  const [tempsEcoule, setTempsEcoule] = useState<number>(0);

  const refIntervalTempsEcoule = useRef<NodeJS.Timeout | null>(null);

  function changerDifficulte(event: ChangeEvent<HTMLSelectElement>) {
    setDifficulte(event.target.value as Difficulte);
  }

  function lancerDeminage() {
    definirZone(difficulte);

    if (refIntervalTempsEcoule.current) {
      clearInterval(refIntervalTempsEcoule.current);
    }

    setTempsEcoule(0);
  }

  function deminer(indexEmplacement: number) {
    const aucunEmplacementDecouvert = listeEmplacement.every(
      (emplacement) => !emplacement.estDecouvert,
    );

    if (aucunEmplacementDecouvert) {
      refIntervalTempsEcoule.current = setInterval(() => {
        setTempsEcoule((tempsEcoule) => tempsEcoule + 1);
      }, 1000);
    }

    decouvrirEmplacement(indexEmplacement);
  }

  function baliser(
    event: MouseEvent<HTMLButtonElement>,
    indexEmplacement: number,
  ) {
    event.preventDefault();
    baliserEmplacement(indexEmplacement);
  }

  function definirContenuEmplacement(emplacement: Emplacement) {
    if (estZoneDetruite && emplacement.valeur === "💣") {
      return emplacement.valeur;
    }

    if (emplacement.estDecouvert) {
      return emplacement.valeur;
    }

    if (emplacement.estPotentiellementDangereux) {
      return "❓";
    }

    if (emplacement.estBalise) {
      return "🚩";
    }

    return "";
  }

  useEffect(() => {
    if (refIntervalTempsEcoule.current && (estZoneDeminee || estZoneDetruite)) {
      clearInterval(refIntervalTempsEcoule.current);
    }
  }, [estZoneDeminee, estZoneDetruite]);

  return (
    <div className="main-container">
      <div className="selection-container">
        <select
          className="selection"
          name="difficulte"
          value={difficulte}
          onChange={changerDifficulte}
        >
          {optionsDifficulte.map((difficulte) => (
            <option key={difficulte} value={difficulte}>
              {difficulte}
            </option>
          ))}
        </select>
      </div>

      <div className="conteneur-actions">
        <span className="action">
          {nombreBaliseDisponible} <span className="icone-action">🚩</span>
        </span>
        <button className="bouton-action" onClick={lancerDeminage}>
          {estZoneDeminee ? "😎" : estZoneDetruite ? "🤯" : "🙂"}
        </button>
        <span className="action">
          {tempsEcoule} <span className="icone-action">⏰</span>
        </span>
      </div>

      <div
        className="conteneur-zone"
        style={{
          gridTemplateColumns: `repeat(${configuration?.largeur ?? 1}, 1fr)`,
        }}
      >
        {listeEmplacement.map((emplacement, i) => (
          <button
            className={`emplacement ${emplacement.estDecouvert && emplacement.valeur === "💣" ? "erreur" : ""}`}
            data-valeur={emplacement.valeur}
            disabled={
              estZoneDeminee || estZoneDetruite || emplacement.estDecouvert
            }
            key={i}
            onClick={() => deminer(i)}
            onContextMenu={(e) => baliser(e, i)}
          >
            {definirContenuEmplacement(emplacement)}
          </button>
        ))}
      </div>
    </div>
  );
}
