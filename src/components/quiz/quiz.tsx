import { env } from "@/config/env";
import React, { useEffect, useMemo, useRef, useState } from "react";
interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
  categories?: { id: number; name: string }[];
  rating?: number;
  pyq?: boolean;
  year?: number;
  totalAttempts?: number;
}

interface QuizProps {
  questions: Question[];
  onQuizComplete: () => void;
  onClose?: () => void;
}

// Normalize answer to 0-based option index.
const getCorrectOptionIndex = (answer: string): number => {
  const numericAnswer = Number(answer);
  if (!Number.isNaN(numericAnswer)) {
    // Support both 0-based and 1-based numeric answers from APIs.
    return numericAnswer > 0 ? numericAnswer - 1 : numericAnswer;
  }

  // Support alphabet answers like A/B/C/D.
  const upper = answer.trim().toUpperCase();
  if (upper.length === 1 && upper >= "A" && upper <= "Z") {
    return upper.charCodeAt(0) - 65;
  }

  return -1;
};

const INITIAL_GE_RATING = 250;

const computeEloRating = (
  quizQuestions: Question[],
  selections: Record<number, number>,
  initialRating = INITIAL_GE_RATING
): number => {
  let playerRating = initialRating;

  quizQuestions.forEach((question) => {
    const selected = selections[question.id];
    if (selected === undefined) return;

    const questionRating = question.rating ?? initialRating;
    const expected = 1 / (1 + Math.pow(10, (questionRating - playerRating) / 400));
    const correct = selected === getCorrectOptionIndex(question.answer) ? 1 : 0;

    const gap = Math.abs(questionRating - playerRating);
    const kFactor = Math.max(16, Math.min(40, 28 + gap / 40));

    playerRating += kFactor * (correct - expected);
  });

  return Math.round(playerRating);
};

const QUIZ_NUDGES: Record<number, { emoji: string; msg: string }> = {
  3: {
    emoji: "😤",
    msg: "3 down. 12 to go.<br><em>The person who clears this exam</em> did not stop at question 3.<br><strong>Do not be the one who quits here.</strong>",
  },
  7: {
    emoji: "🔥",
    msg: "Halfway done.<br>Right now, <em>lakhs of aspirants</em> are also preparing.<br><strong>Most of them will not finish this test.</strong><br>You still can.",
  },
  10: {
    emoji: "⚡",
    msg: "10 questions in.<br><strong>Only 5 left.</strong><br>Your GE Rating is almost ready - and it will tell you something <em>nobody else will say to your face.</em>",
  },
};

const Quiz: React.FC<QuizProps> = ({ questions = [], onQuizComplete, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [nudgeQuestionIndex, setNudgeQuestionIndex] = useState<number | null>(null);
  const [resultStep, setResultStep] = useState<0 | 1 | 2>(0);
  const [ctaLiveCount, setCtaLiveCount] = useState(12843);
  const autoNextTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setIsLoading(false);
      setError(null);
      return;
    }

    setError("No questions available");
    setIsLoading(false);
  }, [questions]);

  useEffect(() => {
    return () => {
      if (autoNextTimerRef.current) {
        window.clearTimeout(autoNextTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!(showResults && resultStep === 2)) return;

    const timer = window.setInterval(() => {
      setCtaLiveCount((prev) => {
        const next = prev + Math.floor(Math.random() * 5) - 2;
        return Math.max(12000, next);
      });
    }, 2200);

    return () => window.clearInterval(timer);
  }, [showResults, resultStep]);

  const calculateScore = () => {
    return questions.reduce((total, question) => {
      const correctOptionIndex = getCorrectOptionIndex(question.answer);
      return total + (selectedOptions[question.id] === correctOptionIndex ? 1 : 0);
    }, 0);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  const geRating = useMemo(() => {
    return computeEloRating(questions, selectedOptions, INITIAL_GE_RATING);
  }, [questions, selectedOptions]);

  const levelText = useMemo(() => {
    const levels: Array<[number, number, string, string]> = [
      [0, 209, "Foundation Level", "Your starting point - every topper had one."],
      [210, 239, "Developing", "Concept clarity is building. Keep compounding."],
      [240, 274, "Average · National Median", "You are in the fight. Precision now matters."],
      [275, 314, "Competitive · Exam Ready", "Strong base. Consistency can move you ahead fast."],
      [315, 9999, "Elite · Probable Qualifier", "You are operating at a high level. Stay locked in."],
    ];

    const found = levels.find(([lo, hi]) => geRating >= lo && geRating <= hi);
    if (!found) return { label: "", sub: "" };
    return { label: found[2], sub: found[3] };
  }, [geRating]);

  const subjectBreakdown = useMemo(() => {
    const colors: Record<string, string> = {
      Polity: "#4A90D9",
      History: "#E07B39",
      Geography: "#2EAF7D",
      Economy: "#D4A017",
      Science: "#9B59B6",
      "Current Affairs": "#E74C3C",
      Practice: "#4A90D9",
    };

    const map: Record<string, { total: number; got: number; pct: number; color: string }> = {};

    questions.forEach((question) => {
      if (selectedOptions[question.id] === undefined) return;
      const subject = question.categories?.[0]?.name || "Practice";
      if (!map[subject]) {
        map[subject] = { total: 0, got: 0, pct: 0, color: colors[subject] || "#4A90D9" };
      }

      map[subject].total += 1;
      const correctOptionIndex = getCorrectOptionIndex(question.answer);
      if (selectedOptions[question.id] === correctOptionIndex) {
        map[subject].got += 1;
      }
    });

    Object.values(map).forEach((v) => {
      v.pct = v.total > 0 ? Math.round((v.got / v.total) * 100) : 0;
    });

    return map;
  }, [questions, selectedOptions]);

  const weakestSubject = useMemo(() => {
    let weakest: string | null = null;
    let weakestPct = 101;
    Object.entries(subjectBreakdown).forEach(([subject, data]) => {
      if (data.pct < weakestPct) {
        weakestPct = data.pct;
        weakest = subject;
      }
    });
    return weakest;
  }, [subjectBreakdown]);

  const examVerdict = useMemo(() => {
    if (geRating >= 315) return "✅ <strong>UPSC Prelims zone.</strong> Stay consistent.";
    if (geRating >= 275) return "✅ <strong>SSC CGL ready.</strong> UPSC needs focused revision rounds.";
    if (geRating >= 240) {
      return `🟡 <strong>State PSC range.</strong> SSC CGL needs tighter work on ${weakestSubject || "weak subjects"}.`;
    }
    return `🔴 <strong>Below qualifying range.</strong> Gap: ${Math.max(0, 240 - geRating)} rating points to first competitive band. Closable in 30 days.`;
  }, [geRating, weakestSubject]);

  const ragebaitHook = useMemo(() => {
    if (geRating >= 315) return `🔥 ${geRating}. Elite zone. The person clearing this year is already on day 60.`;
    if (geRating >= 275) return `⚡ ${geRating}. Above average. The one who beats you by 2 marks is studying right now.`;
    if (geRating >= 240) return `📊 ${geRating}. Median zone. Cutoffs do not care about median.`;
    return `📌 ${geRating}. Honest gap. Every topper started here. Few continued.`;
  }, [geRating]);

  const ctaHeadline = useMemo(() => {
    if (geRating >= 315) return "You are elite. Do not let this rating disappear.";
    if (geRating >= 275) return "You are close. The gap to the top is smaller than you think.";
    if (geRating >= 240) return "You started. Now do not be the one who stops here.";
    return "The gap is real. The ones who closed it - they started today.";
  }, [geRating]);

  const activeQuestion = questions[currentQuestion];
  const selectedForCurrent = activeQuestion ? selectedOptions[activeQuestion.id] : undefined;
  const correctForCurrent = activeQuestion ? getCorrectOptionIndex(activeQuestion.answer) : -1;
  const explanationForCurrent = activeQuestion ? showExplanations[activeQuestion.id] : false;
  const showNextButton =
    selectedForCurrent !== undefined && explanationForCurrent && selectedForCurrent !== correctForCurrent;
  const progressWidth = showResults ? "100%" : `${(currentQuestion / questions.length) * 100}%`;
  const nudgeData = nudgeQuestionIndex !== null ? QUIZ_NUDGES[nudgeQuestionIndex] : null;

  const getSubjectPillClasses = (subject?: string) => {
    const value = (subject || "practice").toLowerCase();
    if (value.includes("polity")) return "bg-[#E0EAFF] text-[#1B3FBB]";
    if (value.includes("history")) return "bg-[#FFF3E0] text-[#8D4E0A]";
    if (value.includes("geo")) return "bg-[#E0F7F0] text-[#1A7A56]";
    if (value.includes("economy")) return "bg-[#FFF8E0] text-[#7A5C0A]";
    if (value.includes("science")) return "bg-[#F3E0FF] text-[#6B1A9A]";
    if (value.includes("current")) return "bg-[#FFE0E0] text-[#9A1A1A]";
    return "bg-[#EAF0FF] text-[#1865F2]";
  };

  const finishQuiz = () => {
    setShowResults(true);
    setResultStep(0);
    onQuizComplete();
  };

  const goToNextQuestion = () => {
    const nextIndex = currentQuestion + 1;
    if (nextIndex >= questions.length) {
      finishQuiz();
      return;
    }

    setCurrentQuestion(nextIndex);
    if (nextIndex === 3 || nextIndex === 7 || nextIndex === 10) {
      setNudgeQuestionIndex(nextIndex);
      setIsNudgeOpen(true);
    }
  };

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    if (selectedOptions[questionId] !== undefined) return;

    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));

    const question = questions[currentQuestion];
    if (!question) return;

    const isCorrect = optionIndex === getCorrectOptionIndex(question.answer);
    if (isCorrect) {
      autoNextTimerRef.current = window.setTimeout(() => {
        goToNextQuestion();
      }, currentQuestion === questions.length - 1 ? 600 : 900);
    }
  };

  const handleNext = () => {
    goToNextQuestion();
  };

  const dismissNudge = () => {
    setIsNudgeOpen(false);
    setNudgeQuestionIndex(null);
  };

  const handlePracticeMore = () => {
    window.location.href = env.TEST_PORTAL;
  };

  const shareResult = async () => {
    const text = `My GE (Govt Exam) Rating on 99Notes: ${geRating}. Find out where you stand - free.`;
    if (navigator.share) {
      await navigator.share({ title: "My GE Rating - 99Notes", text });
      return;
    }

    await navigator.clipboard.writeText(text);
  };

  const resetQuiz = () => {
    if (autoNextTimerRef.current) {
      window.clearTimeout(autoNextTimerRef.current);
    }
    setSelectedOptions({});
    setShowExplanations({});
    setShowResults(false);
    setCurrentQuestion(0);
    setIsNudgeOpen(false);
    setNudgeQuestionIndex(null);
    setResultStep(0);
    setCtaLiveCount(12843);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#1865F2] border-t-transparent" />
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="py-8 text-center text-[#7A8873]">
        <p className="text-sm">No practice questions available at the moment.</p>
      </div>
    );
  }

  if (!showResults && !activeQuestion) {
    return (
      <div className="py-8 text-center text-[#7A8873]">
        <p className="text-sm">Question data is not available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ fontFamily: "Lato, sans-serif" }}>
      <div className="sticky top-0 z-10 border-b border-[#E8EDE2] bg-white">
        <div className="flex items-center justify-between px-5 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-[#7A8873]">
              Q {Math.min(currentQuestion + 1, questions.length)} / {questions.length}
            </span>
            {!showResults ? (
              <span
                className={`rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.06em] ${getSubjectPillClasses(
                  activeQuestion?.categories?.[0]?.name
                )}`}
              >
                {activeQuestion?.categories?.[0]?.name || "Practice"}
              </span>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#7A8873] transition-colors hover:text-[#C0392B]"
            title="Exit quiz"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-[3px] w-full bg-[#E8EDE2]">
          <div
            className="h-full bg-[linear-gradient(90deg,#1865F2,#8FA058)] transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {!showResults ? (
        <>
          <div className="px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
            <p
              className="mb-5 min-h-12 leading-[1.48] text-[#1A1F16]"
              style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.05rem,3.5vw,1.3rem)", fontWeight: 600 }}
            >
              <span className="mr-2 font-bold text-[#1865F2]">Q{currentQuestion + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: activeQuestion?.question || "" }} />
            </p>

            <div className="grid gap-[0.65rem]">
              {activeQuestion?.options.map((option, idx) => {
                const isSelected = selectedForCurrent === idx;
                const isCorrect = idx === correctForCurrent;
                const isShown = !!explanationForCurrent;
                const selectedCorrect = isShown && isSelected && isCorrect;

                let classes =
                  "w-full min-h-12 rounded-[9px] border-[1.5px] px-4 py-3 text-left text-[0.9rem] font-bold transition-all duration-150";

                if (isShown) {
                  if (isCorrect) {
                    classes += " border-[#1A7A40] bg-[#E8F5EE] text-[#1A7A40]";
                  } else if (isSelected) {
                    classes += " border-[#C0392B] bg-[#FDEDEC] text-[#C0392B]";
                  } else {
                    classes += " border-[#E8EDE2] bg-[#F5F7F4] text-[#3D4A35]";
                  }
                } else {
                  classes += " border-[#E8EDE2] bg-[#F5F7F4] text-[#3D4A35] hover:border-[#4A90D9] hover:bg-[#EAF0FF]";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={classes}
                    onClick={() => handleOptionSelect(activeQuestion.id, idx)}
                    disabled={isShown}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-[1px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[0.68rem] font-black ${
                          isShown && isCorrect
                            ? "bg-[#1A7A40] text-white"
                            : isShown && isSelected
                            ? "bg-[#C0392B] text-white"
                            : "bg-[#D8E4CC] text-[#3D4A35]"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1" dangerouslySetInnerHTML={{ __html: option }} />
                    </span>
                    {selectedCorrect ? <div className="mt-2 h-[3px] w-full animate-pulse rounded bg-[#1A7A40]" /> : null}
                  </button>
                );
              })}
            </div>

            {explanationForCurrent && activeQuestion?.explaination ? (
              <div className="mt-4 rounded-r-[9px] border-l-[3px] border-[#8FA058] bg-[linear-gradient(135deg,#f0f5e8,#EAF0FF)] px-4 py-3 text-[0.83rem] leading-[1.62] text-[#3D4A35]">
                <div dangerouslySetInnerHTML={{ __html: activeQuestion.explaination }} />
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E8EDE2] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
            <span className="text-[0.78rem] text-[#7A8873]">
              Score: <strong className="text-[#1A7A40]">{score}</strong> / {currentQuestion}
            </span>
            {showNextButton ? (
              <button
                onClick={handleNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-[#1865F2] px-6 py-2.5 text-[0.86rem] font-black text-white transition-colors hover:bg-[#1149C0]"
              >
                {currentQuestion === questions.length - 1 ? "See My Rating" : "Next"}
                <span>→</span>
              </button>
            ) : (
              <span className="min-h-11" />
            )}
          </div>
        </>
      ) : (
        <div className="px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
          <div className="flex justify-center gap-2 pb-4">
            {[0, 1, 2].map((step) => (
              <span
                key={step}
                className={`h-[7px] w-[7px] rounded-full transition-all ${
                  resultStep === step ? "scale-125 bg-[#1865F2]" : "bg-[#D8E5CC]"
                }`}
              />
            ))}
          </div>

          {resultStep === 0 ? (
            <div>
              <p className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#7A8873]">
                Your GE (Govt Exam) Rating
              </p>
              <div
                className="leading-none text-[#1865F2]"
                style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(3.8rem,14vw,6rem)", fontWeight: 700 }}
              >
                {geRating}
              </div>
              <p className="mt-1 text-[0.85rem] text-[#3D4A35]">
                {levelText.label} <span className="text-[#7A8873]">· {levelText.sub}</span>
              </p>
              <p className="mt-1 text-[0.76rem] text-[#7A8873]">
                Started at {INITIAL_GE_RATING} · {geRating >= INITIAL_GE_RATING ? "+" : ""}
                {geRating - INITIAL_GE_RATING} after this quiz
              </p>
              <div className="mt-4 inline-block rounded-full border border-[#C8DEFF] bg-[#EAF0FF] px-3 py-1.5 text-[0.72rem] font-bold text-[#1865F2]">
                ⚖️ Weighted like chess ELO - harder questions move your score more.
              </div>
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => setResultStep(1)}
                  className="flex-1 rounded-[8px] bg-[#1865F2] px-4 py-3 text-[0.88rem] font-black text-white transition-colors hover:bg-[#1149C0]"
                >
                  See Where You Are Losing Marks →
                </button>
                <button
                  onClick={shareResult}
                  className="min-h-12 rounded-[8px] border-[1.5px] border-[#C8D9B4] px-4 py-3 text-[0.84rem] text-[#7A8873] transition-colors hover:border-[#5A6B32] hover:text-[#5A6B32]"
                >
                  📤
                </button>
              </div>
              <p className="mt-3 text-[0.69rem] font-bold text-[#2D6A1F]">🟢 Free Forever · No Paywall · Ever</p>
            </div>
          ) : null}

          {resultStep === 1 ? (
            <div>
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(subjectBreakdown).map(([subject, data]) => (
                  <div key={subject} className="rounded-[9px] border border-[#E8EDE2] bg-[#F5F7F4] p-3">
                    <div className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.07em] text-[#7A8873]">{subject}</div>
                    <div className="mb-1 h-[5px] w-full overflow-hidden rounded bg-[#DDE5D0]">
                      <div className="h-full rounded" style={{ width: `${data.pct}%`, background: data.color }} />
                    </div>
                    <div className="text-[0.72rem] font-bold text-[#3D4A35]">
                      {data.got}/{data.total} · {data.pct}%
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mb-3 rounded-r-[7px] border-l-[3px] border-[#8FA058] bg-[#EEF2E4] px-3 py-2 text-[0.82rem] text-[#3D4A35]"
                dangerouslySetInnerHTML={{ __html: examVerdict }}
              />

              <p
                className="mb-4 rounded-r-[7px] border-l-[3px] border-[#4A90D9] px-3 py-2 text-[1.05rem] font-bold leading-[1.38] text-[#1A1F16]"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                {ragebaitHook}
              </p>

              <button
                onClick={() => setResultStep(2)}
                className="w-full rounded-[8px] bg-[#1865F2] px-4 py-3 text-[0.88rem] font-black text-white transition-colors hover:bg-[#1149C0]"
              >
                What Is Waiting Inside →
              </button>
              <p className="mt-3 text-[0.69rem] font-bold text-[#2D6A1F]">🟢 Everything inside is free forever.</p>
            </div>
          ) : null}

          {resultStep === 2 ? (
            <div className="rounded-[12px] bg-[linear-gradient(155deg,#0F1D08_0%,#0C1C30_100%)] p-5 text-white">
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-[9px] border border-white/10 bg-white/5 p-3">
                  <div className="text-xl">📚</div>
                  <p className="text-[0.78rem] font-bold">Lakh+ Questions</p>
                  <p className="text-[0.69rem] text-white/55">Topper-curated. All free.</p>
                </div>
                <div className="rounded-[9px] border border-white/10 bg-white/5 p-3">
                  <div className="text-xl">🌅</div>
                  <p className="text-[0.78rem] font-bold">Daily by 10 AM</p>
                  <p className="text-[0.69rem] text-white/55">Current Affairs, sent to you.</p>
                </div>
                <div className="rounded-[9px] border border-white/10 bg-white/5 p-3">
                  <div className="text-xl">🏛️</div>
                  <p className="text-[0.78rem] font-bold">Real Community</p>
                  <p className="text-[0.69rem] text-white/55">Better than Telegram.</p>
                </div>
                <div className="rounded-[9px] border border-white/10 bg-white/5 p-3">
                  <div className="text-xl">🎯</div>
                  <p className="text-[0.78rem] font-bold">Rank up → Contribute</p>
                  <p className="text-[0.69rem] text-white/55">Your notes help others.</p>
                </div>
              </div>

              <div className="mb-4 rounded-[9px] border-[1.5px] border-[rgba(163,180,102,.5)] bg-white/10 p-4">
                <p className="mb-2 inline-block rounded-full bg-[#8FA058] px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em]">
                  🟢 Free Forever · The 7-Day Promise
                </p>
                <p
                  className="text-[1.03rem] italic leading-[1.52]"
                  style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}
                >
                  "Just start studying. A habit takes 21 days to form. We promise - study from here for 7 days, you will not go back until you see your name in the selection list."
                </p>
              </div>

              <div className="mb-3 text-center">
                <p className="mb-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white/45">
                  You just did the hardest part.
                </p>
                <p
                  className="mb-3 text-[clamp(1.2rem,4vw,1.45rem)] leading-tight"
                  style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700 }}
                >
                  {ctaHeadline}
                </p>
                <button
                  onClick={handlePracticeMore}
                  className="w-full rounded-[9px] bg-white px-4 py-4 text-[0.96rem] font-black text-[#1865F2] shadow-[0_6px_24px_rgba(0,0,0,.22)] transition-transform hover:-translate-y-0.5"
                >
                  Continue - Save My Rating Free
                </button>
                <p className="mt-2 text-[0.7rem] text-white/45">
                  No credit card · No OTP wall · <strong className="text-[#7ec87e]">Free forever</strong>
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.7rem] text-white/60">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#22c55e]" />
                  <span>{ctaLiveCount.toLocaleString("en-IN")} aspirants</span>
                  <span>studying on 99Notes right now</span>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-center gap-4">
                <button
                  onClick={shareResult}
                  className="rounded-[8px] border border-white/20 px-3 py-2 text-[0.78rem] text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                  📤 Share Rating
                </button>
                <button
                  onClick={resetQuiz}
                  className="text-[0.76rem] text-white/55 underline transition-colors hover:text-white/80"
                >
                  ↺ Retry
                </button>
              </div>
              <p className="border-t border-white/10 pt-2 text-center text-[0.64rem] text-white/35">
                99Notes · An Aspirant Funded Community Company
              </p>
            </div>
          ) : null}
        </div>
      )}

      {isNudgeOpen && nudgeData ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(255,255,255,.97)] px-7 text-center">
          <div className="max-w-[380px]">
            <p className="mb-3 text-5xl">{nudgeData.emoji}</p>
            <p
              className="mb-6 text-[clamp(1.25rem,4vw,1.5rem)] leading-[1.35] text-[#1A1F16]"
              style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700 }}
              dangerouslySetInnerHTML={{ __html: nudgeData.msg }}
            />
            <button
              onClick={dismissNudge}
              className="min-h-[52px] rounded-[8px] bg-[#1865F2] px-9 py-3 text-[0.96rem] font-black text-white transition-colors hover:bg-[#1149C0]"
            >
              Continue →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Quiz;
