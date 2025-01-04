var csvUrl = 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/new_ALL_standings_2024.csv'; // Replace with the actual CDN URL
function fetchAndDisplayCSV(url) {
    fetch(url)
        .then(function (response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
        .then(function (csvData) {
        console.log('Raw CSV:', csvData); // Debug raw CSV data
        var parsedData = Papa.parse(csvData, { header: false });
        console.log('Parsed Data (no headers):', parsedData);
        displayData(parsedData.data);
    })
        .catch(function (error) {
        console.error('Error fetching or parsing CSV:', error);
    });
}
function displayData(data) {
    var container = document.getElementById('data-container');
    if (container) {
        container.innerHTML = '';
        var table = document.createElement('table');
        data.forEach(function (row) {
            var tr = document.createElement('tr');
            row.forEach(function (cell) {
                var td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        container.appendChild(table);
    }
}
fetchAndDisplayCSV(csvUrl);
