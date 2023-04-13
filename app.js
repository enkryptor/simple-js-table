import { TemplateTable } from "./tables.js";
import data from "./data.js";


const tableElement = document.querySelector('#table-body');
const rowTemplate = document.querySelector('#row-template');
const addRowButton = document.querySelector('#add-row-button');
const submitButton = document.querySelector('#submit-button');
const dataOutput =  document.querySelector('#data-output');

const table = new TemplateTable(rowTemplate);
addRowButton.addEventListener('click', () => table.addRow());
submitButton.addEventListener('click', () => {
    const data = table.getData();
    const text = document.createTextNode(JSON.stringify(data));
    dataOutput.replaceChildren(text);
});

table.attach(tableElement);
table.setData(data);
