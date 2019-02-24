(function (window, document) {
    'use strict';

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

    // function deleteSelection() {
    //     rangy.getSelection().deleteFromDocument();
    // }

    // function collapseSelectionToStart() {
    //     rangy.getSelection().collapseToStart();
    // }

    // function collapseSelectionToEnd() {
    //     rangy.getSelection().collapseToEnd();
    // }

    // function showContent(frag) {
    //     var displayEl = document.getElementById("selectioncontent");
    //     var codeEl = document.getElementById("code");
    //     while (displayEl.firstChild) {
    //         displayEl.removeChild(displayEl.firstChild);
    //     }
    //     if (frag) {
    //         displayEl.appendChild(frag);
    //     }
    //     codeEl.value = displayEl.innerHTML;
    // }

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

    // function extractRange() {
    //     var range = getFirstRange();
    //     if (range) {
    //         showContent(range.extractContents());
    //     }
    // }

    // function cloneRange() {
    //     var range = getFirstRange();
    //     if (range) {
    //         showContent(range.cloneContents());
    //     }
    // }

    // function deleteRange() {
    //     var range = getFirstRange();
    //     if (range) {
    //         range.deleteContents();
    //     }
    // }

    // function surroundRange() {
    //     var range = getFirstRange();
    //     if (range) {
    //         var el = document.createElement("span");
    //         el.style.backgroundColor = "pink";
    //         if (range.canSurroundContents(el)) {
    //             range.surroundContents(el);
    //         } else {
    //             alert("Unable to surround range because range partially selects a non-text node. See DOM4 spec for more information.");
    //         }
    //     }
    // }

    // function insertNodeAtRange() {
    //     var range = getFirstRange();
    //     if (range) {
    //         var el = document.createElement("span");
    //         el.style.backgroundColor = "lightblue";
    //         el.style.color = "red";
    //         el.style.fontWeight = "bold";
    //         el.appendChild(document.createTextNode("**INSERTED NODE**"));
    //         range.insertNode(el);
    //         rangy.getSelection().setSingleRange(range);
    //     }
    // }

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

    function saveSelection() {
        // Remove markers for previously saved selection
        if (savedSel) {
            rangy.removeMarkers(savedSel);
        }
        savedSel = rangy.saveSelection();
        savedSelActiveElement = document.activeElement;
        document.getElementById("restoreButton").disabled = false;
    }

    function restoreSelection() {
        if (savedSel) {
            rangy.restoreSelection(savedSel, true);
            savedSel = null;
            document.getElementById("restoreButton").disabled = true;
            window.setTimeout(function() {
                if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
                    savedSelActiveElement.focus();
                }
            }, 1);
        }
    }


    // highlighter

    var serializedHighlights = decodeURIComponent(window.location.search.slice(window.location.search.indexOf("=") + 1));
    var highlighter;

    var initialDoc;

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

    function reloadPage(button) {
        button.form.elements["serializedHighlights"].value = highlighter.serialize();
        button.form.submit();
    }


    // Initialize Rangy
    window.onload = function() {
        rangy.init();

        // Create selection buttons
        var selectionButtonsContainer = document.getElementById("selectionButtons");
        createButton(selectionButtonsContainer, reportSelectionText, "Get exact selection");
        createButton(selectionButtonsContainer, inspectSelection, "Inspect exact selection");
        createButton(selectionButtonsContainer, reportSelectionHtml, "Get exact selection HTML");
        // createButton(selectionButtonsContainer, deleteSelection, "Delete selection");
        // createButton(selectionButtonsContainer, collapseSelectionToStart, "Collapse to start");
        // createButton(selectionButtonsContainer, collapseSelectionToEnd, "Collapse to end");

        // Create Range buttons
        var rangeButtonsContainer = document.getElementById("rangeButtons");
        createButton(rangeButtonsContainer, inspectRange, "Show range");
        createButton(rangeButtonsContainer, reportRangeHtml, "Show range HTML");
        // createButton(rangeButtonsContainer, extractRange, "Extract range");
        // createButton(rangeButtonsContainer, cloneRange, "Clone");
        // createButton(rangeButtonsContainer, deleteRange, "Delete");
        // createButton(rangeButtonsContainer, surroundRange, "Surround (where possible)");
        // createButton(rangeButtonsContainer, insertNodeAtRange, "Insert node");

        // Display the control range element in IE
        if (rangy.features.implementsControlRange) {
            document.getElementById("controlRange").style.display = "block";
        }

        // serialize / deserialize
        // Enable buttons
        var serializerModule = rangy.modules.Serializer;
        if (rangy.supported && serializerModule && serializerModule.supported) {
            document.getElementById("serializedSelection").disabled = false;
            var serializeButton = document.getElementById("serializeButton");
            serializeButton.disabled = false;
            serializeButton.ontouchstart = serializeButton.onclick = serializeSelection;

            document.getElementById("selectionToDeserialize").disabled = false;
            var deserializeButton = document.getElementById("deserializeButton");
            deserializeButton.disabled = false;
            deserializeButton.ontouchstart = deserializeButton.onclick = deserializeSelection;

            // Display the control range element in IE
            if (rangy.features.implementsControlRange) {
                document.getElementById("controlRange").style.display = "block";
            }

            // Restore the selection from a previous visit to this page
            restoreSelection();
        }

        // save / restore
        // Enable buttons
        var saveRestoreModule = rangy.modules.SaveRestore;
        if (rangy.supported && saveRestoreModule && saveRestoreModule.supported) {
            var saveButton = document.getElementById("saveButton");
            saveButton.disabled = false;
            saveButton.ontouchstart = saveButton.onmousedown = function() {
                saveSelection();
                return false;
            };

            var restoreButton = document.getElementById("restoreButton");
            restoreButton.ontouchstart = restoreButton.onmousedown = function() {
                restoreSelection();
                return false;
            };

            // Display the control range element in IE
            if (rangy.features.implementsControlRange) {
                document.getElementById("controlRange").style.display = "block";
            }
        }

        // highlighter
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

        if (serializedHighlights) {
            highlighter.deserialize(serializedHighlights);
        }

    };

    window.onbeforeunload = saveSelection;


})(this, this.document);
