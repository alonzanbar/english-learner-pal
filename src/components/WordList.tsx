import { Word } from "@/lib/vocabulary";

interface WordListProps {
  words: Word[];
}

const WordList = ({ words }: WordListProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      <div className="grid gap-2">
        {words.map((word, i) => (
          <div
            key={word.english}
            className="flex items-center justify-between bg-card rounded-xl border border-border px-5 py-3 hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${Math.min(i * 20, 500)}ms`, animationFillMode: 'both' }}
          >
            <span className="text-lg font-hebrew font-medium text-foreground">{word.hebrew}</span>
            <span className="text-lg font-medium text-muted-foreground">{word.english}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordList;
