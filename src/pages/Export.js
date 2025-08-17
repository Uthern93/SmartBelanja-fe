import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { exportToExcel, exportToCSV, formatCurrency } from '../utils/exportUtils';
import { Download, FileSpreadsheet, FileText, Calendar, BarChart3 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Export() {
  const { budgetCategories, expenses, getCurrentMonthExpenses, getTotalAllocated, getTotalSpent } = useBudget();
  const [isExporting, setIsExporting] = useState(false);

  const currentMonthExpenses = getCurrentMonthExpenses();
  const totalAllocated = getTotalAllocated();
  const totalSpent = getTotalSpent();
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(budgetCategories, expenses);
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel file');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      await exportToCSV(budgetCategories, expenses);
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV file');
    } finally {
      setIsExporting(false);
    }
  };

  const getDataSummary = () => {
    const summary = {
      totalCategories: budgetCategories.length,
      customCategories: budgetCategories.filter(cat => cat.isCustom).length,
      totalExpenses: currentMonthExpenses.length,
      expensesWithReceipts: currentMonthExpenses.filter(exp => exp.receipt).length,
      oldestExpense: currentMonthExpenses.length > 0 ? 
        new Date(Math.min(...currentMonthExpenses.map(exp => new Date(exp.date)))).toLocaleDateString() : 'N/A',
      newestExpense: currentMonthExpenses.length > 0 ? 
        new Date(Math.max(...currentMonthExpenses.map(exp => new Date(exp.date)))).toLocaleDateString() : 'N/A',
    };
    return summary;
  };

  const summary = getDataSummary();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Data</h1>
          <p className="text-gray-600">Download your budget and expense data</p>
        </div>

        {/* Current Month Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {currentMonth} Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAllocated)}</p>
              <p className="text-sm text-gray-600">Total Allocated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${totalAllocated - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalAllocated - totalSpent)}
              </p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Data Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Categories:</span>
                <span className="font-medium">{summary.totalCategories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Custom Categories:</span>
                <span className="font-medium">{summary.customCategories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses (This Month):</span>
                <span className="font-medium">{summary.totalExpenses}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Expenses with Receipts:</span>
                <span className="font-medium">{summary.expensesWithReceipts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date Range:</span>
                <span className="font-medium text-sm">
                  {summary.oldestExpense} - {summary.newestExpense}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Excel Export */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Excel (.xlsx)</h3>
                  <p className="text-sm text-gray-600">Full-featured spreadsheet with multiple sheets</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Budget summary with allocated vs spent</li>
                  <li>• Detailed expense list with categories</li>
                  <li>• Percentage calculations</li>
                  <li>• Receipt status indicators</li>
                  <li>• Professional formatting</li>
                </ul>
              </div>
              
              <button
                onClick={handleExportExcel}
                disabled={isExporting || currentMonthExpenses.length === 0}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Excel</span>
                  </>
                )}
              </button>
            </div>

            {/* CSV Export */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">CSV (.csv)</h3>
                  <p className="text-sm text-gray-600">Lightweight format compatible with most apps</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Budget summary section</li>
                  <li>• Detailed expense list</li>
                  <li>• Compatible with Google Sheets</li>
                  <li>• Easy to import into other tools</li>
                  <li>• Smaller file size</li>
                </ul>
              </div>
              
              <button
                onClick={handleExportCSV}
                disabled={isExporting || currentMonthExpenses.length === 0}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* No Data Message */}
        {currentMonthExpenses.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-yellow-800">No data to export</h3>
                <p className="text-yellow-700">
                  You need to add some expenses for the current month before you can export data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Export Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Export Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Exports include data for the current month only</li>
            <li>• Excel format is best for detailed analysis and charts</li>
            <li>• CSV format works great with Google Sheets and other spreadsheet apps</li>
            <li>• Files are automatically named with the current month and year</li>
            <li>• Both formats include budget vs actual spending comparisons</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
