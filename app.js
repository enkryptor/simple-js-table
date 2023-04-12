import { TemplateTable } from "./tables.js";
import data from "./data.js";


const tableElement = document.querySelector('#table-body');
const rowTemplate = document.querySelector('#row-template');
const addRowButton = document.querySelector('#add-row-button');

const table = new TemplateTable(rowTemplate);
addRowButton.addEventListener('click', () => table.addRow());

table.attach(tableElement);

table.load(data);
