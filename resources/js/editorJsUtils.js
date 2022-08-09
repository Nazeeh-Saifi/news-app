/**
 *
 * @param {string} tag the html tag to be created
 * @param {Object} options the options of html tag
 * @param {Array} options.classList the classes to be added to this element
 * @param {string} options.src the src value for image tag
 * @param {string} options.placeholder the placeholder value for input tag
 * @param {string} options.type the type value for button tag
 * @param {string} options.innerText the innerText value for html tag
 * @returns {HTMLElement} el
 */
function createEl(tag, options = {}) {
    if (!tag) return;
    const el = document.createElement(tag);
    if (options.classList) {
        options.classList.forEach((classString) => {
            el.classList.add(classString);
        });
    }
    if (options.src) {
        el.src = options.src;
    }
    if (options.placeholder) {
        el.placeholder = options.placeholder;
    }
    if (options.type) {
        el.type = options.type;
    }
    if (options.innerText) {
        el.innerText = options.innerText;
    }
    return el;
}

export { createEl };
