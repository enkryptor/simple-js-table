/**
 * A table based on a row template
 */
export class TemplateTable {
    /**
     * Create new table
     * 
     * @param {HTMLTemplateElement} rowTemplate 
     */
    constructor(rowTemplate) {
        validateTemplate(rowTemplate);
        this.template = rowTemplate;
        this.rows = [];
        this.data = [];
        this.root = null;
        this.clickListener = tableClickListener.bind(this);
    }

    /**
     * Attach table to the specified element
     * 
     * @param {HTMLElement} root 
     */
    attach(root) {
        this.root = root;
        this.root.addEventListener('click', this.clickListener)
        this.redraw();
    }

    /**
     * Detach table (remove from the DOM)
     */
    detach() {
        this.redraw();
        this.root.removeEventListener('click', this.clickListener)
        this.root = null;
    }

    /**
     * Load data to the table
     * 
     * @param {*[]} data 
     */
    setData(data) {
        this.data = data;
        this.redraw();
    }

    /**
     * Get data from the table, edited by user
     */
    getData() {
        return this.rows.map((row, index) => {
            const controls = row.querySelectorAll("[name]");
            const entries = [...controls]
                .map(el =>([el.getAttribute("name"), getValue(el)]))
                .filter(pair => pair[1] !== undefined);
            return {
                ...this.data[index],
                ...Object.fromEntries(entries)
            }
        });
    }

    /**
     * Add new table row
     */
    addRow() {
        this.data.push({});
        this.redraw();
    }

    /**
     * Delete a table row with the specified index
     */
    deleteRow(index) {
        this.data.splice(index, 1);
        this.redraw();
    }

    // *************************************************************
    //  All the lines below is an inner implementation of the table
    // *************************************************************

    redraw() {
        this.rows = this.data.map((record, index) => createRow(record, index, this.template));
        this.root.replaceChildren(...this.rows);
    }
}

/**
 * A 'click' event handler
 *
 * @param {MouseEvent} event 
 */
function tableClickListener(event) {
    const target = event.target;
    const tableRow = target.closest("tr");
    const dataIndex = Number(tableRow.dataset.index);
    if (Number.isNaN(dataIndex)) {
        throw new Error("Can't find the row index.");
    }

    // Row operations:
    if (target.getAttribute("name") === "delete") {
        this.deleteRow(dataIndex);
    }
}

/**
 * Create a `<tr>` element based on the `template` and `data`
 * 
 * @param {object} record 
 * @param {number} index 
 * @param {HTMLTemplateElement} template 
 */
function createRow(record, index, template) {
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.index = index;
    for (const field in record) {
        const value = record[field]
        const element = row.querySelector(`[name=${field}]`);
        if (!element) {
            console.warn(`Column "${field}" not found.`);
        } else {
            setValue(element, value);
        }
    }
    return row;
}

/**
 * Set value for the `element`
 * 
 * @param {HTMLElement} element 
 * @param {string|boolean} value 
 */
function setValue(element, value) {
    if (element instanceof HTMLInputElement) {
        if (element.getAttribute("type") === "checkbox") {
            element.checked = Boolean(value);
        } else {
            element.value = value;
        }
    } else {
        const text = document.createTextNode(value);
        element.replaceChildren(text);
    }
}

/**
 * Get value of the `element`
 * 
 * @param {HTMLElement} element
 */
function getValue(element) {
    if (element instanceof HTMLInputElement) {
        const type = element.getAttribute("type");
        if (type === "checkbox") {
            return (element.checked);
        } else if (type === "number") {
            return Number(element.value);
        } else {
            return element.value;
        }
    }
}

/**
 * Throws an error if the `template` is not a valid table row
 * 
 * @param {HTMLTemplateElement} template 
 */
function validateTemplate(template) {
    if (!(template.content.firstElementChild instanceof HTMLTableRowElement)) {
        throw Error("Root element of the template must be a <tr> element.");
    }
}
