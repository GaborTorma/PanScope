import { getPitchClass, noteNameToMidi } from './noteUtils';

/**
 * Skálából kiszámolja az összes játszható akkordot (dúr, moll, szűk) és azok voicing-jait
 */
export const calculateChords = (scale) => {
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
