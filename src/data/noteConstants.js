// Zenei sorrend az alaphangok helyes sorrendbe tételéhez
export const ROOT_ORDER = {
    'C': 1, 'C#': 2, 'D': 3, 'D#': 4, 'E': 5, 'F': 6,
    'F#': 7, 'G': 8, 'G#': 9, 'A': 10, 'B': 11, 'H': 12
};

// Hangnevek → pitch class (0-11) leképezés
export const NOTE_CLASS_MAP = {
    'C': 0, 'C#': 1, 'DESZ': 1, 'D': 2, 'D#': 3, 'ESZ': 3,
    'E': 4, 'F': 5, 'F#': 6, 'GESZ': 6, 'G': 7, 'G#': 8,
    'ASZ': 8, 'A': 9, 'A#': 10, 'B': 10, 'H': 11
};
