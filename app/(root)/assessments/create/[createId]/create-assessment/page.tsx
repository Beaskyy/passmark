"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";

type Criterion = {
  criterion: string;
  mark: string;
  description: string;
};

type Penalty = {
  description: string;
};

type Bonus = {
  description: string;
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
};

const CreateAssessment = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionNumber: "",
      totalMark: "",
      question: "",
      answer: "",
      criteria: [{ criterion: "", mark: "", description: "" }],
      penalties: [{ description: "" }],
      bonuses: [{ description: "" }],
      showPenalties: false,
      showBonuses: false,
    },
  ]);

  const addNewQuestion = () => {
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
        showPenalties: false,
        showBonuses: false,
      },
    ]);
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
    value: string
  ) => {
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
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].penalties[penaltyIndex].description = value;
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
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].bonuses[bonusIndex].description = value;
    setQuestions(newQuestions);
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
        <p className="text-[#B3B3B3] lg:text-[22px] text-lg lg:font-medium">
          Type assessment name here...
        </p>
        <div className="flex gap-3.5 items-center">
          <Switch />
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
              <div className="flex flex-col gap-1">
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
              </div>
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
                        Description <span className="text-[#335CFF]">*</span>
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
                              removeCriterion(questionIndex, criterionIndex)
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
                      updateQuestion(questionIndex, "showPenalties", checked)
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
                        <div key={penaltyIndex} className="flex flex-col gap-1">
                          <Label className="text-sm text-[#171717] font-medium">
                            Penalty {penaltyIndex + 1}{" "}
                            <span className="text-[#335CFF]">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              placeholder="Deduct 1 mark if no example is provided"
                              className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                              value={penalty.description}
                              onChange={(e) =>
                                updatePenalty(
                                  questionIndex,
                                  penaltyIndex,
                                  e.target.value
                                )
                              }
                            />
                            {question.penalties.length > 1 && (
                              <Trash2
                                className="absolute text-[#EB5D57] size-[22px] right-2.5 top-2.5 cursor-pointer"
                                onClick={() =>
                                  removePenalty(questionIndex, penaltyIndex)
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
                        <div key={bonusIndex} className="flex flex-col gap-1">
                          <Label className="text-sm text-[#171717] font-medium">
                            Bonus {bonusIndex + 1}{" "}
                            <span className="text-[#335CFF]">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              placeholder="Add 1 mark if an example is provided"
                              className="shadow-sm border border-[#EBEBEB] p-2.5 pl-3 text-sm placeholder:text-[#8A8A8A] h-10"
                              value={bonus.description}
                              onChange={(e) =>
                                updateBonus(
                                  questionIndex,
                                  bonusIndex,
                                  e.target.value
                                )
                              }
                            />
                            {question.bonuses.length > 1 && (
                              <Trash2
                                className="absolute text-[#EB5D57] size-[22px] right-2.5 top-2.5 cursor-pointer"
                                onClick={() =>
                                  removeBonus(questionIndex, bonusIndex)
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
              onClick={() => setIsOpen(true)}
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
