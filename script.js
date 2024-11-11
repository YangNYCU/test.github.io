const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");
const calendarBody = document.getElementById("calendarBody");
const dataDisplay = document.getElementById("dataDisplay");

let currentDate = new Date();
let selectedDateCell = null;
let csvData = [];

// 函數來加載 CSV 檔案
function loadCSV() {
  fetch('mrt line clean.csv') // 替換為您的 CSV 檔案路徑
    .then(response => response.text())
    .then(data => {
      csvData = parseCSV(data); // 解析 CSV 資料並存入 csvData
    });
}

// 函數來解析 CSV
function parseCSV(data) {
  const rows = data.split("\n");
  return rows.map(row => {
    const values = row.split(",");
    return {
      Date: values[0], // 假設首欄是日期，格式為 yyyy-mm-dd
      Time: values[1],
      StartSta: values[2],
      StartL: values[3],
      EndSta: values[4],
      EndL: values[5],
      People: values[6]
    };
  });
}

// 函數來顯示選擇的日期資料
function displayDataForDate(date) {
  const filteredData = csvData.filter(row => row.Date === date).slice(0, 10000); // 使用 filter 來篩選資料
  if (filteredData.length > 0) {
    let tableHTML = `
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>StartSta</th>
            <th>StartL</th>
            <th>EndSta</th>
            <th>EndL</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>
    `;
    tableHTML += filteredData.map(data => `
      <tr>
        <td>${data.Date}</td>
        <td>${data.Time}</td>
        <td>${data.StartSta}</td>
        <td>${data.StartL}</td>
        <td>${data.EndSta}</td>
        <td>${data.EndL}</td>
        <td>${data.People}</td>
      </tr>
    `).join("");
    tableHTML += "</tbody></table>";
    dataDisplay.innerHTML = tableHTML;
  } else {
    dataDisplay.innerHTML = "<p>無資料</p>";
  }
}

// 建立年份和月份選項
function populateYearAndMonth() {
  const currentYear = currentDate.getFullYear();
  for (let i = currentYear - 5; i <= currentYear; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    if (i === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }

  for (let i = 0; i < 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i + 1}月`;
    if (i === currentDate.getMonth()) option.selected = true;
    monthSelect.appendChild(option);
  }
}

// 函數來渲染日曆
function renderCalendar() {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarBody.innerHTML = "";

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        break;
      } else {
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        cell.textContent = date;
        cell.addEventListener("click", () => {
          if (selectedDateCell) {
            selectedDateCell.classList.remove("selected");
          }
          cell.classList.add("selected");
          selectedDateCell = cell;
          displayDataForDate(fullDate); // 顯示選擇的日期的資料
        });
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

yearSelect.addEventListener("change", renderCalendar);
monthSelect.addEventListener("change", renderCalendar);

document.addEventListener("DOMContentLoaded", () => {
  populateYearAndMonth();
  renderCalendar();
  loadCSV(); // 加載 CSV 資料
});