const csvUrl: string = 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/web_ALL_standings_2024.csv';

function setupMenuBar(): void {
  const menuBar = document.getElementById('menu-bar');
  if (menuBar) {
    menuBar.innerHTML = `
      <nav>
        <a href="#home" style="margin-right: 20px;">Home</a>
        <a href="#standings">Standings</a>
      </nav>
    `;
  }
}

function fetchAndDisplayCSV(url: string): void {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((csvData) => {
      const parsedData = Papa.parse<string[]>(csvData, { header: false }).data; // Use global Papa object
      displayData(parsedData);
    })
    .catch((error) => console.error('Error fetching or parsing CSV:', error));
}

function displayData(data: string[][]): void {
  const container = document.getElementById('data-container');
  if (container) {
    container.innerHTML = ''; // Clear existing content

    container.style.display = 'block';
    container.style.width = 'auto'; // Allow width to adjust based on content
    container.style.height = 'auto'; // Allow height to adjust based on content
    container.style.overflowX = 'auto'; // Enable horizontal scrolling if needed

    const table = document.createElement('table');
    table.style.width = 'auto'; // Use auto width for dynamic adjustment
    table.style.borderCollapse = 'collapse';
    table.style.margin = '0 auto'; // Horizontally centre the table

    // Measure column widths
    // const columnWidths: number[] = Array(data[0].length).fill(0);
    // const measurer = document.createElement('span');
    // measurer.style.visibility = 'hidden';
    // measurer.style.whiteSpace = 'nowrap';
    // document.body.appendChild(measurer);

    // data.forEach((row) => {
    //  row.forEach((cell, colIndex) => {
    //    measurer.textContent = cell;
    //    const cellWidth = measurer.offsetWidth + 16; // Add padding (8px on each side)
    //    columnWidths[colIndex] = Math.max(columnWidths[colIndex], cellWidth);
    //  });
    //}); 

    //document.body.removeChild(measurer); // Clean up the measurer 


    // Create table rows and columns
    data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
        cellElement.textContent = cell;
      
        const badgeColumnIndex = 1; // Specify the index of the badge column
        if (rowIndex !== 0 && colIndex === badgeColumnIndex) {
          const img = document.createElement('img');
          img.src = cell; // Use the cell value as the image URL
          img.alt = 'Badge'; // Add an alt attribute for accessibility
          img.style.height = '20px'; // Adjust the image height
          img.style.width = '20px'; // Adjust the image width

          // Only append the image if the URL is valid
          img.onerror = () => {
            cellElement.textContent = ''; // Fallback: Show URL if the image fails to load
          };
          img.onload = () => {
            cellElement.textContent = ''; // Clear the text if the image loads successfully
            cellElement.appendChild(img);
          };

          // Set a placeholder while the image is loading (optional)
          cellElement.textContent = 'Loading...';
        } else {
          cellElement.textContent = cell;
}
        
        cellElement.style.padding = '8px'; // Padding for readability
        // cellElement.style.textAlign = 'center'; // Optional: Centre-align text
        // cellElement.style.border = 'none'; // Remove border for better visibility
        // cellElement.style.width = `${columnWidths[colIndex]}px`; // Set dynamic column width
        //if (rowIndex === 0) {
        //  cellElement.classList.add('sticky-header'); // Add class to header cells
        //}
        tr.appendChild(cellElement);
      });
      table.appendChild(tr);
    });

    container.appendChild(table);
  }
}



function initialize(): void {
  setupMenuBar();
  fetchAndDisplayCSV(csvUrl);
}

initialize();
