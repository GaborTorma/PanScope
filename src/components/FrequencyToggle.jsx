/**
 * Nézetváltó: Egyesített / Osztott
 * Csak pontosan 2 skálánál jelenik meg (ilyenkor van miből választani).
 * 1 skálánál nincs értelme, 3-nál kényszerített osztott.
 */
export default function FrequencyToggle({ canMerge, activeCount, splitView, setSplitView }) {
    // Csak akkor jelenjen meg, ha van miből választani (pontosan 2 skála)
    if (activeCount !== 2) return null;

    return (
        <div className="flex justify-center items-center mb-6 mt-2">
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
        </div>
    );
}
