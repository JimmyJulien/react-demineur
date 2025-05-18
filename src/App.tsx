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
    <>
      <div>
        <select
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

      <div>
        <span>{nombreBaliseDisponible}</span>
        <button onClick={lancerDeminage}>
          {estZoneDeminee ? "😎" : estZoneDetruite ? "🤯" : "🙂"}
        </button>
        <span>{tempsEcoule}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${configuration?.largeur ?? 1}, 1fr)`,
        }}
      >
        {listeEmplacement.map((emplacement, i) => (
          <button
            style={{
              background:
                emplacement.valeur === "💣" && emplacement.estDecouvert
                  ? "red"
                  : " black",
            }}
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
    </>
  );
}
