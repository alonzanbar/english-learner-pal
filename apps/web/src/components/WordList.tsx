import { Word } from "@/lib/vocabulary";
import { Check } from "lucide-react";

interface WordListProps {
  words: Word[];
  isKnown?: (english: string) => boolean;
  onToggleKnown?: (english: string) => void;
}

const WordList = ({ words, isKnown, onToggleKnown }: WordListProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      <div className="grid gap-2">
        {words.map((word, i) => {
          const known = isKnown?.(word.english) ?? false;
          return (
            <div
              key={word.english}
              className={`flex items-center justify-between bg-card rounded-xl border border-border px-5 py-3 hover:shadow-md transition-shadow animate-slide-up ${known ? "opacity-60" : ""}`}
              style={{ animationDelay: `${Math.min(i * 20, 500)}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-2">
                {onToggleKnown && (
                  <button
                    onClick={() => onToggleKnown(word.english)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      known
                        ? "bg-success border-success text-success-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {known && <Check size={12} />}
                  </button>
                )}
                <span className="text-lg font-hebrew font-medium text-foreground">{word.hebrew}</span>
              </div>
              <span className="text-lg font-medium text-muted-foreground">{word.english}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordList;
