export class TemplateTable {
    constructor(rowTemplate) {
        this.template = rowTemplate;
        this.rows = [];
        this.data = [];
        this.root = null;
    }

    attach(root) {
        this.root = root;
        this.redraw();
    }

    detach() {
        this.redraw();
        this.root = null;
    }

    load(data) {
        this.data = data;
        this.redraw();
    }

    addRow() {
        this.data.push({});
        this.redraw();
    }

    redraw() {
        const rows = this.generateRows(this.data);
        this.root.replaceChildren(...rows)
    }

    generateRows(data) {
        return data.map((record) => this.createRow(record));
    }

    createRow(record) {
        const row = this.template.content.firstElementChild.cloneNode(true);
        for (const field in record) {
            const value = record[field]
            const element = row.querySelector(`[name=${field}]`);
            if (!element) {
                console.warn(`Cannot find field "${field}"!`);
            } else {
                setValue(element, value);
            }
        }
        return row;
    }
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
