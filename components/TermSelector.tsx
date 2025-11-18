import React from 'react';

type ThemeColor = 'sky' | 'emerald';

interface TermSelectorProps {
  terms: number[];
  selectedTerm: number;
  onSelectTerm: (term: number) => void;
  isTermDisabled?: (term: number) => boolean;
  themeColor: ThemeColor;
}

export const TermSelector: React.FC<TermSelectorProps> = ({ terms, selectedTerm, onSelectTerm, isTermDisabled, themeColor }) => {
  
  const selectedClasses = themeColor === 'sky' 
    ? 'bg-sky-500 text-white shadow-lg' 
    : 'bg-emerald-500 text-white shadow-lg';
  
  const ringClasses = themeColor === 'sky'
    ? 'focus:ring-sky-500'
    : 'focus:ring-emerald-500';

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {terms.map((term) => {
        const isSelected = term === selectedTerm;
        const isDisabled = isTermDisabled ? isTermDisabled(term) : false;

        return (
          <button
            key={term}
            onClick={() => onSelectTerm(term)}
            disabled={isDisabled}
            className={`
              px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${ringClasses}
              ${isSelected
                ? selectedClasses
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {term} meses
          </button>
        );
      })}
    </div>
  );
};