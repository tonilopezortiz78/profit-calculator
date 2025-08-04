# Trading Profit Calculator - Excel Import

A powerful web-based profit calculator that imports Excel trading files, allows row selection of buy transactions, and calculates average buy price and potential profits in USDT.

## ✨ Features

### **Excel File Import**
- **Drag & Drop**: Simply drag your Excel (.xlsx, .xls) or CSV trading files onto the interface
- **File Parsing**: Automatically reads and displays your trading data in a table format
- **Smart Detection**: Recognizes buy/sell transactions and highlights them with different colors

### **Row Selection & Filtering** 
- **Buy Transaction Focus**: Only buy transactions can be selected for profit calculations
- **Checkbox Selection**: Select individual rows or use "Select All Buys" for convenience
- **Visual Selection**: Selected rows are highlighted for easy identification
- **Selection Counter**: Shows how many transactions are currently selected

### **Advanced Calculations**
- **Weighted Average**: Calculates true weighted average buy price based on selected transactions
- **Multi-Asset Support**: Handles different trading pairs (SOL_USDT, BTC_USDT, XMR_USDT, etc.)
- **Real-time Updates**: Calculations update instantly as you select/deselect rows
- **Profit Analysis**: Shows total investment, potential return, profit/loss in USDT, and gain percentage

### **Dual Mode Support**
- **Excel Mode**: Import and analyze your trading files (default)
- **Manual Mode**: Traditional manual entry for quick calculations
- **Easy Switching**: Toggle between modes with one click

### **Professional Interface**
- **Modern Design**: Clean, professional UI with glassmorphism effects
- **Color Coding**: Green for buy transactions, red for sell transactions
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Smart Formatting**: Automatic number formatting for prices and percentages

## How to Use

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open Your Browser**:
   Navigate to `http://localhost:3000`

4. **Import Your Trading Data**:
   - **Drag & Drop**: Drag your Excel trading file directly onto the drop zone
   - **Or Browse**: Click "choose file" to select your trading file
   - **Supported Formats**: .xlsx, .xls, and .csv files

5. **Select Buy Transactions**:
   - **Automatic Filtering**: Only buy transactions will have selectable checkboxes
   - **Individual Selection**: Check specific transactions you want to include
   - **Bulk Selection**: Use "Select All Buys" to select all buy transactions at once
   - **Visual Feedback**: Selected rows are highlighted in blue

6. **Set Sell Price**:
   - **Planned Sell Price**: Enter your target sell price in USDT
   - **Real-time Updates**: Results update instantly as you type

7. **Analyze Results**:
   - **Average Buy Price**: Weighted average based on selected transactions
   - **Total Quantity**: Sum of quantities from selected buy orders
   - **Total Investment**: Total USDT invested in selected transactions
   - **Total Return**: Expected return at your target sell price
   - **Profit/Loss**: Net profit or loss in USDT
   - **Gain Percentage**: Percentage return on your investment

## 📊 Example with Real Trading Data

**Selected Buy Transactions**:
- SOL at $157.1 USDT × 7.07 quantity = $1,110.60
- SOL at $158.1 USDT × 4.764 quantity = $753.18
- SOL at $162.1 USDT × 6.83 quantity = $1,107.14

**Results**:
- **Average Buy Price**: $159.27 USDT
- **Total Quantity**: 18.664 SOL
- **Total Investment**: $2,970.92 USDT
- **Target Sell Price**: $180.00 USDT
- **Expected Return**: $3,359.52 USDT
- **Profit**: +$388.60 USDT (13.08% gain)

## Technologies Used

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Modern gradient design with glassmorphism effects

## File Structure

```
profit_calculator/
├── package.json
├── src/
│   ├── server.js
│   └── public/
│       ├── index.html
│       ├── styles.css
│       └── calculator.js
└── README.md
``` 