import { useState } from "react";
import { Word } from "@/lib/vocabulary";
import { Check } from "lucide-react";

interface FlashcardProps {
  word: Word;
  onNext: () => void;
  onPrevious: () => void;
  current: number;
  total: number;
  isKnown: boolean;
  onToggleKnown: () => void;
}

const Flashcard = ({ word, onNext, onPrevious, current, total, isKnown, onToggleKnown }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = () => {
    setFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setFlipped(false);
    onPrevious();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-muted-foreground font-medium">
        {current} / {total}
      </div>

      <div
        className="card-flip w-full max-w-md h-64 cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`card-flip-inner w-full h-full ${flipped ? "flipped" : ""}`}>
          {/* Front - English */}
          <div className="card-face absolute inset-0 rounded-2xl bg-card border-2 border-border shadow-lg flex flex-col items-center justify-center p-8 hover:shadow-xl transition-shadow">
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3">English</span>
            <span className="text-4xl font-bold text-foreground">{word.english}</span>
            <span className="text-sm text-muted-foreground mt-4">לחץ כדי להפוך</span>
          </div>

          {/* Back - Hebrew */}
          <div className="card-face card-face-back absolute inset-0 rounded-2xl bg-primary text-primary-foreground shadow-lg flex flex-col items-center justify-center p-8">
            <span className="text-xs uppercase tracking-widest opacity-70 mb-3">עברית</span>
            <span className="text-4xl font-bold font-hebrew" dir="rtl">{word.hebrew}</span>
            <span className="text-sm opacity-70 mt-4">לחץ כדי להפוך</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:opacity-80 transition-opacity"
        >
          ← הקודם
        </button>
        <button
          onClick={onToggleKnown}
          className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            isKnown
              ? "bg-success text-success-foreground"
              : "bg-secondary text-secondary-foreground hover:opacity-80"
          }`}
        >
          <Check size={16} />
          {isKnown ? "ידוע" : "סמן כידוע"}
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          הבא →
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
