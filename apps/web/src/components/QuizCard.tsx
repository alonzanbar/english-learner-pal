import { useState, useCallback } from "react";
import { Word, getRandomOptions } from "@/lib/vocabulary";

interface QuizCardProps {
  word: Word;
  onAnswer: (correct: boolean) => void;
}

const QuizCard = ({ word, onAnswer }: QuizCardProps) => {
  const [options] = useState(() => getRandomOptions(word));
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = useCallback((hebrew: string) => {
    if (answered) return;
    setSelected(hebrew);
    setAnswered(true);
    const isCorrect = hebrew === word.hebrew;
    setTimeout(() => onAnswer(isCorrect), 1000);
  }, [answered, word.hebrew, onAnswer]);

  return (
    <div className="flex flex-col items-center gap-8 animate-slide-up">
      <div className="bg-card rounded-2xl border-2 border-border shadow-lg px-12 py-10 text-center">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">What is the translation of</span>
        <span className="text-4xl font-bold text-foreground">{word.english}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg" dir="rtl">
        {options.map((opt) => {
          let bgClass = "bg-card border-2 border-border hover:border-primary";
          if (answered && opt.hebrew === word.hebrew) {
            bgClass = "bg-success text-success-foreground border-2 border-success";
          } else if (answered && selected === opt.hebrew && opt.hebrew !== word.hebrew) {
            bgClass = "bg-destructive text-destructive-foreground border-2 border-destructive animate-shake";
          }

          return (
            <button
              key={opt.english}
              onClick={() => handleSelect(opt.hebrew)}
              disabled={answered}
              className={`${bgClass} rounded-xl px-6 py-4 text-lg font-hebrew font-medium transition-all duration-200 ${
                !answered ? "cursor-pointer hover:shadow-md" : "cursor-default"
              }`}
            >
              {opt.hebrew}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;
