import React, { useState } from "react";
import { ArrowLeftIcon, PlusIcon, TrashIcon, SpinnerIcon } from "./icons";
import { createIdiom } from "../services/idiomService";

interface AdminInsertProps {
  onBack: () => void;
}

const AdminInsert: React.FC<AdminInsertProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    hanzi: "",
    pinyin: "",
    type: "Thành ngữ",
    level: "Trung cấp",
    source: "",
    vietnameseMeaning: "",
    literalMeaning: "",
    figurativeMeaning: "",
    chineseDefinition: "",
    origin: "",
    grammar: "",
    imageUrl: "",
  });

  const [analysis, setAnalysis] = useState([
    { character: "", pinyin: "", meaning: "" },
  ]);
  const [examples, setExamples] = useState([
    { chinese: "", pinyin: "", vietnamese: "" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnalysisChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newAnalysis = [...analysis];
    newAnalysis[index] = { ...newAnalysis[index], [field]: value };
    setAnalysis(newAnalysis);
  };

  const handleExampleChange = (index: number, field: string, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setExamples(newExamples);
  };

  const addAnalysis = () =>
    setAnalysis([...analysis, { character: "", pinyin: "", meaning: "" }]);
  const removeAnalysis = (index: number) =>
    setAnalysis(analysis.filter((_, i) => i !== index));

  const addExample = () =>
    setExamples([...examples, { chinese: "", pinyin: "", vietnamese: "" }]);
  const removeExample = (index: number) =>
    setExamples(examples.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Filter out empty rows
      const cleanAnalysis = analysis.filter((a) => a.character.trim());
      const cleanExamples = examples.filter((e) => e.chinese.trim());

      const payload = {
        ...form,
        analysis: cleanAnalysis,
        examples: cleanExamples,
      };

      await createIdiom(payload);
      setSuccess("Đã thêm từ mới thành công!");
      // Reset form
      setForm({
        hanzi: "",
        pinyin: "",
        type: "Thành ngữ",
        level: "Trung cấp",
        source: "",
        vietnameseMeaning: "",
        literalMeaning: "",
        figurativeMeaning: "",
        chineseDefinition: "",
        origin: "",
        grammar: "",
        imageUrl: "",
      });
      setAnalysis([{ character: "", pinyin: "", meaning: "" }]);
      setExamples([{ chinese: "", pinyin: "", vietnamese: "" }]);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi lưu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pop">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="font-bold">Quay lại trang chủ</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-red-700 p-6 text-white">
          <h2 className="text-2xl font-hanzi font-bold">
            Thêm từ mới vào từ điển
          </h2>
          <p className="text-red-100 text-sm mt-1">
            Nhập thông tin chi tiết để làm giàu kho dữ liệu
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 border-b border-emerald-100 text-center font-bold">
            {success}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-100 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
              1. Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hán tự (Hanzi) *
                </label>
                <input
                  required
                  name="hanzi"
                  value={form.hanzi}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 font-hanzi text-lg"
                  placeholder="Ví dụ: 守株待兔"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pinyin *
                </label>
                <input
                  required
                  name="pinyin"
                  value={form.pinyin}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  placeholder="Ví dụ: shǒu zhū dài tù"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại từ</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg p-2">
                  <option value="Thành ngữ">Thành ngữ (Chengyu)</option>
                  <option value="Quán dụng ngữ">Quán dụng ngữ</option>
                  <option value="Tiếng lóng">Tiếng lóng (Slang)</option>
                  <option value="Từ vựng mạng">Từ vựng mạng</option>
                </select>
              </div> */}
              {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cấp độ</label>
                <select name="level" value={form.level} onChange={handleChange} className="w-full border rounded-lg p-2">
                  <option value="Sơ cấp">Sơ cấp</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Cao cấp">Cao cấp</option>
                </select>
              </div> */}
              {/* <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Nguồn (Source)</label>
                 <input name="source" value={form.source} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="VD: HSK 6, Giáo trình Hán ngữ..." />
              </div> */}
            </div>
          </div>

          {/* Ý nghĩa */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
              2. Ý nghĩa & Định nghĩa
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nghĩa tiếng Việt *
              </label>
              <input
                required
                name="vietnameseMeaning"
                value={form.vietnameseMeaning}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="Nghĩa ngắn gọn..."
              />
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nghĩa đen</label>
                <textarea name="literalMeaning" value={form.literalMeaning} onChange={handleChange} className="w-full border rounded-lg p-2 h-20" placeholder="Giải thích nghĩa đen..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nghĩa bóng / Ý nghĩa *</label>
                <textarea required name="figurativeMeaning" value={form.figurativeMeaning} onChange={handleChange} className="w-full border rounded-lg p-2 h-20" placeholder="Giải thích ý nghĩa sâu xa..." />
              </div>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Định nghĩa tiếng Trung
              </label>
              <textarea
                required
                name="chineseDefinition"
                value={form.chineseDefinition}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 h-20 font-hanzi"
                placeholder="Định nghĩa bằng tiếng Trung..."
              />
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nguồn gốc (Origin)</label>
                    <textarea name="origin" value={form.origin} onChange={handleChange} className="w-full border rounded-lg p-2 h-20" placeholder="Điển tích, nguồn gốc..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ngữ pháp (Grammar)</label>
                    <textarea name="grammar" value={form.grammar} onChange={handleChange} className="w-full border rounded-lg p-2 h-20" placeholder="Cách dùng, từ loại..." />
                </div>
             </div> */}
          </div>

          {/* Phân tích chữ */}
          {/* <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-slate-800">3. Phân tích từng chữ</h3>
              <button type="button" onClick={addAnalysis} className="text-red-600 hover:bg-red-50 p-1 rounded-full"><PlusIcon className="w-5 h-5"/></button>
            </div>
            {analysis.map((item, index) => (
              <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg">
                <input placeholder="Chữ" value={item.character} onChange={(e) => handleAnalysisChange(index, 'character', e.target.value)} className="w-16 border rounded p-2 text-center font-hanzi" />
                <input placeholder="Pinyin" value={item.pinyin} onChange={(e) => handleAnalysisChange(index, 'pinyin', e.target.value)} className="w-24 border rounded p-2" />
                <input placeholder="Nghĩa" value={item.meaning} onChange={(e) => handleAnalysisChange(index, 'meaning', e.target.value)} className="flex-1 border rounded p-2" />
                <button type="button" onClick={() => removeAnalysis(index)} className="text-slate-400 hover:text-red-500 p-2"><TrashIcon className="w-4 h-4" /></button>
              </div>
            ))}
          </div> */}

          {/* Ví dụ */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-slate-800">
                4. Ví dụ minh họa
              </h3>
              <button
                type="button"
                onClick={addExample}
                className="text-red-600 hover:bg-red-50 p-1 rounded-full"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            {examples.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 p-4 rounded-lg space-y-2 relative"
              >
                <button
                  type="button"
                  onClick={() => removeExample(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <input
                  placeholder="Câu tiếng Trung"
                  value={item.chinese}
                  onChange={(e) =>
                    handleExampleChange(index, "chinese", e.target.value)
                  }
                  className="w-full border rounded p-2 font-hanzi"
                />
                <input
                  placeholder="Pinyin câu"
                  value={item.pinyin}
                  onChange={(e) =>
                    handleExampleChange(index, "pinyin", e.target.value)
                  }
                  className="w-full border rounded p-2 text-sm text-slate-600"
                />
                <input
                  placeholder="Dịch nghĩa tiếng Việt"
                  value={item.vietnamese}
                  onChange={(e) =>
                    handleExampleChange(index, "vietnamese", e.target.value)
                  }
                  className="w-full border rounded p-2"
                />
              </div>
            ))}
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800 active:scale-95"
              }`}
            >
              {loading && <SpinnerIcon className="w-5 h-5" />}
              {loading ? "Đang lưu..." : "Lưu dữ liệu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminInsert;
