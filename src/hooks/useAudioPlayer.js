import { useState, useCallback } from 'react';

let audioCtx = null;

/**
 * Custom hook a Web Audio API-n alapuló handpan hangszintézishez
 */
export const useAudioPlayer = () => {
    const [baseFrequency, setBaseFrequency] = useState(440);
    const [activeNotes, setActiveNotes] = useState({});

    const playNote = useCallback((midi) => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        setActiveNotes(prev => ({ ...prev, [midi]: true }));
        setTimeout(() => setActiveNotes(prev => ({ ...prev, [midi]: false })), 300);

        const freq = baseFrequency * Math.pow(2, (midi - 69) / 12);
        const t = audioCtx.currentTime;

        // Alap szinusz (1. felharmonikus)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, t);
        gain1.gain.setValueAtTime(0, t);
        gain1.gain.linearRampToValueAtTime(0.8, t + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 3.5);

        // 2. felharmonikus
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, t);
        gain2.gain.setValueAtTime(0, t);
        gain2.gain.linearRampToValueAtTime(0.3, t + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

        // 3. felharmonikus
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 3, t);
        gain3.gain.setValueAtTime(0, t);
        gain3.gain.linearRampToValueAtTime(0.15, t + 0.04);
        gain3.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

        // Chorus effekt (2x enyhe eltérés)
        const osc4 = audioCtx.createOscillator();
        const gain4 = audioCtx.createGain();
        osc4.type = 'triangle';
        osc4.frequency.setValueAtTime(freq * 2.005, t);
        gain4.gain.setValueAtTime(0, t);
        gain4.gain.linearRampToValueAtTime(0.05, t + 0.02);
        gain4.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

        // Ütés effekt
        const hitOsc = audioCtx.createOscillator();
        const hitGain = audioCtx.createGain();
        hitOsc.type = 'triangle';
        hitOsc.frequency.setValueAtTime(150, t);
        hitOsc.frequency.exponentialRampToValueAtTime(40, t + 0.05);
        hitGain.gain.setValueAtTime(0, t);
        hitGain.gain.linearRampToValueAtTime(0.2, t + 0.01);
        hitGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        // Összekötés
        osc1.connect(gain1); gain1.connect(audioCtx.destination);
        osc2.connect(gain2); gain2.connect(audioCtx.destination);
        osc3.connect(gain3); gain3.connect(audioCtx.destination);
        osc4.connect(gain4); gain4.connect(audioCtx.destination);
        hitOsc.connect(hitGain); hitGain.connect(audioCtx.destination);

        // Indítás/leállítás
        osc1.start(t); osc1.stop(t + 4.0);
        osc2.start(t); osc2.stop(t + 3.0);
        osc3.start(t); osc3.stop(t + 2.0);
        osc4.start(t); osc4.stop(t + 2.0);
        hitOsc.start(t); hitOsc.stop(t + 0.2);
    }, [baseFrequency]);

    const playChord = useCallback((midiNotes) => {
        midiNotes.forEach((midi, index) => {
            setTimeout(() => playNote(midi), index * 40);
        });
    }, [playNote]);

    return { baseFrequency, setBaseFrequency, activeNotes, playNote, playChord };
};
