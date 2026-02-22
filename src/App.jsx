import React, { useState, useMemo, useEffect, useRef } from 'react';

// Célzott zenei sorrend az alaphangok (Root Note) helyes sorrendbe tételéhez
const ROOT_ORDER = {
  'C': 1, 'C#': 2, 'D': 3, 'D#': 4, 'E': 5, 'F': 6, 'F#': 7, 'G': 8, 'G#': 9, 'A': 10, 'B': 11, 'H': 12
};

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

// Futtatáskor azonnali rendezés az előre meghatározott hierarchia alapján
const SCALES = [...SCALES_DATA].sort((a, b) => {
  if (ROOT_ORDER[a.rootNote] !== ROOT_ORDER[b.rootNote]) return ROOT_ORDER[a.rootNote] - ROOT_ORDER[b.rootNote];
  if (a.family !== b.family) return a.family.localeCompare(b.family);
  return a.noteCount - b.noteCount;
});

const getNoteNames = (noteClass) => {
  switch (noteClass) {
    case 0: return ['C'];
    case 1: return ['C#', 'Desz'];
    case 2: return ['D'];
    case 3: return ['D#', 'Esz'];
    case 4: return ['E'];
    case 5: return ['F'];
    case 6: return ['F#', 'Gesz'];
    case 7: return ['G'];
    case 8: return ['G#', 'Asz'];
    case 9: return ['A'];
    case 10: return ['B', 'A#']; // B = Bb (Nemzetközi), A# is here
    case 11: return ['H'];       // H = B (Nemzetközi)
    default: return [];
  }
};

// --- AKKORD SZÁMÍTÁSHOZ SZÜKSÉGES SEGÉDFÜGGVÉNYEK ---
const NOTE_CLASS_MAP = {
  'C': 0, 'C#': 1, 'DESZ': 1, 'D': 2, 'D#': 3, 'ESZ': 3,
  'E': 4, 'F': 5, 'F#': 6, 'GESZ': 6, 'G': 7, 'G#': 8,
  'ASZ': 8, 'A': 9, 'A#': 10, 'B': 10, 'H': 11
};

const getPitchClass = (noteName) => {
  const cleanName = noteName.replace(/[0-9]/g, '').toUpperCase();
  return NOTE_CLASS_MAP[cleanName];
};

const noteNameToMidi = (noteName) => {
  const cleanName = noteName.replace(/[0-9]/g, '').toUpperCase();
  const octave = parseInt(noteName.replace(/[^0-9]/g, ''), 10);
  const pc = NOTE_CLASS_MAP[cleanName];
  return (octave + 1) * 12 + pc;
};

// Akkordok és azok összes variációjának (voicing) kiszámítása
const calculateChords = (scale) => {
  if (!scale) return [];
  const allNotes = [scale.ding, ...scale.notes];

  const availablePitchClasses = {};
  allNotes.forEach(n => {
    const pc = getPitchClass(n);
    if (!availablePitchClasses[pc]) availablePitchClasses[pc] = [];
    if (!availablePitchClasses[pc].includes(n)) {
      availablePitchClasses[pc].push(n);
    }
  });

  Object.keys(availablePitchClasses).forEach(pc => {
    availablePitchClasses[pc].sort((a, b) => noteNameToMidi(a) - noteNameToMidi(b));
  });

  const pitchClasses = new Set(Object.keys(availablePitchClasses).map(Number));
  const chords = [];
  const rootNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H'];

  const buildVoicings = (rootPc, thirdPc, fifthPc) => {
    const voicings = [];
    availablePitchClasses[rootPc].forEach(r => {
      availablePitchClasses[thirdPc].forEach(t => {
        availablePitchClasses[fifthPc].forEach(f => {
          voicings.push({
            label: `[ ${r} - ${t} - ${f} ]`,
            midiNotes: [noteNameToMidi(r), noteNameToMidi(t), noteNameToMidi(f)]
          });
        });
      });
    });
    return voicings;
  };

  pitchClasses.forEach(root => {
    const thirdMaj = (root + 4) % 12;
    const thirdMin = (root + 3) % 12;
    const fifthPerf = (root + 7) % 12;
    const fifthDim = (root + 6) % 12;

    if (pitchClasses.has(thirdMaj) && pitchClasses.has(fifthPerf)) {
      chords.push({ name: `${rootNames[root]} Dúr`, type: 'major', voicings: buildVoicings(root, thirdMaj, fifthPerf) });
    }
    if (pitchClasses.has(thirdMin) && pitchClasses.has(fifthPerf)) {
      chords.push({ name: `${rootNames[root]} Moll`, type: 'minor', voicings: buildVoicings(root, thirdMin, fifthPerf) });
    }
    if (pitchClasses.has(thirdMin) && pitchClasses.has(fifthDim)) {
      chords.push({ name: `${rootNames[root]} Szűk`, type: 'dim', voicings: buildVoicings(root, thirdMin, fifthDim) });
    }
  });

  return chords;
};

const getAvailableOptions = (allScales, currentFilters, fieldToExtract) => {
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

let audioCtx = null;

export default function App() {
  const [filters1, setFilters1] = useState({ root: '', family: '', count: '' });
  const [filters2, setFilters2] = useState({ root: '', family: '', count: '' });

  const [selectedScaleId, setSelectedScaleId] = useState(SCALES[0].id);
  const [compareScaleId, setCompareScaleId] = useState('');
  const [splitView, setSplitView] = useState(false);

  const [baseFrequency, setBaseFrequency] = useState(440);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiError, setAiError] = useState('');

  const [activeNotes, setActiveNotes] = useState({});

  const handleFilterChange1 = (key, value) => {
    const nextFilters = { ...filters1, [key]: value };
    const validScales = SCALES.filter(s => {
      if (nextFilters.root && s.rootNote !== nextFilters.root) return false;
      if (nextFilters.family && s.family !== nextFilters.family) return false;
      if (nextFilters.count && s.noteCount.toString() !== nextFilters.count.toString()) return false;
      return true;
    });

    if (validScales.length === 0) {
      setFilters1({ root: '', family: '', count: '', [key]: value });
    } else {
      setFilters1(nextFilters);
    }
  };

  const handleFilterChange2 = (key, value) => {
    const nextFilters = { ...filters2, [key]: value };
    const validScales = SCALES.filter(s => {
      if (nextFilters.root && s.rootNote !== nextFilters.root) return false;
      if (nextFilters.family && s.family !== nextFilters.family) return false;
      if (nextFilters.count && s.noteCount.toString() !== nextFilters.count.toString()) return false;
      return true;
    });

    if (validScales.length === 0) {
      setFilters2({ root: '', family: '', count: '', [key]: value });
    } else {
      setFilters2(nextFilters);
    }
  };

  const availableRoots1 = useMemo(() => getAvailableOptions(SCALES, filters1, 'root'), [filters1]);
  const availableFamilies1 = useMemo(() => getAvailableOptions(SCALES, filters1, 'family'), [filters1]);
  const availableCounts1 = useMemo(() => getAvailableOptions(SCALES, filters1, 'count'), [filters1]);

  const availableRoots2 = useMemo(() => getAvailableOptions(SCALES, filters2, 'root'), [filters2]);
  const availableFamilies2 = useMemo(() => getAvailableOptions(SCALES, filters2, 'family'), [filters2]);
  const availableCounts2 = useMemo(() => getAvailableOptions(SCALES, filters2, 'count'), [filters2]);

  const filteredScales1 = useMemo(() => {
    return SCALES.filter(scale => {
      if (filters1.root && scale.rootNote !== filters1.root) return false;
      if (filters1.family && scale.family !== filters1.family) return false;
      if (filters1.count && scale.noteCount.toString() !== filters1.count.toString()) return false;
      return true;
    });
  }, [filters1]);

  const filteredScales2 = useMemo(() => {
    return SCALES.filter(scale => {
      if (filters2.root && scale.rootNote !== filters2.root) return false;
      if (filters2.family && scale.family !== filters2.family) return false;
      if (filters2.count && scale.noteCount.toString() !== filters2.count.toString()) return false;
      return true;
    });
  }, [filters2]);

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

  const selectedScale = useMemo(() => SCALES.find(s => s.id === selectedScaleId) || null, [selectedScaleId]);
  const compareScale = useMemo(() => compareScaleId ? SCALES.find(s => s.id === compareScaleId) : null, [compareScaleId]);

  const primaryChords = useMemo(() => calculateChords(selectedScale), [selectedScale]);
  const secondaryChords = useMemo(() => calculateChords(compareScale), [compareScale]);

  const handleScaleChange = (e, isCompare) => {
    if (isCompare) setCompareScaleId(e.target.value);
    else setSelectedScaleId(e.target.value);
    setAiResponse('');
    setAiError('');
  };

  const handleClearAllFilters = () => {
    setFilters1({ root: '', family: '', count: '' });
    setFilters2({ root: '', family: '', count: '' });
  };

  const hasActiveFilters = Object.values(filters1).some(v => v !== '') || Object.values(filters2).some(v => v !== '');

  const playNote = (midi) => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    setActiveNotes(prev => ({ ...prev, [midi]: true }));
    setTimeout(() => setActiveNotes(prev => ({ ...prev, [midi]: false })), 300);

    const freq = baseFrequency * Math.pow(2, (midi - 69) / 12);
    const t = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.8, t + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 3.5);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.3, t + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, t);
    gain3.gain.setValueAtTime(0, t);
    gain3.gain.linearRampToValueAtTime(0.15, t + 0.04);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    const osc4 = audioCtx.createOscillator();
    const gain4 = audioCtx.createGain();
    osc4.type = 'triangle';
    osc4.frequency.setValueAtTime(freq * 2.005, t);
    gain4.gain.setValueAtTime(0, t);
    gain4.gain.linearRampToValueAtTime(0.05, t + 0.02);
    gain4.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    const hitOsc = audioCtx.createOscillator();
    const hitGain = audioCtx.createGain();
    hitOsc.type = 'triangle';
    hitOsc.frequency.setValueAtTime(150, t);
    hitOsc.frequency.exponentialRampToValueAtTime(40, t + 0.05);
    hitGain.gain.setValueAtTime(0, t);
    hitGain.gain.linearRampToValueAtTime(0.2, t + 0.01);
    hitGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc1.connect(gain1); gain1.connect(audioCtx.destination);
    osc2.connect(gain2); gain2.connect(audioCtx.destination);
    osc3.connect(gain3); gain3.connect(audioCtx.destination);
    osc4.connect(gain4); gain4.connect(audioCtx.destination);
    hitOsc.connect(hitGain); hitGain.connect(audioCtx.destination);

    osc1.start(t); osc1.stop(t + 4.0);
    osc2.start(t); osc2.stop(t + 3.0);
    osc3.start(t); osc3.stop(t + 2.0);
    osc4.start(t); osc4.stop(t + 2.0);
    hitOsc.start(t); hitOsc.stop(t + 0.2);
  };

  const playChord = (midiNotes) => {
    midiNotes.forEach((midi, index) => {
      setTimeout(() => {
        playNote(midi);
      }, index * 40);
    });
  };

  const fetchAITips = async () => {
    if (!selectedScale) return;
    setAiLoading(true);
    setAiResponse('');
    setAiError('');

    let prompt = compareScale
      ? `Kérlek hasonlítsd össze ezt a két handpan skálát: 1. ${selectedScale.name} (${selectedScale.notes.join(', ')}) és 2. ${compareScale.name} (${compareScale.notes.join(', ')}). Mi a fő zeneelméleti és hangulati különbség köztük? Kinek melyiket ajánlanád? A válaszod legyen tagolt, használj formázást (vastagítás csillagokkal), írj magyarul, barátságos, szakmai de érthető stílusban. Ne legyen túl hosszú.`
      : `Kérlek adj 3 rövid, kreatív tippet arra, hogyan érdemes játszani egy ${selectedScale.name} (${selectedScale.ding}, ${selectedScale.notes.join(', ')}) handpanen. Milyen ritmusok, technikák vagy érzelmek illenek hozzá a legjobban? A válaszod legyen tagolt, használj formázást (vastagítás csillagokkal), írj magyarul, barátságos, inspiráló stílusban. Ne legyen túl hosszú.`;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    let retries = 5; let delay = 1000;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error('Hiba az API elérésében');
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) { setAiResponse(text); setAiLoading(false); return; }
      } catch (err) {
        if (i === retries - 1) { setAiError('Sajnos nem sikerült kapcsolódni az AI-hoz.'); setAiLoading(false); }
        else { await new Promise(res => setTimeout(res, delay)); delay *= 2; }
      }
    }
  };

  const getNoteMatch = (midi) => {
    const noteClass = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const possibleNames = getNoteNames(noteClass).map(n => `${n}${octave}`);

    const checkScale = (scale) => {
      if (!scale) return { isDing: false, isTone: false, matchedName: '', isActive: false, index: null };
      let isDing = false; let isTone = false; let matchedName = ''; let index = null;

      for (const name of possibleNames) {
        if (scale.ding === name) { isDing = true; matchedName = name; index = 'Ding'; break; }
      }
      if (!isDing) {
        for (const name of possibleNames) {
          const idx = scale.notes.indexOf(name);
          if (idx !== -1) { isTone = true; matchedName = name; index = idx + 1; break; }
        }
      }
      return { isDing, isTone, matchedName, isActive: isDing || isTone, index };
    };

    return { primary: checkScale(selectedScale), secondary: checkScale(compareScale) };
  };

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      if (!line.trim()) return <br key={idx} />;
      const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-slate-800">{part.slice(2, -2)}</strong>;
        return part;
      });
      return <p key={idx} className="mb-2 leading-relaxed">{formattedLine}</p>;
    });
  };

  const renderPiano = (viewMode = 'merged') => {
    const keys = [];
    const startMidiToUse = 43; // G2
    const endMidi = 83; // B5 (hogy az A5 beleférjen)

    for (let midi = startMidiToUse; midi <= endMidi; midi++) {
      const noteClass = midi % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(noteClass);

      const freq = baseFrequency * Math.pow(2, (midi - 69) / 12);
      const freqStr = (Math.round(freq * 10) / 10).toFixed(1);

      if (!isBlack) {
        const defaultName = `${getNoteNames(noteClass)[0]}${Math.floor(midi / 12) - 1}`;
        const match = getNoteMatch(midi);
        const isWhitePressed = activeNotes[midi];

        const hasNextBlack = [0, 2, 5, 7, 9].includes(noteClass);
        const nextMidi = midi + 1;
        let blackMatch = null; let blackDefaultName = ''; let isBlackPressed = false; let nextFreqStr = '';

        if (hasNextBlack && nextMidi <= endMidi) {
          blackMatch = getNoteMatch(nextMidi);
          blackDefaultName = `${getNoteNames(nextMidi % 12)[0]}${Math.floor(nextMidi / 12) - 1}`;
          isBlackPressed = activeNotes[nextMidi];

          const nextFreq = baseFrequency * Math.pow(2, (nextMidi - 69) / 12);
          nextFreqStr = (Math.round(nextFreq * 10) / 10).toFixed(1);
        }

        let bgClassWhite = "bg-white hover:bg-slate-100";
        let displayNameWhite = defaultName;
        let isActiveWhite = false;
        let displayIndexWhite = null;

        if (viewMode === 'merged') {
          if (match.primary.isDing && match.secondary.isDing) bgClassWhite = "bg-gradient-to-r from-amber-400 to-orange-400";
          else if (match.primary.isDing) bgClassWhite = "bg-amber-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          else if (match.secondary.isDing) bgClassWhite = "bg-orange-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          else if (match.primary.isTone && match.secondary.isTone) bgClassWhite = "bg-indigo-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          else if (match.primary.isTone) bgClassWhite = "bg-teal-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          else if (match.secondary.isTone) bgClassWhite = "bg-purple-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";

          isActiveWhite = match.primary.isActive || match.secondary.isActive;
          if (match.primary.isActive) displayNameWhite = match.primary.matchedName;
          else if (match.secondary.isActive) displayNameWhite = match.secondary.matchedName;

          if (match.primary.isActive && match.secondary.isActive) {
            displayIndexWhite = match.primary.index === match.secondary.index ? match.primary.index : `${match.primary.index} | ${match.secondary.index}`;
          } else if (match.primary.isActive) displayIndexWhite = match.primary.index;
          else if (match.secondary.isActive) displayIndexWhite = match.secondary.index;
        } else if (viewMode === 'primary') {
          if (match.primary.isDing) bgClassWhite = "bg-amber-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          else if (match.primary.isTone) bgClassWhite = "bg-teal-200 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          isActiveWhite = match.primary.isActive;
          if (isActiveWhite) displayNameWhite = match.primary.matchedName;
          displayIndexWhite = match.primary.index;
        } else if (viewMode === 'secondary') {
          if (match.secondary.isDing) bgClassWhite = "bg-orange-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          else if (match.secondary.isTone) bgClassWhite = "bg-purple-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]";
          isActiveWhite = match.secondary.isActive;
          if (isActiveWhite) displayNameWhite = match.secondary.matchedName;
          displayIndexWhite = match.secondary.index;
        }

        keys.push(
          <div key={`white-${midi}`} className="relative group select-none">
            <div
              onPointerDown={(e) => { e.preventDefault(); playNote(midi); }}
              className={`w-10 sm:w-14 h-48 sm:h-60 border-2 border-slate-800 rounded-b-md flex flex-col justify-end items-center pb-2 transition-all duration-100 cursor-pointer shadow-sm
                ${isWhitePressed ? 'translate-y-1 brightness-95' : ''} ${bgClassWhite}`}
            >
              {/* FREKVENCIA: PONTOSAN A FEKETE BILLENTYŰ VONALA ALATT */}
              <span className="absolute top-[125px] sm:top-[160px] left-0 w-full text-center text-[9px] sm:text-[10px] tracking-tighter text-slate-400 font-medium pointer-events-none">
                {freqStr}
              </span>

              {displayIndexWhite !== null && (
                <span className="text-[10px] sm:text-xs leading-none mb-1 px-1.5 py-0.5 rounded bg-black/10 font-bold pointer-events-none text-slate-800 z-10">
                  {displayIndexWhite}
                </span>
              )}
              <span className={`text-sm pointer-events-none z-10 ${isActiveWhite ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                {displayNameWhite}
              </span>
            </div>

            {hasNextBlack && nextMidi <= endMidi && (() => {
              let bgClassBlack = "bg-slate-900 hover:bg-slate-800";
              let displayNameBlack = blackDefaultName;
              let isActiveBlack = false;
              let displayIndexBlack = null;

              if (viewMode === 'merged') {
                if (blackMatch.primary.isDing && blackMatch.secondary.isDing) bgClassBlack = "bg-gradient-to-r from-amber-500 to-orange-500";
                else if (blackMatch.primary.isDing) bgClassBlack = "bg-amber-500";
                else if (blackMatch.secondary.isDing) bgClassBlack = "bg-orange-500";
                else if (blackMatch.primary.isTone && blackMatch.secondary.isTone) bgClassBlack = "bg-indigo-500";
                else if (blackMatch.primary.isTone) bgClassBlack = "bg-teal-500";
                else if (blackMatch.secondary.isTone) bgClassBlack = "bg-purple-500";

                isActiveBlack = blackMatch.primary.isActive || blackMatch.secondary.isActive;
                if (blackMatch.primary.isActive) displayNameBlack = blackMatch.primary.matchedName;
                else if (blackMatch.secondary.isActive) displayNameBlack = blackMatch.secondary.matchedName;

                if (blackMatch.primary.isActive && blackMatch.secondary.isActive) {
                  displayIndexBlack = blackMatch.primary.index === blackMatch.secondary.index ? blackMatch.primary.index : `${blackMatch.primary.index}|${blackMatch.secondary.index}`;
                } else if (blackMatch.primary.isActive) displayIndexBlack = blackMatch.primary.index;
                else if (blackMatch.secondary.isActive) displayIndexBlack = blackMatch.secondary.index;
              } else if (viewMode === 'primary') {
                if (blackMatch.primary.isDing) bgClassBlack = "bg-amber-500";
                else if (blackMatch.primary.isTone) bgClassBlack = "bg-teal-500";
                isActiveBlack = blackMatch.primary.isActive;
                if (isActiveBlack) displayNameBlack = blackMatch.primary.matchedName;
                displayIndexBlack = blackMatch.primary.index;
              } else if (viewMode === 'secondary') {
                if (blackMatch.secondary.isDing) bgClassBlack = "bg-orange-500";
                else if (blackMatch.secondary.isTone) bgClassBlack = "bg-purple-500";
                isActiveBlack = blackMatch.secondary.isActive;
                if (isActiveBlack) displayNameBlack = blackMatch.secondary.matchedName;
                displayIndexBlack = blackMatch.secondary.index;
              }

              return (
                <div
                  onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); playNote(nextMidi); }}
                  className={`absolute top-0 -right-3.5 sm:-right-5 w-7 sm:w-10 h-28 sm:h-36 border-2 border-slate-800 rounded-b-md flex flex-col justify-end items-center pb-2 z-20 transition-all duration-100 cursor-pointer
                    ${isBlackPressed ? 'translate-y-1 brightness-90' : ''} ${bgClassBlack}`}
                >
                  {/* Fekete billentyű Hz érték lejjebb tolva */}
                  <span className="absolute top-2 left-0 w-full text-center text-[8px] sm:text-[9px] tracking-tighter text-white/70 font-bold pointer-events-none">{nextFreqStr}</span>
                  {displayIndexBlack !== null && (
                    <span className="text-[9px] sm:text-[10px] leading-none mb-1 px-1 py-0.5 rounded bg-white/20 font-bold pointer-events-none text-white z-10 mt-auto">
                      {displayIndexBlack}
                    </span>
                  )}
                  <span className={`text-xs pointer-events-none z-10 ${isActiveBlack ? 'font-bold text-white' : 'text-slate-500'} ${displayIndexBlack === null ? 'mt-auto' : ''}`}>
                    {displayNameBlack}
                  </span>
                </div>
              );
            })()}
          </div>
        );
      }
    }
    return keys;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="text-center space-y-2 mb-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Handpan Skála Vizualizáló
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Válaszd ki a skálákat, vizsgáld meg a felépítésüket és kattints a hangok lejátszásához!
          </p>
        </header>

        {/* --- SKÁLA VÁLASZTÓ ÉS SZŰRŐK --- */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 relative">

          {hasActiveFilters && (
            <div className="flex justify-center md:absolute md:-top-4 md:right-6 mb-4 md:mb-0 z-20">
              <button
                onClick={handleClearAllFilters}
                className="text-sm font-bold px-4 py-2 bg-red-500 text-white border-2 border-white rounded-full hover:bg-red-600 hover:scale-105 transition-all shadow-md flex items-center gap-2"
              >
                <span>✖</span> Összes szűrő törlése
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto md:pt-4">

            {/* 1. Skála blokk */}
            <div className="flex flex-col gap-3 bg-teal-50/40 p-5 rounded-xl border border-teal-100">
              <label className="font-bold text-teal-800 uppercase tracking-wider text-sm">1. Skála (Fő skála):</label>
              <select
                value={selectedScaleId} onChange={(e) => handleScaleChange(e, false)}
                className="w-full p-3 bg-white border-2 border-teal-200 rounded-xl text-lg font-bold text-teal-900 focus:ring-4 focus:ring-teal-500/20 outline-none cursor-pointer shadow-sm"
              >
                {filteredScales1.map(scale => <option key={`s1-${scale.id}`} value={scale.id}>{scale.name}</option>)}
              </select>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-teal-700/70 uppercase tracking-widest">Szűrés (Alap ➝ Típus ➝ Hang)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select value={filters1.root} onChange={(e) => handleFilterChange1('root', e.target.value)} className="p-2 text-xs font-semibold bg-white border border-teal-200 text-teal-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer transition-all">
                    <option value="">Mind (Alap)</option>
                    {availableRoots1.map(r => <option key={`f1-r-${r}`} value={r}>{r}</option>)}
                  </select>
                  <select value={filters1.family} onChange={(e) => handleFilterChange1('family', e.target.value)} className="p-2 text-xs font-semibold bg-white border border-teal-200 text-teal-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer transition-all">
                    <option value="">Mind (Típus)</option>
                    {availableFamilies1.map(f => <option key={`f1-f-${f}`} value={f}>{f}</option>)}
                  </select>
                  <select value={filters1.count} onChange={(e) => handleFilterChange1('count', e.target.value)} className="p-2 text-xs font-semibold bg-white border border-teal-200 text-teal-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer transition-all">
                    <option value="">Mind (Hang)</option>
                    {availableCounts1.map(n => <option key={`f1-n-${n}`} value={n}>{n} hangos</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Skála blokk */}
            <div className="flex flex-col gap-3 bg-purple-50/40 p-5 rounded-xl border border-purple-100">
              <label className="font-bold text-purple-800 uppercase tracking-wider text-sm flex justify-between items-center">
                <span>2. Skála (Összehasonlítás):</span>
              </label>
              <select
                value={compareScaleId} onChange={(e) => handleScaleChange(e, true)}
                className={`w-full p-3 bg-white border-2 rounded-xl text-lg font-bold outline-none cursor-pointer shadow-sm transition-all ${compareScaleId ? 'border-purple-300 text-purple-900 focus:ring-4 focus:ring-purple-500/20' : 'border-slate-200 text-slate-500'}`}
              >
                <option value="">-- Nincs összehasonlítás --</option>
                {filteredScales2.map(scale => <option key={`s2-${scale.id}`} value={scale.id}>{scale.name}</option>)}
              </select>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-purple-700/70 uppercase tracking-widest">Szűrés (Alap ➝ Típus ➝ Hang)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select value={filters2.root} onChange={(e) => handleFilterChange2('root', e.target.value)} className="p-2 text-xs font-semibold bg-white border border-purple-200 text-purple-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer transition-all">
                    <option value="">Mind (Alap)</option>
                    {availableRoots2.map(r => <option key={`f2-r-${r}`} value={r}>{r}</option>)}
                  </select>
                  <select value={filters2.family} onChange={(e) => handleFilterChange2('family', e.target.value)} className="p-2 text-xs font-semibold bg-white border border-purple-200 text-purple-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer transition-all">
                    <option value="">Mind (Típus)</option>
                    {availableFamilies2.map(f => <option key={`f2-f-${f}`} value={f}>{f}</option>)}
                  </select>
                  <select value={filters2.count} onChange={(e) => handleFilterChange2('count', e.target.value)} className="p-2 text-xs font-semibold bg-white border border-purple-200 text-purple-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer transition-all">
                    <option value="">Mind (Hang)</option>
                    {availableCounts2.map(n => <option key={`f2-n-${n}`} value={n}>{n} hangos</option>)}
                  </select>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg max-w-3xl mx-auto border border-slate-100">
            {!compareScaleId ? (
              <>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-500"></div> Ding</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-300 border border-teal-500"></div> Hangsor (1, 2, 3...)</div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-300 border border-teal-500"></div> Csak 1. Skála</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-purple-300 border border-purple-500"></div> Csak 2. Skála</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-indigo-400 border border-indigo-600"></div> Közös hang</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 border border-amber-600"></div> Alaphang (Ding)</div>
              </>
            )}
          </div>
        </div>

        {/* --- ZONGORA NÉZET --- */}
        {selectedScale && (
          <div className="bg-white py-8 rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">

            <p className="absolute top-2 left-4 text-[10px] text-slate-400 font-medium">
              * A billentyűkön látható számok a {baseFrequency} Hz-es A4 alaphanghoz viszonyított frekvenciák.
            </p>

            <div className="flex justify-center items-center gap-4 mb-6 mt-2">
              <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
                <button
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${baseFrequency === 432 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setBaseFrequency(432)}>
                  432 Hz
                </button>
                <button
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${baseFrequency === 440 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setBaseFrequency(440)}>
                  440 Hz
                </button>
              </div>

              {compareScaleId && (
                <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
                  <button className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${!splitView ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setSplitView(false)}>Egyesített nézet</button>
                  <button className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${splitView ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setSplitView(true)}>Osztott nézet</button>
                </div>
              )}
            </div>

            <div className="w-full overflow-x-auto pb-4 pt-2 custom-scrollbar">
              {splitView && compareScaleId ? (
                <div className="flex flex-col gap-6 min-w-max px-8 pt-4 pb-2 items-start sm:items-center">
                  <div className="w-full flex flex-col items-center gap-3">
                    <h4 className="text-sm font-bold text-teal-700 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200 shadow-sm">1. {selectedScale.name}</h4>
                    <div className="flex justify-start sm:justify-center">{renderPiano('primary')}</div>
                  </div>
                  <div className="w-full flex flex-col items-center gap-3 mt-4">
                    <h4 className="text-sm font-bold text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200 shadow-sm">2. {compareScale.name}</h4>
                    <div className="flex justify-start sm:justify-center">{renderPiano('secondary')}</div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start sm:justify-center min-w-max px-8 pt-4">
                  {renderPiano('merged')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- INFÓ KÁRTYÁK --- */}
        {selectedScale && (
          <div className={`grid grid-cols-1 ${compareScale ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-6`}>

            {/* 1. Skála Infó */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-t-teal-400 border border-slate-200 flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">1. Skála</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedScale.name}</h2>
                <p className="text-teal-700 font-semibold">{selectedScale.type}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Hangulat</p>
                <p className="text-slate-800 italic">{selectedScale.mood}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Hangok</p>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-lg font-bold shadow-sm">
                      {selectedScale.ding} (Ding)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedScale.notes.map((note, i) => (
                      <span key={i} className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg font-medium shadow-sm">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AKKORDOK MEGJELENÍTÉSE (1. Skála) */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Kijátszható akkordok (kattints rá)</p>
                <div className="flex flex-col gap-2">
                  {primaryChords.length > 0 ? primaryChords.map((chord, i) => (
                    <div key={i} className="grid grid-cols-[80px_1fr] items-start gap-2">
                      <span className={`pt-0.5 font-bold text-sm ${chord.type === 'major' ? 'text-teal-800' : chord.type === 'minor' ? 'text-teal-600' : 'text-slate-600'}`}>
                        {chord.name}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {chord.voicings.map((voicing, j) => (
                          <button
                            key={j}
                            onClick={() => playChord(voicing.midiNotes)}
                            className={`px-2.5 py-1 bg-white border rounded-md text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1 group ${chord.type === 'major' ? 'border-teal-200 text-teal-700 hover:bg-teal-50' : chord.type === 'minor' ? 'border-teal-200 text-teal-600 hover:bg-teal-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            <span className="text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">▶</span>
                            {voicing.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )) : <span className="text-sm text-slate-400 italic">Nincs elég hang akkordok építéséhez</span>}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Jellemzés</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedScale.description}</p>
              </div>
            </div>

            {/* 2. Skála Infó */}
            {compareScale && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-t-purple-400 border border-slate-200 flex flex-col gap-5">
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-1 rounded">2. Skála</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{compareScale.name}</h2>
                  <p className="text-purple-700 font-semibold">{compareScale.type}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Hangulat</p>
                  <p className="text-slate-800 italic">{compareScale.mood}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Hangok</p>
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-lg font-bold shadow-sm">
                        {compareScale.ding} (Ding)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {compareScale.notes.map((note, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-medium shadow-sm">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AKKORDOK MEGJELENÍTÉSE (2. Skála) */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Kijátszható akkordok (kattints rá)</p>
                  <div className="flex flex-col gap-2">
                    {secondaryChords.length > 0 ? secondaryChords.map((chord, i) => (
                      <div key={i} className="grid grid-cols-[80px_1fr] items-start gap-2">
                        <span className={`pt-0.5 font-bold text-sm ${chord.type === 'major' ? 'text-purple-800' : chord.type === 'minor' ? 'text-purple-600' : 'text-slate-600'}`}>
                          {chord.name}:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {chord.voicings.map((voicing, j) => (
                            <button
                              key={j}
                              onClick={() => playChord(voicing.midiNotes)}
                              className={`px-2.5 py-1 bg-white border rounded-md text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1 group ${chord.type === 'major' ? 'border-purple-200 text-purple-700 hover:bg-purple-50' : chord.type === 'minor' ? 'border-purple-200 text-purple-600 hover:bg-purple-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              <span className="text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">▶</span>
                              {voicing.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )) : <span className="text-sm text-slate-400 italic">Nincs elég hang akkordok építéséhez</span>}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Jellemzés</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{compareScale.description}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- LEBEGŐ AI CHAT GOMB ÉS POP-UP --- */}
      <button
        onClick={() => setIsAiOpen(!isAiOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-2xl hover:scale-110 hover:bg-teal-500 transition-all z-[60]"
      >
        ✨
      </button>

      {isAiOpen && (
        <div className="fixed bottom-24 right-6 w-[340px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[60] overflow-hidden transform transition-all">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-bold text-sm">AI Zenei Elemző</h3>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white transition-colors text-lg leading-none">✖</button>
          </div>

          <div className="p-5 bg-slate-50 flex-grow max-h-[400px] overflow-y-auto custom-scrollbar text-sm text-slate-700">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-semibold text-teal-600 animate-pulse">Elemzés generálása...</p>
              </div>
            ) : aiError ? (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center font-semibold">{aiError}</div>
            ) : aiResponse ? (
              <div className="leading-relaxed">
                {renderFormattedText(aiResponse)}
              </div>
            ) : (
              <div className="text-center py-6 px-2">
                <p className="text-slate-500 mb-2">
                  {compareScale
                    ? "Kérdezd meg az AI-t a két kiválasztott skála zeneelméleti és hangulati különbségeiről!"
                    : "Szeretnél inspirációt meríteni ehhez a skálához? Kérj kreatív játékstílus tippeket az AI-tól!"}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={fetchAITips}
              disabled={aiLoading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:from-teal-400 hover:to-emerald-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiResponse ? "Új elemzés kérése" : compareScale ? "Skálák összehasonlítása" : "Tippek kérése az 1. skálához"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}