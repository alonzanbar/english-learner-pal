import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listFiles, uploadFile, type FileMeta } from "@/lib/api";
import { clearWordsCache } from "@/lib/vocabulary";
import { clearSelectedWordListId, getSelectedWordListId, setSelectedWordListId } from "@/lib/word-list-persistence";
import { setTargetPlan } from "@/lib/target-plan-persistence";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Target } from "lucide-react";

export default function ChooseWordList() {
  const navigate = useNavigate();

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileMeta[]>([]);

  const [addWordsOpen, setAddWordsOpen] = useState(false);
  const [addWordsTitle, setAddWordsTitle] = useState("");
  const [addWordsFile, setAddWordsFile] = useState<File | null>(null);
  const [addWordsStatus, setAddWordsStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [addWordsError, setAddWordsError] = useState<string | null>(null);

  const [targetPlanOpen, setTargetPlanOpen] = useState(false);
  const [targetPlanFileId, setTargetPlanFileId] = useState("");
  const [targetPlanDays, setTargetPlanDays] = useState(14);
  const [targetPlanStartDate, setTargetPlanStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [targetPlanError, setTargetPlanError] = useState<string | null>(null);

  const sortedFiles = useMemo(() => {
    return [...fileList].sort((a, b) => a.name.localeCompare(b.name));
  }, [fileList]);

  const refreshFiles = async () => {
    const files = await listFiles();
    setFileList(files);
    return files;
  };

  useEffect(() => {
    (async () => {
      setLoadState("loading");
      setLoadError(null);
      try {
        const files = await refreshFiles();
        const savedId = getSelectedWordListId();
        if (savedId && files.some((f) => f.id === savedId)) {
          navigate("/learn", { replace: true });
          return;
        }
        setLoadState("ready");
      } catch (err: unknown) {
        setLoadState("error");
        setLoadError((err as { message?: string })?.message ?? "Failed to load word lists");
      }
    })();
  }, [navigate]);

  const handlePick = (fileId: string) => {
    setSelectedWordListId(fileId);
    clearWordsCache();
    navigate("/learn");
  };

  const handleChangeListReset = () => {
    clearSelectedWordListId();
  };

  const handleTargetPlanOpen = () => {
    setTargetPlanOpen(true);
    setTargetPlanError(null);
    if (sortedFiles.length > 0 && !targetPlanFileId) {
      setTargetPlanFileId(sortedFiles[0].id);
    }
  };

  const handleTargetPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlanFileId) {
      setTargetPlanError("Please select a word list.");
      return;
    }
    const days = Math.floor(Number(targetPlanDays)) || 1;
    if (days < 1) {
      setTargetPlanError("Days must be at least 1.");
      return;
    }
    if (!targetPlanStartDate?.trim()) {
      setTargetPlanError("Please pick a start date.");
      return;
    }
    setTargetPlan({ fileId: targetPlanFileId, days, startDate: targetPlanStartDate.trim() });
    setSelectedWordListId(targetPlanFileId);
    clearWordsCache();
    setTargetPlanOpen(false);
    navigate("/learn");
  };

  const handleAddWordsOpen = () => {
    setAddWordsOpen(true);
    setAddWordsTitle("");
    setAddWordsFile(null);
    setAddWordsStatus("idle");
    setAddWordsError(null);
  };

  const handleAddWordsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addWordsFile) {
      setAddWordsError("Please select a file.");
      return;
    }
    setAddWordsStatus("uploading");
    setAddWordsError(null);
    try {
      await uploadFile(addWordsFile, addWordsTitle);
      clearWordsCache();
      await refreshFiles();
      setAddWordsOpen(false);
      setAddWordsStatus("idle");
    } catch (err: unknown) {
      setAddWordsStatus("error");
      setAddWordsError((err as { message?: string })?.message ?? "Upload failed");
    }
  };

  if (loadState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <p className="text-muted-foreground">Loading word lists...</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6" dir="rtl">
        <div className="max-w-md w-full space-y-3">
          <p className="text-destructive">{loadError}</p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outline" onClick={handleChangeListReset}>Clear selection</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">Choose a word list</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Pick a list to start learning, or upload a new one.</p>
          </div>
          <div className="flex gap-2">
            {sortedFiles.length > 0 && (
              <Button variant="outline" onClick={handleTargetPlanOpen} className="gap-2">
                <Target size={16} />
                Target plan
              </Button>
            )}
            <Button onClick={handleAddWordsOpen} className="gap-2">
              <PlusCircle size={16} />
              Add words
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {sortedFiles.length === 0 ? (
          <div className="border border-dashed rounded-xl p-6 text-center space-y-3">
            <p className="text-muted-foreground">No word lists found yet.</p>
            <Button onClick={handleAddWordsOpen} className="gap-2">
              <PlusCircle size={16} />
              Upload your first list
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedFiles.map((f) => (
              <div key={f.id} className="border rounded-xl p-4 flex items-center justify-between gap-3 bg-card">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {f.id}</div>
                </div>
                <Button onClick={() => handlePick(f.id)} className="shrink-0">
                  Start
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={targetPlanOpen} onOpenChange={setTargetPlanOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Target plan</DialogTitle>
            <DialogDescription>
              Pick one word list, how many days to spread the words over, and when to start. You’ll see one day’s words at a time on the Learn page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTargetPlanSubmit} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Word list</Label>
              <Select value={targetPlanFileId} onValueChange={setTargetPlanFileId} required>
                <SelectTrigger aria-label="Word list">
                  <SelectValue placeholder="Choose a list" />
                </SelectTrigger>
                <SelectContent>
                  {sortedFiles.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target-plan-days">Days</Label>
              <Input
                id="target-plan-days"
                type="number"
                min={1}
                value={targetPlanDays}
                onChange={(e) => setTargetPlanDays(Number(e.target.value) || 1)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target-plan-start">Start date</Label>
              <Input
                id="target-plan-start"
                type="date"
                value={targetPlanStartDate}
                onChange={(e) => setTargetPlanStartDate(e.target.value)}
              />
            </div>
            {targetPlanError && (
              <p className="text-sm text-destructive">{targetPlanError}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTargetPlanOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Start plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={addWordsOpen} onOpenChange={setAddWordsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add words</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file (.csv, .xlsx, .xls) and give it a title. The file should have word columns (e.g. English, Hebrew).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWordsSubmit} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="add-words-title">Title</Label>
              <Input
                id="add-words-title"
                value={addWordsTitle}
                onChange={(e) => setAddWordsTitle(e.target.value)}
                placeholder="My word list"
                disabled={addWordsStatus === "uploading"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-words-file">File</Label>
              <Input
                id="add-words-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setAddWordsFile(e.target.files?.[0] ?? null)}
                disabled={addWordsStatus === "uploading"}
              />
            </div>
            {addWordsError && (
              <p className="text-sm text-destructive">{addWordsError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddWordsOpen(false)}
                disabled={addWordsStatus === "uploading"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addWordsStatus === "uploading"}>
                {addWordsStatus === "uploading" ? "Uploading…" : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

