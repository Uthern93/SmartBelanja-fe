import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BudgetContext = createContext();

const initialState = {
  budgetCategories: [
    { id: 'food', name: 'Food', allocatedAmount: 0, isCustom: false },
    { id: 'utilities', name: 'Utilities', allocatedAmount: 0, isCustom: false },
    { id: 'car', name: 'Car', allocatedAmount: 0, isCustom: false },
    { id: 'personal', name: 'Personal', allocatedAmount: 0, isCustom: false },
    { id: 'entertainment', name: 'Entertainment', allocatedAmount: 0, isCustom: false },
  ],
  expenses: [],
  currentDate: new Date(),
};

function budgetReducer(state, action) {
  switch (action.type) {
    case 'SET_BUDGET_ALLOCATION':
      return {
        ...state,
        budgetCategories: state.budgetCategories.map(category =>
          category.id === action.payload.categoryId
            ? { ...category, allocatedAmount: action.payload.amount }
            : category
        ),
      };
    
    case 'ADD_CUSTOM_CATEGORY':
      const newCategory = {
        id: Date.now().toString(),
        name: action.payload.name,
        allocatedAmount: action.payload.amount || 0,
        isCustom: true,
      };
      return {
        ...state,
        budgetCategories: [...state.budgetCategories, newCategory],
      };
    
    case 'DELETE_CUSTOM_CATEGORY':
      return {
        ...state,
        budgetCategories: state.budgetCategories.filter(
          category => category.id !== action.payload.categoryId || !category.isCustom
        ),
        expenses: state.expenses.filter(
          expense => expense.categoryId !== action.payload.categoryId
        ),
      };
    
    case 'ADD_EXPENSE':
      const newExpense = {
        id: Date.now().toString(),
        categoryId: action.payload.categoryId,
        amount: action.payload.amount,
        description: action.payload.description,
        receipt: action.payload.receipt,
        date: action.payload.date || new Date().toISOString(),
      };
      return {
        ...state,
        expenses: [...state.expenses, newExpense],
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload.expenseId),
      };
    
    case 'LOAD_DATA':
      return action.payload;
    
    default:
      return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('budgetTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('budgetTrackerData', JSON.stringify(state));
  }, [state]);

  const setBudgetAllocation = (categoryId, amount) => {
    dispatch({ type: 'SET_BUDGET_ALLOCATION', payload: { categoryId, amount } });
  };

  const addCustomCategory = (name, amount = 0) => {
    dispatch({ type: 'ADD_CUSTOM_CATEGORY', payload: { name, amount } });
  };

  const deleteCustomCategory = (categoryId) => {
    dispatch({ type: 'DELETE_CUSTOM_CATEGORY', payload: { categoryId } });
  };

  const addExpense = (categoryId, amount, description, receipt) => {
    dispatch({ type: 'ADD_EXPENSE', payload: { categoryId, amount, description, receipt } });
  };

  const deleteExpense = (expenseId) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: { expenseId } });
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  };

  const getExpensesByCategory = (categoryId) => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    return currentMonthExpenses.filter(expense => expense.categoryId === categoryId);
  };

  const getTotalSpentByCategory = (categoryId) => {
    const categoryExpenses = getExpensesByCategory(categoryId);
    return categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalAllocated = () => {
    return state.budgetCategories.reduce((total, category) => total + category.allocatedAmount, 0);
  };

  const getTotalSpent = () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    return currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const value = {
    ...state,
    setBudgetAllocation,
    addCustomCategory,
    deleteCustomCategory,
    addExpense,
    deleteExpense,
    getCurrentMonthExpenses,
    getExpensesByCategory,
    getTotalSpentByCategory,
    getTotalAllocated,
    getTotalSpent,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
