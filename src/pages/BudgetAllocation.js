import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/exportUtils';
import { Plus, Trash2, Save, DollarSign } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function BudgetAllocation() {
  const { 
    budgetCategories, 
    setBudgetAllocation, 
    addCustomCategory, 
    deleteCustomCategory,
    getTotalAllocated 
  } = useBudget();

  const [allocations, setAllocations] = useState(
    budgetCategories.reduce((acc, category) => {
      acc[category.id] = category.allocatedAmount;
      return acc;
    }, {})
  );

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAllocationChange = (categoryId, amount) => {
    const numAmount = parseFloat(amount) || 0;
    setAllocations(prev => ({
      ...prev,
      [categoryId]: numAmount
    }));
  };

  const handleSaveAllocations = () => {
    Object.entries(allocations).forEach(([categoryId, amount]) => {
      setBudgetAllocation(categoryId, amount);
    });
    toast.success('Budget allocations saved successfully!');
  };

  const handleAddCustomCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const amount = parseFloat(newCategoryAmount) || 0;
    addCustomCategory(newCategoryName.trim(), amount);
    
    // Update local allocations state
    const newId = Date.now().toString();
    setAllocations(prev => ({
      ...prev,
      [newId]: amount
    }));

    setNewCategoryName('');
    setNewCategoryAmount('');
    setShowAddCategory(false);
    toast.success('Custom category added successfully!');
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all associated expenses.')) {
      deleteCustomCategory(categoryId);
      setAllocations(prev => {
        const newAllocations = { ...prev };
        delete newAllocations[categoryId];
        return newAllocations;
      });
      toast.success('Category deleted successfully!');
    }
  };

  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Allocation</h1>
          <p className="text-gray-600">Set your monthly budget for each category</p>
        </div>

        {/* Total Budget Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Total Monthly Budget</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(totalAllocated)}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Budget Categories</h2>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Add New Category Form */}
          {showAddCategory && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add Custom Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Hobbies, Education"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Budget Amount
                  </label>
                  <input
                    type="number"
                    value={newCategoryAmount}
                    onChange={(e) => setNewCategoryAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={handleAddCustomCategory}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategoryName('');
                      setNewCategoryAmount('');
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="space-y-4">
            {budgetCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    {category.isCustom && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={allocations[category.id] || ''}
                        onChange={(e) => handleAllocationChange(category.id, e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {category.isCustom && (
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveAllocations}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="h-4 w-4" />
              <span>Save Allocations</span>
            </button>
          </div>
        </div>

        {/* Budget Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Budget Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Review and adjust your budget monthly based on spending patterns</li>
            <li>• Start with conservative estimates and increase gradually</li>
            <li>• Consider seasonal expenses when setting annual budgets</li>
            <li>• Leave some buffer for unexpected expenses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
