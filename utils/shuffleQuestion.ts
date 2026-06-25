import type { Question } from "@/lib/questions";

// Fisher-Yates shuffle for options while preserving the original correct index.
export function shuffleQuestion(question: Question): Question {
  const optionPairs = question.options.map((value, index) => ({ value, originalIndex: index }));

  for (let i = optionPairs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
  }

  const shuffledOptions = optionPairs.map((p) => p.value);
  const answer = optionPairs.findIndex((p) => p.originalIndex === question.answer);

  return {
    ...question,
    options: shuffledOptions,
    answer,
  };
}
