'use client';

import { useState, useEffect } from 'react';
import { EmailForm, GeneratedEmail } from '@/types';
import EmailFormComponent from '@/components/EmailForm';
import EmailOutput from '@/components/EmailOutput';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<GeneratedEmail | null>(null);
  const [lastFormData, setLastFormData] = useState<EmailForm | null>(null);
  const [history, setHistory] = useState<GeneratedEmail[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('emailHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (email: GeneratedEmail) => {
    const newHistory = [email, ...history.slice(0, 4)];
    setHistory(newHistory);
    localStorage.setItem('emailHistory', JSON.stringify(newHistory));
  };

  const handleGenerate = async (formData: EmailForm) => {
    setIsLoading(true);
    setLastFormData(formData);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate email');
      }

      const newEmail: GeneratedEmail = {
        subject: data.subject,
        body: data.body,
        timestamp: Date.now(),
        purpose: formData.purpose
      };

      setCurrentEmail(newEmail);
      saveToHistory(newEmail);

    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const handleEdit = (subject: string, body: string) => {
    if (currentEmail) {
      const updatedEmail = { ...currentEmail, subject, body };
      setCurrentEmail(updatedEmail);
      saveToHistory(updatedEmail);
    }
  };

  const loadFromHistory = (email: GeneratedEmail) => {
    setCurrentEmail(email);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Email Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate professional emails with AI-powered assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Email Details
              </h2>
              <EmailFormComponent onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent History
                  </h3>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {showHistory ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showHistory && (
                  <div className="space-y-2">
                    {history.map((email, index) => (
                      <button
                        key={email.timestamp}
                        onClick={() => loadFromHistory(email)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {email.subject}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {email.purpose} • {new Date(email.timestamp).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <EmailOutput
                email={currentEmail}
                isLoading={isLoading}
                onRegenerate={handleRegenerate}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
