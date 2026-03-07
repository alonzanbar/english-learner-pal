const STORAGE_KEY = "target-plan";

export interface TargetPlan {
  fileId: string;
  days: number;
  startDate: string; // ISO date "YYYY-MM-DD"
}

function parseStored(raw: string | null): TargetPlan | null {
  if (!raw?.trim()) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (
      data &&
      typeof data === "object" &&
      "fileId" in data &&
      "days" in data &&
      "startDate" in data &&
      typeof (data as TargetPlan).fileId === "string" &&
      typeof (data as TargetPlan).days === "number" &&
      typeof (data as TargetPlan).startDate === "string"
    ) {
      const plan = data as TargetPlan;
      if (plan.days >= 1 && plan.startDate) return plan;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getTargetPlan(): TargetPlan | null {
  try {
    return parseStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function setTargetPlan(plan: TargetPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    // ignore
  }
}

export function clearTargetPlan(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
