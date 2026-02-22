import { NOTE_CLASS_MAP } from '../data/noteConstants';

/**
 * Pitch class (0-11) → lehetséges hangnevek (enharmonikus párral)
 */
export const getNoteNames = (noteClass) => {
    switch (noteClass) {
        case 0: return ['C'];
        case 1: return ['C#', 'Desz'];
        case 2: return ['D'];
        case 3: return ['D#', 'Esz'];
        case 4: return ['E'];
        case 5: return ['F'];
        case 6: return ['F#', 'Gesz'];
        case 7: return ['G'];
        case 8: return ['G#', 'Asz'];
        case 9: return ['A'];
        case 10: return ['B', 'A#'];
        case 11: return ['H'];
        default: return [];
    }
};

/**
 * Hangnév (pl. 'C#4') → pitch class (0-11)
 */
export const getPitchClass = (noteName) => {
    const cleanName = noteName.replace(/[0-9]/g, '').toUpperCase();
    return NOTE_CLASS_MAP[cleanName];
};

/**
 * Hangnév (pl. 'C4') → MIDI szám
 */
export const noteNameToMidi = (noteName) => {
    const cleanName = noteName.replace(/[0-9]/g, '').toUpperCase();
    const octave = parseInt(noteName.replace(/[^0-9]/g, ''), 10);
    const pc = NOTE_CLASS_MAP[cleanName];
    return (octave + 1) * 12 + pc;
};

/**
 * MIDI szám → melyik skálában van (ding/tone/nem tartozik bele)
 */
export const getNoteMatch = (midi, selectedScale, compareScale, tertiaryScale = null) => {
    const noteClass = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const possibleNames = getNoteNames(noteClass).map(n => `${n}${octave}`);

    const checkScale = (scale) => {
        if (!scale) return { isDing: false, isTone: false, matchedName: '', isActive: false, index: null };
        let isDing = false, isTone = false, matchedName = '', index = null;

        for (const name of possibleNames) {
            if (scale.ding === name) { isDing = true; matchedName = name; index = 'Ding'; break; }
        }
        if (!isDing) {
            for (const name of possibleNames) {
                const idx = scale.notes.indexOf(name);
                if (idx !== -1) { isTone = true; matchedName = name; index = idx + 1; break; }
            }
        }
        return { isDing, isTone, matchedName, isActive: isDing || isTone, index };
    };

    return {
        primary: checkScale(selectedScale),
        secondary: checkScale(compareScale),
        tertiary: checkScale(tertiaryScale),
    };
};
