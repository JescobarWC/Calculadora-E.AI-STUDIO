import React from 'react';
import { CalculatorCard } from './components/CalculatorCard';
import { CONTADO_COEFFICIENTS, FINANCIADO_COEFFICIENTS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent sm:text-6xl">
            Calculadora E.AI Studio
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Calculadora de Financiación de Vehículos
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <CalculatorCard
            title="Precio Contado"
            interestRate="4,99% T.I.N."
            coefficients={CONTADO_COEFFICIENTS}
            themeColor="sky"
          />
          <CalculatorCard
            title="Precio Financiado"
            interestRate="9,99% T.I.N."
            coefficients={FINANCIADO_COEFFICIENTS}
            themeColor="emerald"
          />
        </main>
        
        <footer className="text-center mt-16 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} E.AI Studio. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;