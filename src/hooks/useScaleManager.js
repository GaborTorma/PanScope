import { useState, useMemo, useEffect, useCallback } from 'react';
import { SCALES } from '../data/scales';
import { fetchScales } from '../services/scaleService';
import { filterScales, getAvailableOptions } from '../utils/scaleFilters';
import { calculateChords } from '../utils/chordCalculator';

let nextId = 1;

/**
 * Custom hook a dinamikus, többszörös skálaslot kezelésére.
 * A skálákat Supabase-ből tölti, fallback a lokális SCALES tömbre.
 */
export const useScaleManager = () => {
    const [allScales, setAllScales] = useState(SCALES); // azonnal fallback-kel indul
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState('local'); // 'local' | 'supabase'

    // Async betöltés indításkor
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const scales = await fetchScales();
                if (!cancelled && scales?.length > 0) {
                    setAllScales(scales);
                    // Ha a Supabase client nem null → 'supabase', különben 'local'
                    setDataSource(scales !== SCALES ? 'supabase' : 'local');
                }
            } catch {
                // Fallback marad
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const makeSlot = useCallback((scaleId) => ({
        id: `slot-${nextId++}`,
        scaleId: scaleId || allScales[0]?.id || '',
        filters: { root: '', family: '', count: '' },
    }), [allScales]);

    const [slots, setSlots] = useState(() => [{
        id: `slot-${nextId++}`,
        scaleId: SCALES[0]?.id || '',
        filters: { root: '', family: '', count: '' },
    }]);
    const [splitView, setSplitView] = useState(false);

    // --- Slot CRUD ---
    const addSlot = useCallback(() => {
        setSlots(prev => [...prev, makeSlot()]);
    }, [makeSlot]);

    const removeSlot = useCallback((id) => {
        setSlots(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
    }, []);

    const updateSlotFilter = useCallback((id, key, value) => {
        setSlots(prev => prev.map(slot => {
            if (slot.id !== id) return slot;
            const nextFilters = { ...slot.filters, [key]: value };
            const valid = filterScales(allScales, nextFilters);
            if (valid.length === 0) {
                return { ...slot, filters: { root: '', family: '', count: '', [key]: value } };
            }
            return { ...slot, filters: nextFilters };
        }));
    }, [allScales]);

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

    // Osztott nézet kikapcsol, ha csak 1 slot van
    useEffect(() => {
        if (slots.length <= 1) setSplitView(false);
    }, [slots.length]);

    // --- Minden slothoz kiszámítjuk a szűrt listákat ---
    const resolvedSlots = useMemo(() => {
        // Első menet: minden slot effektív scaleId-ja
        const effectiveIds = slots.map(slot => {
            const filtered = filterScales(allScales, slot.filters);
            return filtered.find(s => s.id === slot.scaleId)
                ? slot.scaleId
                : filtered[0]?.id || slot.scaleId;
        });

        return slots.map((slot, slotIndex) => {
            const filtered = filterScales(allScales, slot.filters);
            const effectiveScaleId = effectiveIds[slotIndex];

            // Más slotokban már kiválasztott skálák kizárása (de a sajátja marad)
            const otherIds = new Set(effectiveIds.filter((_, i) => i !== slotIndex));
            const filteredExclusive = filtered.filter(s => !otherIds.has(s.id) || s.id === effectiveScaleId);

            const selectedScale = allScales.find(s => s.id === effectiveScaleId) || null;
            const chords = calculateChords(selectedScale);

            return {
                ...slot,
                scaleId: effectiveScaleId,
                filteredScales: filteredExclusive,
                availableRoots: getAvailableOptions(allScales, slot.filters, 'root'),
                availableFamilies: getAvailableOptions(allScales, slot.filters, 'family'),
                availableCounts: getAvailableOptions(allScales, slot.filters, 'count'),
                hasActiveFilters: Object.values(slot.filters).some(v => v !== ''),
                selectedScale,
                chords,
            };
        });
    }, [slots, allScales]);

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
        isLoading,
        dataSource,
    };
};
