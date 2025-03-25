import { useState, useEffect } from "react";
import "./App.css";
import { fetchQuizData } from "./q.js";

function App() {
  const [running, setRunning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    async function getQuiz() {
      try {
        const quiz = await fetchQuizData();
        setQuestions(quiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    }
    getQuiz();
  }, []);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const startQuiz = () => {
    if (!loading) {
      setRunning(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setRunning(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const decodeHtmlEntities = (text) => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h1>Loading Quiz...</h1>
      </div>
    );
  }

  if (!running) {
    return (
      <div className="welcome-screen">
        <h1>Welcome to the Quiz!</h1>
        <p>Test your knowledge with {questions.length} questions</p>
        <button onClick={startQuiz} className="start-button">
          Start Quiz
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="result-screen">
        <h1>Quiz Completed!</h1>
        <h2>
          Your score: {score} / {questions.length}
        </h2>
        <div className="score-circle">
          {Math.round((score / questions.length) * 100)}%
        </div>
        <button onClick={restartQuiz} className="restart-button">
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <main className="quiz-container">
      <div className="quiz-header">
        <span className="question-count">
          Question {currentQuestionIndex + 1}/{questions.length}
        </span>
        <span className="score">Score: {score}</span>
      </div>

      <div className="question-card">
        <h2 className="question-text">
          {decodeHtmlEntities(currentQuestion.question)}
        </h2>

        <div className="answer-options">
          {currentQuestion.answers.map((answer, index) => {
            const isCorrect = answer === currentQuestion.correctAnswer;
            const isSelected = selectedAnswer === answer;
            let buttonClass = "answer-button";

            if (selectedAnswer !== null) {
              if (isSelected) {
                buttonClass += isCorrect ? " correct" : " incorrect";
              } else if (isCorrect) {
                buttonClass += " correct";
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
              >
                {decodeHtmlEntities(answer)}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="feedback-section">
            <button onClick={nextQuestion} className="next-button">
              {isLastQuestion ? "See Results" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
