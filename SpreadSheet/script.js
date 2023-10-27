const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.rowName = rowName;
    this.columnName = columnName;
    this.active = active;
  }
}

exportBtn.onclick = (e) => {
  let csv = "";
  for (let i = 1; i < spreadsheet.length; i++) {
    csv +=
      spreadsheet[i]
        .filter((cell) => !cell.isHeader)
        .map((cell) => cell.data)
        .join(",") + "\r\n";
  }

  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "spreadsheet File Name.csv";
  a.click();
};

initSpreadsheet();

function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRow = [];
    for (let j = 0; j < COLS; j++) {
      let cellData = "";
      let isHeader = false;
      let disabled = false;

      if (j === 0) {
        cellData = i;
        isHeader = true;
        disabled = true;
      }

      if (i === 0) {
        cellData = alphabet[j - 1];
        isHeader = true;
        disabled = true;
      }

      if (!cellData) {
        cellData = "";
      }

      const rowName = i;
      const columnName = alphabet[j - 1];

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      );
      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
}

function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + "_" + cell.column;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.onclick = () => handleCellClick(cell);
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

  return cellEl;
}

function handleOnChange(data, cell) {
  cell.data = data;
}

function handleCellClick(cell) {
  clearHeaderActiveStates();

  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];
  const columnHeaderEl = getElFromRowColumn(
    columnHeader.row,
    columnHeader.column
  );
  const rowHeaderEl = getElFromRowColumn(rowHeader.row, rowHeader.column);

  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");

  document.querySelector("#cell-status").innerHTML =
    cell.columnName + cell.rowName;
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");

  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function getElFromRowColumn(row, column) {
  return document.querySelector("#cell_" + row + "_" + column);
}

function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}
