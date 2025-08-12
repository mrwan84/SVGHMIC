/**
 * Source class for handling text content in DOM elements
 */
class Source {
    /**
     * Creates a Source instance
     * @param {HTMLElement} dom - The DOM element to manage
     */
    constructor(dom) {
        this.dom = dom;
    }

    /**
     * Sets the text content of the DOM element
     * @param {string} text - The text to set
     */
    setText(text) {
        this.dom.textContent = text;
    }
}
