import Papa from 'papaparse';

const csvUrl = 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/new_ALL_standings_2024.csv'; // Replace with the actual CDN URL

function fetchAndDisplayCSV(url: string): void {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((csvData) => {
      // Debug raw CSV data
      console.log('Raw CSV:', csvData);

      // Parse without headers for debugging
      const parsedData = Papa.parse(csvData, { header: false });
      console.log('Parsed Data (no headers):', parsedData);

      // Call a function to process the parsed data
      displayData(parsedData.data as any[][]);

    })
    .catch((error) => console.error('Error fetching or parsing CSV:', error));
}

function displayData(data: any[][]): void {
  const container = document.getElementById('data-container');
  if (container) {
    container.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    data.forEach((row) => {
      const tr = document.createElement('tr');
      row.forEach((cell) => {
        const td = document.createElement('td');
        td.textContent = cell; // Access raw cell value
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table);
  }
}

fetchAndDisplayCSV(csvUrl);
