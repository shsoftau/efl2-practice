import { leagueDictionary, urlDictionary, globalState } from './config.js';
import { displayData_fixtures, clearTimezoneInfo } from './fixtures.js';

// Helper functions for button styles
function updateTopButtonStyles() {
    const buttons = document.querySelectorAll('.top-button');
    buttons.forEach(button => {
        const buttonPageKey = Number(button.getAttribute('onclick').match(/\d+/)[0]);
        if (buttonPageKey === globalState.PageKey) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function updateLeftButtonStyles() {
    console.log('Updating left button styles. Current league code:', globalState.sel_league_code);
    const buttons = document.querySelectorAll('.left-button');
    buttons.forEach(button => {
        try {
            const buttonLeague = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            const buttonLeagueCode = leagueDictionary[buttonLeague];
            console.log('Button league:', buttonLeague, 'Code:', buttonLeagueCode);
            
            // Compare as numbers
            if (Number(buttonLeagueCode) === Number(globalState.sel_league_code)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        } catch (error) {
            console.error('Error processing button:', button, error);
        }
    });
}

// Display functions
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

// Add this at the start of the file after imports
function checkCoreFeatures() {
    // Check if required functions exist
    const requiredFunctions = {
        handleLeftButtonClick: window.handleLeftButtonClick,
        handleTopButtonClick: window.handleTopButtonClick,
        refreshData: refreshData,
        displayData: displayData,
        fetchAndDisplayCSV: fetchAndDisplayCSV
    };

    // Check if each function exists
    Object.entries(requiredFunctions).forEach(([name, func]) => {
        if (typeof func !== 'function') {
            console.error(`Core function ${name} is missing or not a function!`);
        }
    });

    // Check if required DOM elements exist
    const requiredElements = {
        'data-container': document.getElementById('data-container'),
        'top-buttons': document.querySelector('.top-button'),
        'left-buttons': document.querySelector('.left-button')
    };

    Object.entries(requiredElements).forEach(([name, element]) => {
        if (!element) {
            console.error(`Required element ${name} is missing!`);
        }
    });

    // Check if global state is properly initialized
    if (typeof globalState.PageKey === 'undefined' || 
        typeof globalState.sel_league_code === 'undefined') {
        console.error('Global state not properly initialized!');
    }
}

// Button click handlers
export function handleLeftButtonClick(league) {
    try {
        console.log("League selected:", league);
        if (!leagueDictionary[league]) {
            console.error(`League "${league}" not found in leagueDictionary.`);
            return;
        }
        globalState.sel_league_code = Number(leagueDictionary[league]);
        console.log("League code set to:", globalState.sel_league_code);
        updateLeftButtonStyles();
        refreshData();
    } catch (error) {
        console.error('Error in handleLeftButtonClick:', error);
    }
}

export function handleTopButtonClick(pageKey) {
    try {
        console.log("Page changed to:", pageKey);
        globalState.PageKey = Number(pageKey);
        
        if (pageKey === 1) {
            clearTimezoneInfo();
        }
        
        updateTopButtonStyles();
        refreshData();
    } catch (error) {
        console.error('Error in handleTopButtonClick:', error);
    }
}

// Make the functions available globally
window.handleLeftButtonClick = handleLeftButtonClick;
window.handleTopButtonClick = handleTopButtonClick;

// Initialize button styles and load data
document.addEventListener('DOMContentLoaded', () => {
    // Check core features first
    checkCoreFeatures();
    
    // Then proceed with initialization
    updateTopButtonStyles();
    updateLeftButtonStyles();
    refreshData();
});

// Add this function to help with testing
function testCoreFunctionality() {
    console.group('Testing Core Functionality');
    
    // Test league switching
    console.log('Testing league switch...');
    handleLeftButtonClick('premier_league');
    
    // Test page switching
    console.log('Testing page switch...');
    handleTopButtonClick(1);
    handleTopButtonClick(2);
    
    // Test data loading
    console.log('Testing data refresh...');
    refreshData();
    
    console.groupEnd();
}

// Add this to development tools
if (process.env.NODE_ENV !== 'production') {
    window.testCoreFunctionality = testCoreFunctionality;
}

function scrollToLatestGame() {
  console.log('Scroll function triggered');
  
  // Find the first row where home team score is null
  const tableRows = document.querySelectorAll('table tr');
  console.log('Found table rows:', tableRows.length);

  let targetRow;

  for (const row of tableRows) {
    const scoreCell = row.querySelector('.home-score'); // Let's verify this selector
    console.log('Score cell found:', scoreCell, 'Content:', scoreCell?.textContent);
    
    if (scoreCell && scoreCell.textContent.trim() === '') {
      targetRow = row;
      console.log('Found target row:', row);
      break;
    }
  }

  if (targetRow) {
    console.log('Scrolling to target row');
    targetRow.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  } else {
    console.log('No target row found');
  }
}

// Try both button types to ensure we catch the right ones
document.querySelectorAll('.left-button, .top-button').forEach(button => {
  console.log('Adding click listener to button:', button);
  button.addEventListener('click', () => {
    console.log('Button clicked');
    setTimeout(scrollToLatestGame, 100);
  });
});
