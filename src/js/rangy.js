(function (window, document) {
    'use strict';

    // exact selection & range selection

    function getFirstRange() {
        var sel = rangy.getSelection();
        return sel.rangeCount ? sel.getRangeAt(0) : null;
    }

    function reportSelectionText() {
        alert( rangy.getSelection().toString() );
    }

    function reportSelectionHtml() {
        alert( rangy.getSelection().toHtml() );
    }

    function inspectSelection() {
        alert( rangy.getSelection().inspect() );
    }

    function inspectRange() {
        var range = getFirstRange();
        if (range) {
            alert(range.inspect());
        }
    }

    function reportRangeHtml() {
        var range = getFirstRange();
        if (range) {
            alert(range.toHtml());
        }
    }

    // serialize / deserialize

    function serializeSelection() {
        var input = document.getElementById("serializedSelection");
        input.value = rangy.serializeSelection();
        input.focus();
        input.select();
    }

    function deserializeSelection() {
        rangy.deserializeSelection(document.getElementById("selectionToDeserialize").value);
    }

    function restoreSelection() {
        rangy.restoreSelectionFromCookie();
    }

    function saveSelection() {
        rangy.saveSelectionCookie();
    }

    // save / restore

    var savedSel = null;
    var savedSelActiveElement = null;

    function saveSelection2() {
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
        highlighter.highlightSelection("highlight");
    }

    function noteSelectedText() {
        highlighter.highlightSelection("note");
    }

    function removeHighlightFromSelectedText() {
        highlighter.unhighlightSelection();
    }

    function highlightScopedSelectedText() {
        highlighter.highlightSelection("highlight", { containerElementId: "summary" });
    }

    function noteScopedSelectedText() {
        highlighter.highlightSelection("note", { containerElementId: "summary" });
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

        // Create selection buttons
        var selectionButtonsContainer = document.getElementById("selectionButtons");
        createButton(selectionButtonsContainer, reportSelectionText, "Get exact selection");
        createButton(selectionButtonsContainer, inspectSelection, "Inspect exact selection");
        createButton(selectionButtonsContainer, reportSelectionHtml, "Get exact selection HTML");

        // Create range buttons
        var rangeButtonsContainer = document.getElementById("rangeButtons");
        createButton(rangeButtonsContainer, inspectRange, "Show range");
        createButton(rangeButtonsContainer, reportRangeHtml, "Show range HTML");

        // Create serialize / deserialize buttons
        createButton(serializeButtonsContainer, serializeSelection, "Serialize selection");
        createButton(deserializeButtonsContainer, deserializeSelection, "Restore selection");

        // Create save / restore buttons
        var saveRestoreModule = rangy.modules.SaveRestore;
        if (rangy.supported && saveRestoreModule && saveRestoreModule.supported) {
            createButton(saveButtonsContainer, saveSelection2, "Save selection");
            createButton(saveButtonsContainer, restoreSelection, "Restore selection");
        }

        // Create highlighter buttons
        var highlightButtonsContainer = document.getElementById("highlightButtons");
        createButton(highlightButtonsContainer, highlightSelectedText, "Highlight selection");
        createButton(highlightButtonsContainer, noteSelectedText, "Add note to selection");
        createButton(highlightButtonsContainer, removeHighlightFromSelectedText, "Remove highlights from selection");
        createButton(highlightButtonsContainer, highlightScopedSelectedText, "Highlight within outlined paragraph");
        createButton(highlightButtonsContainer, noteScopedSelectedText, "Annotate selection within outlined paragraph");

        highlighter = rangy.createHighlighter();

        highlighter.addClassApplier(rangy.createClassApplier("highlight", {
            ignoreWhiteSpace: true,
            tagNames: ["span", "a"]
        }));

        highlighter.addClassApplier(rangy.createClassApplier("note", {
            ignoreWhiteSpace: true,
            elementTagName: "a",
            elementProperties: {
                href: "#",
                onclick: function() {
                    var highlight = highlighter.getHighlightForElement(this);
                    if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                        highlighter.removeHighlights( [highlight] );
                    }
                    return false;
                }
            }
        }));

    };

    window.onbeforeunload = saveSelection;


})(this, this.document);
