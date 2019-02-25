(function (window, document) {
    'use strict';

    // exact selection & range selection

    function reportSelectionText() {
        console.log( rangy.getSelection().toString() );
    }

    function inspectSelection() {
        console.log( rangy.getSelection().inspect() );
    }

    function getFirstRange() {
        var sel = rangy.getSelection();
        // console.log(sel);
        return sel.rangeCount ? sel.getRangeAt(0) : null;
    }

    function inspectRange() {
        var range = getFirstRange();
        if (range) {
            console.log(range.inspect());
        }
    }

    // save / restore

    var savedSel = null;
    var savedSelActiveElement = null;

    function saveSelection() {
        if (savedSel) {
            rangy.removeMarkers(savedSel);
        }
        savedSel = rangy.saveSelection();
        savedSelActiveElement = document.activeElement;
    }

    function restoreSelection() {
        if (savedSel) {
            rangy.restoreSelection(savedSel, true);
            savedSel = null;
            window.setTimeout(function() {
                if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
                    savedSelActiveElement.focus();
                }
            }, 1);
        }
    }

    // highlighter

    var highlighter;

    function highlightSelectedText() {
        highlighter.highlightSelection("note");
    }

    function removeHighlightFromSelectedText() {
        highlighter.unhighlightSelection();
    }

    // Helpers

    function createButton(parentNode, clickHandler, value) {
        var button = document.createElement("input");
        button.type = "button";
        button.unselectable = true;
        button.className = "unselectable";
        button.ontouchstart = button.onmousedown = function() {
            clickHandler();
            return false;
        };
        button.value = value;
        parentNode.appendChild(button);
        button = null;
    }

    // Initialize Rangy
    window.onload = function() {
        rangy.init();

        // Create selection and range buttons
        var selectionButtonsContainer = document.getElementById("selectionButtons");
        createButton(selectionButtonsContainer, reportSelectionText, "Get exact selection");
        createButton(selectionButtonsContainer, inspectSelection, "Inspect exact selection");
        createButton(selectionButtonsContainer, inspectRange, "Show range");

        // Create save / restore buttons
        var saveRestoreModule = rangy.modules.SaveRestore;
        if (rangy.supported && saveRestoreModule && saveRestoreModule.supported) {
            createButton(saveButtonsContainer, saveSelection, "Save selection");
            createButton(saveButtonsContainer, restoreSelection, "Restore selection");
        }

        // Create highlighter buttons
        var highlightButtonsContainer = document.getElementById("highlightButtons");
        createButton(highlightButtonsContainer, highlightSelectedText, "Highlight selection");
        createButton(highlightButtonsContainer, removeHighlightFromSelectedText, "Remove highlights from selection");

        highlighter = rangy.createHighlighter();

        highlighter.addClassApplier(rangy.createClassApplier("note", {
            ignoreWhiteSpace: true,
            // tagNames: ["span", "a"],
            elementTagName: "a",
            elementProperties: {
                href: "#",
                onclick: function() {
                    var highlight = highlighter.getHighlightForElement(this);
                    console.log(highlight);
                    // if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                    //     highlighter.removeHighlights( [highlight] );
                    // }
                    return false;
                }
            }
        }));

    };


})(this, this.document);
