import { useState, useMemo, useEffect } from 'react';
import { SCALES } from '../data/scales';
import { filterScales, getAvailableOptions } from '../utils/scaleFilters';
import { calculateChords } from '../utils/chordCalculator';

/**
 * Custom hook a teljes skálaválasztás, szűrés és összehasonlítás kezelésére
 */
export const useScaleManager = () => {
    const [filters1, setFilters1] = useState({ root: '', family: '', count: '' });
    const [filters2, setFilters2] = useState({ root: '', family: '', count: '' });
    const [selectedScaleId, setSelectedScaleId] = useState(SCALES[0].id);
    const [compareScaleId, setCompareScaleId] = useState('');
    const [splitView, setSplitView] = useState(false);

    const handleFilterChange = (filtersSetter, currentFilters) => (key, value) => {
        const nextFilters = { ...currentFilters, [key]: value };
        const validScales = filterScales(SCALES, nextFilters);

        if (validScales.length === 0) {
            filtersSetter({ root: '', family: '', count: '', [key]: value });
        } else {
            filtersSetter(nextFilters);
        }
    };

    const handleFilterChange1 = handleFilterChange(setFilters1, filters1);
    const handleFilterChange2 = handleFilterChange(setFilters2, filters2);

    // Elérhető szűrő-opciók
    const availableRoots1 = useMemo(() => getAvailableOptions(SCALES, filters1, 'root'), [filters1]);
    const availableFamilies1 = useMemo(() => getAvailableOptions(SCALES, filters1, 'family'), [filters1]);
    const availableCounts1 = useMemo(() => getAvailableOptions(SCALES, filters1, 'count'), [filters1]);

    const availableRoots2 = useMemo(() => getAvailableOptions(SCALES, filters2, 'root'), [filters2]);
    const availableFamilies2 = useMemo(() => getAvailableOptions(SCALES, filters2, 'family'), [filters2]);
    const availableCounts2 = useMemo(() => getAvailableOptions(SCALES, filters2, 'count'), [filters2]);

    // Szűrt skála-listák
    const filteredScales1 = useMemo(() => filterScales(SCALES, filters1), [filters1]);
    const filteredScales2 = useMemo(() => filterScales(SCALES, filters2), [filters2]);

    // Automatikus kiválasztás-frissítés szűrésnél
    useEffect(() => {
        if (filteredScales1.length > 0 && !filteredScales1.find(s => s.id === selectedScaleId)) {
            setSelectedScaleId(filteredScales1[0].id);
        }
    }, [filteredScales1, selectedScaleId]);

    useEffect(() => {
        if (compareScaleId) {
            if (filteredScales2.length === 0) {
                setCompareScaleId('');
            } else if (!filteredScales2.find(s => s.id === compareScaleId)) {
                setCompareScaleId(filteredScales2[0].id);
            }
        }
    }, [filteredScales2, compareScaleId]);

    // Kiválasztott skálák
    const selectedScale = useMemo(() => SCALES.find(s => s.id === selectedScaleId) || null, [selectedScaleId]);
    const compareScale = useMemo(() => compareScaleId ? SCALES.find(s => s.id === compareScaleId) : null, [compareScaleId]);

    // Akkordok
    const primaryChords = useMemo(() => calculateChords(selectedScale), [selectedScale]);
    const secondaryChords = useMemo(() => calculateChords(compareScale), [compareScale]);

    const handleScaleChange = (value, isCompare) => {
        if (isCompare) setCompareScaleId(value);
        else setSelectedScaleId(value);
    };

    const handleClearAllFilters = () => {
        setFilters1({ root: '', family: '', count: '' });
        setFilters2({ root: '', family: '', count: '' });
    };

    const hasActiveFilters = Object.values(filters1).some(v => v !== '') || Object.values(filters2).some(v => v !== '');

    return {
        // Szűrők
        filters1, filters2,
        handleFilterChange1, handleFilterChange2,
        handleClearAllFilters, hasActiveFilters,
        // Szűrő opciók (1. skála)
        availableRoots1, availableFamilies1, availableCounts1,
        // Szűrő opciók (2. skála)
        availableRoots2, availableFamilies2, availableCounts2,
        // Szűrt listák
        filteredScales1, filteredScales2,
        // Kiválasztott skálák
        selectedScale, compareScale,
        selectedScaleId, compareScaleId,
        handleScaleChange,
        // Nézet
        splitView, setSplitView,
        // Akkordok
        primaryChords, secondaryChords,
    };
};
