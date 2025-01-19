import { leagueDictionary, urlDictionary, globalState } from './config.js';
import { displayData_fixtures, clearTimezoneInfo } from './fixtures.js';

// Define displayData once
function displayData(data, columnSettings, hiddenColumns) {
    console.log("displayData called with:", data.length, "rows");
    const container = document.getElementById("data-container");
    if (!container) {
        console.error("Container not found!");
        return;
    }
    container.innerHTML = ''; // Clear existing content

    // Create table
    const table = document.createElement('table');
    
    // Add headers
    if (data.length > 0) {
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(key => {
            if (!hiddenColumns.includes(key)) {
                const th = document.createElement('th');
                th.textContent = key;
                if (columnSettings[key]) {
                    th.style.width = columnSettings[key].width;
                    th.style.textAlign = columnSettings[key].align;
                }
                headerRow.appendChild(th);
            }
        });
        table.appendChild(headerRow);
    }

    // Add data rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.entries(row).forEach(([key, value]) => {
            if (!hiddenColumns.includes(key)) {
                const td = document.createElement('td');
                if (typeof value === 'string' && value.match(/\.(png|jpg|jpeg|gif)$/i)) {
                    const img = document.createElement('img');
                    img.src = value;
                    img.style.width = '20px';
                    td.appendChild(img);
                } else {
                    td.textContent = value;
                }
                if (columnSettings[key]) {
                    td.style.textAlign = columnSettings[key].align;
                }
                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    });

    container.appendChild(table);
}

function fetchAndDisplayCSV(url, filterField, filterValue, columnSettings, hiddenColumns, displayCallback) {
    console.log("Fetching CSV from:", url);
    console.log("Filter:", filterField, filterValue);
    
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            console.log("CSV data received:", results.data.length, "rows");
            
            let filteredData = results.data;
            if (filterField && filterValue) {
                filteredData = results.data.filter(row => String(row[filterField]) === String(filterValue));
                console.log("Filtered data:", filteredData.length, "rows");
            }
            
            displayCallback(filteredData, columnSettings, hiddenColumns);
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
        }
    });
}

function refreshData() {
    console.log("Refreshing data with state:", globalState);
    const config = urlDictionary[globalState.PageKey];
    console.log("Using config:", config);
    
    if (config) {
        const isFixturesPage = globalState.PageKey === 2;
        const displayFunc = isFixturesPage ? displayData_fixtures : displayData;
        console.log("Using display function:", isFixturesPage ? "fixtures" : "standings");
        
        fetchAndDisplayCSV(
            config.url,
            config.filterField,
            config.filterValue(globalState),
            config.columnSettings,
            config.hiddenColumns,
            displayFunc
        );
    } else {
        console.error("No config found for PageKey:", globalState.PageKey);
    }
}

// Export the functions that are used in HTML onclick events
export function handleTopButtonClick(event) {
    // Your function code here
}

export function handleLeftButtonClick(event) {
    // Your function code here
}

// Make the functions available globally if they're used in onclick HTML attributes
window.handleTopButtonClick = handleTopButtonClick;
window.handleLeftButtonClick = handleLeftButtonClick;

// Initial load
refreshData();
