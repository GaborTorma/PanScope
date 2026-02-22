import { useMemo } from 'react';
import { useScaleManager } from './hooks/useScaleManager';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { calculatePianoRange } from './utils/pianoRange';

import Header from './components/Header';
import Legend from './components/Legend';
import FrequencyToggle from './components/FrequencyToggle';
import PianoKeyboard from './components/PianoKeyboard';
import AiChat from './components/AiChat';
import ScaleSlot from './components/ScaleSlot';

const MAX_SCALES = 3;

const SPLIT_LABEL_STYLES = [
  'text-teal-700 bg-teal-50 border-teal-200',
  'text-purple-700 bg-purple-50 border-purple-200',
  'text-slate-700 bg-slate-100 border-slate-300',
];

export default function App() {
  const {
    slots, addSlot, removeSlot,
    updateSlotFilter, updateSlotScale, clearSlotFilters,
    activeScales, splitView, setSplitView,
  } = useScaleManager();

  const { baseFrequency, setBaseFrequency, activeNotes, playNote, playChord } = useAudioPlayer();

  const pianoRange = useMemo(() => calculatePianoRange(activeScales, 2), [activeScales]);

  const hasCompare = activeScales.length >= 2;
  const canMerge = activeScales.length <= 2;
  // 3 skálánál kényszerített osztott, 1-nél nincs split, 2-nél user választ
  const effectiveSplitView = activeScales.length >= 3 ? true : activeScales.length === 2 ? splitView : false;

  const primaryScale = activeScales[0] || null;
  const compareScale = activeScales[1] || null;

  // Grid oszlopszám az aktív slotok számától függ
  const gridCols = slots.length === 1
    ? 'grid-cols-1'
    : slots.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header + 432/440 toggle jobb felső sarokban */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Header />
          </div>
          <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner flex-shrink-0 mt-1">
            <button
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${baseFrequency === 432 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setBaseFrequency(432)}
            >432 Hz</button>
            <button
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all ${baseFrequency === 440 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setBaseFrequency(440)}
            >440 Hz</button>
          </div>
        </div>

        {/* --- Skála slotok --- */}
        <div className="space-y-6">
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

          {primaryScale && <Legend hasCompare={hasCompare} />}
        </div>

        {/* --- Zongora --- */}
        {primaryScale && (
          <div className="bg-white py-8 rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
            <p className="absolute top-2 left-4 text-[10px] text-slate-400 font-medium">
              * A billentyűkön látható számok a {baseFrequency} Hz-es A4 alaphanghoz viszonyított frekvenciák.
            </p>

            <FrequencyToggle
              canMerge={canMerge}
              activeCount={activeScales.length}
              splitView={effectiveSplitView}
              setSplitView={setSplitView}
            />

            <div className="w-full overflow-x-auto pb-4 pt-2 custom-scrollbar">
              {effectiveSplitView ? (
                <div className="flex flex-col gap-6 min-w-max px-8 pt-4 pb-2 items-start sm:items-center">
                  {activeScales.map((scale, i) => (
                    <div key={`piano-${i}`} className="w-full flex flex-col items-center gap-3">
                      <h4 className={`text-sm font-bold px-4 py-1.5 rounded-full border shadow-sm ${SPLIT_LABEL_STYLES[i] || SPLIT_LABEL_STYLES[2]}`}>
                        {i + 1}. {scale.name}
                      </h4>
                      <div className="flex justify-start sm:justify-center">
                        <PianoKeyboard
                          viewMode="primary"
                          selectedScale={scale}
                          compareScale={null}
                          baseFrequency={baseFrequency}
                          activeNotes={activeNotes}
                          playNote={playNote}
                          startMidi={pianoRange.startMidi}
                          endMidi={pianoRange.endMidi}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-start sm:justify-center min-w-max px-8 pt-4">
                  <PianoKeyboard
                    viewMode="merged"
                    selectedScale={primaryScale}
                    compareScale={compareScale}
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

      {/* Floating "+" gomb — jobb alsó sarok, fix pozíció */}
      {slots.length < MAX_SCALES && (
        <button
          onClick={addSlot}
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center text-3xl font-light hover:bg-teal-600 hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
          aria-label="Új skála hozzáadása"
          title="Új skála hozzáadása"
        >+</button>
      )}

      {/* AI Chat */}
      <AiChat selectedScale={primaryScale} compareScale={compareScale} />
    </div>
  );
}