import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function calculateScore(
  correctAnswers: number,
  incorrectAnswers: number,
  markingScheme: { correct: number; incorrect: number } = {
    correct: 4,
    incorrect: -1,
  },
): number {
  return (
    correctAnswers * markingScheme.correct +
    incorrectAnswers * markingScheme.incorrect
  );
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
