import { useState, useCallback, useMemo } from "react";
import { Word, getRandomOptions } from "@/lib/vocabulary";
import { getSentenceForWord, getWordsWithSentences } from "@/lib/sentences";

interface SentenceQuizProps {
  word: Word;
  onAnswer: (correct: boolean) => void;
}

const SentenceQuiz = ({ word, onAnswer }: SentenceQuizProps) => {
  const sentenceData = useMemo(() => getSentenceForWord(word.english), [word.english]);
  const options = useMemo(() => {
    // Get 4 options, all of which have sentences (to seem plausible)
    const wordsWithSentences = getWordsWithSentences();
    const allOptions = getRandomOptions(word, 4);
    // Filter to prefer words with sentences but always include the correct one
    return allOptions;
  }, [word]);

  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = useCallback((english: string) => {
    if (answered) return;
    setSelected(english);
    setAnswered(true);
    const isCorrect = english === word.english;
    setTimeout(() => onAnswer(isCorrect), 1200);
  }, [answered, word.english, onAnswer]);

  if (!sentenceData) {
    // Fallback: skip words without sentences
    setTimeout(() => onAnswer(true), 100);
    return null;
  }

  // Split sentence around ___
  const parts = sentenceData.sentence.split("___");

  return (
    <div className="flex flex-col items-center gap-8 animate-slide-up">
      {/* Sentence with blank */}
      <div className="bg-card rounded-2xl border-2 border-border shadow-lg px-8 py-8 text-center max-w-xl w-full">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">השלם את המשפט</span>
        <p className="text-xl leading-relaxed text-foreground" dir="ltr">
          {parts[0]}
          <span className="inline-block mx-1 px-4 py-1 rounded-lg bg-primary/10 border-2 border-dashed border-primary min-w-[100px] text-center">
            {answered ? (
              <span className="font-bold text-primary">{word.english}</span>
            ) : (
              <span className="text-muted-foreground">?</span>
            )}
          </span>
          {parts[1]}
        </p>
        {answered && (
          <p className="mt-3 text-sm font-hebrew text-muted-foreground" dir="rtl">
            {word.hebrew} — {word.english}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {options.map((opt) => {
          let classes = "bg-card border-2 border-border hover:border-primary hover:shadow-md";
          if (answered && opt.english === word.english) {
            classes = "bg-success text-success-foreground border-2 border-success";
          } else if (answered && selected === opt.english && opt.english !== word.english) {
            classes = "bg-destructive text-destructive-foreground border-2 border-destructive animate-shake";
          }

          return (
            <button
              key={opt.english}
              onClick={() => handleSelect(opt.english)}
              disabled={answered}
              className={`${classes} rounded-xl px-5 py-4 text-lg font-medium transition-all duration-200 ${
                !answered ? "cursor-pointer" : "cursor-default"
              }`}
              dir="ltr"
            >
              {opt.english}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SentenceQuiz;
