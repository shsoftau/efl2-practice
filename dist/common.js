export function fetchAndDisplayCSV(url, filterField, filterValue, columnSettings, hiddenColumns, displayFunc) {
    // Log the URL being fetched
    console.log('Attempting to fetch CSV from:', url);
    
    Papa.parse(url, {
      download: true,
      header: true,
      complete: function (results) {
        // Log successful parsing
        console.log('CSV parsed successfully:', results);
        
        const filteredData = results.data.filter(row => row[filterField] === filterValue);
        console.log('Filtered data:', filteredData);
        
        displayFunc(filteredData, columnSettings, hiddenColumns);
      },
      error: function (error) {
        console.error('Error loading CSV:', error);
        
        // Add more detailed error information to the page
        const container = document.getElementById("data-container");
        if (container) {
          container.innerHTML = `
            <div style="color: red;">
              <p>Error loading data. Please check:</p>
              <ul>
                <li>The CSV file path is correct: ${url}</li>
                <li>The file exists in the repository</li>
                <li>The file is accessible via the URL</li>
              </ul>
            </div>
          `;
        }
      }
    });
}
  

export function displayData(data, columnSettings, hiddenColumns) {
    const container = document.getElementById("data-container");
    if (!container) return;
    container.innerHTML = ""; // Clear existing content
    const table = document.createElement("table");

    // Table headers
    if (data.length > 0) {
        const headerRow = Object.keys(data[0]);
        const tr = document.createElement("tr");
        headerRow.forEach((columnName) => {
            if (!hiddenColumns.includes(columnName)) {
                const th = document.createElement("th");
                const displayName = columnSettings[columnName]?.displayName;

                // Use displayName if provided, otherwise skip setting text
                if (displayName !== undefined) {
                    th.textContent = displayName;
                }

                if (columnSettings[columnName]?.width) th.style.width = columnSettings[columnName].width;
                if (columnSettings[columnName]?.align) th.style.textAlign = columnSettings[columnName].align;
                tr.appendChild(th);
            }
        });
        table.appendChild(tr);
    }

    // Table rows
    data.forEach((row) => {
        const tr = document.createElement("tr");
        Object.entries(row).forEach(([columnName, cell]) => {
            if (!hiddenColumns.includes(columnName)) {
                const td = document.createElement("td");

                // Dynamically check if the cell is an image URL
                if (typeof cell === "string" && /\.(jpg|jpeg|png|gif|webp)$/i.test(cell)) {
                    const img = document.createElement("img");
                    img.src = cell;
                    img.alt = "Image";
                    img.style.width = "20px"; // Explicitly set width
                    img.style.height = "auto"; // Maintain aspect ratio
                    td.appendChild(img);
                } else {
                    td.textContent = cell;
                }

                if (columnSettings[columnName]?.align) td.style.textAlign = columnSettings[columnName].align;
                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    });

    container.appendChild(table);
}
