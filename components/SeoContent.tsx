import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SeoContent: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Bitcoin DCA?",
      answer: "DCA (dollar cost averaging) in Bitcoin means buying a small, fixed amount of Bitcoin on a regular schedule, like every week or month, no matter what the price is. Instead of trying to guess the best time to buy, you spread your purchases over time. This helps reduce stress and smooth out the price you pay as Bitcoin goes up and down."
    },
    {
      question: "How does a Bitcoin DCA calculator work?",
      answer: "A Bitcoin DCA calculator shows what could happen if you invest a fixed amount into Bitcoin over time. You enter how much you invest, how often, and for how long. The calculator then estimates how much Bitcoin you might accumulate and what it could be worth in the future, helping you understand the long term impact of consistent investing."
    },
    {
      question: "Why do people use DCA instead of lump-sum investing?",
      answer: "Many people use DCA because it removes the pressure of trying to buy at the perfect time. Instead of putting all your money in at once, you invest gradually and reduce the risk of buying right before a price drop. Over time, this steady approach makes it easier to stay consistent without constantly watching the market."
    }
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 mt-16 mb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Bitcoin Dollar Cost Averaging (DCA) Explained
        </h2>
        <p className="text-lg text-slate-600 font-medium">
          Understanding the strategy behind consistent bitcoin accumulation.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl bg-white overflow-hidden transition-all duration-200 ${
              openIndex === index ? 'border-beaver-red shadow-md' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <h3>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <span className={`text-lg font-bold transition-colors ${
                  openIndex === index ? 'text-beaver-red' : 'text-slate-900 group-hover:text-slate-700'
                }`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-beaver-red flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                )}
              </button>
            </h3>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeoContent;