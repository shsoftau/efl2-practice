"use strict";
var csvUrl = 'https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/web_ALL_standings_2024.csv';

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
            var parsedData = Papa.parse(csvData, { header: false }).data; // Use global Papa object
            displayData(parsedData);
        })
        .catch(function (error) {
            console.error('Error fetching or parsing CSV:', error);
        });
}

function displayData(data) {
    var container = document.getElementById('data-container');
    if (container) {
        container.innerHTML = ''; // Clear existing content
        var table = document.createElement('table');
        
        data.forEach(function (row, rowIndex) {
            var tr = document.createElement('tr');
            row.forEach(function (cell, colIndex) {
                var cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
                if (rowIndex !== 0 && colIndex === 1) { // Badge column logic
                    var img = document.createElement('img');
                    img.src = cell; // Use cell value as image URL
                    img.alt = 'Badge'; // Accessibility
                    img.onerror = function () {
                        cellElement.textContent = cell; // Fallback: Show URL if image fails
                    };
                    img.onload = function () {
                        cellElement.textContent = ''; // Clear text if image loads
                        cellElement.appendChild(img);
                    };
                    cellElement.textContent = 'Loading...'; // Placeholder
                } else {
                    cellElement.textContent = cell;
                }
                tr.appendChild(cellElement);
            });
            table.appendChild(tr);
        });
        
        container.appendChild(table);
    }
}

function initialize() {
    setupMenuBar();
    fetchAndDisplayCSV(csvUrl);
}

initialize();
