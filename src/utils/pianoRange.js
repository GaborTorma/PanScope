import { noteNameToMidi } from './noteUtils';

/**
 * Kiszámolja a szükséges MIDI tartományt egy vagy több skálához,
 * +padding fehér billentyűt adva mindkét oldalon.
 *
 * @param {Array} scales - Skálák tömbje (legalább egy elem kötelező)
 * @param {number} whiteKeyPadding - Hány extra fehér billentyű legyen mindkét oldalon
 * @returns {{ startMidi: number, endMidi: number }}
 */
export const calculatePianoRange = (scales, whiteKeyPadding = 2) => {
    const BLACK_KEYS = new Set([1, 3, 6, 8, 10]);

    // Összegyűjtjük az összes hang MIDI értékét az összes skálából
    const allMidi = scales
        .filter(Boolean)
        .flatMap(scale => [scale.ding, ...scale.notes].map(noteNameToMidi));

    if (allMidi.length === 0) {
        return { startMidi: 43, endMidi: 83 }; // Fallback: G2–B5
    }

    const rawMin = Math.min(...allMidi);
    const rawMax = Math.max(...allMidi);

    // Bal oldali padding: visszafelé lépünk, fehér billentyűket számolva
    let startMidi = rawMin;
    let whiteCount = 0;
    while (whiteCount < whiteKeyPadding && startMidi > 21) {
        startMidi--;
        if (!BLACK_KEYS.has(startMidi % 12)) {
            whiteCount++;
        }
    }

    // Jobb oldali padding: előre lépünk, fehér billentyűket számolva
    let endMidi = rawMax;
    whiteCount = 0;
    while (whiteCount < whiteKeyPadding && endMidi < 108) {
        endMidi++;
        if (!BLACK_KEYS.has(endMidi % 12)) {
            whiteCount++;
        }
    }

    return { startMidi, endMidi };
};
