/**
 * 432 Hz / 440 Hz frekvencia váltó + egyesített/osztott nézet váltó
 */
export default function FrequencyToggle({ baseFrequency, setBaseFrequency, hasCompare, splitView, setSplitView }) {
    return (
        <div className="flex justify-center items-center gap-4 mb-6 mt-2">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
                <button
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${baseFrequency === 432 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setBaseFrequency(432)}
                >
                    432 Hz
                </button>
                <button
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${baseFrequency === 440 ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setBaseFrequency(440)}
                >
                    440 Hz
                </button>
            </div>

            {hasCompare && (
                <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
                    <button
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${!splitView ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setSplitView(false)}
                    >
                        Egyesített nézet
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${splitView ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setSplitView(true)}
                    >
                        Osztott nézet
                    </button>
                </div>
            )}
        </div>
    );
}
