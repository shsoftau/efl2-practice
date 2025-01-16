export const fixturesConfig = {
    url: 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/fixtures/Web_fixtures_2024_utf8.csv',
    columnSettings: {
        "wkd": { 
            width: "50px", 
            align: "center", 
            displayName: "Day",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "User Date": { 
            width: "100px", 
            align: "center", 
            displayName: "Date",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Time": { 
            width: "80px", 
            align: "center", 
            displayName: "Time",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Round": { 
            width: "200px", 
            align: "left", 
            displayName: "Round",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Status": { 
            width: "30px", 
            align: "center", 
            displayName: "Status",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Home Win Flag": { 
            width: "20px", 
            align: "center", 
            displayName: "",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Home Team": { 
            width: "200px", 
            align: "right", 
            displayName: "Home",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Home Badge": { 
            width: "50px", 
            align: "center", 
            displayName: "",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Home Score": { 
            width: "70px", 
            align: "center", 
            displayName: "",
            font: { size: "13px", weight: "bold", style: "normal" }
        },
        "Separator": { 
            width: "10px", 
            align: "center", 
            displayName: "",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Away Score": { 
            width: "70px", 
            align: "center", 
            displayName: "",
            font: { size: "13px", weight: "bold", style: "normal" }
        },
        "Away Badge": { 
            width: "50px", 
            align: "left", 
            displayName: "",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Away Team": { 
            width: "200px", 
            align: "left", 
            displayName: "Away",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Away Win Flag": { 
            width: "20px", 
            align: "left", 
            displayName: "",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
        "Venue": { 
            width: "500px", 
            align: "left", 
            displayName: "Venue",
            font: { size: "13px", weight: "normal", style: "normal" }
        },
    },
    filterField: "league.id",
    filterValue: (state) => state.sel_league_code,
    hiddenColumns: ["", "teams.home.id","teams.away.id","league.id","league.season","fixture.id", "Date"],
};

export function displayData_fixtures(data, columnSettings, hiddenColumns) {
    console.log("Starting displayData_fixtures with:", {
        dataLength: data?.length,
        columnSettingsKeys: Object.keys(columnSettings),
        hiddenColumns: hiddenColumns,
        firstRow: data[0]
    });

    // Get user's UTC offset and timezone info first
    const userOffset = new Date().getTimezoneOffset() / -60;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('/', ' ');
    const sign = userOffset >= 0 ? '+' : '';
    
    // Update timezone info in left pane
    const tzInfo = document.getElementById('timezone-info');
    if (tzInfo) {
        tzInfo.style.fontSize = '10px';
        tzInfo.style.color = '#666';
        tzInfo.style.padding = '10px';
        tzInfo.style.textAlign = 'center';
        tzInfo.textContent = `All dates and times are as per ${timezone} GMT${sign}${userOffset}`;
    }

    const container = document.getElementById("data-container");
    if (!container) {
        console.error("Container not found!");
        return;
    }

    // Clear the container
    container.innerHTML = "";

    // Create table with fixed layout
    const table = document.createElement("table");
    table.style.tableLayout = 'fixed'; // This ensures columns stick to their defined widths

    try {
        // Process the data
        console.log("Processing data...");
        const processedData = data.map(row => {
            const originalDate = new Date(row.Date);
            const userDate = new Date(originalDate.getTime() + (userOffset * 60 * 60 * 1000));
            
            return {
                "wkd": userDate.toLocaleDateString('en-US', { weekday: 'short' }),
                "User Date": userDate.toLocaleDateString('en-US', { 
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }).replace(',', ''),
                "Time": userDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                ...row
            };
        });

        // Table headers
        if (processedData.length > 0) {
            const tr = document.createElement("tr");
            Object.keys(columnSettings).forEach((columnName) => {
                if (!hiddenColumns.includes(columnName)) {
                    const th = document.createElement("th");
                    
                    // Check if displayName exists and is not an empty string
                    const displayName = columnSettings[columnName]?.displayName;
                    th.textContent = displayName !== undefined ? displayName : columnName;

                    // Apply font settings to header
                    const font = columnSettings[columnName]?.font;
                    if (font) {
                        th.style.fontSize = font.size;
                        th.style.fontWeight = font.weight;
                        th.style.fontStyle = font.style;
                    }

                    // Add sticky positioning and width from columnSettings
                    Object.assign(th.style, {
                        position: 'sticky',
                        top: '0',
                        backgroundColor: 'white',
                        zIndex: '999',
                        width: columnSettings[columnName].width || 'auto',
                        textAlign: columnSettings[columnName].align || 'left'
                    });

                    tr.appendChild(th);
                }
            });
            table.appendChild(tr);
        }

        // Table rows
        processedData.forEach((row) => {
            const tr = document.createElement("tr");
            Object.keys(columnSettings).forEach((columnName) => {
                if (!hiddenColumns.includes(columnName)) {
                    const td = document.createElement("td");
                    const cell = row[columnName];

                    // Apply font settings to cell
                    const font = columnSettings[columnName]?.font;
                    if (font) {
                        td.style.fontSize = font.size;
                        td.style.fontWeight = font.weight;
                        td.style.fontStyle = font.style;
                    }

                    // Set width and alignment from columnSettings
                    td.style.width = columnSettings[columnName].width || 'auto';
                    td.style.textAlign = columnSettings[columnName].align || 'left';

                    if (['Home Win Flag', 'Away Win Flag'].includes(columnName)) {
                        if (cell === 'W') {
                            td.textContent = '🟢';
                        } else if (cell === 'L') {
                            td.textContent = '🔴';
                        } else if (cell === 'D') {
                            td.textContent = '⚪';
                        }
                    }
                    else if (typeof cell === "string" && /\.(jpg|jpeg|png|gif|webp)$/i.test(cell)) {
                        const img = document.createElement("img");
                        img.src = cell;
                        img.style.width = '20px';
                        img.style.height = 'auto';
                        td.appendChild(img);
                    } else {
                        td.textContent = cell || '';
                    }

                    tr.appendChild(td);
                }
            });
            table.appendChild(tr);
        });

        container.appendChild(table);
        console.log("Table rendered successfully");

    } catch (error) {
        console.error("Error in displayData_fixtures:", error);
        container.innerHTML = "Error loading data. Please try again.";
    }
}

export function clearTimezoneInfo() {
    // Empty function as we don't need to clear anything separately
}
