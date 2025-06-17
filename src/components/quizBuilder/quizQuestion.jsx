import React from 'react';
import WysiwygInput from '../form/wysiwygInput';
import TextInput from '../form/textInput';
import SelectOption from '../form/selectOption';
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

  return (
    <div className="p-3 border rounded-md flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Quiz {index + 1}</h3>
        <button
          type="button"
          className="flex items-center p-1 px-2 gap-1 rounded-md bg-error-600 hover:bg-error-700 text-white-100"
          onClick={onDelete}
        >
          <Icon type="trash" className="w-5 h-5" />
          Quiz
        </button>
      </div>
      <WysiwygInput
        label={`Pertanyaan`}
        value={data.question}
        onChange={(e) => updateField('question', e.target.value)}
        placeholder="Masukkan pertanyaan"
      />
      {data.options.map((opt, idx) => (
        <TextInput
          key={idx}
          label={`Pilihan ${idx + 1}`}
          value={opt}
          onChange={(e) => updateOption(idx, e.target.value)}
          placeholder={`Masukkan pilihan ${idx + 1}`}
        />
      ))}
      <SelectOption
        label="Jawaban Benar"
        name={`correctAnswer-${index}`}
        value={data.correctAnswer}
        onChange={(e) => updateField('correctAnswer', e.target.value)}
        options={data.options.map((opt, idx) => ({
          value: opt,
          label: `Pilihan ${idx + 1}`,
        }))}
        placeholder="Pilih jawaban benar"
      />
    </div>
  );
}
