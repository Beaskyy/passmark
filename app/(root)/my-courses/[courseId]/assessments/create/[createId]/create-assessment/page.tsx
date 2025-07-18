"use client";

import { use, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCreateQuestion } from "@/hooks/useCreateQuestion";
import { useCreateAssessment } from "@/hooks/useCreateAssessment";
import { useUpdateAssessment } from "@/hooks/useUpdateAssessment";
import { useUpdateQuestion } from "@/hooks/useUpdateQuestion";
import { useCreateMarkingGuide } from "@/hooks/useCreateMarkingGuide";
import { useUpdateMarkingGuide } from "@/hooks/useUpdateMarkingGuide";
import { useDeleteMarkingGuide } from "@/hooks/useDeleteMarkingGuide";
import { useCreatePenalty } from "@/hooks/useCreatePenalty";
import { useUpdatePenalty } from "@/hooks/useUpdatePenalty";
import { useDeletePenalty } from "@/hooks/useDeletePenalty";
import { useCreateBonus } from "@/hooks/useCreateBonus";
import { useUpdateBonus } from "@/hooks/useUpdateBonus";
import { useDeleteBonus } from "@/hooks/useDeleteBonus";

import { Dialog, DialogContent } from "@/components/ui/dialog";

type Criterion = {
  criterion: string;
  mark: string;
  description: string;
  guide_id?: string;
  debounceTimeout?: NodeJS.Timeout | null;
};

type Penalty = {
  description: string;
  mark?: string;
  penalty_id?: string;
  debounceTimeout?: NodeJS.Timeout | null;
};

type Bonus = {
  description: string;
  mark?: string;
  bonus_id?: string;
  debounceTimeout?: NodeJS.Timeout | null;
};

type Question = {
  questionNumber: string;
  totalMark: string;
  question: string;
  answer: string;
  criteria: Criterion[];
  penalties: Penalty[];
  bonuses: Bonus[];
  showPenalties: boolean;
  showBonuses: boolean;
  question_id?: string;
  isCreated?: boolean;
  debounceTimeout?: NodeJS.Timeout | null;
};

const CreateAssessment = () => {
  const router = useRouter();
  const path = usePathname();
  const segments = path?.split("/");
  const courseId = segments[2];
  const title = segments[5];
  const [description, setDescription] = useState("");
  const [assessmentId, setAssessmentId] = useState<string | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionNumber: "",
      totalMark: "",
      question: "",
      answer: "",
      criteria: [{ criterion: "", mark: "", description: "" }],
      penalties: [{ description: "" }],
      bonuses: [{ description: "" }],
      showPenalties: true,
      showBonuses: false,
    },
  ]);
  const createAssessment = useCreateAssessment();
  const updateAssessment = useUpdateAssessment();
  const createQuestion = useCreateQuestion();
  const updateQuestionApi = useUpdateQuestion();
  const createMarkingGuide = useCreateMarkingGuide();
  const updateMarkingGuide = useUpdateMarkingGuide();
  const deleteMarkingGuide = useDeleteMarkingGuide();
  const createPenalty = useCreatePenalty();
  const updatePenaltyApi = useUpdatePenalty();
  const deletePenalty = useDeletePenalty();
  const createBonus = useCreateBonus();
  const updateBonusApi = useUpdateBonus();
  const deleteBonus = useDeleteBonus();

  const [debouncedDescription, setDebouncedDescription] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  // Load from sessionStorage when courseId and title are available
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!courseId || !title) return;
    const LOCAL_STORAGE_KEY = `create-assessment-${courseId}-${title}`;
    const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.description) setDescription(parsed.description);
          if (parsed.questions) setQuestions(parsed.questions);
          if (parsed.useAI !== undefined) setUseAI(parsed.useAI);
          if (parsed.assessmentId) setAssessmentId(parsed.assessmentId);
        }
      } catch {}
    }
    // eslint-disable-next-line
  }, [courseId, title]);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!courseId || !title) return;
    const LOCAL_STORAGE_KEY = `create-assessment-${courseId}-${title}`;
    const data = {
      description,
      questions,
      useAI,
      assessmentId,
    };
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    // eslint-disable-next-line
  }, [description, questions, useAI, assessmentId, courseId, title]);

  // Debounce effect for assessment creation
  useEffect(() => {
    if (!description.trim()) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        if (!assessmentId) {
          const response = await createAssessment.mutateAsync({
            course_id: courseId,
            title,
            description,
          });
          setAssessmentId(
            response.data?.assessment_id || response.assessment_id
          );
        } else {
          await updateAssessment.mutateAsync({
            assessment_id: assessmentId,
            course_id: courseId,
            title,
            description,
          });
        }
      } catch (error) {
        // Optionally show error toast
      }
    }, 500);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  // Effect to focus the input on mount
  useEffect(() => {
    if (descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, []);

  const handleDescriptionBlur = async () => {
    if (!description.trim()) return;
    if (!assessmentId) {
      // Create assessment
      try {
        const response = await createAssessment.mutateAsync({
          course_id: courseId,
          title,
          description,
        });
        setAssessmentId(response.data?.assessment_id || response.assessment_id);
      } catch (error) {
        // Optionally show error toast
      }
    } else {
      // Update assessment
      try {
        await updateAssessment.mutateAsync({
          assessment_id: assessmentId,
          course_id: courseId,
          title,
          description,
        });
      } catch (error) {
        // Optionally show error toast
      }
    }
  };

  // Remove all onBlur handlers for question, criterion, penalty, and bonus inputs
  // Add per-entity debounced useEffect for each question, criterion, penalty, and bonus

  // --- 1. Debounce for Questions ---
  useEffect(() => {
    if (!assessmentId) return;
    questions.forEach((question, index) => {
      if (
        question.questionNumber.trim() &&
        question.totalMark.trim() &&
        question.question.trim()
      ) {
        if (!question.debounceTimeout) {
          question.debounceTimeout = null;
        }
        if (question.debounceTimeout) clearTimeout(question.debounceTimeout);
        question.debounceTimeout = setTimeout(async () => {
          if (!question.isCreated) {
            try {
              const payload = {
                course_id: courseId,
                assessment_id: assessmentId!,
                number: question.questionNumber,
                text: question.question,
                total_marks: Number(question.totalMark),
                by_ai: useAI,
              };
              const response = await createQuestion.mutateAsync(payload);
              const newQuestions = [...questions];
              newQuestions[index] = {
                ...question,
                isCreated: true,
                question_id: response.data?.question_id || response.question_id,
                criteria: [{ criterion: "", mark: "", description: "" }],
                penalties: [{ description: "", mark: "" }],
                bonuses: [{ description: "", mark: "" }],
              };
              setQuestions(newQuestions);
            } catch {}
          } else if (question.question_id) {
            try {
              const payload = {
                question_id: question.question_id,
                course_id: courseId,
                assessment_id: assessmentId!,
                number: question.questionNumber,
                text: question.question,
                total_marks: Number(question.totalMark),
                by_ai: useAI,
              };
              await updateQuestionApi.mutateAsync(payload);
            } catch {}
          }
        }, 500);
      }
    });
    // eslint-disable-next-line
  }, [questions, assessmentId, useAI]);

  // --- 2. Debounce for Criteria (Marking Guide) ---
  useEffect(() => {
    questions.forEach((question, questionIndex) => {
      question.criteria.forEach((criterion, criterionIndex) => {
        if (
          criterion.criterion.trim() &&
          criterion.mark.trim() &&
          criterion.description.trim()
        ) {
          if (!criterion.debounceTimeout) {
            criterion.debounceTimeout = null;
          }
          if (criterion.debounceTimeout)
            clearTimeout(criterion.debounceTimeout);
          criterion.debounceTimeout = setTimeout(async () => {
            if (!question.question_id) return;
            if (!criterion.guide_id) {
              try {
                const payload = {
                  question_id: question.question_id as string,
                  criteria: criterion.criterion,
                  description: criterion.description,
                  mark: Number(criterion.mark),
                  by_ai: useAI,
                };
                const response = await createMarkingGuide.mutateAsync(payload);
                const newQuestions = [...questions];
                newQuestions[questionIndex].criteria[criterionIndex].guide_id =
                  response.data?.guide_id || response.guide_id;
                setQuestions(newQuestions);
              } catch {}
            } else {
              try {
                const payload = {
                  guide_id: criterion.guide_id,
                  question_id: question.question_id as string,
                  criteria: criterion.criterion,
                  description: criterion.description,
                  mark: Number(criterion.mark),
                  by_ai: useAI,
                };
                await updateMarkingGuide.mutateAsync(payload);
              } catch {}
            }
          }, 500);
        }
      });
    });
    // eslint-disable-next-line
  }, [questions, useAI]);

  // --- 3. Debounce for Penalties ---
  useEffect(() => {
    questions.forEach((question, questionIndex) => {
      question.penalties.forEach((penalty, penaltyIndex) => {
        if (penalty.description.trim() && penalty.mark && penalty.mark.trim()) {
          if (!penalty.debounceTimeout) {
            penalty.debounceTimeout = null;
          }
          if (penalty.debounceTimeout) clearTimeout(penalty.debounceTimeout);
          penalty.debounceTimeout = setTimeout(async () => {
            if (!question.question_id) return;
            if (!penalty.penalty_id) {
              try {
                const payload = {
                  question_id: question.question_id as string,
                  description: penalty.description,
                  mark: Number(penalty.mark),
                  by_ai: useAI,
                };
                const response = await createPenalty.mutateAsync(payload);
                const newQuestions = [...questions];
                newQuestions[questionIndex].penalties[penaltyIndex].penalty_id =
                  response.data?.penalty_id || response.penalty_id;
                setQuestions(newQuestions);
              } catch {}
            } else {
              try {
                if (!question.question_id) return;
                const payload = {
                  penalty_id: penalty.penalty_id,
                  question_id: question.question_id as string,
                  description: penalty.description,
                  mark: Number(penalty.mark),
                  by_ai: useAI,
                };
                await updatePenaltyApi.mutateAsync(payload);
              } catch {}
            }
          }, 500);
        }
      });
    });
    // eslint-disable-next-line
  }, [questions, useAI]);

  // --- 4. Debounce for Bonuses ---
  useEffect(() => {
    questions.forEach((question, questionIndex) => {
      question.bonuses.forEach((bonus, bonusIndex) => {
        if (bonus.description.trim() && bonus.mark && bonus.mark.trim()) {
          if (!bonus.debounceTimeout) {
            bonus.debounceTimeout = null;
          }
          if (bonus.debounceTimeout) clearTimeout(bonus.debounceTimeout);
          bonus.debounceTimeout = setTimeout(async () => {
            if (!question.question_id) return;
            if (!bonus.bonus_id) {
              try {
                const payload = {
                  question_id: question.question_id as string,
                  description: bonus.description,
                  mark: Number(bonus.mark),
                  by_ai: useAI,
                };
                const response = await createBonus.mutateAsync(payload);
                const newQuestions = [...questions];
                newQuestions[questionIndex].bonuses[bonusIndex].bonus_id =
                  response.data?.bonus_id || response.bonus_id;
                setQuestions(newQuestions);
              } catch {}
            } else {
              try {
                const payload = {
                  bonus_id: bonus.bonus_id,
                  question_id: question.question_id as string,
                  description: bonus.description,
                  mark: Number(bonus.mark),
                  by_ai: useAI,
                };
                await updateBonusApi.mutateAsync(payload);
              } catch {}
            }
          }, 500);
        }
      });
    });
    // eslint-disable-next-line
  }, [questions, useAI]);

  const handleQuestionBlur = async (question: Question, index: number) => {
    // Only proceed if all required fields are filled
    if (
      question.questionNumber.trim() &&
      question.totalMark.trim() &&
      question.question.trim()
    ) {
      // If not created, create
      if (!question.isCreated) {
        try {
          const payload = {
            course_id: courseId,
            assessment_id: assessmentId!,
            number: question.questionNumber,
            text: question.question,
            total_marks: Number(question.totalMark),
            by_ai: useAI,
          };
          const response = await createQuestion.mutateAsync(payload);
          const newQuestions = [...questions];
          newQuestions[index] = {
            ...question,
            isCreated: true,
            question_id: response.data?.question_id || response.question_id,
            criteria: [{ criterion: "", mark: "", description: "" }],
            penalties: [{ description: "", mark: "" }],
            bonuses: [{ description: "", mark: "" }],
          };
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else if (question.question_id) {
        // If already created, update
        try {
          const payload = {
            question_id: question.question_id,
            course_id: courseId,
            assessment_id: assessmentId!,
            number: question.questionNumber,
            text: question.question,
            total_marks: Number(question.totalMark),
            by_ai: useAI,
          };
          await updateQuestionApi.mutateAsync(payload);
        } catch (error) {
          // Optionally show error toast
        }
      }
    }
  };

  const addNewQuestion = async () => {
    await handleQuestionBlur(
      questions[questions.length - 1],
      questions.length - 1
    );
    setQuestions([
      ...questions,
      {
        questionNumber: "",
        totalMark: "",
        question: "",
        answer: "",
        criteria: [{ criterion: "", mark: "", description: "" }],
        penalties: [{ description: "" }],
        bonuses: [{ description: "" }],
        showPenalties: true,
        showBonuses: false,
      },
    ]);
  };

  const handleContinue = async () => {
    await handleQuestionBlur(
      questions[questions.length - 1],
      questions.length - 1
    );
    setIsOpen(true);
  };

  const updateQuestion = <K extends keyof Question>(
    questionIndex: number,
    field: K,
    value: Question[K]
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addCriterion = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].criteria.push({
      criterion: "",
      mark: "",
      description: "",
    });
    setQuestions(newQuestions);
  };

  const removeCriterion = (questionIndex: number, criterionIndex: number) => {
    if (questions[questionIndex].criteria.length > 1) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].criteria = newQuestions[
        questionIndex
      ].criteria.filter((_, i) => i !== criterionIndex);
      setQuestions(newQuestions);
    }
  };

  const updateCriterion = (
    questionIndex: number,
    criterionIndex: number,
    field: keyof Criterion,
    value: any
  ) => {
    if (field === "debounceTimeout") return;
    const newQuestions = [...questions];
    newQuestions[questionIndex].criteria[criterionIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addPenalty = (questionIndex: number) => {
    if (questions[questionIndex].showPenalties) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].penalties.push({ description: "" });
      setQuestions(newQuestions);
    }
  };

  const removePenalty = (questionIndex: number, penaltyIndex: number) => {
    if (questions[questionIndex].penalties.length > 1) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].penalties = newQuestions[
        questionIndex
      ].penalties.filter((_, i) => i !== penaltyIndex);
      setQuestions(newQuestions);
    }
  };

  const updatePenalty = (
    questionIndex: number,
    penaltyIndex: number,
    field: keyof Penalty,
    value: any
  ) => {
    if (field === "debounceTimeout") return;
    const newQuestions = [...questions];
    newQuestions[questionIndex].penalties[penaltyIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addBonus = (questionIndex: number) => {
    if (questions[questionIndex].showBonuses) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].bonuses.push({ description: "" });
      setQuestions(newQuestions);
    }
  };

  const removeBonus = (questionIndex: number, bonusIndex: number) => {
    if (questions[questionIndex].bonuses.length > 1) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].bonuses = newQuestions[
        questionIndex
      ].bonuses.filter((_, i) => i !== bonusIndex);
      setQuestions(newQuestions);
    }
  };

  const updateBonus = (
    questionIndex: number,
    bonusIndex: number,
    field: keyof Bonus,
    value: any
  ) => {
    if (field === "debounceTimeout") return;
    const newQuestions = [...questions];
    newQuestions[questionIndex].bonuses[bonusIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleCriterionBlur = async (
    question: Question,
    questionIndex: number,
    criterion: Criterion,
    criterionIndex: number
  ) => {
    // Only proceed if all fields are filled
    if (
      criterion.criterion.trim() &&
      criterion.mark.trim() &&
      criterion.description.trim() &&
      question.question_id
    ) {
      if (!criterion.guide_id) {
        // Create marking guide
        try {
          const payload = {
            question_id: question.question_id,
            criteria: criterion.criterion,
            description: criterion.description,
            mark: Number(criterion.mark),
            by_ai: useAI,
          };
          const response = await createMarkingGuide.mutateAsync(payload);
          // Update guide_id in state
          const newQuestions = [...questions];
          newQuestions[questionIndex].criteria[criterionIndex].guide_id =
            response.data?.guide_id || response.guide_id;
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        // Update marking guide
        try {
          const payload = {
            guide_id: criterion.guide_id,
            question_id: question.question_id,
            criteria: criterion.criterion,
            description: criterion.description,
            mark: Number(criterion.mark),
            by_ai: useAI,
          };
          await updateMarkingGuide.mutateAsync(payload);
        } catch (error) {
          // Optionally show error toast
        }
      }
    }
  };

  const handleDeleteCriterion = async (
    questionIndex: number,
    criterionIndex: number
  ) => {
    const criterion = questions[questionIndex].criteria[criterionIndex];
    if (criterion.guide_id) {
      try {
        await deleteMarkingGuide.mutateAsync({ guide_id: criterion.guide_id });
      } catch (error) {
        // Optionally show error toast
      }
    }
    removeCriterion(questionIndex, criterionIndex);
  };

  const handlePenaltyBlur = async (
    question: Question,
    questionIndex: number,
    penalty: Penalty,
    penaltyIndex: number
  ) => {
    // Only proceed if description and mark are filled and question_id exists
    if (
      penalty.description.trim() &&
      penalty.mark &&
      penalty.mark.trim() &&
      question.question_id
    ) {
      if (!penalty.penalty_id) {
        // Create penalty
        try {
          const payload = {
            question_id: question.question_id,
            description: penalty.description,
            mark: Number(penalty.mark),
            by_ai: useAI,
          };
          const response = await createPenalty.mutateAsync(payload);
          // Update penalty_id in state
          const newQuestions = [...questions];
          newQuestions[questionIndex].penalties[penaltyIndex].penalty_id =
            response.data?.penalty_id || response.penalty_id;
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        // Update penalty
        try {
          if (!question.question_id) return;
          const payload = {
            penalty_id: penalty.penalty_id,
            question_id: question.question_id as string,
            description: penalty.description,
            mark: Number(penalty.mark),
            by_ai: useAI,
          };
          await updatePenaltyApi.mutateAsync(payload);
        } catch {}
      }
    }
  };

  const handleDeletePenalty = async (
    questionIndex: number,
    penaltyIndex: number
  ) => {
    const penalty = questions[questionIndex].penalties[penaltyIndex];
    if (penalty.penalty_id) {
      try {
        await deletePenalty.mutateAsync({ penalty_id: penalty.penalty_id });
      } catch (error) {
        // Optionally show error toast
      }
    }
    removePenalty(questionIndex, penaltyIndex);
  };

  const handleBonusBlur = async (
    question: Question,
    questionIndex: number,
    bonus: Bonus,
    bonusIndex: number
  ) => {
    // Only proceed if description and mark are filled and question_id exists
    if (
      bonus.description.trim() &&
      bonus.mark &&
      bonus.mark.trim() &&
      question.question_id
    ) {
      if (!bonus.bonus_id) {
        // Create bonus
        try {
          const payload = {
            question_id: question.question_id,
            description: bonus.description,
            mark: Number(bonus.mark),
            by_ai: useAI,
          };
          const response = await createBonus.mutateAsync(payload);
          // Update bonus_id in state
          const newQuestions = [...questions];
          newQuestions[questionIndex].bonuses[bonusIndex].bonus_id =
            response.data?.bonus_id || response.bonus_id;
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        // Update bonus
        try {
          const payload = {
            bonus_id: bonus.bonus_id,
            question_id: question.question_id,
            description: bonus.description,
            mark: Number(bonus.mark),
            by_ai: useAI,
          };
          await updateBonusApi.mutateAsync(payload);
        } catch (error) {
          // Optionally show error toast
        }
      }
    }
  };

  const handleDeleteBonus = async (
    questionIndex: number,
    bonusIndex: number
  ) => {
    const bonus = questions[questionIndex].bonuses[bonusIndex];
    if (bonus.bonus_id) {
      try {
        await deleteBonus.mutateAsync({ bonus_id: bonus.bonus_id });
      } catch (error) {
        // Optionally show error toast
      }
    }
    removeBonus(questionIndex, bonusIndex);
  };

  return (
    <main className="lg:px-[108px] md:px-[20] p-5 bg-white min-h-screen">
      <div className="flex justify-between lg:items-center gap-4">
        <div className="flex items-center gap-3 mt-2">
          <Image
            src="/images/back.svg"
            alt="back"
            width={44}
            height={44}
            onClick={() => router.back()}
          />
          <h3 className="text-black font-semibold lg:text-[17px] text-sm">
            My Questions
          </h3>
        </div>
        <Image
          src="/images/spinner2.svg"
          alt="spinner"
          width={32}
          height={32}
        />
      </div>
      <div className="flex flex-col gap-11 mt-7">
        <Input
          ref={descriptionInputRef}
          className="placeholder:text-[#B3B3B3] min-h-[22px] text-black text-[22px] lg:font-medium !border-none !shadow-none"
          placeholder="Type assessment name here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-3.5 items-center">
          <Switch checked={useAI} onCheckedChange={setUseAI} />
          <p className="text-black lg:text-sm text-xs font-semibold">
            Use Passmark AI Assistant
          </p>
          <Image
            src="/images/ai-magic.svg"
            alt="ai-magic"
            width={22}
            height={22}
          />
        </div>
        {assessmentId && (
          <div className="flex flex-col gap-[112px]">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="flex flex-col gap-8">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#171717] font-medium">
                      Question number <span className="text-[#335CFF]">*</span>
                    </Label>
                    <Input
                      placeholder="eg. 1a, 2b"
                      className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                      value={question.questionNumber}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "questionNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#171717] font-medium">
                      Total Mark <span className="text-[#335CFF]">*</span>
                    </Label>
                    <div className="flex items-center gap-3.5">
                      <Input
                        placeholder="eg. 20 Marks"
                        className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                        value={question.totalMark}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "totalMark",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-sm text-[#171717] font-medium">
                    Question <span className="text-[#335CFF]">*</span>
                  </Label>
                  <Input
                    placeholder="Explain the key difference between Animal cell and Plant cell"
                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "question", e.target.value)
                    }
                  />
                </div>
                {/* <div className="flex flex-col gap-1">
                  <Label className="text-sm text-[#171717] font-medium">
                    Answer <span className="text-[#335CFF]">*</span>
                  </Label>
                  <Input
                    placeholder="Explain the key difference between Animal cell and Plant cell"
                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                    value={question.answer}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "answer", e.target.value)
                    }
                  />
                </div> */}
                {question.question_id && (
                  <>
                    <div className="flex flex-col gap-3.5">
                      <h2 className="text-black lg:text-[15px] text-sm font-semibold">
                        Marking Criterion
                      </h2>
                      {question.criteria.map((criterion, criterionIndex) => (
                        <div
                          key={criterionIndex}
                          className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5"
                        >
                          <div className="flex flex-col gap-1">
                            <Label className="text-sm text-[#171717] font-medium">
                              Criterion{" "}
                              <span className="text-[#335CFF]">*</span>
                            </Label>
                            <Input
                              placeholder="Definition of animal cell"
                              className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                              value={criterion.criterion}
                              onChange={(e) =>
                                updateCriterion(
                                  questionIndex,
                                  criterionIndex,
                                  "criterion",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label className="text-sm text-[#171717] font-medium">
                              Mark <span className="text-[#335CFF]">*</span>
                            </Label>
                            <Input
                              placeholder="10"
                              className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                              value={criterion.mark}
                              onChange={(e) =>
                                updateCriterion(
                                  questionIndex,
                                  criterionIndex,
                                  "mark",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label className="text-sm text-[#171717] font-medium">
                              Description{" "}
                              <span className="text-[#335CFF]">*</span>
                            </Label>
                            <div className="flex items-center gap-3.5">
                              <Input
                                placeholder="Clear and Correct Definition Provided"
                                className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                                value={criterion.description}
                                onChange={(e) =>
                                  updateCriterion(
                                    questionIndex,
                                    criterionIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                              {question.criteria.length > 1 && (
                                <div
                                  className="flex justify-center items-center size-8 rounded-lg bg-[#FFE9E9] cursor-pointer"
                                  onClick={() =>
                                    handleDeleteCriterion(
                                      questionIndex,
                                      criterionIndex
                                    )
                                  }
                                >
                                  <Trash2 className="text-[#EB5D57] w-[12.44x] h-3.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        className="flex items-center gap-1 cursor-pointer text-[#335CFF] lg:text-sm text-xs font-semibold hover:opacity-85"
                        onClick={() => addCriterion(questionIndex)}
                      >
                        <Plus size={20} />
                        Add New Criterion
                      </div>
                    </div>
                    <div className="flex flex-col gap-[15px]">
                      <div className="flex gap-2.5 items-center">
                        <Switch
                          checked={question.showPenalties}
                          onCheckedChange={(checked) =>
                            updateQuestion(
                              questionIndex,
                              "showPenalties",
                              checked
                            )
                          }
                        />
                        <p className="text-black lg:text-sm text-xs font-semibold">
                          Penalties
                        </p>
                      </div>
                      {question.showPenalties && (
                        <>
                          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
                            {question.penalties.map((penalty, penaltyIndex) => (
                              <div
                                key={penaltyIndex}
                                className="flex flex-col gap-1"
                              >
                                <Label className="text-sm text-[#171717] font-medium">
                                  Penalty {penaltyIndex + 1}{" "}
                                  <span className="text-[#335CFF]">*</span>
                                </Label>
                                <div className="relative">
                                  <Input
                                    placeholder="Deduct 1 mark if no example is provided"
                                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10 mb-2"
                                    value={penalty.description}
                                    onChange={(e) =>
                                      updatePenalty(
                                        questionIndex,
                                        penaltyIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Input
                                    placeholder="Penalty mark"
                                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                                    value={penalty.mark || ""}
                                    onChange={(e) =>
                                      updatePenalty(
                                        questionIndex,
                                        penaltyIndex,
                                        "mark",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {question.penalties.length > 1 && (
                                    <Trash2
                                      className="absolute text-[#EB5D57] size-[22px] right-2.5 top-2.5 cursor-pointer"
                                      onClick={() =>
                                        handleDeletePenalty(
                                          questionIndex,
                                          penaltyIndex
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div
                            className="flex items-center gap-1 cursor-pointer text-[#335CFF] lg:text-sm text-xs font-semibold hover:opacity-85"
                            onClick={() => addPenalty(questionIndex)}
                          >
                            <Plus size={20} />
                            Add New Penalty
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-[15px]">
                      <div className="flex gap-2.5 items-center">
                        <Switch
                          checked={question.showBonuses}
                          onCheckedChange={(checked) =>
                            updateQuestion(
                              questionIndex,
                              "showBonuses",
                              checked
                            )
                          }
                        />
                        <p className="text-black lg:text-sm text-xs font-semibold">
                          Bonus
                        </p>
                      </div>
                      {question.showBonuses && (
                        <>
                          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3.5">
                            {question.bonuses.map((bonus, bonusIndex) => (
                              <div
                                key={bonusIndex}
                                className="flex flex-col gap-1"
                              >
                                <Label className="text-sm text-[#171717] font-medium">
                                  Bonus {bonusIndex + 1}{" "}
                                  <span className="text-[#335CFF]">*</span>
                                </Label>
                                <div className="relative">
                                  <Input
                                    placeholder="Add 1 mark if an example is provided"
                                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10 mb-2"
                                    value={bonus.description}
                                    onChange={(e) =>
                                      updateBonus(
                                        questionIndex,
                                        bonusIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Input
                                    placeholder="Bonus mark"
                                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                                    value={bonus.mark || ""}
                                    onChange={(e) =>
                                      updateBonus(
                                        questionIndex,
                                        bonusIndex,
                                        "mark",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {question.bonuses.length > 1 && (
                                    <Trash2
                                      className="absolute text-[#EB5D57] size-[22px] right-2.5 top-2.5 cursor-pointer"
                                      onClick={() =>
                                        handleDeleteBonus(
                                          questionIndex,
                                          bonusIndex
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div
                            className="flex items-center gap-1 cursor-pointer text-[#335CFF] lg:text-sm text-xs font-semibold hover:opacity-85"
                            onClick={() => addBonus(questionIndex)}
                          >
                            <Plus size={20} />
                            Add New Bonus
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2.5">
              <Button
                className="lg:h-10 h-8 w-fit bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-sm text-xs tracking-[1.5%] hover:text-[#F5F7FF] hover:bg-primary rounded-[10px] lg:font-semibold font-medium"
                onClick={addNewQuestion}
              >
                Add New Question
              </Button>
              <Button
                className="md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10"
                onClick={handleContinue}
              >
                {questions.length > 1 ? "Finish" : "Continue"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="shadow-md flex flex-col justify-center items-center gap-4 p-5 w-[357px]  !rounded-[20px] border-none">
          <Image
            src="/images/error-warning.svg"
            alt="warning"
            width={40}
            height={40}
          />
          <div className="flex flex-col gap-1 text-center">
            <h5 className="text-[#171717] lg:text-base text-sm font-semibold">
              Your answer may need review
            </h5>
            <p className="text-[#8C8C8C] lg:text-sm text-xs">
              It looks like there may be an issue with your answers. Kindly
              double-check
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="lg:h-10 h-8 w-fit bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-[13px] text-xs tracking-[1.5%] !hover:bg-primary hover:bg-[#f5f7ffc6] rounded-[10px] lg:font-semibold font-medium !text-[13px]">
              Continue anyway
            </Button>
            <Button className="md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 !text-[13px]">
              Review answers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CreateAssessment;
