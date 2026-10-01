'use client';

import React, { useState } from 'react';
import { QUIZ_QUESTIONS, LEAP_YEAR_FACTS } from '../utils';

export default function QuizAndFactsSection() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);

  const handleSelectAnswer = (questionId: number, val: string) => {
    if (answers[questionId]) return; // already answered

    const q = QUIZ_QUESTIONS.find((item) => item.id === questionId);
    if (!q) return;

    const isCorrect = val === q.correctAnswer;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setScore(0);
  };

  return (
    <section className="max-w-max-width-canvas mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-space-md" id="interactive-challenge-and-facts">
      {/* Quiz Column (5 Cols) */}
      <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-bold">
            Interactive Challenge
          </span>
          <span className="font-data-mono text-body-sm font-bold text-on-surface" id="quizScore">
            Score: {score} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            Can You Beat the Calendar?
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Test your mastery against the century anomalies that trip up 80% of people.
          </p>
        </div>

        <div className="flex flex-col gap-space-md" id="quizContainer">
          {QUIZ_QUESTIONS.map((q) => {
            const userAnswer = answers[q.id];
            const isAnswered = Boolean(userAnswer);
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10"
                data-q={q.id}
              >
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {q.question}
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.value;
                    let btnStyle =
                      'bg-surface-container text-on-surface hover:bg-surface-container-high';
                    if (isAnswered) {
                      if (isSelected) {
                        btnStyle = isCorrect
                          ? 'bg-primary text-on-primary font-bold'
                          : 'bg-error/20 text-error font-bold';
                      } else {
                        btnStyle = 'bg-surface-container/50 text-outline cursor-not-allowed';
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        className={`quiz-btn py-1.5 px-3 rounded text-body-sm font-medium transition-colors border border-outline-variant/10 ${btnStyle}`}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, opt.value)}
                        disabled={isAnswered}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {isAnswered && (
                  <div
                    className={`quiz-feedback text-[12px] mt-1 font-semibold ${
                      isCorrect ? 'text-primary' : 'text-error'
                    }`}
                  >
                    {isCorrect ? q.explanationCorrect : q.explanationIncorrect}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="py-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-all border border-outline-variant/20"
          id="resetQuizBtn"
          type="button"
          onClick={handleResetQuiz}
        >
          Reset Quiz
        </button>
      </div>

      {/* Facts Grid (7 Cols) */}
      <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-bold">
            Curiosities &amp; Culture
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            10 Fascinating Leap Year Facts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm max-h-[460px] overflow-y-auto pr-1">
          {LEAP_YEAR_FACTS.map((fact, idx) => (
            <div
              key={idx}
              className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-2 border border-outline-variant/10 shadow-xs"
            >
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                {fact.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-bold text-on-surface">
                  {fact.title}
                </span>
                <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">
                  {fact.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
