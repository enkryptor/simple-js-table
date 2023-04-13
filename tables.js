function clickListener(event) {
    const target = event.target;
    if (target.getAttribute("name") === "delete") {
        const tableRow = target.closest("tr");
        if (tableRow.dataset.index >= 0) {
            this.data.splice(tableRow.dataset.index, 1);
            this.redraw();
        } else {
            console.warn("Can't find the row index.");
        }
    }
}

export class TemplateTable {
    constructor(rowTemplate) {
        this.template = rowTemplate;
        this.rows = [];
        this.data = [];
        this.root = null;
        this.clickListener = clickListener.bind(this);
    }

    attach(root) {
        this.root = root;
        this.root.addEventListener('click', this.clickListener)
        this.redraw();
    }

    detach() {
        this.redraw();
        this.root.removeEventListener('click', this.clickListener)
        this.root = null;
    }

    setData(data) {
        this.data = data;
        this.redraw();
    }

    getData() {
        return []; // TODO return table data
    }

    addRow() {
        this.data.push({});
        this.redraw();
    }

    redraw() {
        const rows = this.data.map((record, index) => createRow(record, index, this.template));
        this.root.replaceChildren(...rows)
    }
}

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

function getValue(element) {
    return "-";
}
