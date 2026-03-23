'use client';

import { EmailTone } from '@/types';

interface ToneSelectorProps {
  selectedTone: EmailTone;
  onToneChange: (tone: EmailTone) => void;
}

const tones: EmailTone[] = ['Formal', 'Friendly', 'Persuasive', 'Casual', 'Assertive'];

export default function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tone
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tones.map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => onToneChange(tone)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTone === tone
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
}
