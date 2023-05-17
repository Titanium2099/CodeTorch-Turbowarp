// Stylesheets are added at the start of <body> so that they have higher precedence
// than those in <head>
const stylesheetContainer = document.createElement('div');
stylesheetContainer.style.display = 'none';
document.body.insertBefore(stylesheetContainer, document.body.firstChild);

/**
 * Maps opaque module IDs to its ConditionalStyle.
 * @type {Map<unknown, ConditionalStyle>}
 */
const allSheets = new Map();

/**
<<<<<<< HEAD
=======
 * @param {string} addonId An addon ID
 * @returns {number} Precedence number
 */
const getPrecedence = addonId => {
    // columns must have higher precedence than hide-flyout
    if (addonId === 'columns') return 1;
    // editor-stage-left must have higher precedence than hide-stage
    if (addonId === 'editor-stage-left') return 1;
    return 0;
};

/**
>>>>>>> e0418b99 (addons: Rewrite userstyle loading)
 * Determine if the contents of a list are equal (===) to each other.
 * @param {unknown[]} a The first list
 * @param {unknown[]} b The second list
 * @returns {boolean} true if the lists are identical
 */
const areArraysEqual = (a, b) => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; a++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

<<<<<<< HEAD
const updateAll = () => {
    for (const sheet of allSheets.values()) {
        sheet.update();
    }
};

class ConditionalStyle {
=======
class ConditionalStyle {
    static get (moduleId, styleText) {
        if (!allSheets.get(moduleId)) {
            const newSheet = new ConditionalStyle(styleText);
            allSheets.set(moduleId, newSheet);
        }
        return allSheets.get(moduleId);
    }

    static updateAll () {
        for (const sheet of allSheets.values()) {
            sheet.update();
        }
    }

    static updateAddon (addonId) {
        for (const sheet of allSheets.values()) {
            if (sheet.dependsOn(addonId)) {
                sheet.update();
            }
        }
    }

>>>>>>> e0418b99 (addons: Rewrite userstyle loading)
    /**
     * @param {string} styleText CSS text
     */
    constructor (styleText) {
        /**
         * Lazily created <style> element.
         * @type {HTMLStyleElement}
         */
        this.el = null;

        /**
         * Temporary storing place for the CSS text until the style sheet is created.
         * @type {string|null}
         */
        this.styleText = styleText;

        /**
         * Higher number indicates this element should override lower numbers.
         * @type {number}
         */
        this.precedence = 0;

        /**
         * List of [addonId, condition] tuples.
         * @type {Array<[string, () => boolean>]}
         */
        this.dependents = [];

        /**
         * List of addonIds that were enabled on the previous call to update()
         * @type {string[]}
         */
        this.previousEnabledDependents = [];
    }

<<<<<<< HEAD
    addDependent (addonId, precedence, condition) {
        this.dependents.push([addonId, condition]);

=======
    addDependent (addonId, condition) {
        this.dependents.push([addonId, condition]);

        const precedence = getPrecedence(addonId);
>>>>>>> e0418b99 (addons: Rewrite userstyle loading)
        if (precedence > this.precedence) {
            this.precedence = precedence;

            if (this.el) {
                this.el.dataset.precedence = precedence;
            }
        }

        this.update();
    }

    getEnabledDependents () {
        const enabledDependents = [];
        for (const [addonId, condition] of this.dependents) {
            if (condition()) {
                enabledDependents.push(addonId);
            }
        }
        return enabledDependents;
    }

    dependsOn (addonId) {
        return this.dependents.some(dependent => dependent[0] === addonId);
    }

    getElement () {
        if (!this.el) {
            const el = document.createElement('style');
<<<<<<< HEAD
            el.className = 'scratch-addons-style';
=======
>>>>>>> e0418b99 (addons: Rewrite userstyle loading)
            el.dataset.precedence = this.precedence;
            el.textContent = this.styleText;
            this.styleText = null;
            this.el = el;
        }
        return this.el;
    }

    update () {
        const enabledDependents = this.getEnabledDependents();
        if (areArraysEqual(enabledDependents, this.previousEnabledDependents)) {
            // Nothing to do.
            return;
        }
        this.previousEnabledDependents = enabledDependents;

        if (enabledDependents.length > 0) {
            const el = this.getElement();
            el.dataset.addons = enabledDependents.join(',');

            for (const child of stylesheetContainer.children) {
                const otherPrecedence = +child.dataset.precedence || 0;
                if (otherPrecedence >= this.precedence) {
                    // We need to be before this style.
                    stylesheetContainer.insertBefore(el, child);
                    return;
                }
            }

            // We have higher precedence than all existing stylesheets.
            stylesheetContainer.appendChild(el);
        } else if (this.el) {
            this.el.remove();
        }
    }
}

<<<<<<< HEAD
const create = (moduleId, styleText) => {
    if (!allSheets.get(moduleId)) {
        const newSheet = new ConditionalStyle(styleText);
        allSheets.set(moduleId, newSheet);
    }
    return allSheets.get(moduleId);
};

export {
    create,
    updateAll
};
=======
export default ConditionalStyle;
>>>>>>> e0418b99 (addons: Rewrite userstyle loading)
