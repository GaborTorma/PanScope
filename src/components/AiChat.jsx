import { useState } from 'react';
import { fetchAITips } from '../services/geminiApi';

/**
 * Lebegő AI chat gomb + popup
 * Dependency Inversion: a geminiApi szolgáltatástól függ, nem az App-tól
 */
export default function AiChat({ selectedScale, compareScale, onScaleChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const handleFetch = async () => {
        if (!selectedScale) return;
        setLoading(true);
        setResponse('');
        setError('');

        try {
            const text = await fetchAITips(selectedScale, compareScale);
            setResponse(text);
        } catch (err) {
            setError(err.message || 'Sajnos nem sikerült kapcsolódni az AI-hoz.');
        } finally {
            setLoading(false);
        }
    };

    const renderFormattedText = (text) => {
        return text.split('\n').map((line, idx) => {
            if (!line.trim()) return <br key={idx} />;
            // Biztonságos szöveg-feldolgozás: React JSX, nincs dangerouslySetInnerHTML
            const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-slate-800">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
            return <p key={idx} className="mb-2 leading-relaxed">{formattedLine}</p>;
        });
    };

    return (
        <>
            {/* Lebegő gomb */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-2xl hover:scale-110 hover:bg-teal-500 transition-all z-[60]"
                aria-label="AI Zenei Elemző megnyitása"
            >
                ✨
            </button>

            {/* Popup */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[340px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[60] overflow-hidden transform transition-all">
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <h3 className="font-bold text-sm">AI Zenei Elemző</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors text-lg leading-none" aria-label="Bezárás">✖</button>
                    </div>

                    <div className="p-5 bg-slate-50 flex-grow max-h-[400px] overflow-y-auto custom-scrollbar text-sm text-slate-700">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-semibold text-teal-600 animate-pulse">Elemzés generálása...</p>
                            </div>
                        ) : error ? (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center font-semibold">{error}</div>
                        ) : response ? (
                            <div className="leading-relaxed">
                                {renderFormattedText(response)}
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
                            onClick={handleFetch}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-md hover:from-teal-400 hover:to-emerald-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {response ? "Új elemzés kérése" : compareScale ? "Skálák összehasonlítása" : "Tippek kérése az 1. skálához"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
