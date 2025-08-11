"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCreateQuestion } from "@/hooks/useCreateQuestion";
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
import { useFetchAssessmentDetails } from "@/hooks/useFetchAssessmentDetails";
import { useFetchQuestions } from "@/hooks/useFetchQuestions";
import { useFetchMarkingGuideList } from "@/hooks/useFetchMarkingGuideList";
import { useFetchPenaltyList } from "@/hooks/useFetchPenaltyList";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditAssessmentSkeleton from "./EditAssessmentSkeleton";

type APIResponse<T> = {
  data: T;
  message?: string;
};

type APIMarkingGuide = {
  guide_id: string;
  criteria: string;
  description: string;
  mark: number;
};

type APIPenalty = {
  penalty_id: string;
  description: string;
  mark: number;
};

type APIBonus = {
  bonus_id: string;
  description: string;
  mark: number;
};

type APIQuestion = {
  question_id: string;
  number: string;
  text: string;
  total_marks: number;
  marking_guides?: APIMarkingGuide[];
  penalties?: APIPenalty[];
  bonuses?: APIBonus[];
};

type FormattedMarkingGuide = {
  criteria: string;
  mark: string;
  description: string;
  guide_id?: string;
};

type FormattedPenalty = {
  description: string;
  mark: string;
  penalty_id?: string;
};

type FormattedBonus = {
  description: string;
  mark: string;
  bonus_id?: string;
};

type FormattedQuestion = {
  questionNumber: string;
  totalMark: string;
  question: string;
  answer: string;
  criteria: FormattedMarkingGuide[];
  penalties: FormattedPenalty[];
  bonuses: FormattedBonus[];
  showPenalties: boolean;
  showBonuses: boolean;
  question_id?: string;
  isCreated?: boolean;
};

const EditAssessment = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;
  const path = usePathname();
  const segments = path?.split("/");
  const courseId = segments?.[2] || "";
  const assessmentId = segments?.[5] || "";
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  // Fetch assessment details
  const { data: assessmentDetails, isLoading: isLoadingAssessment } =
    useFetchAssessmentDetails(assessmentId);
  const { data: questionsResponse, isLoading: isLoadingQuestions } =
    useFetchQuestions(assessmentId);

  // Fetch marking guides and penalties for each question
  const questionIds =
    (questionsResponse?.data as APIQuestion[] | undefined)?.map(
      (q) => q.question_id
    ) || [];

  const markingGuideResults = useQueries({
    queries: questionIds.map((qId: string) => ({
      queryKey: ["markingGuideList", qId],
      queryFn: async () => {
        if (!token || !orgId) return { data: [] };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/main/marking-guide/list/${qId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        return result;
      },
      enabled: !!token && !!orgId && !!qId,
    })),
  });

  const penaltyResults = useQueries({
    queries: questionIds.map((qId: string) => ({
      queryKey: ["penaltyList", qId],
      queryFn: async () => {
        if (!token || !orgId) return { data: [] };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/main/penalty/list/${qId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        return result;
      },
      enabled: !!token && !!orgId && !!qId,
    })),
  });

  // Initialize state with fetched data
  useEffect(() => {
    if (assessmentDetails?.data) {
      setDescription(assessmentDetails?.data?.description || "");
      setTitle(assessmentDetails?.data?.title || "");
    }
  }, [assessmentDetails]);

  // Initialize questions with fetched data
  useEffect(() => {
    // Check if all required data is available
    const allMarkingGuidesLoaded = markingGuideResults?.every(
      (result) => result.isSuccess
    );
    const allPenaltiesLoaded = penaltyResults?.every(
      (result) => result.isSuccess
    );

    if (
      questions.length === 0 &&
      questionsResponse?.data &&
      markingGuideResults &&
      penaltyResults &&
      markingGuideResults.length > 0 &&
      penaltyResults.length > 0 &&
      allMarkingGuidesLoaded &&
      allPenaltiesLoaded
    ) {
      const formattedQuestions = (questionsResponse.data as APIQuestion[]).map(
        (q: APIQuestion, index: number) => {
          // Check if the marking guide query result exists and has data
          const markingGuideResult = markingGuideResults[index];
          const penaltyResult = penaltyResults[index];

          const markingGuides = markingGuideResult?.data?.data || [];
          const penalties = penaltyResult?.data?.data || [];

          const formattedMarkingGuides: FormattedMarkingGuide[] =
            markingGuides.map((guide: APIMarkingGuide) => ({
              criteria: guide.criteria || "",
              mark: guide.mark.toString() || "",
              description: guide.description || "",
              guide_id: guide.guide_id,
            }));

          const formattedPenalties: FormattedPenalty[] = penalties.map(
            (penalty: APIPenalty) => ({
              description: penalty.description || "",
              mark: penalty.mark.toString() || "0",
              penalty_id: penalty.penalty_id,
            })
          ) || [
            {
              description: "",
              mark: "0",
            },
          ];

          const formattedBonuses: FormattedBonus[] = q.bonuses?.map(
            (bonus: APIBonus) => ({
              description: bonus.description || "",
              mark: bonus.mark.toString() || "0",
              bonus_id: bonus.bonus_id,
            })
          ) || [
            {
              description: "",
              mark: "0",
              bonus_id: undefined,
            },
          ];

          const defaultMarkingGuide: FormattedMarkingGuide = {
            criteria: "",
            mark: "0",
            description: "",
          };

          const defaultPenalty: FormattedPenalty = {
            description: "",
            mark: "0",
          };

          const defaultQuestion = {
            questionNumber: q.number || "",
            totalMark: q.total_marks.toString() || "",
            question: q.text || "",
            answer: "",
            criteria:
              formattedMarkingGuides.length > 0
                ? formattedMarkingGuides
                : [defaultMarkingGuide],
            penalties:
              formattedPenalties.length > 0
                ? formattedPenalties
                : [defaultPenalty],
            bonuses: formattedBonuses,
            showPenalties: penalties.length > 0,
            showBonuses: false,
            question_id: q.question_id,
            isCreated: true,
          } as FormattedQuestion;

          return defaultQuestion;
        }
      );
      setQuestions(formattedQuestions);
    }
  }, [
    questionsResponse,
    markingGuideResults,
    penaltyResults,
    questions.length,
  ]);

  const updateAssessment = useUpdateAssessment();
  const updateQuestionApi = useUpdateQuestion();
  const createQuestion = useCreateQuestion();
  const createMarkingGuide = useCreateMarkingGuide();
  const updateMarkingGuide = useUpdateMarkingGuide();
  const deleteMarkingGuide = useDeleteMarkingGuide();
  const createPenalty = useCreatePenalty();
  const updatePenaltyApi = useUpdatePenalty();
  const deletePenalty = useDeletePenalty();
  const createBonus = useCreateBonus();
  const updateBonusApi = useUpdateBonus();
  const deleteBonus = useDeleteBonus();

  const handleDescriptionBlur = async () => {
    if (!description.trim()) return;
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
  };

  const handleQuestionBlur = async (
    question: FormattedQuestion,
    index: number
  ) => {
    if (
      question.questionNumber.trim() &&
      question.totalMark &&
      question.question.trim()
    ) {
      if (!question.question_id) {
        try {
          const payload = {
            course_id: courseId,
            assessment_id: assessmentId,
            number: question.questionNumber,
            text: question.question,
            total_marks: parseFloat(question.totalMark),
            by_ai: useAI,
          };
          const response = await createQuestion.mutateAsync(payload);
          const newQuestions = [...questions];
          newQuestions[index].question_id =
            response.data?.question_id || response.question_id;
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        try {
          const payload = {
            question_id: question.question_id,
            course_id: courseId,
            assessment_id: assessmentId,
            number: question.questionNumber,
            text: question.question,
            total_marks: parseFloat(question.totalMark),
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
        criteria: [{ criteria: "", mark: "", description: "" }],
        penalties: [{ description: "", mark: "0" }],
        bonuses: [{ description: "", mark: "0" }],
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
    // Validate sums: total mark equals sum of marking criteria marks for all questions
    const hasMismatch = questions.some((q) => {
      const total = parseFloat(q.totalMark || "0");
      const sum = (q.criteria || []).reduce((acc, c) => {
        const val = parseFloat((c.mark as string) || "0");
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      return total !== sum;
    });
    const hasZeroTotal = questions.some(
      (q) => parseFloat(q.totalMark || "0") === 0
    );

    if (hasMismatch || hasZeroTotal) {
      setIsOpen(true);
    } else {
      router.push(`/my-courses/${courseId}`);
    }
  };

  const updateQuestion = <K extends keyof FormattedQuestion>(
    questionIndex: number,
    field: K,
    value: FormattedQuestion[K]
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addCriterion = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].criteria.push({
      criteria: "",
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
    field: keyof FormattedMarkingGuide,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].criteria[criterionIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addPenalty = (questionIndex: number) => {
    const newQuestions = [...questions];
    const newPenalty: FormattedPenalty = { description: "", mark: "0" };
    newQuestions[questionIndex].penalties.push(newPenalty);
    setQuestions(newQuestions);
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
    field: keyof APIPenalty,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].penalties[penaltyIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addBonus = (questionIndex: number) => {
    const newQuestions = [...questions];
    const newBonus: FormattedBonus = { description: "", mark: "0" };
    newQuestions[questionIndex].bonuses.push(newBonus);
    setQuestions(newQuestions);
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
    field: keyof FormattedBonus,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].bonuses[bonusIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleCriterionBlur = async (
    question: FormattedQuestion,
    questionIndex: number,
    criterion: FormattedQuestion["criteria"][0],
    criterionIndex: number
  ) => {
    if (
      criterion.criteria.trim() &&
      criterion.mark &&
      criterion.description.trim() &&
      question.question_id
    ) {
      if (!criterion.guide_id) {
        try {
          const payload = {
            question_id: question.question_id,
            criteria: criterion.criteria,
            description: criterion.description,
            mark: parseFloat(criterion.mark),
            by_ai: useAI,
          };
          const response = await createMarkingGuide.mutateAsync(payload);
          const newQuestions = [...questions];
          newQuestions[questionIndex].criteria[criterionIndex].guide_id =
            response.data?.guide_id || response.guide_id;
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        try {
          const payload = {
            guide_id: criterion.guide_id,
            question_id: question.question_id,
            criteria: criterion.criteria,
            description: criterion.description,
            mark: parseFloat(criterion.mark),
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
    question: FormattedQuestion,
    questionIndex: number,
    penalty: FormattedPenalty,
    penaltyIndex: number
  ) => {
    if (penalty.description.trim() && penalty.mark && question.question_id) {
      if (!penalty.penalty_id) {
        try {
          const payload = {
            question_id: question.question_id,
            description: penalty.description,
            mark: parseFloat(penalty.mark),
            by_ai: useAI,
          };
          const response = await createPenalty.mutateAsync(payload);
          const newQuestions = [...questions];
          if (newQuestions[questionIndex].penalties[penaltyIndex]) {
            newQuestions[questionIndex].penalties[penaltyIndex].penalty_id =
              response.data?.penalty_id || response.penalty_id;
            setQuestions(newQuestions);
          }
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        try {
          const payload = {
            penalty_id: penalty.penalty_id,
            question_id: question.question_id,
            description: penalty.description,
            mark: parseFloat(penalty.mark),
            by_ai: useAI,
          };
          await updatePenaltyApi.mutateAsync(payload);
        } catch (error) {
          // Optionally show error toast
        }
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
    question: FormattedQuestion,
    questionIndex: number,
    bonus: FormattedQuestion["bonuses"][0],
    bonusIndex: number
  ) => {
    if (bonus.description.trim() && bonus.mark && question.question_id) {
      if (!bonus.bonus_id) {
        try {
          const payload = {
            question_id: question.question_id,
            description: bonus.description,
            mark: parseFloat(bonus.mark),
            by_ai: useAI,
          };
          const response = await createBonus.mutateAsync(payload);
          const newQuestions = [...questions];
          newQuestions[questionIndex].bonuses[bonusIndex].bonus_id =
            response.data?.bonus_id || response.bonus_id;
          setQuestions(newQuestions);
        } catch (error) {
          // Optionally show error toast
        }
      } else {
        try {
          const payload = {
            bonus_id: bonus.bonus_id,
            question_id: question.question_id,
            description: bonus.description,
            mark: parseFloat(bonus.mark),
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

  // Show skeleton while loading
  const markingGuidesLoading = markingGuideResults?.some(
    (result) => result.isLoading
  );
  const penaltiesLoading = penaltyResults?.some((result) => result.isLoading);

  if (
    assessmentDetails?.isLoading ||
    questionsResponse?.isLoading ||
    markingGuidesLoading ||
    penaltiesLoading
  ) {
    return <EditAssessmentSkeleton />;
  }

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
            Edit Assessment
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-11 mt-7">
        <Input
          ref={descriptionInputRef}
          className="placeholder:text-[#B3B3B3] min-h-[22px] text-black text-[22px] lg:font-medium !border-none !shadow-none"
          placeholder="Type assessment name here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
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
                    onBlur={() => handleQuestionBlur(question, questionIndex)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-sm text-[#171717] font-medium">
                    Total Mark <span className="text-[#335CFF]">*</span>
                  </Label>
                  <Input
                    placeholder="eg. 20 Marks"
                    className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                    value={question.totalMark}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "totalMark", e.target.value)
                    }
                    onBlur={() => handleQuestionBlur(question, questionIndex)}
                  />
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
                  onBlur={() => handleQuestionBlur(question, questionIndex)}
                />
              </div>
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
                            Criterion <span className="text-[#335CFF]">*</span>
                          </Label>
                          <Input
                            placeholder="Definition of animal cell"
                            className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                            value={criterion.criteria}
                            onChange={(e) =>
                              updateCriterion(
                                questionIndex,
                                criterionIndex,
                                "criteria",
                                e.target.value
                              )
                            }
                            onBlur={() =>
                              handleCriterionBlur(
                                question,
                                questionIndex,
                                criterion,
                                criterionIndex
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
                            onBlur={() =>
                              handleCriterionBlur(
                                question,
                                questionIndex,
                                criterion,
                                criterionIndex
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
                              onBlur={() =>
                                handleCriterionBlur(
                                  question,
                                  questionIndex,
                                  criterion,
                                  criterionIndex
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
                                  onBlur={() =>
                                    handlePenaltyBlur(
                                      question,
                                      questionIndex,
                                      penalty,
                                      penaltyIndex
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
                                  onBlur={() =>
                                    handlePenaltyBlur(
                                      question,
                                      questionIndex,
                                      penalty,
                                      penaltyIndex
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
                          updateQuestion(questionIndex, "showBonuses", checked)
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
                                  onBlur={() =>
                                    handleBonusBlur(
                                      question,
                                      questionIndex,
                                      bonus,
                                      bonusIndex
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
                                  onBlur={() =>
                                    handleBonusBlur(
                                      question,
                                      questionIndex,
                                      bonus,
                                      bonusIndex
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
              disabled={createQuestion.isPending || updateQuestionApi.isPending}
              onClick={handleContinue}
            >
              {questions.length > 1 ? "Finish" : "Continue"}
            </Button>
          </div>
        </div>
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
              It looks like there may be an issue with your questions. Kindly
              double-check
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push(`/my-courses/${courseId}`)}
              className="lg:h-10 h-8 w-fit bg-[#F5F7FF] border border-[#F0F3FF] text-[#335CFF] lg:text-[13px] text-xs tracking-[1.5%] !hover:bg-primary hover:bg-[#f5f7ffc6] rounded-[10px] lg:font-semibold font-medium !text-[13px]"
            >
              Continue anyway
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="md:text-[13px] text-xs rounded-[10px] py-2.5 px-6 bg-gradient-to-t from-[#0089FF] to-[#0068FF] max-h-10 !text-[13px]"
            >
              Review answers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default EditAssessment;
