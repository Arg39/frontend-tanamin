import React from 'react';
import WysiwygInput from '../form/wysiwygInput';
import TextInput from '../form/textInput';
import Icon from '../icons/icon';

export default function QuizQuestion({ index, data, onChange, onDelete }) {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const updateOption = (idx, value) => {
    const updatedOptions = [...data.options];
    updatedOptions[idx] = value;
    onChange({ ...data, options: updatedOptions });
  };

  const handleCorrectAnswerChange = (idx) => {
    updateField('correctAnswer', idx);
  };

  return (
    <div className="p-4 border rounded-lg flex flex-col gap-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-primary-700">Quiz {index + 1}</h3>
        <button
          type="button"
          className="flex items-center p-1 px-2 gap-1 rounded-md bg-error-600 hover:bg-error-700 text-white transition"
          onClick={onDelete}
        >
          <Icon type="trash" className="w-5 h-5" />
          <span className="hidden sm:inline">Hapus</span>
        </button>
      </div>
      <div className="mb-2">
        <WysiwygInput
          label="Pertanyaan"
          value={data.question}
          onChange={(e) => updateField('question', e.target.value)}
          placeholder="Masukkan pertanyaan"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium text-gray-700">
          <p>
            Opsi Jawaban
            <span className="text-error-600"> (*pilih untuk jawaban yang benar)</span>
          </p>
        </div>
        {data.options.map((opt, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-2 rounded-md border transition ${
              data.correctAnswer === idx
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`correctAnswer-${index}`}
              checked={data.correctAnswer === idx}
              onChange={() => handleCorrectAnswerChange(idx)}
              className="accent-primary-600 w-5 h-5 cursor-pointer flex-shrink-0"
              aria-label={`Pilih jawaban benar untuk pilihan ${idx + 1}`}
            />
            <div className="flex-1">
              {data.correctAnswer === idx && (
                <span className="text-xs text-primary-600 font-semibold whitespace-nowrap">
                  Jawaban Benar
                </span>
              )}
              <TextInput
                label={null}
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Masukkan pilihan ${idx + 1}`}
                className="w-full min-w-[200px] md:min-w-[400px] px-3 py-2 text-base"
                inputClassName="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
