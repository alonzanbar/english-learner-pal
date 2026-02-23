import { useState, useCallback, useMemo, useEffect } from "react";
import { getAllWords, getWordsBySublist, getSublists, shuffleArray, ensureWordsLoaded, Word } from "@/lib/vocabulary";
import { getWordsWithSentences } from "@/lib/sentences";
import { useKnownWords } from "@/hooks/use-known-words";
import Flashcard from "@/components/Flashcard";
import QuizCard from "@/components/QuizCard";
import SentenceQuiz from "@/components/SentenceQuiz";
import WordList from "@/components/WordList";
import { BookOpen, Brain, MessageSquare, List, Shuffle, Eye, EyeOff, RotateCcw, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "flashcards" | "quiz" | "sentences" | "list";

const Index = () => {
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("flashcards");
  const [selectedSublist, setSelectedSublist] = useState<number>(0); // 0 = all
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizKey, setQuizKey] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [hideKnown, setHideKnown] = useState(true);
  const { knownWords, toggleKnown, resetKnown, isKnown, knownCount } = useKnownWords();

  useEffect(() => {
    ensureWordsLoaded()
      .then(() => setLoadState("ready"))
      .catch((err) => {
        setLoadState("error");
        setLoadError(err?.message ?? "Failed to load word list");
      });
  }, []);

  const sublists = useMemo(() => getSublists(), [loadState]);

  const baseWords = useMemo(() => {
    return selectedSublist === 0 ? getAllWords() : getWordsBySublist(selectedSublist);
  }, [selectedSublist]);

  const filteredWords = useMemo(() => {
    return hideKnown ? baseWords.filter(w => !knownWords.has(w.english)) : baseWords;
  }, [baseWords, hideKnown, knownWords]);

  const words = useMemo(() => {
    return shuffled ? shuffleArray(filteredWords) : filteredWords;
  }, [filteredWords, shuffled]);

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
    { key: "flashcards", label: "Flashcards", icon: <BookOpen size={18} /> },
    { key: "quiz", label: "Quiz", icon: <Brain size={18} /> },
    { key: "sentences", label: "Sentences", icon: <MessageSquare size={18} /> },
    { key: "list", label: "List", icon: <List size={18} /> },
  ];

  if (loadState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <p className="text-muted-foreground">Loading word list...</p>
      </div>
    );
  }
  if (loadState === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <p className="text-destructive">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Single header row: title + word count | mode icons + sublist + actions */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-foreground leading-tight">Academic Word List</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">AWL – {words.length} words</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex gap-0.5 bg-secondary rounded-lg p-0.5">
              {modes.map((m) => (
                <Tooltip key={m.key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleModeChange(m.key)}
                      aria-label={m.label}
                      className={`flex items-center justify-center size-8 rounded-md shrink-0 transition-all ${
                        mode === m.key
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{m.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <Select
              value={String(selectedSublist)}
              onValueChange={(v) => handleSublistChange(Number(v))}
            >
              <SelectTrigger className="w-[72px] h-8 text-xs" aria-label="Sublist">
                <SelectValue placeholder="Sublist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All</SelectItem>
                {sublists.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleShuffle}
                    aria-label="Shuffle"
                    className={`flex items-center justify-center size-8 rounded-lg text-sm transition-all ${
                      shuffled
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                    }`}
                  >
                    <Shuffle size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Shuffle</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setHideKnown(!hideKnown)}
                    aria-label={hideKnown ? "Hide known" : "Show known"}
                    className={`flex items-center justify-center size-8 rounded-lg text-sm transition-all ${
                      hideKnown
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                    }`}
                  >
                    {hideKnown ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {hideKnown ? "Hide known" : "Show known"}
                  {knownCount > 0 && ` (${knownCount})`}
                </TooltipContent>
              </Tooltip>
              {knownCount > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={resetKnown}
                      aria-label="Reset known"
                      className="flex items-center justify-center size-8 rounded-lg text-sm bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Reset known</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {mode === "flashcards" && currentWord && (
          <Flashcard
            word={currentWord}
            onNext={handleNext}
            onPrevious={handlePrevious}
            current={currentIndex + 1}
            total={words.length}
            isKnown={isKnown(currentWord.english)}
            onToggleKnown={() => toggleKnown(currentWord.english)}
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

        {mode === "list" && <WordList words={hideKnown ? words : baseWords} isKnown={isKnown} onToggleKnown={toggleKnown} />}
      </main>
    </div>
  );
};

export default Index;
