import { ROOT_ORDER } from '../data/noteConstants';

/**
 * Szűri a skálákat a megadott szűrő-objektum alapján
 */
export const filterScales = (scales, filters) => {
    return scales.filter(scale => {
        if (filters.root && scale.rootNote !== filters.root) return false;
        if (filters.family && scale.family !== filters.family) return false;
        if (filters.count && scale.noteCount.toString() !== filters.count.toString()) return false;
        return true;
    });
};

/**
 * Megadja, hogy egy adott szűrő-mezőből milyen értékek érhetők el
 * (a többi szűrő figyelembevételével)
 */
export const getAvailableOptions = (allScales, currentFilters, fieldToExtract) => {
    const filtered = allScales.filter(s => {
        if (fieldToExtract !== 'root' && currentFilters.root && s.rootNote !== currentFilters.root) return false;
        if (fieldToExtract !== 'family' && currentFilters.family && s.family !== currentFilters.family) return false;
        if (fieldToExtract !== 'count' && currentFilters.count && s.noteCount.toString() !== currentFilters.count.toString()) return false;
        return true;
    });

    const vals = [...new Set(filtered.map(s => {
        if (fieldToExtract === 'root') return s.rootNote;
        if (fieldToExtract === 'family') return s.family;
        if (fieldToExtract === 'count') return s.noteCount;
        return null;
    }))];

    return vals.sort((a, b) => {
        if (fieldToExtract === 'root') return ROOT_ORDER[a] - ROOT_ORDER[b];
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        return a.toString().localeCompare(b.toString());
    });
};
