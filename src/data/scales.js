import { ROOT_ORDER } from './noteConstants';

// === SKÁLA ADATBÁZIS ===
const SCALES_DATA = [
    // --- C ALAPÚAK ---
    {
        id: 'c_aegean_9', name: 'C Aegean 9', type: 'Dúr (Líd / Pentaton)', mood: 'Lebegő, álomszerű, világos',
        noteCount: 9, rootNote: 'C', family: 'Aegean',
        ding: 'C3', notes: ['E3', 'G3', 'H3', 'C4', 'E4', 'F#4', 'G4', 'H4'],
        description: 'Líd módra épülő, álomszerű hangsor. A felemelt 4. fok (F#) adja meg a jellegzetes, tágas Aegean hangzást.'
    },
    {
        id: 'c_amara_9', name: 'C Amara 9', type: 'Moll (Dór / Hexaton)', mood: 'Misztikus, meditatív, mély',
        noteCount: 9, rootNote: 'C', family: 'Amara',
        ding: 'C3', notes: ['G3', 'B3', 'C4', 'D4', 'Esz4', 'F4', 'G4', 'C5'],
        description: 'A 6. fok hiánya miatt nagyon nyitott, meditatív hangzású skála. A "C" alaphang miatt szép mély rezonanciája van.'
    },

    // --- C# ALAPÚAK ---
    {
        id: 'c_sharp_annaziska_9', name: 'C# Annaziska 9', type: 'Moll (C# Eol)', mood: 'Drámai, szenvedélyes, mély',
        noteCount: 9, rootNote: 'C#', family: 'Annaziska',
        ding: 'C#3', notes: ['G#3', 'A3', 'H3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4'],
        description: 'Gyönyörű, drámai természetes moll skála. A C# alaphang rendkívül mély és gazdag rezonanciát ad.'
    },

    // --- D ALAPÚAK ---
    {
        id: 'd_aegean_9', name: 'D Aegean 9', type: 'Dúr (Líd / Pentaton)', mood: 'Napfényes, grandiózus, lebegő',
        noteCount: 9, rootNote: 'D', family: 'Aegean',
        ding: 'D3', notes: ['F#3', 'A3', 'C#4', 'D4', 'F#4', 'G#4', 'A4', 'C#5'],
        description: 'A C Aegean magasabb párja. A felemelt 4. fok (G#) miatt hihetetlenül pozitív, tágas teret hoz létre.'
    },
    {
        id: 'd_amara_9', name: 'D Amara 9', type: 'Moll (Dór / Hexaton)', mood: 'Felemelő, áramló, kelta',
        noteCount: 9, rootNote: 'D', family: 'Amara',
        ding: 'D3', notes: ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'],
        description: 'Nagyon pozitív hangvételű moll skála, amely könnyed játékmódot tesz lehetővé (a 6. fok hiányzik).'
    },
    {
        id: 'd_amara_10', name: 'D Amara 10', type: 'Moll (Dór / Hexaton)', mood: 'Felemelő, gazdag, dinamikus',
        noteCount: 10, rootNote: 'D', family: 'Amara',
        ding: 'D3', notes: ['G3', 'A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'],
        description: 'Az Amara skála gyönyörű kiterjesztése egy mély G3 hanggal a Ding alatt, hihetetlen dinamikát adva.'
    },
    {
        id: 'd_kurd_9', name: 'D Kurd 9', type: 'Moll (Eol / Természetes moll)', mood: 'Érzelmes, melankolikus',
        noteCount: 9, rootNote: 'D', family: 'Kurd',
        ding: 'D3', notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
        description: 'Az egyik legnépszerűbb és leguniverzálisabb skála. Kezdőknek és haladóknak is kiváló, teljes természetes moll.'
    },
    {
        id: 'd_kurd_10', name: 'D Kurd 10', type: 'Moll (Eol / Természetes moll)', mood: 'Érzelmes, kiterjesztett',
        noteCount: 10, rootNote: 'D', family: 'Kurd',
        ding: 'D3', notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'],
        description: 'A 9 hangos alap Kurd kibővített változata egy magas C5 hanggal.'
    },

    // --- E ALAPÚAK ---
    {
        id: 'e_amara_9', name: 'E Celtic / Amara 9', type: 'Moll (Dór / Hexaton)', mood: 'Fényes, lebegő, felemelő',
        noteCount: 9, rootNote: 'E', family: 'Amara',
        ding: 'E3', notes: ['H3', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'D5'],
        description: 'Az Amara (más néven Celtic Minor) család fényes tagja, a jellegzetes nyitott b7 (D5) hangzásával.'
    },
    {
        id: 'e_amara_10', name: 'E Amara 10', type: 'Moll (Kiterjesztett)', mood: 'Mély, monumentális, éteri',
        noteCount: 10, rootNote: 'E', family: 'Amara',
        ding: 'E3', notes: ['H3', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'D5', 'E5'],
        description: 'A 9 hangos E Amara skála kibővített változata egy legfelső E5 hanggal, ami gyönyörű, tiszta lezárást ad.'
    },
    {
        id: 'e_kurd_9', name: 'E Kurd 9', type: 'Moll (Természetes)', mood: 'Tiszta, fókuszált, sokoldalú',
        noteCount: 9, rootNote: 'E', family: 'Kurd',
        ding: 'E3', notes: ['H3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4'],
        description: 'Az egyik legnépszerűbb természetes moll (E-moll). Dinamikus, sokszínű és minden stílusban megállja a helyét.'
    },
    {
        id: 'e_kurd_10', name: 'E Kurd 10', type: 'Moll (Természetes / Kiterjesztett)', mood: 'Tiszta, fókuszált, kiterjesztett',
        noteCount: 10, rootNote: 'E', family: 'Kurd',
        ding: 'E3', notes: ['H3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'D5'],
        description: 'A 9 hangos E Kurd kibővített változata egy magas D5 (kis szeptim) hanggal.'
    },

    // --- F ALAPÚAK ---
    {
        id: 'f_pygmy_9', name: 'F Pygmy 9', type: 'Moll (Dór / Pentaton jellegű)', mood: 'Törzsi, mély, földhözragadt',
        noteCount: 9, rootNote: 'F', family: 'Pygmy',
        ding: 'F3', notes: ['G3', 'Asz3', 'C4', 'Esz4', 'F4', 'G4', 'Asz4', 'C5'],
        description: 'Afrikai zenei gyökerekkel rendelkező skála. Meditatív, különleges hangulatot teremt, hiányzik belőle a 2. és 6. fok.'
    },
];

// Rendezett skálák exportálása
export const SCALES = [...SCALES_DATA].sort((a, b) => {
    if (ROOT_ORDER[a.rootNote] !== ROOT_ORDER[b.rootNote]) return ROOT_ORDER[a.rootNote] - ROOT_ORDER[b.rootNote];
    if (a.family !== b.family) return a.family.localeCompare(b.family);
    return a.noteCount - b.noteCount;
});
