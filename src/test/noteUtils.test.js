import { describe, test, expect } from 'vitest';
import { getNoteNames, getPitchClass, noteNameToMidi } from '../utils/noteUtils';

describe('getNoteNames', () => {
    test('C → ["C"]', () => expect(getNoteNames(0)).toEqual(['C']));
    test('C# → ["C#", "Desz"]', () => expect(getNoteNames(1)).toEqual(['C#', 'Desz']));
    test('H (B) → ["H"]', () => expect(getNoteNames(11)).toEqual(['H']));
    test('érvénytelen → []', () => expect(getNoteNames(12)).toEqual([]));
});

describe('getPitchClass', () => {
    test('C4 → 0', () => expect(getPitchClass('C4')).toBe(0));
    test('C#3 → 1', () => expect(getPitchClass('C#3')).toBe(1));
    test('H4 → 11', () => expect(getPitchClass('H4')).toBe(11));
    test('ESZ4 → 3 (enharmonikus)', () => expect(getPitchClass('Esz4')).toBe(3));
    test('G#3 → 8', () => expect(getPitchClass('G#3')).toBe(8));
});

describe('noteNameToMidi', () => {
    test('A4 → 69 (standard hangolási alappont)', () => expect(noteNameToMidi('A4')).toBe(69));
    test('C4 → 60', () => expect(noteNameToMidi('C4')).toBe(60));
    test('C5 → 72', () => expect(noteNameToMidi('C5')).toBe(72));
    test('D3 → 50', () => expect(noteNameToMidi('D3')).toBe(50));
    test('H2 → 47', () => expect(noteNameToMidi('H2')).toBe(47));
    test('magasabb oktáv → nagyobb MIDI szám', () => {
        expect(noteNameToMidi('C5')).toBeGreaterThan(noteNameToMidi('C4'));
    });
});
