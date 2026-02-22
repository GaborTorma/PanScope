import { supabase } from './supabaseClient';
import { SCALES } from '../data/scales';
import { ROOT_ORDER } from '../data/noteConstants';

const CACHE_KEY = 'panscope_scales_cache';
const CACHE_TTL = 1000 * 60 * 60; // 1 óra

/**
 * Skálák lekérése:
 * 1. Ha van Supabase → onnan kérdez (+ localStorage cache)
 * 2. Ha nincs / hiba → fallback a lokális SCALES tömbre
 */
export async function fetchScales() {
    // Ha nincs Supabase konfigurálva, azonnal fallback
    if (!supabase) {
        return SCALES;
    }

    // Cache ellenőrzés
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL && data?.length > 0) {
                // Háttérben frissítés (stale-while-revalidate)
                refreshCache();
                return sortScales(data);
            }
        }
    } catch { /* cache hiba → lekérdezés */ }

    // Supabase lekérdezés
    try {
        const { data, error } = await supabase
            .from('scales')
            .select('*');

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Üres válasz');

        // DB mezőnevek → frontend formátum mapping
        const mapped = data.map(mapDbToScale);

        // Cache mentés
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: mapped,
                timestamp: Date.now()
            }));
        } catch { /* localStorage tele → nem gond */ }

        return sortScales(mapped);
    } catch (err) {
        console.warn('[PanScope] Supabase hiba, fallback lokális adatokra:', err.message);
        return SCALES;
    }
}

/** Háttérben frissíti a cache-t */
async function refreshCache() {
    try {
        const { data, error } = await supabase
            .from('scales')
            .select('*');

        if (!error && data?.length > 0) {
            const mapped = data.map(mapDbToScale);
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: mapped,
                timestamp: Date.now()
            }));
        }
    } catch { /* silent fail */ }
}

/** DB snake_case → frontend camelCase */
function mapDbToScale(row) {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        mood: row.mood,
        noteCount: row.note_count,
        rootNote: row.root_note,
        family: row.family,
        ding: row.ding,
        notes: row.notes, // text[] jön PostgreSQL-ből
        description: row.description,
    };
}

/** ROOT_ORDER szerinti rendezés */
function sortScales(scales) {
    return [...scales].sort((a, b) => {
        if (ROOT_ORDER[a.rootNote] !== ROOT_ORDER[b.rootNote])
            return ROOT_ORDER[a.rootNote] - ROOT_ORDER[b.rootNote];
        if (a.family !== b.family)
            return a.family.localeCompare(b.family);
        return a.noteCount - b.noteCount;
    });
}
