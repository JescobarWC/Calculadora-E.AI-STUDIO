import React, { useState, useMemo, useEffect } from 'react';
import { TERMS, WARRANTY_PRICES } from '../constants';
import { Coefficients } from '../types';
import { TermSelector } from './TermSelector';

type ThemeColor = 'sky' | 'emerald';

interface CalculatorCardProps {
  title: string;
  interestRate: string;
  coefficients: Coefficients;
  themeColor: ThemeColor;
}

const themeClasses: Record<ThemeColor, Record<string, string>> = {
  sky: {
    border: 'border-sky-500',
    text: 'text-sky-600',
    bg: 'bg-sky-500',
    ring: 'focus:ring-sky-500',
    hoverShadow: 'hover:shadow-sky-500/10',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
  },
  emerald: {
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    bg: 'bg-emerald-500',
    ring: 'focus:ring-emerald-500',
    hoverShadow: 'hover:shadow-emerald-500/10',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
};

const EuroIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const WarningIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


const MONTHS = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
];

const YEARS = Array.from({ length: 2025 - 2012 + 1 }, (_, i) => 2025 - i);

type WarrantyType = 'premium' | 'gran_ocasion';

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, interestRate, coefficients, themeColor }) => {
  const [amount, setAmount] = useState<string>('10000');
  const [term, setTerm] = useState<number>(TERMS[0]);
  const [registrationYear, setRegistrationYear] = useState<number>(YEARS[0]);
  const [registrationMonth, setRegistrationMonth] = useState<number>(MONTHS[0].value);
  const [includeWarranty, setIncludeWarranty] = useState<boolean>(false);
  const [warrantyType, setWarrantyType] = useState<WarrantyType>('premium');
  const [warrantyDuration, setWarrantyDuration] = useState<number>(1);
  const [is4x4, setIs4x4] = useState<boolean>(false);

  const currentTheme = themeClasses[themeColor];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  const warrantyCost = useMemo(() => {
    if (!includeWarranty) return 0;
    const prices = is4x4 ? WARRANTY_PRICES[warrantyType].suv : WARRANTY_PRICES[warrantyType].standard;
    return prices[warrantyDuration as keyof typeof prices] || 0;
  }, [includeWarranty, warrantyType, warrantyDuration, is4x4]);
  
  const monthlyPayment = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return 0;
    const totalAmount = numericAmount + warrantyCost;
    return totalAmount * coefficients[term];
  }, [amount, term, coefficients, warrantyCost]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  
  const vehicleAgeInMonths = useMemo(() => {
    const currentDate = new Date();
    return Math.max(0, (currentDate.getFullYear() - registrationYear) * 12 + (currentDate.getMonth() + 1 - registrationMonth));
  }, [registrationYear, registrationMonth]);

  const isTermDisabled = useMemo(() => (term: number): boolean => {
    // La única regla para deshabilitar es si el vehículo + plazo supera los 180 meses.
    return vehicleAgeInMonths + term > 180;
  }, [vehicleAgeInMonths]);

  // El aviso se muestra si se eligen 120 meses y el vehículo tiene 24 meses o más.
  const showWarning = term === 120 && vehicleAgeInMonths >= 24;

  useEffect(() => {
    if (isTermDisabled(term)) {
      const firstAvailableTerm = TERMS.find(t => !isTermDisabled(t));
      if (firstAvailableTerm) setTerm(firstAvailableTerm);
    }
  }, [vehicleAgeInMonths, term, isTermDisabled]);
  
  useEffect(() => {
    if (warrantyType === 'gran_ocasion' && warrantyDuration > 2) setWarrantyDuration(1);
  }, [warrantyType, warrantyDuration]);
  
  const warrantyDurationOptions = warrantyType === 'premium' ? [1, 2, 3] : [1, 2];

  return (
    <div className={`bg-white rounded-2xl shadow-xl border-t-4 ${currentTheme.border} p-6 sm:p-8 transition-all duration-300 ${currentTheme.hoverShadow} hover:shadow-2xl hover:-translate-y-1`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <span className={`${currentTheme.badgeBg} ${currentTheme.badgeText} text-sm font-semibold px-3 py-1 rounded-full`}>{interestRate}</span>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor={`amount-${title}`} className="block text-sm font-medium text-slate-600 mb-2">Importe a Financiar</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EuroIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input type="text" id={`amount-${title}`} value={amount} onChange={handleAmountChange} placeholder="Ej: 15000"
              className={`w-full bg-slate-100 border border-slate-300 rounded-lg py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${currentTheme.ring} transition`} />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Fecha de Matriculación</label>
            <div className="grid grid-cols-2 gap-4">
                <select value={registrationMonth} onChange={(e) => setRegistrationMonth(parseInt(e.target.value))} aria-label="Mes de matriculación" className={`w-full bg-slate-100 border border-slate-300 rounded-lg py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${currentTheme.ring} transition`}>
                    {MONTHS.map(month => (<option key={month.value} value={month.value}>{month.label}</option>))}
                </select>
                <select value={registrationYear} onChange={(e) => setRegistrationYear(parseInt(e.target.value))} aria-label="Año de matriculación" className={`w-full bg-slate-100 border border-slate-300 rounded-lg py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${currentTheme.ring} transition`}>
                    {YEARS.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
            </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200/80">
            <div className="flex justify-between items-center">
                <label htmlFor={`warranty-toggle-${title}`} className="text-sm font-medium text-slate-700">Añadir Garantía Extendida</label>
                <button role="switch" aria-checked={includeWarranty} onClick={() => setIncludeWarranty(!includeWarranty)} id={`warranty-toggle-${title}`} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeWarranty ? currentTheme.bg : 'bg-slate-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${includeWarranty ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
            </div>

            {includeWarranty && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Garantía</label>
                        <div className="flex w-full bg-slate-200/70 border border-slate-300/70 rounded-lg p-1">
                            <button onClick={() => setWarrantyType('premium')} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${warrantyType === 'premium' ? `${currentTheme.bg} text-white font-semibold shadow` : 'text-slate-700 hover:bg-slate-200'}`}>Premium</button>
                            <button onClick={() => setWarrantyType('gran_ocasion')} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${warrantyType === 'gran_ocasion' ? `${currentTheme.bg} text-white font-semibold shadow` : 'text-slate-700 hover:bg-slate-200'}`}>Gran Ocasión</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Duración Garantía</label>
                        <div className="grid grid-cols-3 gap-2">
                            {warrantyDurationOptions.map(duration => (
                                <button key={duration} onClick={() => setWarrantyDuration(duration)} className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${warrantyDuration === duration ? `${currentTheme.bg} text-white shadow-lg` : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                                    {duration} año{duration > 1 ? 's' : ''}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <label htmlFor={`is4x4-toggle-${title}`} className="text-sm font-medium text-slate-700">4x4 / &gt;2000cc</label>
                        <button role="switch" aria-checked={is4x4} onClick={() => setIs4x4(!is4x4)} id={`is4x4-toggle-${title}`} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${is4x4 ? currentTheme.bg : 'bg-slate-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${is4x4 ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                </div>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Plazo (en meses)</label>
            <TermSelector terms={TERMS} selectedTerm={term} onSelectTerm={setTerm} isTermDisabled={isTermDisabled} themeColor={themeColor} />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-slate-500 text-center text-lg">Cuota mensual estimada</p>
        <p className={`text-4xl sm:text-5xl font-bold text-center mt-2 tracking-tight ${currentTheme.text}`}>
          {formatCurrency(monthlyPayment)}
        </p>
        {showWarning && (
            <div className="mt-4 p-3 bg-amber-100 border-l-4 border-amber-500 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <WarningIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-amber-800">
                            Revisar con el departamento de financiación
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};