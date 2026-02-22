const API_URL = import.meta.env.VITE_GEMINI_API_URL ||
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

/**
 * AI elemzés vagy összehasonlítás kérése a Gemini API-tól
 * @param {Object} selectedScale - kiválasztott skála
 * @param {Object|null} compareScale - összehasonlító skála (opcionális)
 * @returns {Promise<string>} AI válasz szöveg
 */
export const fetchAITips = async (selectedScale, compareScale = null) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    if (!apiKey) {
        throw new Error('Nincs beállítva API kulcs. Add meg a VITE_GEMINI_API_KEY értékét a .env fájlban.');
    }

    const prompt = compareScale
        ? `Kérlek hasonlítsd össze ezt a két handpan skálát: 1. ${selectedScale.name} (${selectedScale.notes.join(', ')}) és 2. ${compareScale.name} (${compareScale.notes.join(', ')}). Mi a fő zeneelméleti és hangulati különbség köztük? Kinek melyiket ajánlanád? A válaszod legyen tagolt, használj formázást (vastagítás csillagokkal), írj magyarul, barátságos, szakmai de érthető stílusban. Ne legyen túl hosszú.`
        : `Kérlek adj 3 rövid, kreatív tippet arra, hogyan érdemes játszani egy ${selectedScale.name} (${selectedScale.ding}, ${selectedScale.notes.join(', ')}) handpanen. Milyen ritmusok, technikák vagy érzelmek illenek hozzá a legjobban? A válaszod legyen tagolt, használj formázást (vastagítás csillagokkal), írj magyarul, barátságos, inspiráló stílusban. Ne legyen túl hosszú.`;

    const url = `${API_URL}?key=${encodeURIComponent(apiKey)}`;

    let retries = 3;
    let delay = 1000;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new Error(`API hiba (${response.status}): ${errorBody.slice(0, 200)}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) return text;
            throw new Error('Üres válasz az AI-tól');
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(res => setTimeout(res, delay));
            delay *= 2;
        }
    }
};
