"use strict";

// Define dynamic filter values as constants
let sel_league_code = 39; // Default league code (Premier League)
let fixtureFilterValue = 39; // Example filter value for fixtures

// Dictionary mapping keys to URLs, column settings, and filtering parameters
const urlDictionary = {
    1: {
        url: 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/web_ALL_standings_2024.csv',
        columnSettings: {
            "Position": { width: "40px", align: "center" },
            "Badge": { width: "50px", align: "center" },
            "Team": { width: "220px", align: "left" },
            "W": { width: "40px", align: "center" },
            "D": { width: "40px", align: "center" },
            "L": { width: "40px", align: "center" },
            "GF": { width: "40px", align: "center" },
            "GA": { width: "40px", align: "center" },
            "GD": { width: "40px", align: "center" },
            "MP": { width: "40px", align: "center" },
            "Points": { width: "40px", align: "center" },
            "Last 5": { width: "150px", align: "center" },
        },
        filterField: "league", // Field to filter
        filterValue: () => sel_league_code, // Dynamic league code
        hiddenColumns: ["league", "season"] // Define columns to hide for currentKey = 1
    },
    2: {
        url: 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/fixtures/fixtures_byleague_2024_39.csv',
        columnSettings: {
            "fixture.date": { width: "150px", align: "center" },
            "teams.home.name": { width: "200px", align: "left" },
            "teams.away.name": { width: "200px", align: "left" },
        },
        filterField: "league.id", // Field to filter
        filterValue: () => fixtureFilterValue, // Dynamic fixture filter
    },
};

let currentKey = 1; // Default key (Standings)

// Handle left pane button clicks
function handleLeftButtonClick(button) {
    switch (button) {
        case "premier_league": sel_league_code = 39; break;
        case "bundesliga": sel_league_code = 78; break;
        case "la_liga": sel_league_code = 140; break;
        case "serie_a": sel_league_code = 135; break;
        case "ligue_1": sel_league_code = 61; break;
        case "primeira_liga": sel_league_code = 94; break;
        case "eredivisie": sel_league_code = 88; break;
        default: console.error("Unknown league button:", button); return;
    }
    updateLeftPaneActiveButton(); // Update active button
    refreshData(); // Refresh data for the selected league
}




// Handle top button clicks
function handleTopButtonClick(action) {
    switch (action) {
        case "standings": currentKey = 1; break;
        case "fixtures": currentKey = 2; break;
        default: console.error("Unknown action:", action); return;
    }
    updateTopPaneActiveButton(); // Update active button
    refreshData(); // Refresh data for the selected action
}

function refreshData() {
    const config = urlDictionary[currentKey];
    if (config) {
        const csvUrl = config.url;
        const filterField = config.filterField;
        const filterValue = config.filterValue();
        console.log(`Loading data from ${csvUrl} with filter ${filterField}=${filterValue}`);
        fetchAndDisplayCSV(csvUrl, filterField, filterValue);
    } else {
        console.error(`No URL or configuration found for key: ${currentKey}`);
    }
}

// Function to fetch and display data
function fetchAndDisplayCSV(url, filterField, filterValue) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then((csvData) => {
            const parsedData = Papa.parse(csvData, { header: true }).data;
            const filteredData = parsedData.filter((row) => row[filterField] == filterValue);
            displayData(filteredData);
        })
        .catch((error) => console.error("Error fetching or parsing CSV:", error));
}

function displayData(data) {
    const container = document.getElementById("data-container");
    if (container) {
        container.innerHTML = ""; // Clear existing content
        const table = document.createElement("table");

        // Retrieve hidden columns for the currentKey
        const hiddenColumns = urlDictionary[currentKey]?.hiddenColumns || [];
        const columnSettings = urlDictionary[currentKey]?.columnSettings || {};

        // Add table header
        if (data.length > 0) {
            const headerRow = Object.keys(data[0]);
            const tr = document.createElement("tr");
            headerRow.forEach((columnName) => {
                if (!hiddenColumns.includes(columnName)) { // Check if column is not hidden
                    const th = document.createElement("th");
                    th.textContent = columnName;

                    // Apply width from column settings
                    if (columnSettings[columnName]?.width) {
                        th.style.width = columnSettings[columnName].width;
                    }

                    // Apply alignment from column settings
                    if (columnSettings[columnName]?.align) {
                        th.style.textAlign = columnSettings[columnName].align;
                    }

                    tr.appendChild(th);
                }
            });
            table.appendChild(tr);
        }

        // Add table rows
        data.forEach((row) => {
            const tr = document.createElement("tr");
            Object.entries(row).forEach(([columnName, cell]) => {
                if (!hiddenColumns.includes(columnName)) { // Check if column is not hidden
                    const cellElement = document.createElement("td");

                    if (columnName === "Badge") {
                        const img = document.createElement("img");
                        img.src = cell; // Use cell value as image URL
                        img.alt = "Badge";
                        img.className = "badge-img";
                        img.onerror = () => {
                            cellElement.textContent = ""; // Fallback
                        };
                        cellElement.appendChild(img);
                    } else {
                        cellElement.textContent = cell;
                    }

                    // Apply alignment from column settings
                    if (columnSettings[columnName]?.align) {
                        cellElement.style.textAlign = columnSettings[columnName].align;
                    }

                    // Apply width from column settings
                    if (columnSettings[columnName]?.width) {
                        cellElement.style.width = columnSettings[columnName].width;
                    }

                    tr.appendChild(cellElement);
                }
            });
            table.appendChild(tr);
        });

        container.appendChild(table);
    }
}




// Apply active class to the left pane buttons
function updateLeftPaneActiveButton() {
    document.querySelectorAll(".left-button").forEach((button) => {
        const league = button.getAttribute("data-league");
        if (league === getLeagueNameByCode(sel_league_code)) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Apply active class to the top pane buttons
function updateTopPaneActiveButton() {
    document.querySelectorAll(".top-button").forEach((button) => {
        const action = button.getAttribute("data-action");
        if (
            (action === "standings" && currentKey === 1) ||
            (action === "fixtures" && currentKey === 2)
        ) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Map sel_league_code to the corresponding data-league attribute
function getLeagueNameByCode(code) {
    switch (code) {
        case 39: return "premier_league";
        case 78: return "bundesliga";
        case 140: return "la_liga";
        case 135: return "serie_a";
        case 61: return "ligue_1";
        case 94: return "primeira_liga";
        case 88: return "eredivisie";
        default: return null;
    }
}









// Add event listeners for buttons and load default data
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".left-button").forEach((button) => {
        button.addEventListener("click", () => {
            const league = button.getAttribute("data-league");
            handleLeftButtonClick(league);
        });
    });

    document.querySelectorAll(".top-button").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.getAttribute("data-action");
            handleTopButtonClick(action);
        });
    });

    // Initial active states
    updateLeftPaneActiveButton();
    updateTopPaneActiveButton();

    // Load the default data on page load
    refreshData();
});
