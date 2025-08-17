# SmartBelanja - Monthly Budget Tracker

A comprehensive React web application for tracking and planning monthly spending with beautiful, mobile-responsive design.

## 🌟 Features

### 1. Budget Allocation

- **Pre-defined Categories**: Food, Utilities, Car, Personal, Entertainment
- **Custom Categories**: Add your own budget categories with custom names and amounts
- **Easy Management**: Set monthly budget amounts for each category
- **Real-time Totals**: See your total monthly budget allocation

### 2. Expense Tracking

- **Add Expenses**: Record expenses with amount, description, and category
- **Receipt Upload**: Attach receipt images (JPEG, PNG, GIF) or PDF files
- **Search & Filter**: Find expenses by description or filter by category
- **Grouped View**: Expenses organized by date for easy review
- **Real-time Statistics**: Track total expenses, number of transactions, and daily averages

### 3. Dashboard Analytics

- **Visual Charts**: Pie charts for spending distribution and bar charts for budget vs actual
- **Progress Tracking**: Visual progress bars showing budget utilization
- **Summary Cards**: Quick overview of total allocated, spent, remaining, and percentage used
- **Category Breakdown**: Detailed table showing performance for each category
- **Recent Activity**: Quick view of recent expenses

### 4. Data Export

- **Excel Export**: Professional spreadsheet with multiple sheets (Budget Summary & Detailed Expenses)
- **CSV Export**: Lightweight format compatible with Google Sheets and other tools
- **Automatic Naming**: Files named with current month and year
- **Comprehensive Data**: Includes allocated vs spent comparisons, percentages, and receipt status

### 5. Mobile-First Design

- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Touch-Friendly**: Large buttons and easy navigation on mobile devices
- **Tailwind CSS**: Modern, clean design with consistent styling
- **Mobile Navigation**: Collapsible menu for small screens

### 6. Data Persistence

- **Local Storage**: All data automatically saved to browser's local storage
- **No Server Required**: Runs entirely in the browser
- **Instant Loading**: Fast performance with local data storage

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smartbelanja-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Setting Up Your Budget

1. Navigate to **Budget Allocation**
2. Set amounts for default categories (Food, Utilities, Car, Personal, Entertainment)
3. Add custom categories by clicking "Add Category"
4. Click "Save Allocations" to store your budget

### Tracking Expenses

1. Go to **Expense Tracking**
2. Click "Add Expense"
3. Select category, enter amount and description
4. Optionally upload a receipt
5. Click "Add Expense" to save

### Viewing Your Dashboard

1. Visit the **Dashboard** to see:
   - Monthly spending overview
   - Visual charts and graphs
   - Category-wise breakdown
   - Recent expenses

### Exporting Data

1. Navigate to **Export Data**
2. Choose between Excel (.xlsx) or CSV (.csv) format
3. Click download to get your monthly report

## 🛠️ Technology Stack

- **React 19**: Modern React with hooks and context
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful charts and graphs
- **Lucide React**: Modern icon set
- **React Hot Toast**: Elegant notifications
- **XLSX**: Excel file generation
- **File Saver**: File download functionality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.js    # Main navigation component
├── context/             # React context for state management
│   └── BudgetContext.js # Budget and expense state management
├── pages/               # Main application pages
│   ├── Dashboard.js     # Analytics dashboard
│   ├── BudgetAllocation.js # Budget setup page
│   ├── ExpenseTracking.js  # Expense management page
│   └── Export.js        # Data export page
├── utils/               # Utility functions
│   └── exportUtils.js   # Export and formatting utilities
├── App.js               # Main app component with routing
└── index.js             # Application entry point
```

## 🎨 Design Features

- **Consistent Color Scheme**: Professional blue and gray palette
- **Responsive Grid**: Adapts to all screen sizes
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 💾 Data Storage

All data is stored locally in your browser using localStorage. This means:

- ✅ No account creation required
- ✅ Data persists between sessions
- ✅ Works offline
- ⚠️ Data is device-specific
- ⚠️ Clearing browser data will remove your information

## 🔧 Customization

The application is highly customizable:

- Add unlimited custom budget categories
- Modify the default categories in `BudgetContext.js`
- Adjust the color scheme in `tailwind.config.js`
- Customize export formats in `exportUtils.js`

## 📊 Export Formats

### Excel (.xlsx)

- **Budget Summary Sheet**: Category allocations, spending, and percentages
- **Detailed Expenses Sheet**: All expenses with dates, categories, and receipt status
- **Professional Formatting**: Ready for presentations and analysis

### CSV (.csv)

- **Universal Compatibility**: Works with Google Sheets, Excel, and other tools
- **Lightweight**: Smaller file size for quick sharing
- **Text-based**: Easy to parse and manipulate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Include screenshots if applicable

---

**Happy Budget Tracking! 💰**
