import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (budgetCategories, expenses) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = new Date().toLocaleString('default', { month: 'long' });
  
  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Create budget summary data
  const budgetSummary = budgetCategories.map(category => {
    const categoryExpenses = currentMonthExpenses.filter(expense => expense.categoryId === category.id);
    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = category.allocatedAmount - totalSpent;
    
    return {
      'Category': category.name,
      'Allocated Budget': category.allocatedAmount,
      'Total Spent': totalSpent,
      'Remaining': remaining,
      'Percentage Used': category.allocatedAmount > 0 ? ((totalSpent / category.allocatedAmount) * 100).toFixed(1) + '%' : '0%'
    };
  });

  // Create detailed expenses data
  const detailedExpenses = currentMonthExpenses.map(expense => {
    const category = budgetCategories.find(cat => cat.id === expense.categoryId);
    return {
      'Date': new Date(expense.date).toLocaleDateString(),
      'Category': category ? category.name : 'Unknown',
      'Description': expense.description,
      'Amount': expense.amount,
      'Receipt': expense.receipt ? 'Yes' : 'No'
    };
  });

  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Add budget summary sheet
  const summarySheet = XLSX.utils.json_to_sheet(budgetSummary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Budget Summary');
  
  // Add detailed expenses sheet
  const expensesSheet = XLSX.utils.json_to_sheet(detailedExpenses);
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Detailed Expenses');
  
  // Save file
  const fileName = `Budget_Tracker_${monthName}_${currentYear}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToCSV = (budgetCategories, expenses) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = new Date().toLocaleString('default', { month: 'long' });
  
  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Create CSV content
  let csvContent = `Budget Tracker - ${monthName} ${currentYear}\n\n`;
  
  // Budget Summary
  csvContent += 'BUDGET SUMMARY\n';
  csvContent += 'Category,Allocated Budget,Total Spent,Remaining,Percentage Used\n';
  
  budgetCategories.forEach(category => {
    const categoryExpenses = currentMonthExpenses.filter(expense => expense.categoryId === category.id);
    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = category.allocatedAmount - totalSpent;
    const percentageUsed = category.allocatedAmount > 0 ? ((totalSpent / category.allocatedAmount) * 100).toFixed(1) : '0';
    
    csvContent += `${category.name},${category.allocatedAmount},${totalSpent},${remaining},${percentageUsed}%\n`;
  });
  
  csvContent += '\n\nDETAILED EXPENSES\n';
  csvContent += 'Date,Category,Description,Amount,Receipt\n';
  
  currentMonthExpenses.forEach(expense => {
    const category = budgetCategories.find(cat => cat.id === expense.categoryId);
    const date = new Date(expense.date).toLocaleDateString();
    const hasReceipt = expense.receipt ? 'Yes' : 'No';
    
    csvContent += `${date},${category ? category.name : 'Unknown'},"${expense.description}",${expense.amount},${hasReceipt}\n`;
  });
  
  // Save file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const fileName = `Budget_Tracker_${monthName}_${currentYear}.csv`;
  saveAs(blob, fileName);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
