// Variables for defining parameters and content
let paramDef = "";
let contents;
let svgHmi = null;

// Cache DOM elements
const elements = {
    stage: document.getElementById('stageID'),
    txtArea: document.getElementById('txtAreaID'),
    wireframe: document.getElementById('wireframeID'),
    prettyView: document.getElementById('prettyViewID'),
    wordWrap: document.getElementById('wordWrapID'),
    fileName: document.getElementById('fileNameID'),
    load: document.getElementById('load'),
    save: document.getElementById('save'),
    clear: document.getElementById('clear'),
    paramName: document.getElementById('paramNameID'),
    paramType: document.getElementById('paramTypeID'),
    paramDefValue: document.getElementById('paramDefValueID'),
    paramConnect: document.getElementById('paramConnectID'),
    addButton: document.getElementById('addButtonID')
};

// Initialize Editor
const editor = new Editor(elements.stage);
editor.setSource(new Source(elements.txtArea));


// Toggle wireframe view
elements.wireframe.addEventListener("change", function () {
    elements.stage.classList.toggle("wireframeID");
});

// Toggle pretty view
elements.prettyView.addEventListener("change", function () {
    elements.stage.classList.toggle("prettyViewID");
    prettyPrintXML(elements.txtArea.textContent);
});

elements.wordWrap.addEventListener("change", function () {
    elements.stage.classList.toggle("wordWrapID");

    if (elements.wordWrap.checked) {
        elements.txtArea.setAttribute("wrap", "soft");
    }
    else {
        elements.txtArea.setAttribute("wrap", "off"); 
    }
});

// Create hidden form and input for file Selection
const form = document.createElement("form");
form.style.display = "none";
document.body.appendChild(form);

const input = document.createElement("input");
input.type = "file";

// Attach event listener for file Selection
input.addEventListener("change", handleFileSelection);
form.appendChild(input);

// Event for triggering the file Selection
elements.load.addEventListener("click", function () {
    input.click();
});

// SAVE functionality
const Name = `AutomationSet_${Math.floor(Math.random() * 1000)}`;
const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

// This part deals with the saving of files
elements.save.addEventListener("click", function () {
    const saveEditor = elements.txtArea.textContent;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(saveEditor, "text/xml");
    const s = new XMLSerializer();
    const str = s.serializeToString(xmlDoc);

    const blob = new Blob([str], { type: "text/plain" });
    link.href = URL.createObjectURL(blob);
    link.download = elements.fileName.value + "_" + Name + ".svghmi";
    link.click();
});

// CLEAR functionality
elements.clear.addEventListener("click", function () {
    editor.clear();
});

// Adding parameter definition on button click
elements.addButton.addEventListener("click", (e) => {
    addParamDef();
});

/**
 * Adds a parameter definition to the SVG editor
 * Generates default values based on parameter type and updates the editor
 */
function addParamDef() {
    let paramdefVal;
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    switch (elements.paramType.value) {
        case "HmiColor":
            paramdefVal = `0xFF${randomColor}`;
            break;
        case "number":
            paramdefVal = "0";
            break;
        case "boolean":
            paramdefVal = "false";
            break;
        case "string":
            paramdefVal = "";
            break;
        default:
            break;
    }

    if (elements.paramDefValue.value !== "") {
        paramdefVal = elements.paramDefValue.value;
    }

    // Here you define new parameters
    // paramDef = [name, type, default, id]
    paramDef = [elements.paramName.value, elements.paramType.value, paramdefVal, elements.paramConnect.value];
    editor.setParamDef(paramDef);
};

/**
 * Helper function to get the 'viewBox' attribute from SVG
 * @param {Document} svgdoc - The SVG document
 * @returns {string|null} The viewBox attribute value or null if not found
 */
function getViewBox(svgdoc) {
    const svgElement = svgdoc.documentElement;
    if (svgElement && svgElement.tagName.toLowerCase() === 'svg') {
		
        return svgElement.getAttribute('viewBox');
    }
    return null;
};


/**
 * Function to replace fill attribute in SVG based on 'id'
 * @param {string} svgText - The SVG text content
 * @returns {string} Modified SVG text with HMI binding
 */
function replaceFillInSvg(svgText) {
    // Regex for 'style' and 'id'
    const styleRegex = /(style=".*?fill:)(#.*?;)(.*?")/;
    const idRegex = /id="(.*?)"/;

    // Find the 'id' value
    const idMatch = svgText.match(idRegex);
    if (idMatch) {
        const idValue = idMatch[1];
        const newFillValue = `hmi-bind:fill="{{Converter.RGBA(ParamProps.${idValue}_Color)}}"`;

        // Replace the 'style' value
        return svgText.replace(styleRegex, `$1${newFillValue};$3`);
    }
    return svgText;
};

/**
 * Function to format XML using vkbeautify library
 * @param {string} xmlText - The XML text to format
 * @returns {*} The svgHmi object or null
 */
function prettyPrintXML(xmlText) {
    if (typeof vkbeautify !== 'undefined') {
        if (elements.prettyView.checked) {
            if (xmlText?.length > 0) {
                elements.txtArea.textContent = vkbeautify.xml(xmlText, 2);
            }
        } else {
            elements.txtArea.textContent = vkbeautify.xmlmin(xmlText, 2);
        }
        return svgHmi;
    } else {
        const errorMsg = "vkbeautify library is not available";
        console.error("Error:", errorMsg);
    }
    return null;
};

/**
 * Handles file selection and loading of SVG files
 * @param {Event} event - The file selection event
 */
function handleFileSelection(event) {
    const file = input.files[0];
    if (file) {
        elements.fileName.value = file.name.split(".")[0];
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            function (event) {
                contents = event.target.result;
                try {
                    const parsedSVG = new DOMParser().parseFromString(contents, "image/svg+xml");
                    this.svgHmi = editor.setSVG(parsedSVG, elements.fileName.value, getViewBox(parsedSVG));
                } catch (error) {
                    console.error("Could not parse SVG:", error);
                    console.error("Stack Trace:", error.stack);
                    alert("There was a problem loading the SVG file. Please try again.");
                }
            },
            false
        );
        reader.readAsText(file);
        form.reset();
    } else {
        console.error("No file Selected."); // Error handling
        alert("There was no SVG file Selected");
    }

    if (elements.wireframe.checked) {
        elements.stage.classList.toggle("wireframeID");
    }

    if (elements.prettyView.checked) {
        prettyPrintXML(elements.txtArea.textContent);
    }

    if (elements.wordWrap.checked) {
        elements.txtArea.setAttribute("wrap", "soft");
    }
    else {
        elements.txtArea.setAttribute("wrap", "off");
    }
};
