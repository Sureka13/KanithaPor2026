import type { Question } from "@/lib/questions";

export function shuffleQuestion(question: Question): Question {
  // Make a copy of the options with original indexes so we can preserve the correct answer.
  const optionPairs = question.options.map((value, index) => ({ value, originalIndex: index }));

  // Fisher-Yates shuffle.
  for (let i = optionPairs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
  }

  const shuffledOptions = optionPairs.map((pair) => pair.value);
  const answer = optionPairs.findIndex((pair) => pair.originalIndex === question.answer);

  return {
    ...question,
    options: shuffledOptions,
    answer,
  };
}
