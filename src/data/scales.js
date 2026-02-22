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
    {
        id: 'c_sharp_annaziska_10', name: 'C# Annaziska 10', type: 'Moll (C# Eol)', mood: 'Drámai, kiterjesztett',
        noteCount: 10, rootNote: 'C#', family: 'Annaziska',
        ding: 'C#3', notes: ['G#3', 'A3', 'H3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'H4'],
        description: 'A 9 hangos Annaziska kibővített változata egy magas H4 (nemzetközi B4) hanggal.'
    },
    {
        id: 'c_sharp_chromatic_15', name: 'C# Chromatic 15', type: 'Kromatikus / Kísérleti', mood: 'Komplex, teljes, határok nélküli',
        noteCount: 15, rootNote: 'C#', family: 'Chromatic',
        ding: 'C#3', notes: ['G3', 'G#3', 'A3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4'],
        description: 'Kétoldalas "katedrális" handpan, mely az alsó és felső oldal használatával a kromatikus skálát lefedi.'
    },
    {
        id: 'c_sharp_mystic_9', name: 'C# Mystic 9', type: 'Moll / Különleges', mood: 'Varázslatos, éteri, éjszakai',
        noteCount: 9, rootNote: 'C#', family: 'Mystic',
        ding: 'C#3', notes: ['G#3', 'A3', 'C#4', 'D#4', 'E4', 'G#4', 'A4', 'C#5'],
        description: 'A Yatao és Numen kínálatának ikonikus, hihetetlenül éteri skálája. Ritka fokokból épül fel, nagyon meditatív.'
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
        id: 'd_celtic_8', name: 'D Celtic 8', type: 'Moll (Dór / Hexaton)', mood: 'Folyékony, mesebeli, reményteli',
        noteCount: 8, rootNote: 'D', family: 'Celtic',
        ding: 'D3', notes: ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
        description: 'Népszerű Celtic hangolás, mely a kelta népzenét idézi. Felemelő, nyitott végű skála.'
    },
    {
        id: 'd_celtic_9', name: 'D Celtic Minor 9', type: 'Moll (Dór / Hexaton)', mood: 'Folyékony, mesebeli',
        noteCount: 9, rootNote: 'D', family: 'Celtic',
        ding: 'D3', notes: ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'],
        description: 'Könnyen improvizálható skála, ami nyitottabban hagyja a zenét a legfelső kismikszeptim (C5) miatt.'
    },
    {
        id: 'd_hijaz_9', name: 'D Hijaz 9', type: 'Fríg domináns (Keleties)', mood: 'Arabeszk, sivatagi, egzotikus',
        noteCount: 9, rootNote: 'D', family: 'Hijaz',
        ding: 'D3', notes: ['A3', 'B3', 'C#4', 'D4', 'E4', 'F4', 'G4', 'A4'],
        description: 'Jellegzetes közel-keleti hangzásvilág. A bővített szekund lépés egyedülálló, misztikus atmoszférát teremt.'
    },
    {
        id: 'd_integral_8', name: 'D Integral 8', type: 'Moll (Természetes / Hiányos)', mood: 'Mély, sötét, feszültséggel teli',
        noteCount: 8, rootNote: 'D', family: 'Integral',
        ding: 'D3', notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'A4'],
        description: 'A 4. fok nélküli természetes D-moll skála. Nagyon mély és meditatív, sötét tónusú elrendezés.'
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
    {
        id: 'd_kurd_12', name: 'D Kurd 12 (Mutant)', type: 'Moll (Eol / Kiterjesztett)', mood: 'Komplex, professzionális, mély',
        noteCount: 12, rootNote: 'D', family: 'Kurd',
        ding: 'D3', notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5', 'D5'],
        description: 'Kibővített, úgynevezett "mutant" elrendezés extra mély G3 és magas C5, D5 hangokkal.'
    },
    {
        id: 'd_sabye_8', name: 'D SaBye 8', type: 'Dúr (Mixolíd/Jón)', mood: 'Keleties, felszabadult, különleges',
        noteCount: 8, rootNote: 'D', family: 'Sabye',
        ding: 'D3', notes: ['A3', 'H3', 'C#4', 'D4', 'E4', 'F#4', 'A4'],
        description: 'Egy gyönyörű, nyitott és vidám D-dúr alapú skála, amely szabad, meditatív játékot enged.'
    },
    {
        id: 'd_tarznau_9', name: 'D Tarznau 9', type: 'Moll (Harmonikus változó)', mood: 'Egzotikus, feszült, történetmesélő',
        noteCount: 9, rootNote: 'D', family: 'Tarznau',
        ding: 'D3', notes: ['G3', 'A3', 'C4', 'D4', 'D#4', 'F4', 'G4', 'A4'],
        description: 'Csodálatos közel-keleti fűszerezésű skála, mely nagyon egyedi dallamvezetést tesz lehetővé.'
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
        id: 'e_amara_12', name: 'E Amara 12 (Mutant)', type: 'Moll (Dór / Kiterjesztett)', mood: 'Éteri, áramló, magával ragadó',
        noteCount: 12, rootNote: 'E', family: 'Amara',
        ding: 'E3', notes: ['H3', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'D5', 'E5', 'F#5', 'G5'],
        description: 'Egy gyönyörűen kiterjesztett Amara skála, ami a magas regiszterekben további éteri hangokat (F#5, G5) kínál.'
    },
    {
        id: 'e_celtic_13', name: 'E Celtic Minor 13 (Mutant)', type: 'Moll (Hexaton / Kiterjesztett)', mood: 'Folyékony, mesebeli, végtelen',
        noteCount: 13, rootNote: 'E', family: 'Celtic',
        ding: 'E3', notes: ['H3', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'D5', 'E5', 'F#5', 'G5', 'A5'],
        description: 'Hatalmas hangterjedelmű, kiterjesztett (mutant) Celtic Minor elrendezés. A nagyon magas (E5-A5) hangok egészen éteri magasságokba viszik a dallamokat.'
    },
    {
        id: 'e_equinox_8', name: 'E Equinox 8', type: 'Moll (Eol / Hexaton)', mood: 'Titokzatos, atmoszférikus',
        noteCount: 8, rootNote: 'E', family: 'Equinox',
        ding: 'E3', notes: ['G3', 'H3', 'C4', 'D4', 'E4', 'F#4', 'G4'],
        description: 'Népszerű skála, amely átmenetet képez a sötétebb mollok és a reményteli hangzások között. 4. fok nélküli E-moll.'
    },
    {
        id: 'e_equinox_9', name: 'E Equinox 9', type: 'Moll (Eol / Hexaton)', mood: 'Titokzatos, atmoszférikus',
        noteCount: 9, rootNote: 'E', family: 'Equinox',
        ding: 'E3', notes: ['G3', 'H3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'H4'],
        description: 'Az Equinox teljesebb, 9 hangos változata, megőrizve a titokzatos és mély rezonanciát.'
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
    {
        id: 'e_kurd_12', name: 'E Kurd 12 (Mutant)', type: 'Moll (Természetes / Kiterjesztett)', mood: 'Dinamikus, professzionális, teljes',
        noteCount: 12, rootNote: 'E', family: 'Kurd',
        ding: 'E3', notes: ['H3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'C5', 'D5', 'E5'],
        description: 'Kiterjesztett (mutant) E Kurd elrendezés, mely két teljes oktávot lefed E3-tól E5-ig, hihetetlen szóló lehetőségeket nyújtva.'
    },
    {
        id: 'e_kurd_13', name: 'E Kurd 13 (A5 Mutant)', type: 'Moll (Természetes / Kiterjesztett)', mood: 'Monumentális, végtelen, virtuóz',
        noteCount: 13, rootNote: 'E', family: 'Kurd',
        ding: 'E3', notes: ['H3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'C5', 'D5', 'E5', 'A5'],
        description: 'Egy masszív 13 hangos Kurd mutant, ami a felső oktávot egészen egy csengő A5-ig kiterjeszti.'
    },
    {
        id: 'e_kurd_13_fsharp', name: 'E Kurd 13 F#', type: 'Moll (Természetes / Kiterjesztett)', mood: 'Monumentális, áramló, virtuóz',
        noteCount: 13, rootNote: 'E', family: 'Kurd',
        ding: 'E3', notes: ['H3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'H4', 'C5', 'D5', 'E5', 'F#5'],
        description: 'A 13 hangos Kurd mutant egy másik népszerű elrendezése, ami folytonosan, egészen F#5-ig terjeszti ki a skálát a magas regiszterben.'
    },
    {
        id: 'e_sabye_9', name: 'E Sabye 9', type: 'Dúr (Mixolíd)', mood: 'Keleties, felszabadult, különleges',
        noteCount: 9, rootNote: 'E', family: 'Sabye',
        ding: 'E3', notes: ['A3', 'H3', 'C#4', 'D4', 'E4', 'F#4', 'G#4', 'H4'],
        description: 'Egy gyönyörű mixolíd dúr skála, amelynek van egy kis keleties, varázslatos fűszerezése a kisseptim miatt.'
    },

    // --- F ALAPÚAK ---
    {
        id: 'f_integral_9', name: 'F Integral 9', type: 'Moll (Természetes / Hiányos)', mood: 'Mély, sötét, feszültséggel teli',
        noteCount: 9, rootNote: 'F', family: 'Integral',
        ding: 'F3', notes: ['C4', 'C#4', 'Esz4', 'F4', 'G4', 'Asz4', 'C5'],
        description: 'Sötét tónusú skála. A félhang lépések (C-C#) izgalmas, keleties feszültséget teremtenek benne.'
    },
    {
        id: 'f_pygmy_9', name: 'F Pygmy 9', type: 'Moll (Dór / Pentaton jellegű)', mood: 'Törzsi, mély, földhözragadt',
        noteCount: 9, rootNote: 'F', family: 'Pygmy',
        ding: 'F3', notes: ['G3', 'Asz3', 'C4', 'Esz4', 'F4', 'G4', 'Asz4', 'C5'],
        description: 'Afrikai zenei gyökerekkel rendelkező skála. Meditatív, különleges hangulatot teremt, hiányzik belőle a 2. és 6. fok.'
    },

    // --- F# ALAPÚAK ---
    {
        id: 'f_sharp_pygmy_9', name: 'F# Pygmy 9', type: 'Moll (Pentaton jellegű)', mood: 'Misztikus, törzsi, percussive',
        noteCount: 9, rootNote: 'F#', family: 'Pygmy',
        ding: 'F#3', notes: ['G#3', 'A3', 'C#4', 'E4', 'F#4', 'G#4', 'A4', 'C#5'],
        description: 'Egy élesebb, rendkívül dinamikus és "percussive" játékra alkalmas Pygmy hangolás.'
    },

    // --- H (Nemzetközi B) ALAPÚAK ---
    {
        id: 'h_celtic_9', name: 'H Celtic Minor 9 (B Celtic)', type: 'Moll (Hexaton)', mood: 'Földrengésszerű, ősi, elsöprő',
        noteCount: 9, rootNote: 'H', family: 'Celtic',
        ding: 'H2', notes: ['F#3', 'A3', 'H3', 'C#4', 'D4', 'E4', 'F#4', 'A4'],
        description: 'Hatalmas, basszus-nehéz skála (nemzetközi nevén B2 Celtic). Az extrém mély alaphang elképesztő rezgéseket generál.'
    }
];

// Rendezett skálák exportálása
export const SCALES = [...SCALES_DATA].sort((a, b) => {
    if (ROOT_ORDER[a.rootNote] !== ROOT_ORDER[b.rootNote]) return ROOT_ORDER[a.rootNote] - ROOT_ORDER[b.rootNote];
    if (a.family !== b.family) return a.family.localeCompare(b.family);
    return a.noteCount - b.noteCount;
});
