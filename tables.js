/**
 * A table based on a row template
 */
export class TemplateTable {
    /**
     * Create new table
     * 
     * @param {HTMLTemplateElement} rowTemplate 
     * @param {{actions: function[], validators: function[]}} options 
     */
    constructor(rowTemplate, { actions, validators }={}) {
        validateTemplate(rowTemplate);
        this.template = rowTemplate;
        this.rows = [];
        this.data = [];
        this.root = null;
        this.actions = actions ?? {};
        this.validators = validators ?? {};
        this.clickListener = this.clickListener.bind(this);
        this.inputListener = this.inputListener.bind(this);
    }

    /**
     * Attach table to the specified element
     * 
     * @param {HTMLElement} root 
     */
    attach(root) {
        this.root = root;
        this.root.addEventListener('click', this.clickListener);
        this.root.addEventListener('input', this.inputListener);
        this.redraw();
    }

    /**
     * Detach table (remove from the DOM)
     */
    detach() {
        this.redraw();
        this.root.removeEventListener('click', this.clickListener);
        this.root.removeEventListener('input', this.inputListener);
        this.root = null;
    }

    /**
     * Load data to the table
     * 
     * @param {*[]} data 
     */
    setData(data) {
        this.data = structuredClone(data);
        this.redraw();
    }

    /**
     * Get data from the table, edited by user
     */
    getData() {
        return this.data;
    }

    /**
     * Add a new table row
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

    /**
     * A 'click' event handler
     *
     * @param {MouseEvent} event 
     */
    clickListener(event) {
        const { name, index } = this.getCell(event.target);

        // Row operations:
        if (name === 'delete') {
            this.deleteRow(index);
        }

        // Custom actions:
        const action = this.actions[name];
        if (action) {
            action(this.data[index]);
        }
    }

    /**
     * An 'input' event handler
     *
     * @param {InputEvent} event 
     */
    inputListener(event) {
        const element = event.target;
        const { name,index } = this.getCell(element);

        // Update the cell value:
        const value = getValue(element);
        this.data[index][name] = value;

        // Validate the value:
        const validator = this.validators[name];
        if (!validator) {
            return;
        }
        const valid = validator(value);
        if (!valid) {
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }
    }

    /**
     * Get the respective table cell coordinates
     * @param {HTMLElement} element 
     * @returns 
     */
    getCell(element) {
        const name = element.getAttribute('name');
        const tableRow = element.closest('tr');
        const index = Number(tableRow.dataset.index);
        if (Number.isNaN(index)) {
            throw new Error('Can\'t find the row index.');
        }
        return { name, index };
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
        if (element) {
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
        if (element.getAttribute('type') === 'checkbox') {
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
        const type = element.getAttribute('type');
        if (type === 'checkbox') {
            return (element.checked);
        } else if (type === 'number') {
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
        throw Error('Root element of the template must be a <tr> element.');
    }
}
