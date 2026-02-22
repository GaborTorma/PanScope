import { describe, test, expect } from 'vitest';
import { filterScales, getAvailableOptions } from '../utils/scaleFilters';
import { SCALES } from '../data/scales';

describe('filterScales', () => {
    test('üres szűrőre az összes skálát visszaadja', () => {
        const result = filterScales(SCALES, { root: '', family: '', count: '' });
        expect(result).toHaveLength(SCALES.length);
    });

    test('root szűrő csak D alapú skálákat ad', () => {
        const result = filterScales(SCALES, { root: 'D', family: '', count: '' });
        result.forEach(s => expect(s.rootNote).toBe('D'));
        expect(result.length).toBeGreaterThan(0);
    });

    test('family szűrő csak Kurd skálákat ad', () => {
        const result = filterScales(SCALES, { root: '', family: 'Kurd', count: '' });
        result.forEach(s => expect(s.family).toBe('Kurd'));
        expect(result.length).toBeGreaterThan(0);
    });

    test('count szűrő csak 9 hangos skálákat ad', () => {
        const result = filterScales(SCALES, { root: '', family: '', count: '9' });
        result.forEach(s => expect(s.noteCount).toBe(9));
    });

    test('nem létező kombinációra üres tömböt ad', () => {
        const result = filterScales(SCALES, { root: 'C', family: 'Kurd', count: '' });
        expect(result).toHaveLength(0);
    });

    test('kombinált szűrők: D + Kurd', () => {
        const result = filterScales(SCALES, { root: 'D', family: 'Kurd', count: '' });
        result.forEach(s => {
            expect(s.rootNote).toBe('D');
            expect(s.family).toBe('Kurd');
        });
    });
});

describe('getAvailableOptions', () => {
    const emptyFilters = { root: '', family: '', count: '' };

    test('root opcióknál C megjelenik', () => {
        const roots = getAvailableOptions(SCALES, emptyFilters, 'root');
        expect(roots).toContain('C');
    });

    test('family opcióknál Kurd megjelenik', () => {
        const families = getAvailableOptions(SCALES, emptyFilters, 'family');
        expect(families).toContain('Kurd');
    });

    test('count opciók számok', () => {
        const counts = getAvailableOptions(SCALES, emptyFilters, 'count');
        counts.forEach(c => expect(typeof c).toBe('number'));
    });

    test('D szűrő mellett csak D-skálák family-jei jelennek meg', () => {
        const families = getAvailableOptions(SCALES, { root: 'D', family: '', count: '' }, 'family');
        const dScales = SCALES.filter(s => s.rootNote === 'D');
        const dFamilies = [...new Set(dScales.map(s => s.family))];
        families.forEach(f => expect(dFamilies).toContain(f));
    });
});
