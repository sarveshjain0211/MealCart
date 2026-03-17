import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AIAssistant from '../sections/AIAssistant';

const FloatingAIButton = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-50 flex items-center justify-center text-white transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl group"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
        </button>
      )}

      {/* AI Assistant Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 overflow-hidden md:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* AI Assistant Panel */}
          <div 
            className="relative w-full md:w-[500px] lg:w-[600px] h-[600px] md:h-[700px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">AI Cooking Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 transition-colors rounded-lg hover:bg-white/20"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* AI Assistant Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <AIAssistant isEmbedded={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIButton;
