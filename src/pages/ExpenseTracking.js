import React, { useState, useRef } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency, formatDate } from '../utils/exportUtils';
import { Plus, Upload, Trash2, Search, Filter, Receipt, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ExpenseTracking() {
  const { 
    budgetCategories, 
    addExpense, 
    deleteExpense, 
    getCurrentMonthExpenses,
    getTotalSpentByCategory 
  } = useBudget();

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const fileInputRef = useRef(null);

  const expenses = getCurrentMonthExpenses();

  const handleAddExpense = () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    let receiptData = null;
    if (receiptFile) {
      receiptData = {
        name: receiptFile.name,
        size: receiptFile.size,
        type: receiptFile.type,
        lastModified: receiptFile.lastModified,
      };
    }

    addExpense(selectedCategory, parseFloat(amount), description.trim(), receiptData);
    
    // Reset form
    setSelectedCategory('');
    setAmount('');
    setDescription('');
    setReceiptFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAddExpense(false);
    
    toast.success('Expense added successfully!');
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
      toast.success('Expense deleted successfully!');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only images (JPEG, PNG, GIF) and PDF files are allowed');
        return;
      }
      
      setReceiptFile(file);
    }
  };

  // Filter expenses based on search and category filter
  const filteredExpenses = expenses.filter(expense => {
    const category = budgetCategories.find(cat => cat.id === expense.categoryId);
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || expense.categoryId === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group expenses by date
  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const date = new Date(expense.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracking</h1>
          <p className="text-gray-600">{currentMonth}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Number of Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average per Day</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(expenses.length > 0 ? 
                    expenses.reduce((sum, exp) => sum + exp.amount, 0) / new Date().getDate() : 0
                  )}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {budgetCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add Expense Button */}
            <button
              onClick={() => setShowAddExpense(!showAddExpense)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Add Expense Form */}
          {showAddExpense && (
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {budgetCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Grocery shopping"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{receiptFile ? receiptFile.name : 'Upload Receipt'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddExpense(false);
                    setSelectedCategory('');
                    setAmount('');
                    setDescription('');
                    setReceiptFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Expenses List */}
        <div className="space-y-6">
          {Object.keys(groupedExpenses).length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600 mb-4">Start tracking your expenses by adding your first expense.</p>
              <button
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Expense</span>
              </button>
            </div>
          ) : (
            Object.entries(groupedExpenses).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, dayExpenses]) => (
              <div key={date} className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{formatDate(date)}</h3>
                  <p className="text-sm text-gray-600">
                    {dayExpenses.length} expense{dayExpenses.length !== 1 ? 's' : ''} • {formatCurrency(dayExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {dayExpenses.map(expense => {
                    const category = budgetCategories.find(cat => cat.id === expense.categoryId);
                    return (
                      <div key={expense.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium text-gray-900">{expense.description}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{category?.name || 'Unknown Category'}</span>
                                {expense.receipt && (
                                  <span className="inline-flex items-center space-x-1 text-green-600">
                                    <Receipt className="h-3 w-3" />
                                    <span>Receipt</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-lg text-gray-900">
                            {formatCurrency(expense.amount)}
                          </span>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
