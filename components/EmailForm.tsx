'use client';

import { useState } from 'react';
import { type EmailForm, EmailPurpose, EmailTone, EmailLength } from '@/types';
import ToneSelector from './ToneSelector';

interface EmailFormProps {
  onSubmit: (data: EmailForm) => void;
  isLoading: boolean;
}

const purposes: EmailPurpose[] = [
  'Cold Outreach',
  'Follow-up', 
  'Apology',
  'Job Application',
  'Networking',
  'Thank You',
  'Sales Pitch'
];

const lengths: EmailLength[] = ['Short', 'Medium', 'Long'];

export default function EmailForm({ onSubmit, isLoading }: EmailFormProps) {
  const [formData, setFormData] = useState<EmailForm>({
    recipientName: '',
    recipientRole: '',
    purpose: 'Cold Outreach',
    senderName: '',
    keyPoints: '',
    tone: 'Friendly',
    length: 'Medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof EmailForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recipient Name
        </label>
        <input
          type="text"
          value={formData.recipientName}
          onChange={(e) => updateField('recipientName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recipient Role / Company
        </label>
        <input
          type="text"
          value={formData.recipientRole}
          onChange={(e) => updateField('recipientRole', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Marketing Manager at Acme Corp"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Purpose
        </label>
        <select
          value={formData.purpose}
          onChange={(e) => updateField('purpose', e.target.value as EmailPurpose)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {purposes.map(purpose => (
            <option key={purpose} value={purpose}>{purpose}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={formData.senderName}
          onChange={(e) => updateField('senderName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Jane Smith"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Key Points to Include
        </label>
        <div className="relative">
          <textarea
            value={formData.keyPoints}
            onChange={(e) => updateField('keyPoints', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            rows={4}
            placeholder="• Main point 1&#10;• Main point 2&#10;• Main point 3"
            required
          />
          <span className="absolute bottom-2 right-2 text-xs text-gray-500">
            {formData.keyPoints.length} chars
          </span>
        </div>
      </div>

      <ToneSelector
        selectedTone={formData.tone}
        onToneChange={(tone) => updateField('tone', tone)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Length
        </label>
        <div className="grid grid-cols-3 gap-2">
          {lengths.map(length => (
            <button
              key={length}
              type="button"
              onClick={() => updateField('length', length)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                formData.length === length
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {length}
              <span className="block text-xs opacity-75">
                {length === 'Short' ? '~100w' : length === 'Medium' ? '~200w' : '~350w'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Email'
        )}
      </button>
    </form>
  );
}
