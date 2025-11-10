import React, { useState } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown, Eye, CheckCircle } from 'lucide-react';
import { useFAQ } from '../context/FAQContext';
import { toast } from 'react-hot-toast';

const FAQAccordion = ({ faqs, showFeedback = true, showViews = false }) => {
  const {
    registerView,
    markAsHelpful,
    markAsNotHelpful,
    hasVoted,
    getUserVote,
  } = useFAQ();

  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
      registerView(id);
    }
  };

  const handleHelpful = (e, faqId) => {
    e.stopPropagation();
    const success = markAsHelpful(faqId);
    if (success) {
      toast.success('Obrigado pelo feedback! 👍');
    } else {
      toast.error('Você já avaliou esta pergunta');
    }
  };

  const handleNotHelpful = (e, faqId) => {
    e.stopPropagation();
    const success = markAsNotHelpful(faqId);
    if (success) {
      toast.success('Obrigado pelo feedback!');
    } else {
      toast.error('Você já avaliou esta pergunta');
    }
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma pergunta encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        const userVote = getUserVote(faq.id);
        const voted = hasVoted(faq.id);

        return (
          <div
            key={faq.id}
            className={`bg-white rounded-xl border-2 transition-all ${
              isOpen
                ? 'border-dark-900 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex-1 pr-4">
                <h3
                  className={`font-semibold transition-colors ${
                    isOpen ? 'text-dark-900' : 'text-gray-900'
                  }`}
                >
                  {faq.question}
                </h3>
                {showViews && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {faq.views} visualizações
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {faq.helpful} úteis
                    </span>
                  </div>
                )}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Answer */}
            {isOpen && (
              <div className="px-6 pb-4 border-t border-gray-100">
                <div className="pt-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>

                  {/* Tags */}
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {faq.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-3">
                        Esta resposta foi útil?
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleHelpful(e, faq.id)}
                          disabled={voted}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            userVote === 'helpful'
                              ? 'bg-green-500 text-white'
                              : voted
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                          }`}
                        >
                          {userVote === 'helpful' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <ThumbsUp className="w-4 h-4" />
                          )}
                          Sim ({faq.helpful})
                        </button>
                        <button
                          onClick={(e) => handleNotHelpful(e, faq.id)}
                          disabled={voted}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            userVote === 'not_helpful'
                              ? 'bg-red-500 text-white'
                              : voted
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          {userVote === 'not_helpful' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <ThumbsDown className="w-4 h-4" />
                          )}
                          Não ({faq.notHelpful})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
