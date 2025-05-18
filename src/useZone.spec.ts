import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useZone } from "./useZone";

describe("useZone", () => {
  it("Doit définir une zone niveau débutant", async () => {
    const { result } = renderHook(() => useZone("Débutant"));

    await waitFor(() => {
      expect(result.current.configuration?.hauteur).toBe(9);
      expect(result.current.configuration?.largeur).toBe(9);
      expect(result.current.configuration?.nombreMine).toBe(10);
      expect(result.current.listeEmplacement.length).toBe(9 * 9);
    });
  });

  it("Doit définir une zone niveau intermédiaire", async () => {
    const { result } = renderHook(() => useZone("Intermédiaire"));

    await waitFor(() => {
      expect(result.current.configuration?.hauteur).toBe(16);
      expect(result.current.configuration?.largeur).toBe(16);
      expect(result.current.configuration?.nombreMine).toBe(40);
      expect(result.current.listeEmplacement.length).toBe(16 * 16);
    });
  });

  it("Doit définir une zone niveau expert", async () => {
    const { result } = renderHook(() => useZone("Expert"));

    await waitFor(() => {
      expect(result.current.configuration?.hauteur).toBe(16);
      expect(result.current.configuration?.largeur).toBe(30);
      expect(result.current.configuration?.nombreMine).toBe(99);
      expect(result.current.listeEmplacement.length).toBe(16 * 30);
    });
  });

  it("Doit baliser un emplacement", async () => {
    const { result } = renderHook(() => useZone("Débutant"));

    await waitFor(() => {
      expect(result.current.listeEmplacement.length).toBeGreaterThan(0);
    });

    act(() => result.current.baliserEmplacement(0));

    await waitFor(() => {
      expect(result.current.listeEmplacement[0].estBalise).toBe(true);
    });
  });

  it(
    "Doit retirer e balisage et marquer un emplacement comme potentiellement dangereux " +
      "quand on balise un emplacement déjà balisé",
    async () => {
      const { result } = renderHook(() => useZone("Débutant"));

      await waitFor(() => {
        expect(result.current.listeEmplacement.length).toBeGreaterThan(0);
      });

      act(() => result.current.baliserEmplacement(0));

      await waitFor(() => {
        expect(result.current.listeEmplacement[0].estBalise).toBe(true);
      });

      act(() => result.current.baliserEmplacement(0));

      await waitFor(() => {
        expect(result.current.listeEmplacement[0].estBalise).toBe(false);
        expect(
          result.current.listeEmplacement[0].estPotentiellementDangereux,
        ).toBe(true);
      });
    },
  );

  it(
    "Doit retirer le marqueur potentiellement dangereux " +
      "quand on balise un emplacement potentiellement dangereux",
    async () => {
      const { result } = renderHook(() => useZone("Débutant"));

      await waitFor(() => {
        expect(result.current.listeEmplacement.length).toBeGreaterThan(0);
      });

      act(() => result.current.baliserEmplacement(0));

      await waitFor(() => {
        expect(result.current.listeEmplacement[0].estBalise).toBe(true);
      });

      act(() => result.current.baliserEmplacement(0));

      await waitFor(() => {
        expect(
          result.current.listeEmplacement[0].estPotentiellementDangereux,
        ).toBe(true);
      });

      act(() => result.current.baliserEmplacement(0));

      await waitFor(() => {
        expect(
          result.current.listeEmplacement[0].estPotentiellementDangereux,
        ).toBe(false);
      });
    },
  );

  it("Doit découvrir un emplacement", async () => {
    const { result } = renderHook(() => useZone("Débutant"));

    await waitFor(() => {
      expect(result.current.listeEmplacement.length).toBeGreaterThan(0);
    });

    act(() => result.current.decouvrirEmplacement(0));

    await waitFor(() => {
      expect(result.current.listeEmplacement[0].estDecouvert).toBe(true);
    });
  });

  it("Doit considérer la zone comme détruite quand un emplacement avec une mine est découvert", async () => {
    const { result } = renderHook(() => useZone("Débutant"));

    await waitFor(() => {
      expect(result.current.listeEmplacement.length).toBeGreaterThan(0);
    });

    act(() => {
      const indexEmplacementBombe: number =
        result.current.listeEmplacement.findIndex(
          (emplacement) => emplacement.valeur === "💣",
        );
      result.current.decouvrirEmplacement(indexEmplacementBombe);
    });

    await waitFor(() => {
      expect(result.current.estZoneDetruite).toBe(true);
    });
  });

  it("Doit considérer la zone comme déminée quand tous les emplacements sans mine sont découverts", async () => {
    const { result } = renderHook(() => useZone("Débutant"));

    await waitFor(() => {
      expect(result.current.listeEmplacement.length).toBeGreaterThan(0);
    });

    act(() => {
      for (let i = 0; i < result.current.listeEmplacement.length; i++) {
        const emplacement = result.current.listeEmplacement[i];

        if (emplacement.valeur !== "💣") {
          result.current.decouvrirEmplacement(i);
        }
      }
    });

    await waitFor(() => {
      expect(result.current.estZoneDeminee).toBe(true);
    });
  });
});
