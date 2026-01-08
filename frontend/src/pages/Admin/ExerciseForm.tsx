import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  ArrowLeftIcon,
  SaveIcon,
  TypeIcon,
  LayersIcon,
  HelpCircleIcon,
  TrashIcon,
  PlusIcon,
  Loader2 as SpinnerIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createExercise,
  fetchAdminExerciseById,
  updateExercise,
} from "@/services/api/exerciseService";
import { Exercise, ExerciseType } from "@/types";
import { toast } from "@/libs/Toast";
import FormSelect from "@/components/common/FormSelect";

// Sub-components
import MultipleChoiceForm from "@/components/admin/ExerciseForm/MultipleChoiceForm";
import MatchingForm from "@/components/admin/ExerciseForm/MatchingForm";
import FillBlanksForm from "@/components/admin/ExerciseForm/FillBlanksForm";
import { useFormContext } from "react-hook-form";

const QuestionCard: React.FC<{ index: number; remove: any }> = ({
  index,
  remove,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const type = watch(`questions.${index}.type`);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative animate-pop">
      <div className="flex justify-between items-start mb-6 border-b border-slate-50 pb-4">
        <div className="flex gap-4 flex-1">
          <div className="w-1/2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Loại câu hỏi
            </label>
            <FormSelect
              value={type}
              onChange={(val) => {
                setValue(`questions.${index}.type`, val);
              }}
              options={[
                {
                  value: ExerciseType.MULTIPLE_CHOICE,
                  label: "Trắc nghiệm ABCD",
                },
                { value: ExerciseType.MATCHING, label: "Nối cặp" },
                {
                  value: ExerciseType.FILL_BLANKS,
                  label: "Điền vào chỗ trống",
                },
              ]}
              className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl font-bold text-sm"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Điểm
            </label>
            <input
              type="number"
              {...register(`questions.${index}.points`, {
                valueAsNumber: true,
              })}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 font-bold text-center text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 h-fit">
            Câu {index + 1}
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
            title="Xóa câu hỏi này"
          >
            <TrashIcon size={18} />
          </button>
        </div>
      </div>

      {type === ExerciseType.MULTIPLE_CHOICE && (
        <MultipleChoiceForm prefix={`questions.${index}.content`} />
      )}
      {type === ExerciseType.MATCHING && (
        <MatchingForm prefix={`questions.${index}.content`} />
      )}
      {type === ExerciseType.FILL_BLANKS && (
        <FillBlanksForm prefix={`questions.${index}.content`} />
      )}
    </div>
  );
};

const ExerciseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const methods = useForm<Partial<Exercise>>({
    defaultValues: {
      difficulty: "easy",
      questions: [
        {
          type: ExerciseType.MULTIPLE_CHOICE,
          points: 10,
          content: {
            question: "",
            options: [
              { id: "A", text: "" },
              { id: "B", text: "" },
              { id: "C", text: "" },
              { id: "D", text: "" },
            ],
            correctOptionId: "A",
            pairs: [{ left: "", right: "" }],
            text: "",
            wordBank: [],
            correctAnswers: [],
          },
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = methods;

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions" as any,
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      void (async () => {
        try {
          const data = await fetchAdminExerciseById(id);
          // Auto-migrate on frontend if backend returned content but no questions (just in case)
          if (!data.questions || data.questions.length === 0) {
            if (data.content) {
              data.questions = [
                {
                  content: data.content,
                  type: data.type,
                  points: data.points || 10,
                } as any,
              ];
            } else {
              data.questions = [
                {
                  content: {},
                  type: ExerciseType.MULTIPLE_CHOICE,
                  points: 10,
                } as any,
              ];
            }
          }
          reset(data);
        } catch (err) {
          toast.error("Không thể tải thông tin bài tập");
          navigate("/admin/exercises");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, reset, navigate]);

  const onBack = () => {
    navigate("/admin/exercises");
  };

  const onSubmit = async (data: Partial<Exercise>) => {
    try {
      const questions = data.questions || [];
      const processedQuestions = questions.map((q: any) => {
        const rawContent = q.content || {};
        const finalContent: any = {};
        const qType = q.type || ExerciseType.MULTIPLE_CHOICE;

        if (qType === ExerciseType.MULTIPLE_CHOICE) {
          finalContent.question = rawContent.question;
          finalContent.options = (rawContent.options || []).map(
            (opt: any, idx: number) => ({
              ...opt,
              id: String.fromCharCode(65 + idx),
            })
          );
          finalContent.correctOptionId = rawContent.correctOptionId;
        } else if (qType === ExerciseType.MATCHING) {
          finalContent.pairs = rawContent.pairs;
        } else if (qType === ExerciseType.FILL_BLANKS) {
          finalContent.text = rawContent.text;
          finalContent.wordBank = rawContent.wordBank;
          finalContent.correctAnswers = rawContent.correctAnswers;
        }

        return {
          ...q,
          type: qType,
          content: finalContent,
        };
      });

      const payload = { ...data, questions: processedQuestions };

      // Sync top-level metadata from questions for backward compatibility
      if (processedQuestions.length > 0) {
        // Use the first question's type as the "main" type
        (payload as any).type =
          processedQuestions[0].type || ExerciseType.MULTIPLE_CHOICE;
        // Sum points
        (payload as any).points = processedQuestions.reduce(
          (acc: number, q: any) => acc + (Number(q.points) || 0),
          0
        );
      } else {
        (payload as any).type = ExerciseType.MULTIPLE_CHOICE;
        (payload as any).points = 0;
      }

      // Remove legacy props from payload parent
      delete (payload as any).content;

      if (isEdit) {
        await updateExercise(id, payload);
        toast.success("Đã cập nhật bài tập");
      } else {
        await createExercise(payload);
        toast.success("Đã tạo bài tập mới");
      }
      navigate("/admin/exercises");
    } catch (err) {
      toast.error("Lỗi khi lưu bài tập");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin text-red-600">
          <LayersIcon size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                className="p-2 -ml-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
              >
                <ArrowLeftIcon size={20} />
              </button>
              <h1 className="text-xl font-bold text-slate-800">
                {isEdit ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* General Info */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <TypeIcon size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Thông tin chung
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Tên bài tập
                    </label>
                    <input
                      {...register("title", { required: "Vui lòng nhập tên" })}
                      className={`w-full px-4 py-3 bg-slate-50 border ${
                        errors.title ? "border-red-300" : "border-slate-200"
                      } rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-medium`}
                      placeholder="Nhập tiêu đề hấp dẫn cho bài tập..."
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1 font-bold">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Mô tả
                    </label>
                    <textarea
                      {...register("description")}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-medium"
                      placeholder="Mô tả ngắn gọn về mục tiêu bài tập này..."
                    />
                  </div>

                  {/* <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Độ khó
                    </label>
                    <FormSelect
                      value={watch("difficulty")}
                      onChange={(val) => setValue("difficulty", val as any)}
                      options={[
                        { value: "easy", label: "Dễ" },
                        { value: "medium", label: "Trung bình" },
                        { value: "hard", label: "Khó" },
                      ]}
                      className="w-full h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold uppercase tracking-tighter"
                    />
                  </div> */}
                </div>
              </section>

              {/* Questions List */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircleIcon className="text-purple-600" size={24} />
                    Danh sách câu hỏi ({questionFields.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      appendQuestion({
                        type: ExerciseType.MULTIPLE_CHOICE,
                        points: 10,
                        content: {
                          question: "",
                          options: [
                            { id: "A", text: "" },
                            { id: "B", text: "" },
                            { id: "C", text: "" },
                            { id: "D", text: "" },
                          ],
                          correctOptionId: "A",
                          pairs: [],
                          text: "",
                          wordBank: [],
                          correctAnswers: [],
                        },
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-all text-sm"
                  >
                    <PlusIcon size={16} /> Thêm câu hỏi
                  </button>
                </div>

                {questionFields.map((field, index) => (
                  <QuestionCard
                    key={field.id}
                    index={index}
                    remove={removeQuestion}
                  />
                ))}

                {questionFields.length === 0 && (
                  <div className="text-center py-10 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">
                      Chưa có câu hỏi nào
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        appendQuestion({
                          content: {},
                          type: ExerciseType.MULTIPLE_CHOICE,
                          points: 10,
                        } as any)
                      }
                      className="mt-3 text-purple-600 font-bold hover:underline"
                    >
                      Thêm câu hỏi đầu tiên
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="flex-none bg-white border-t border-slate-200 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 transition-all">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-wrap-reverse sm:flex-nowrap justify-end items-center gap-3 sm:gap-4">
              {isEdit && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 sm:flex-none px-8 py-3.5 font-black text-slate-400 hover:text-red-600 transition-all text-[10px] sm:text-xs uppercase tracking-[0.2em] outline-none"
                >
                  Hủy bỏ
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 bg-red-700 text-white rounded-2xl font-black shadow-2xl shadow-red-200 hover:bg-red-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 text-xs sm:text-sm uppercase tracking-widest"
              >
                {loading ? (
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <SaveIcon size={18} />
                    <span>Lưu bài tập</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ExerciseForm;
