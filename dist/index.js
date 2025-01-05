"use strict";

var csvUrl = 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/web_ALL_standings_2024.csv';

// Table column settings (includes width and alignment)
const columnSettings = {
    "Position": { width: "40px", align: "center" },
    "Badge": { width: "50px", align: "center" },
    "Team": { width: "200px", align: "left" },
    "W": { width: "40px", align: "center" },
    "D": { width: "40px", align: "center" },
    "L": { width: "40px", align: "center" },
    "GF": { width: "40px", align: "center" },
    "GA": { width: "40px", align: "center" },
    "GD": { width: "40px", align: "center" },
    "MP": { width: "40px", align: "center" },
    "Points": { width: "40px", align: "center" },
    "Last 5": { width: "150px", align: "center" },
};

// Default league code
let sel_league_code = 88;

// Dictionary mapping button names to league codes
const leagueCodes = {
    1: 39,  // English Premier League
    2: 78,  // Bundesliga
    3: 140, // La Liga
    4: 94,  // Primeira Liga
    5: 61,  // Ligue 1
    6: 135, // Serie A
    7: 88   // Eredivisie
};

function setupMenuBar() {
    var menuBar = document.getElementById('menu-bar');
    if (menuBar) {
        menuBar.innerHTML = `
      <nav>
        <a href="#home" style="margin-right: 20px;">Home</a>
        <a href="#standings">Standings</a>
      </nav>
    `;
    }
}

function fetchAndDisplayCSV(url) {
    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(function (csvData) {
            var parsedData = Papa.parse(csvData, { header: true }).data; // Use global Papa object with headers
            filterAndDisplayData(parsedData);
        })
        .catch(function (error) {
            console.error('Error fetching or parsing CSV:', error);
        });
}

function filterAndDisplayData(data) {
    // Filter data based on the selected league code
    const filteredData = data.filter(row => row.league == sel_league_code);

    displayData(filteredData);

    // Hide specific columns by name
    hideColumnsByName(["league", "season"]);
}

function displayData(data) {
    var container = document.getElementById('data-container');
    if (container) {
        container.innerHTML = ''; // Clear existing content
        var table = document.createElement('table');

        // Add table header
        if (data.length > 0) {
            const headerRow = Object.keys(data[0]);
            var tr = document.createElement('tr');
            headerRow.forEach(columnName => {
                var th = document.createElement('th');
                th.textContent = columnName;
                tr.appendChild(th);
            });
            table.appendChild(tr);
        }

        // Add table rows
        data.forEach(function (row) {
            var tr = document.createElement('tr');
            Object.values(row).forEach((cell, colIndex) => {
                var cellElement = document.createElement('td');
                const columnName = Object.keys(row)[colIndex]?.trim();

                if (columnName === "Badge") { // Badge column logic
                    var img = document.createElement('img');
                    img.src = cell; // Use cell value as image URL
                    img.alt = 'Badge'; // Accessibility
                    img.className = 'badge-img'; // Add a class for styling
                    img.onerror = function () {
                        cellElement.textContent = ''; // Fallback: Show URL if image fails
                    };
                    cellElement.appendChild(img);
                } else {
                    cellElement.textContent = cell;
                }

                // Apply alignment from column settings
                if (columnSettings[columnName]?.align) {
                    cellElement.style.textAlign = columnSettings[columnName].align;
                }

                tr.appendChild(cellElement);
            });
            table.appendChild(tr);
        });

        container.appendChild(table);

        // Set column widths after table is appended to the DOM
        setColumnStyles(table, columnSettings);
    }
}

function setColumnStyles(table, settings) {
    const headers = table.querySelectorAll("th");
    headers.forEach((header, index) => {
        const columnName = header.textContent.trim();
        if (settings[columnName]) {
            const { width, align } = settings[columnName];

            // Set column width
            if (width) header.style.width = width;

            // Set alignment for header
            if (align) header.style.textAlign = align;

            // Apply alignment to corresponding data cells
            const dataCells = table.querySelectorAll(`td:nth-child(${index + 1})`);
            dataCells.forEach((cell) => {
                cell.style.textAlign = align;
            });
        }
    });
}

// Update table when league code changes
function updateLeagueCode(newLeagueCode) {
    sel_league_code = newLeagueCode;
    fetchAndDisplayCSV(csvUrl); // Refresh table data
}

// Handle button clicks
function handleButtonClick(buttonNumber) {
    const newLeagueCode = leagueCodes[buttonNumber];
    if (newLeagueCode) {
        updateLeagueCode(newLeagueCode);
    } else {
        console.error(`No league code found for button ${buttonNumber}`);
    }
}

function hideColumnsByName(columnNames) {
    const table = document.querySelector("table"); // Select the table
    if (!table) return;

    const headers = table.querySelectorAll("th"); // Get all headers
    headers.forEach((header, index) => {
        const columnName = header.textContent.trim();
        if (columnNames.includes(columnName)) {
            // Hide the header
            header.style.display = "none";

            // Hide the corresponding cells
            const cells = table.querySelectorAll(`td:nth-child(${index + 1})`);
            cells.forEach((cell) => {
                cell.style.display = "none";
            });
        }
    });
}

function initialize() {
    setupMenuBar();
    fetchAndDisplayCSV(csvUrl);
}

initialize();
