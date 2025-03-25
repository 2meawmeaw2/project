export async function fetchQuizData() {
  const response = await fetch(
    "https://opentdb.com/api.php?amount=5&type=multiple"
  );
  const data = await response.json();

  return data.results.map((q) => ({
    question: q.question,
    answers: [...q.incorrect_answers, q.correct_answer].sort(
      () => Math.random() - 0.5
    ),
    correctAnswer: q.correct_answer,
  }));
}
