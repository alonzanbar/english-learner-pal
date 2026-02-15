import { useState, useCallback, useMemo } from "react";
import { getAllWords, getWordsBySublist, getSublists, shuffleArray, Word } from "@/lib/vocabulary";
import { getWordsWithSentences } from "@/lib/sentences";
import Flashcard from "@/components/Flashcard";
import QuizCard from "@/components/QuizCard";
import SentenceQuiz from "@/components/SentenceQuiz";
import WordList from "@/components/WordList";
import { BookOpen, Brain, MessageSquare, List, Shuffle } from "lucide-react";

type Mode = "flashcards" | "quiz" | "sentences" | "list";

const Index = () => {
  const [mode, setMode] = useState<Mode>("flashcards");
  const [selectedSublist, setSelectedSublist] = useState<number>(0); // 0 = all
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizKey, setQuizKey] = useState(0);
  const [shuffled, setShuffled] = useState(false);

  const sublists = useMemo(() => getSublists(), []);

  const baseWords = useMemo(() => {
    return selectedSublist === 0 ? getAllWords() : getWordsBySublist(selectedSublist);
  }, [selectedSublist]);

  const words = useMemo(() => {
    return shuffled ? shuffleArray(baseWords) : baseWords;
  }, [baseWords, shuffled]);

  const currentWord = words[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  }, [words.length]);

  const handleQuizAnswer = useCallback((correct: boolean) => {
    setQuizScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setQuizKey((k) => k + 1);
  }, [words.length]);

  const resetQuiz = () => {
    setQuizScore({ correct: 0, total: 0 });
    setCurrentIndex(0);
    setQuizKey((k) => k + 1);
  };

  // For sentence mode, filter to words that have sentences
  const sentenceWordsList = useMemo(() => {
    const sentenceWords = getWordsWithSentences();
    return words.filter(w => sentenceWords.includes(w.english.toLowerCase()));
  }, [words]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setCurrentIndex(0);
    if (newMode === "quiz" || newMode === "sentences") resetQuiz();
  };

  const handleSublistChange = (sublist: number) => {
    setSelectedSublist(sublist);
    setCurrentIndex(0);
    if (mode === "quiz") resetQuiz();
  };

  const toggleShuffle = () => {
    setShuffled(!shuffled);
    setCurrentIndex(0);
  };

  const modes: { key: Mode; label: string; icon: React.ReactNode }[] = [
    { key: "flashcards", label: "כרטיסיות", icon: <BookOpen size={18} /> },
    { key: "quiz", label: "בוחן", icon: <Brain size={18} /> },
    { key: "sentences", label: "משפטים", icon: <MessageSquare size={18} /> },
    { key: "list", label: "רשימה", icon: <List size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-foreground leading-tight">אוצר מילים אקדמי</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">AWL – {words.length} מילים</p>
            </div>
          </div>
        </div>

        {/* Mode Switcher - separate row on mobile */}
        <div className="container max-w-4xl mx-auto px-3 pb-2">
          <div className="flex gap-1 bg-secondary rounded-xl p-1 overflow-x-auto">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => handleModeChange(m.key)}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  mode === m.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">רשימה:</span>
          <button
            onClick={() => handleSublistChange(0)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              selectedSublist === 0
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            הכל
          </button>
          {sublists.map((s) => (
            <button
              key={s}
              onClick={() => handleSublistChange(s)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectedSublist === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {s}
            </button>
          ))}
          
          <div className="mr-auto">
            <button
              onClick={toggleShuffle}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                shuffled
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              <Shuffle size={14} />
              ערבב
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {mode === "flashcards" && currentWord && (
          <Flashcard
            word={currentWord}
            onNext={handleNext}
            onPrevious={handlePrevious}
            current={currentIndex + 1}
            total={words.length}
          />
        )}

        {mode === "quiz" && currentWord && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-success font-bold">✓ {quizScore.correct}</span>
              <span className="text-destructive font-bold">✗ {quizScore.total - quizScore.correct}</span>
              <span className="text-muted-foreground">
                {quizScore.total > 0
                  ? `${Math.round((quizScore.correct / quizScore.total) * 100)}%`
                  : "0%"}
              </span>
            </div>

            <div className="w-full max-w-md bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex) / words.length) * 100}%` }}
              />
            </div>

            <QuizCard key={quizKey} word={currentWord} onAnswer={handleQuizAnswer} />
          </div>
        )}

        {mode === "sentences" && sentenceWordsList.length > 0 && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-success font-bold">✓ {quizScore.correct}</span>
              <span className="text-destructive font-bold">✗ {quizScore.total - quizScore.correct}</span>
              <span className="text-muted-foreground">
                {quizScore.total > 0
                  ? `${Math.round((quizScore.correct / quizScore.total) * 100)}%`
                  : "0%"}
              </span>
            </div>

            <div className="w-full max-w-md bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex) / sentenceWordsList.length) * 100}%` }}
              />
            </div>

            <SentenceQuiz
              key={quizKey}
              word={sentenceWordsList[currentIndex % sentenceWordsList.length]}
              onAnswer={(correct) => {
                setQuizScore((prev) => ({
                  correct: prev.correct + (correct ? 1 : 0),
                  total: prev.total + 1,
                }));
                setCurrentIndex((prev) => (prev + 1) % sentenceWordsList.length);
                setQuizKey((k) => k + 1);
              }}
            />
          </div>
        )}

        {mode === "list" && <WordList words={words} />}
      </main>
    </div>
  );
};

export default Index;
