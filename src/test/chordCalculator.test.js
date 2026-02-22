import { describe, test, expect } from 'vitest';
import { calculateChords } from '../utils/chordCalculator';

const D_KURD_SCALE = {
    id: 'd_kurd_9',
    ding: 'D3',
    notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
};

describe('calculateChords', () => {
    test('null skálára üres tömböt ad', () => {
        expect(calculateChords(null)).toEqual([]);
    });

    test('undefined skálára üres tömböt ad', () => {
        expect(calculateChords(undefined)).toEqual([]);
    });

    test('D Kurd skálán legalább egy akkordot számít', () => {
        const chords = calculateChords(D_KURD_SCALE);
        expect(chords.length).toBeGreaterThan(0);
    });

    test('minden akkordnak van neve, típusa és voicing-ja', () => {
        const chords = calculateChords(D_KURD_SCALE);
        chords.forEach(chord => {
            expect(chord).toHaveProperty('name');
            expect(chord).toHaveProperty('type');
            expect(chord).toHaveProperty('voicings');
            expect(chord.voicings.length).toBeGreaterThan(0);
        });
    });

    test('D Kurd skálán D Moll akkord megtalálható', () => {
        const chords = calculateChords(D_KURD_SCALE);
        const dMoll = chords.find(c => c.name === 'D Moll');
        expect(dMoll).toBeDefined();
    });

    test('voicing 3 MIDI hangból áll', () => {
        const chords = calculateChords(D_KURD_SCALE);
        chords.forEach(chord => {
            chord.voicings.forEach(v => {
                expect(v.midiNotes).toHaveLength(3);
            });
        });
    });

    test('akkord típusok csak major/minor/dim lehetnek', () => {
        const chords = calculateChords(D_KURD_SCALE);
        const validTypes = ['major', 'minor', 'dim'];
        chords.forEach(c => expect(validTypes).toContain(c.type));
    });
});
