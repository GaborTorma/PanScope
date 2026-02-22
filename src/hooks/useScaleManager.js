import { useState, useMemo, useEffect, useCallback } from 'react';
import { SCALES } from '../data/scales';
import { filterScales, getAvailableOptions } from '../utils/scaleFilters';
import { calculateChords } from '../utils/chordCalculator';

let nextId = 1;
const makeSlot = (scaleId) => ({
    id: `slot-${nextId++}`,
    scaleId: scaleId || SCALES[0].id,
    filters: { root: '', family: '', count: '' },
});

/**
 * Custom hook a dinamikus, többszörös skálaslot kezelésére.
 * Minden slot saját szűrőkkel, kiválasztott skálával és akkordokkal rendelkezik.
 */
export const useScaleManager = () => {
    const [slots, setSlots] = useState([makeSlot()]);
    const [splitView, setSplitView] = useState(false);

    // --- Slot CRUD ---
    const addSlot = useCallback(() => {
        setSlots(prev => [...prev, makeSlot()]);
    }, []);

    const removeSlot = useCallback((id) => {
        setSlots(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
    }, []);

    const updateSlotFilter = useCallback((id, key, value) => {
        setSlots(prev => prev.map(slot => {
            if (slot.id !== id) return slot;
            const nextFilters = { ...slot.filters, [key]: value };
            const valid = filterScales(SCALES, nextFilters);
            // Ha az új szűrő kiüresítené a listát, csak az adott szűrőt állítjuk, a többit reseteljük
            if (valid.length === 0) {
                return { ...slot, filters: { root: '', family: '', count: '', [key]: value } };
            }
            return { ...slot, filters: nextFilters };
        }));
    }, []);

    const updateSlotScale = useCallback((id, scaleId) => {
        setSlots(prev => prev.map(slot =>
            slot.id === id ? { ...slot, scaleId } : slot
        ));
    }, []);

    const clearSlotFilters = useCallback((id) => {
        setSlots(prev => prev.map(slot =>
            slot.id === id ? { ...slot, filters: { root: '', family: '', count: '' } } : slot
        ));
    }, []);

    // Osztott nézet automatikusan kikapcsol, ha nem pontosan 2 slot van
    useEffect(() => {
        if (slots.length !== 2) setSplitView(false);
    }, [slots.length]);

    // --- Minden slothoz kiszámítjuk a szűrt listákat és a kiválasztott skálát ---
    const resolvedSlots = useMemo(() =>
        slots.map(slot => {
            const filtered = filterScales(SCALES, slot.filters);

            // Ha a jelenlegi scaleId nincs benne a szűrt listában → első elemre ugrunk
            const effectiveScaleId = filtered.find(s => s.id === slot.scaleId)
                ? slot.scaleId
                : filtered[0]?.id || slot.scaleId;

            const selectedScale = SCALES.find(s => s.id === effectiveScaleId) || null;
            const chords = calculateChords(selectedScale);

            return {
                ...slot,
                scaleId: effectiveScaleId,
                filteredScales: filtered,
                availableRoots: getAvailableOptions(SCALES, slot.filters, 'root'),
                availableFamilies: getAvailableOptions(SCALES, slot.filters, 'family'),
                availableCounts: getAvailableOptions(SCALES, slot.filters, 'count'),
                hasActiveFilters: Object.values(slot.filters).some(v => v !== ''),
                selectedScale,
                chords,
            };
        }),
        [slots]);

    // Az összes aktív skála (a zongora és az AI számára)
    const activeScales = resolvedSlots.map(s => s.selectedScale).filter(Boolean);

    return {
        slots: resolvedSlots,
        addSlot,
        removeSlot,
        updateSlotFilter,
        updateSlotScale,
        clearSlotFilters,
        activeScales,
        splitView,
        setSplitView,
        canSplit: slots.length === 2,
    };
};
