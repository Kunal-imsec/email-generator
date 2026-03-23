'use client';

import { useState } from 'react';
import { GeneratedEmail } from '@/types';

interface EmailOutputProps {
  email: GeneratedEmail | null;
  isLoading: boolean;
  onRegenerate: () => void;
  onEdit: (subject: string, body: string) => void;
}

export default function EmailOutput({ email, isLoading, onRegenerate, onEdit }: EmailOutputProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  const handleCopy = async () => {
    if (!email) return;
    
    const fullEmail = `Subject: ${email.subject}\n\n${email.body}`;
    await navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      onEdit(editSubject, editBody);
      setIsEditing(false);
    } else {
      setEditSubject(email?.subject || '');
      setEditBody(email?.body || '');
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg mb-4 dark:bg-gray-700"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium mb-2">No email generated yet</p>
        <p className="text-sm">Fill out the form and click generate to create your email</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Email</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleEditToggle}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={onRegenerate}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
          >
            Regenerate
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          ) : (
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {email.subject}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Body
          </label>
          {isEditing ? (
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              rows={10}
            />
          ) : (
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {email.body}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
