import { useScaleManager } from './hooks/useScaleManager';
import { useAudioPlayer } from './hooks/useAudioPlayer';

import Header from './components/Header';
import ScaleSelector from './components/ScaleSelector';
import Legend from './components/Legend';
import FrequencyToggle from './components/FrequencyToggle';
import PianoKeyboard from './components/PianoKeyboard';
import ScaleInfoCard from './components/ScaleInfoCard';
import AiChat from './components/AiChat';

/**
 * App — Kompozíciós réteg
 * Összefogja a hook-okat és a komponenseket, de saját logikája nincs.
 */
export default function App() {
  const scaleManager = useScaleManager();
  const audio = useAudioPlayer();

  const {
    filters1, filters2,
    handleFilterChange1, handleFilterChange2,
    handleClearAllFilters, hasActiveFilters,
    availableRoots1, availableFamilies1, availableCounts1,
    availableRoots2, availableFamilies2, availableCounts2,
    filteredScales1, filteredScales2,
    selectedScale, compareScale,
    selectedScaleId, compareScaleId,
    handleScaleChange,
    splitView, setSplitView,
    primaryChords, secondaryChords,
  } = scaleManager;

  const { baseFrequency, setBaseFrequency, activeNotes, playNote, playChord } = audio;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">

        <Header />

        {/* --- Skálaválasztó panel --- */}
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
            <ScaleSelector
              label="1. Skála (Fő skála):"
              colorScheme="teal"
              selectedId={selectedScaleId}
              onScaleChange={handleScaleChange}
              filteredScales={filteredScales1}
              filters={filters1}
              onFilterChange={handleFilterChange1}
              availableRoots={availableRoots1}
              availableFamilies={availableFamilies1}
              availableCounts={availableCounts1}
            />
            <ScaleSelector
              label="2. Skála (Összehasonlítás):"
              colorScheme="purple"
              selectedId={compareScaleId}
              onScaleChange={handleScaleChange}
              filteredScales={filteredScales2}
              filters={filters2}
              onFilterChange={handleFilterChange2}
              availableRoots={availableRoots2}
              availableFamilies={availableFamilies2}
              availableCounts={availableCounts2}
              isCompare
            />
          </div>

          <Legend hasCompare={!!compareScaleId} />
        </div>

        {/* --- Zongora nézet --- */}
        {selectedScale && (
          <div className="bg-white py-8 rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
            <p className="absolute top-2 left-4 text-[10px] text-slate-400 font-medium">
              * A billentyűkön látható számok a {baseFrequency} Hz-es A4 alaphanghoz viszonyított frekvenciák.
            </p>

            <FrequencyToggle
              baseFrequency={baseFrequency}
              setBaseFrequency={setBaseFrequency}
              hasCompare={!!compareScaleId}
              splitView={splitView}
              setSplitView={setSplitView}
            />

            <div className="w-full overflow-x-auto pb-4 pt-2 custom-scrollbar">
              {splitView && compareScaleId ? (
                <div className="flex flex-col gap-6 min-w-max px-8 pt-4 pb-2 items-start sm:items-center">
                  <div className="w-full flex flex-col items-center gap-3">
                    <h4 className="text-sm font-bold text-teal-700 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200 shadow-sm">1. {selectedScale.name}</h4>
                    <div className="flex justify-start sm:justify-center">
                      <PianoKeyboard viewMode="primary" selectedScale={selectedScale} compareScale={compareScale} baseFrequency={baseFrequency} activeNotes={activeNotes} playNote={playNote} />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center gap-3 mt-4">
                    <h4 className="text-sm font-bold text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200 shadow-sm">2. {compareScale.name}</h4>
                    <div className="flex justify-start sm:justify-center">
                      <PianoKeyboard viewMode="secondary" selectedScale={selectedScale} compareScale={compareScale} baseFrequency={baseFrequency} activeNotes={activeNotes} playNote={playNote} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start sm:justify-center min-w-max px-8 pt-4">
                  <PianoKeyboard viewMode="merged" selectedScale={selectedScale} compareScale={compareScale} baseFrequency={baseFrequency} activeNotes={activeNotes} playNote={playNote} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Infó kártyák --- */}
        {selectedScale && (
          <div className={`grid grid-cols-1 ${compareScale ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-6`}>
            <ScaleInfoCard scale={selectedScale} chords={primaryChords} variant="primary" playChord={playChord} />
            {compareScale && (
              <ScaleInfoCard scale={compareScale} chords={secondaryChords} variant="secondary" playChord={playChord} />
            )}
          </div>
        )}
      </div>

      {/* --- AI Chat --- */}
      <AiChat selectedScale={selectedScale} compareScale={compareScale} />
    </div>
  );
}