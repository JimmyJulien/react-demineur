export type Difficulte = "Débutant" | "Intermédiaire" | "Expert";

export interface ConfigurationZone {
  hauteur: number;
  largeur: number;
  nombreMine: number;
}

export interface Emplacement {
  estBalise: boolean;
  estDecouvert: boolean;
  estPotentiellementDangereux: boolean;
  valeur: string;
  x: number;
  y: number;
}
