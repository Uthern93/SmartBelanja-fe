import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BudgetProvider } from './context/BudgetContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import BudgetAllocation from './pages/BudgetAllocation';
import ExpenseTracking from './pages/ExpenseTracking';
import Export from './pages/Export';

function App() {
  return (
    <BudgetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/budget" element={<BudgetAllocation />} />
              <Route path="/expenses" element={<ExpenseTracking />} />
              <Route path="/export" element={<Export />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BudgetProvider>
  );
}

export default App;
