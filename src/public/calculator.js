document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileSelectBtn = document.getElementById('fileSelectBtn');
    const manualModeBtn = document.getElementById('manualModeBtn');
    const manualSection = document.getElementById('manualSection');
    const excelSection = document.getElementById('excelSection');
    const fileName = document.getElementById('fileName');
    
    // Manual entry elements
    const addRowBtn = document.getElementById('addRowBtn');
    const purchasesTableBody = document.getElementById('purchasesTableBody');
    const emptyTableMessage = document.getElementById('emptyTableMessage');
    
    // Excel table elements
    const excelTable = document.getElementById('excelTable');
    const excelTableHead = document.getElementById('excelTableHead');
    const excelTableBody = document.getElementById('excelTableBody');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    const selectedCount = document.getElementById('selectedCount');
    
    // Results elements
    const sellPriceInput = document.getElementById('sellPrice');
    const avgBuyPriceEl = document.getElementById('avgBuyPrice');
    const totalQuantityEl = document.getElementById('totalQuantity');
    const totalInvestmentEl = document.getElementById('totalInvestment');
    const totalReturnEl = document.getElementById('totalReturn');
    const profitLossEl = document.getElementById('profitLoss');
    const gainPercentageEl = document.getElementById('gainPercentage');

    // State
    let currentMode = 'excel'; // 'excel' or 'manual'
    let rowIdCounter = 0;
    let excelData = [];
    let selectedRows = new Set();

    // Utility Functions
    function formatNumber(num) {
        return parseFloat(num).toFixed(5);
    }

    function formatCurrency(num) {
        return parseFloat(num).toFixed(2);
    }

    function formatPercentage(num) {
        return parseFloat(num).toFixed(2) + '%';
    }

    function showSection(section) {
        manualSection.style.display = section === 'manual' ? 'block' : 'none';
        excelSection.style.display = section === 'excel' ? 'block' : 'none';
        currentMode = section;
        
        if (section === 'manual') {
            manualModeBtn.textContent = 'Excel Import Mode';
            manualModeBtn.classList.add('active');
        } else {
            manualModeBtn.textContent = 'Manual Entry Mode';
            manualModeBtn.classList.remove('active');
        }
    }

    // File Upload Functions
    function handleFile(file) {
        if (!file) return;
        
        fileName.textContent = `(${file.name})`;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    alert('The file appears to be empty or in an unsupported format.');
                    return;
                }
                
                excelData = jsonData;
                displayExcelData(jsonData);
                showSection('excel');
                
            } catch (error) {
                alert('Error reading file: ' + error.message);
                console.error('File parsing error:', error);
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    function displayExcelData(data) {
        if (data.length === 0) return;
        
        // Clear previous data
        excelTableHead.innerHTML = '';
        excelTableBody.innerHTML = '';
        selectedRows.clear();
        
        // Hide empty state
        const emptyState = document.getElementById('emptyTableState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Get headers from first row
        const headers = Object.keys(data[0]);
        
        // Create header row
        const headerRow = document.createElement('tr');
        
        // Add checkbox column
        const checkboxHeader = document.createElement('th');
        checkboxHeader.innerHTML = '<input type="checkbox" id="selectAllCheckbox">';
        checkboxHeader.className = 'checkbox-cell';
        checkboxHeader.style.position = 'sticky';
        checkboxHeader.style.left = '0';
        checkboxHeader.style.zIndex = '11';
        checkboxHeader.style.backgroundColor = '#e3f2fd';
        headerRow.appendChild(checkboxHeader);
        
        // Add data headers
        headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            
            // Make important columns more visible
            if (header.toLowerCase().includes('price') || 
                header.toLowerCase().includes('amount') || 
                header.toLowerCase().includes('quantity') ||
                header.toLowerCase().includes('side')) {
                th.style.backgroundColor = '#fff3e0';
                th.style.fontWeight = '700';
            }
            
            headerRow.appendChild(th);
        });
        
        excelTableHead.appendChild(headerRow);
        
        // Create data rows
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-row-index', index);
            
            // Determine if this is a buy or sell transaction
            const side = row.Side || row.side || '';
            const isBuy = side.toLowerCase() === 'buy';
            const isSell = side.toLowerCase() === 'sell';
            
            if (isBuy) {
                tr.classList.add('buy-row');
            } else if (isSell) {
                tr.classList.add('sell-row');
            }
            
            // Add checkbox cell (only enable for Buy transactions)
            const checkboxCell = document.createElement('td');
            checkboxCell.className = 'checkbox-cell';
            checkboxCell.style.position = 'sticky';
            checkboxCell.style.left = '0';
            checkboxCell.style.zIndex = '10';
            checkboxCell.style.backgroundColor = isBuy ? '#f8fff9' : (isSell ? '#fff5f5' : '#fff');
            
            if (isBuy) {
                checkboxCell.innerHTML = `<input type="checkbox" class="row-checkbox" data-row-index="${index}">`;
            } else {
                checkboxCell.innerHTML = '—';
            }
            tr.appendChild(checkboxCell);
            
            // Add data cells
            headers.forEach(header => {
                const td = document.createElement('td');
                let value = row[header] || '';
                
                // Format specific columns
                if (header.toLowerCase().includes('side')) {
                    td.className = isBuy ? 'side-buy' : (isSell ? 'side-sell' : '');
                    td.style.fontWeight = '600';
                }
                
                // Highlight important data columns
                if (header.toLowerCase().includes('price') || 
                    header.toLowerCase().includes('amount') || 
                    header.toLowerCase().includes('quantity')) {
                    td.style.backgroundColor = '#fafafa';
                    td.style.fontWeight = '500';
                }
                
                // Format numbers for better readability
                if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        // Format based on column type
                        if (header.toLowerCase().includes('price')) {
                            td.textContent = numValue.toFixed(5);
                        } else if (header.toLowerCase().includes('amount') || header.toLowerCase().includes('quantity')) {
                            td.textContent = numValue.toFixed(6);
                        } else if (header.toLowerCase().includes('total')) {
                            td.textContent = numValue.toFixed(2);
                        } else {
                            td.textContent = value;
                        }
                    } else {
                        td.textContent = value;
                    }
                } else {
                    td.textContent = value;
                }
                
                tr.appendChild(td);
            });
            
            excelTableBody.appendChild(tr);
        });
        
        // Add event listeners
        document.getElementById('selectAllCheckbox').addEventListener('change', handleSelectAll);
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', handleRowSelection);
        });
        
        updateSelectedCount();
    }

    // Excel Data Functions
    function handleSelectAll(e) {
        const isChecked = e.target.checked;
        const buyCheckboxes = document.querySelectorAll('.row-checkbox');
        
        buyCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            const rowIndex = parseInt(checkbox.getAttribute('data-row-index'));
            
            if (isChecked) {
                selectedRows.add(rowIndex);
                checkbox.closest('tr').classList.add('selected');
            } else {
                selectedRows.delete(rowIndex);
                checkbox.closest('tr').classList.remove('selected');
            }
        });
        
        updateSelectedCount();
        updateSummary();
        calculateResults();
    }

    function handleRowSelection(e) {
        const checkbox = e.target;
        const rowIndex = parseInt(checkbox.getAttribute('data-row-index'));
        const row = checkbox.closest('tr');
        
        if (checkbox.checked) {
            selectedRows.add(rowIndex);
            row.classList.add('selected');
        } else {
            selectedRows.delete(rowIndex);
            row.classList.remove('selected');
        }
        
        updateSelectedCount();
        updateSummary();
        calculateResults();
    }

    function updateSelectedCount() {
        selectedCount.textContent = `${selectedRows.size} selected`;
    }

    function getSelectedPurchases() {
        if (currentMode === 'manual') {
            return getManualPurchases();
        } else {
            return getExcelPurchases();
        }
    }

    function getExcelPurchases() {
        const purchases = [];
        
        selectedRows.forEach(rowIndex => {
            const rowData = excelData[rowIndex];
            if (!rowData) return;
            
            // Try different possible column names for price and quantity
            const price = parseFloat(
                rowData['Filled Price'] || 
                rowData['Price'] || 
                rowData['price'] || 
                rowData['filled_price'] || 
                0
            );
            
            const quantity = parseFloat(
                rowData['Executed Amount'] || 
                rowData['Amount'] || 
                rowData['Quantity'] || 
                rowData['quantity'] || 
                rowData['executed_amount'] || 
                0
            );
            
            if (price > 0 && quantity > 0) {
                purchases.push({
                    price: price,
                    quantity: quantity,
                    total: price * quantity
                });
            }
        });
        
        return purchases;
    }

    function getManualPurchases() {
        const rows = purchasesTableBody.querySelectorAll('tr');
        const purchases = [];
        
        rows.forEach(row => {
            const priceInput = row.querySelector('.price-input');
            const quantityInput = row.querySelector('.quantity-input');
            
            const price = parseFloat(priceInput.value) || 0;
            const quantity = parseFloat(quantityInput.value) || 0;
            
            if (price > 0 && quantity > 0) {
                purchases.push({
                    price: price,
                    quantity: quantity,
                    total: price * quantity
                });
            }
        });
        
        return purchases;
    }

    // Manual Entry Functions (keep existing functionality)
    function addTableRow() {
        const rowId = ++rowIdCounter;
        const row = document.createElement('tr');
        row.setAttribute('data-row-id', rowId);
        
        row.innerHTML = `
            <td>
                <input type="number" class="table-input price-input" step="0.00001" placeholder="0.00000" data-row-id="${rowId}">
            </td>
            <td>
                <input type="number" class="table-input quantity-input" step="0.00001" placeholder="0.00000" data-row-id="${rowId}">
            </td>
            <td class="total-cell">
                <span class="total-value" data-row-id="${rowId}">0.00</span>
            </td>
            <td>
                <button class="remove-btn" onclick="removeTableRow(${rowId})">Remove</button>
            </td>
        `;
        
        purchasesTableBody.appendChild(row);
        updateTableVisibility();
        
        const priceInput = row.querySelector('.price-input');
        priceInput.focus();
        
        const priceInputEl = row.querySelector('.price-input');
        const quantityInputEl = row.querySelector('.quantity-input');
        
        priceInputEl.addEventListener('input', () => updateRowTotal(rowId));
        quantityInputEl.addEventListener('input', () => updateRowTotal(rowId));
        
        priceInputEl.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                quantityInputEl.focus();
            }
        });
        
        quantityInputEl.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTableRow();
            }
        });
    }

    function removeTableRow(rowId) {
        const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
        if (row) {
            row.remove();
            updateTableVisibility();
            updateSummary();
            calculateResults();
        }
    }

    function updateRowTotal(rowId) {
        const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
        if (!row) return;
        
        const priceInput = row.querySelector('.price-input');
        const quantityInput = row.querySelector('.quantity-input');
        const totalSpan = row.querySelector('.total-value');
        
        const price = parseFloat(priceInput.value) || 0;
        const quantity = parseFloat(quantityInput.value) || 0;
        const total = price * quantity;
        
        totalSpan.textContent = formatCurrency(total);
        
        updateSummary();
        calculateResults();
    }

    function updateTableVisibility() {
        const hasRows = purchasesTableBody.children.length > 0;
        emptyTableMessage.style.display = hasRows ? 'none' : 'block';
    }

    // Calculation Functions
    function updateSummary() {
        const purchases = getSelectedPurchases();
        const summarySection = document.querySelector('.summary-section');
        
        if (purchases.length === 0) {
            summarySection.style.display = 'none';
            return;
        }

        summarySection.style.display = 'block';
        const totalInvestment = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
        const totalQuantity = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
        const avgBuyPrice = totalInvestment / totalQuantity;

        avgBuyPriceEl.textContent = formatNumber(avgBuyPrice) + ' USDT';
        totalQuantityEl.textContent = formatNumber(totalQuantity);
        totalInvestmentEl.textContent = formatCurrency(totalInvestment) + ' USDT';
    }

    function calculateResults() {
        const purchases = getSelectedPurchases();
        const sellPrice = parseFloat(sellPriceInput.value) || 0;
        const resultsSection = document.querySelector('.results-section');
        
        if (purchases.length === 0 && sellPrice <= 0) {
            resultsSection.style.display = 'none';
            return;
        }
        
        resultsSection.style.display = 'block';
        
        if (purchases.length === 0 || sellPrice <= 0) {
            totalReturnEl.textContent = '—';
            profitLossEl.textContent = '—';
            gainPercentageEl.textContent = '—';
            
            profitLossEl.className = 'result-value';
            gainPercentageEl.className = 'result-value';
            return;
        }

        const totalInvestment = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
        const totalQuantity = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
        const totalReturn = sellPrice * totalQuantity;
        const profitLoss = totalReturn - totalInvestment;
        const gainPercentage = (profitLoss / totalInvestment) * 100;

        totalReturnEl.textContent = formatCurrency(totalReturn) + ' USDT';
        profitLossEl.textContent = (profitLoss >= 0 ? '+' : '') + formatCurrency(profitLoss) + ' USDT';
        gainPercentageEl.textContent = (gainPercentage >= 0 ? '+' : '') + formatPercentage(gainPercentage);

        profitLossEl.className = 'result-value';
        gainPercentageEl.className = 'result-value';
        
        if (profitLoss > 0) {
            profitLossEl.classList.add('profit');
            gainPercentageEl.classList.add('profit');
        } else if (profitLoss < 0) {
            profitLossEl.classList.add('loss');
            gainPercentageEl.classList.add('loss');
        }
    }
    
    function hideEmptyResults() {
        const summarySection = document.querySelector('.summary-section');
        const resultsSection = document.querySelector('.results-section');
        summarySection.style.display = 'none';
        resultsSection.style.display = 'none';
    }

    // Event Listeners
    
    // File upload events
    dropZone.addEventListener('click', () => fileInput.click());
    fileSelectBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    
    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });
    
    // Mode toggle
    manualModeBtn.addEventListener('click', () => {
        showSection(currentMode === 'manual' ? 'excel' : 'manual');
    });
    
    // Excel table controls
    selectAllBtn.addEventListener('click', () => {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.dispatchEvent(new Event('change'));
        }
    });
    
    clearSelectionBtn.addEventListener('click', () => {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.dispatchEvent(new Event('change'));
        }
    });
    
    // Manual entry events
    addRowBtn.addEventListener('click', addTableRow);
    
    // Calculation events
    sellPriceInput.addEventListener('input', calculateResults);
    sellPriceInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateResults();
        }
    });

    // Global functions for onclick handlers
    window.removeTableRow = removeTableRow;

    // Initialize
    showSection('excel');
    updateSummary();
    calculateResults();
    
    // Show the excel section immediately so users can see the interface
    excelSection.style.display = 'block';
}); 