import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  ArrowLeftIcon,
  SaveIcon,
  TypeIcon,
  LayersIcon,
  HelpCircleIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createExercise,
  fetchExerciseById,
  updateExercise,
} from "@/services/api/exerciseService";
import { Exercise, ExerciseType } from "@/types";
import { toast } from "@/libs/Toast";
import FormSelect from "@/components/common/FormSelect";

// Sub-components
import MultipleChoiceForm from "@/components/admin/ExerciseForm/MultipleChoiceForm";
import MatchingForm from "@/components/admin/ExerciseForm/MatchingForm";
import FillBlanksForm from "@/components/admin/ExerciseForm/FillBlanksForm";
import { PlusIcon, SpinnerIcon } from "@/components/common/icons";

const ExerciseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const methods = useForm<Partial<Exercise>>({
    defaultValues: {
      type: ExerciseType.MULTIPLE_CHOICE,
      difficulty: "easy",
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
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const selectedType = watch("type");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      void (async () => {
        try {
          const data = await fetchExerciseById(id);
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
      // Clean up content based on type before saving
      const finalContent: any = {};
      if (data.type === ExerciseType.MULTIPLE_CHOICE) {
        finalContent.question = data.content.question;
        finalContent.options = data.content.options.map(
          (opt: any, idx: number) => ({
            ...opt,
            id: String.fromCharCode(65 + idx),
          })
        );
        finalContent.correctOptionId = data.content.correctOptionId;
      } else if (data.type === ExerciseType.MATCHING) {
        finalContent.pairs = data.content.pairs;
      } else if (data.type === ExerciseType.FILL_BLANKS) {
        finalContent.text = data.content.text;
        finalContent.wordBank = data.content.wordBank;
        finalContent.correctAnswers = data.content.correctAnswers;
      }

      const payload = { ...data, content: finalContent };

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

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Dạng bài tập
                    </label>
                    <FormSelect
                      value={selectedType}
                      onChange={(val) => {
                        setValue("type", val as ExerciseType);
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
                      className="w-full h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
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
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Điểm
                      </label>
                      <input
                        type="number"
                        {...register("points")}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-100 font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Question Content */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <HelpCircleIcon size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Nội dung câu hỏi
                  </h2>
                </div>

                {selectedType === ExerciseType.MULTIPLE_CHOICE && (
                  <MultipleChoiceForm />
                )}
                {selectedType === ExerciseType.MATCHING && <MatchingForm />}
                {selectedType === ExerciseType.FILL_BLANKS && (
                  <FillBlanksForm />
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
