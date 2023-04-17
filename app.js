import { TemplateTable } from './tables.js';
import data from './data.js';


const tableElement = document.querySelector('#table-body');
const rowTemplate = document.querySelector('#row-template');
const addRowButton = document.querySelector('#add-row-button');
const submitButton = document.querySelector('#submit-button');
const dataOutput =  document.querySelector('#data-output');
const modalElement = document.querySelector('#modal');
const modalBody = document.querySelector('#modal .modal-body');

const openModal = (data) => {
    const modal = new bootstrap.Modal(modalElement);
    const text = document.createTextNode(data.list ? JSON.stringify(data.list) : '');
    modalBody.replaceChildren(text);
    modal.show();
}

const options = {
    actions: {
        menu: openModal,
    }
};

const table = new TemplateTable(rowTemplate, options);

// "Add row" button handler
addRowButton.addEventListener('click', () => table.addRow());

// "Submit data" button handler
submitButton.addEventListener('click', () => {
    const data = table.getData();
    const text = document.createTextNode(JSON.stringify(data, null, 2));
    dataOutput.replaceChildren(text);
});

table.attach(tableElement);
table.setData(data);
