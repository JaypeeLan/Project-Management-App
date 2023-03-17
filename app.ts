const addBtns = document.querySelectorAll(".add-btn:not(.solid)")!;
const saveItemBtns = document.querySelectorAll(".solid")!;
const addItemContainers = document.querySelectorAll(".add-container")!;
const addItems = document.querySelectorAll(".add-item")!;
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list")!;
const backlogList = document.getElementById("backlog-list") as HTMLUListElement;
const progressList = document.getElementById(
  "progress-list"
) as HTMLUListElement;
const completeList = document.getElementById(
  "complete-list"
) as HTMLUListElement;
const onHoldList = document.getElementById("on-hold-list") as HTMLUListElement;

// Items
let updatedOnLoad: boolean = false;

type ListArrays = Array<string[]>;

// Initialize Arrays
let backlogListArray: string[] = [];
let progressListArray: string[] = [];
let completeListArray: string[] = [];
let onHoldListArray: string[] = [];
let listArrays: ListArrays;

// Drag Functionality
let dragging: boolean = false;
let draggedItem: HTMLLIElement;
let currentColumn: number;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course"];
    progressListArray = ["Work on projects"];
    completeListArray = ["Sit back and relax"];
    onHoldListArray = ["Listen to music"];
  }
}

getSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, i) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
  });
}

updateSavedColumns();

//  filter array to prevent empty items from saving into local storage
function filterArray(arr: string[]) {
  const filteredArray = arr.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(
  columnEl: HTMLUListElement,
  column: number,
  item: string,
  index: number
) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = `true`;
  listEl.id = `${index}`;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogList, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressList, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeList, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldList, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update item - delete if necessary, or update array value
function updateItem(id: number, column: number) {
  // selected column
  const selectedArray = listArrays[column];
  // selected item
  const selectedColumnEl = listColumns[column].children;
  // ================================================ //
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent!;
    }
    updateDOM();
  }
}

// Add to column list, reset textbox
function addToColumn(column: number) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText!);
  addItems[column].textContent = "";
  updateDOM();
}

// show add item input box
function showInputBox(column: number) {
  (addBtns[column] as any).style.visibility = "hidden";
  (saveItemBtns[column] as any).style.display = "flex";
  (addItemContainers[column] as any).style.display = "flex";
}

// hide input box after saving
function hideInputBox(column: number) {
  (addBtns[column] as any).style.visibility = "visible";
  (saveItemBtns[column] as any).style.display = "none";
  (addItemContainers[column] as any).style.display = "none";
  addToColumn(column);
}

// when Item starts dragging
function drag(e: any) {
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e: any) {
  e.preventDefault();
}

function drop(e: any) {
  e.preventDefault();
  // remove styling
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  dragging = false;
  updateArrays();
}

function dragEnter(column: number) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// update arrays after dragging and dropping
function updateArrays() {
  // loop through the list children and push to respective arrays
  backlogListArray = Array.from(backlogList.children).map(
    (i) => i.textContent!
  );

  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent!
  );

  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent!
  );

  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent!);
  updateDOM();
}

// On Load
updateDOM();
