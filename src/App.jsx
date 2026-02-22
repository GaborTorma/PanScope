import { useMemo } from 'react';
import { useScaleManager } from './hooks/useScaleManager';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { calculatePianoRange } from './utils/pianoRange';

import Header from './components/Header';
import PianoKeyboard from './components/PianoKeyboard';
import AiChat from './components/AiChat';
import ScaleSlot from './components/ScaleSlot';

const MAX_SCALES = 3;

const SPLIT_LABEL_STYLES = [
  'text-teal-700 bg-teal-50 border-teal-200',
  'text-purple-700 bg-purple-50 border-purple-200',
  'text-rose-700 bg-rose-50 border-rose-200',
];

const SPLIT_VIEW_MODES = ['primary', 'secondary', 'tertiary'];

export default function App() {
  const {
    slots, addSlot, removeSlot,
    updateSlotFilter, updateSlotScale, clearSlotFilters,
    activeScales, splitView, setSplitView,
  } = useScaleManager();

  const { baseFrequency, setBaseFrequency, activeNotes, playNote, playChord } = useAudioPlayer();

  const pianoRange = useMemo(() => calculatePianoRange(activeScales, 2), [activeScales]);

  const effectiveSplitView = activeScales.length <= 1 ? false : splitView;

  const primaryScale  = activeScales[0] || null;
  const compareScale  = activeScales[1] || null;
  const tertiaryScale = activeScales[2] || null;

  const gridCols = slots.length === 1
    ? 'grid-cols-1'
    : slots.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">

        <Header />

        {/* --- Skála slotok --- */}
        <div className={`grid ${gridCols} gap-4`}>
          {slots.map((slot, index) => (
            <ScaleSlot
              key={slot.id}
              slot={slot}
              index={index}
              totalCount={slots.length}
              onFilterChange={updateSlotFilter}
              onScaleChange={updateSlotScale}
              onRemove={removeSlot}
              onClearFilters={clearSlotFilters}
              playChord={playChord}
            />
          ))}
        </div>

        {/* --- Zongora --- */}
        {primaryScale && (
          <div className="bg-white py-8 rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">

            {/* Frekvencia + nézetváltó — jobb felső sarok */}
            <div className="absolute top-2 right-4 flex items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
                <button
                  className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${baseFrequency === 432 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setBaseFrequency(432)}
                >432 Hz</button>
                <button
                  className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${baseFrequency === 440 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setBaseFrequency(440)}
                >440 Hz</button>
              </div>

              {activeScales.length >= 2 && (
                <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
                  <button
                    className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${!effectiveSplitView ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setSplitView(false)}
                  >Egyesített</button>
                  <button
                    className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${effectiveSplitView ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setSplitView(true)}
                  >Osztott</button>
                </div>
              )}
            </div>

            <div className="w-full overflow-x-auto pb-4 pt-10 custom-scrollbar">
              {effectiveSplitView ? (
                <div className="flex flex-col gap-6 min-w-max px-8 pt-4 pb-2 items-start sm:items-center">
                  {activeScales.map((scale, i) => {
                    const vm = SPLIT_VIEW_MODES[i] || 'primary';
                    const selScale  = i === 0 ? scale : null;
                    const cmpScale  = i === 1 ? scale : null;
                    const tertScale = i === 2 ? scale : null;
                    return (
                      <div key={`piano-${i}`} className="w-full flex flex-col items-center gap-3">
                        <h4 className={`text-sm font-bold px-4 py-1.5 rounded-full border shadow-sm ${SPLIT_LABEL_STYLES[i] || SPLIT_LABEL_STYLES[2]}`}>
                          {i + 1}. {scale.name}
                        </h4>
                        <div className="flex justify-start sm:justify-center">
                          <PianoKeyboard
                            viewMode={vm}
                            selectedScale={selScale}
                            compareScale={cmpScale}
                            tertiaryScale={tertScale}
                            baseFrequency={baseFrequency}
                            activeNotes={activeNotes}
                            playNote={playNote}
                            startMidi={pianoRange.startMidi}
                            endMidi={pianoRange.endMidi}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-start sm:justify-center min-w-max px-8 pt-4">
                  <PianoKeyboard
                    viewMode="merged"
                    selectedScale={primaryScale}
                    compareScale={compareScale}
                    tertiaryScale={tertiaryScale}
                    baseFrequency={baseFrequency}
                    activeNotes={activeNotes}
                    playNote={playNote}
                    startMidi={pianoRange.startMidi}
                    endMidi={pianoRange.endMidi}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {slots.length < MAX_SCALES && (
        <button
          onClick={addSlot}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center text-3xl font-light hover:bg-teal-600 hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
          aria-label="Új skála hozzáadása"
          title="Új skála hozzáadása"
        >+</button>
      )}

      <AiChat selectedScale={primaryScale} compareScale={compareScale} />
    </div>
  );
}
