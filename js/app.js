// Variables for defining parameters and content
let paramDef = "";
let contents;
let svgHmi = null;

// Initialize Editor
const editor = new Editor(stageID);
editor.setSource(new Source(txtAreaID));


// Toggle wireframe view
wireframeID.addEventListener("change", function () {
    stageID.classList.toggle("wireframeID");
});

// Toggle pretty view
prettyViewID.addEventListener("change", function () {
    stageID.classList.toggle("prettyViewID");
    prettyPrintXML(document.getElementById("txtAreaID").textContent);
});

wordWrapID.addEventListener("change", function () {
    stageID.classList.toggle("wordWrapID");

    if (wordWrapID.checked) {
        document.getElementById("txtAreaID").setAttribute("wrap", "off");
    }
    else {
        document.getElementById("txtAreaID").setAttribute("wrap", "soft"); 
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
load.addEventListener("click", function () {
    input.click();
});

// SAVE functionality
const Name = `AutomationSet_${Math.floor(Math.random() * 1000)}`;
const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

// This part deals with the saving of files
save.addEventListener("click", function () {
    const saveEditor = document.getElementById("txtAreaID").textContent;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(saveEditor, "text/xml");
    const s = new XMLSerializer();
    const str = s.serializeToString(xmlDoc);

    //const str = document.getElementById("txtAreaID").textContent;
    const blob = new Blob([str], { type: "text/plain" });
    link.href = URL.createObjectURL(blob);
    link.download = fileNameID.value + "_" + Name + ".svghmi";
    link.click();
});

// CLEAR functionality
clear.addEventListener("click", function () {
    editor.clear();
});

// Define parameters
const paramName = document.getElementById("paramNameID");
const paramType = document.getElementById("paramTypeID");
const paramDefValue = document.getElementById("paramDefValueID");
const paramConnectID = document.getElementById("paramConnectID");
const addButton = document.getElementById("addButtonID");

// Adding parameter definition on button click
addButton.addEventListener("click", (e) => {
    addParamDef();
});

// ADD function
function addParamDef() {
    let paramdefVal;
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    switch (paramType.value) {
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

    if (paramDefValue.value !== "") {
        paramdefVal = paramDefValue.value;
    }

	// Here you define new parameters
    //paramDef = [name, type, default]
    paramDef = [paramName.value, paramType.value, paramdefVal, paramConnectID]
    editor.setParamDef(paramDef);
};

// Helper function to get the 'viewBox' Attribute from SVG
// This function gets the viewBox Attribute value from SVG Element
function getViewBox(svgdoc) {
    const svgElement = svgdoc.documentElement;
    if (svgElement && svgElement.tagName.toLowerCase() === 'svg') {
		
        return svgElement.getAttribute('viewBox');
    }
    return null;
};


// Function to replace fill Attribute in SVG based on 'id'
function replaceFillInSvg(svgText) {
    // Regex für 'style' und 'id'
    const styleRegex = /(style=".*?fill:)(#.*?;)(.*?")/;
    const idRegex = /id="(.*?)"/;

    // Finde den 'id'-Wert
    const idMatch = svgText.match(idRegex);
    if (idMatch) {
        const idValue = idMatch[1];
        const newFillValue = `hmi-bind:fill="{{Converter.RGBA(ParamProps.${idValue}_Color)}}"`;

        // Ersetze den 'style'-Wert
        return svgText.replace(styleRegex, `$1${newFillValue};$3`);
    }
    return svgText;
};

// Function to use pretty print XML
function prettyPrintXML(xmlText) {
    if (typeof vkbeautify !== 'undefined') {
        if (prettyViewID.checked) {
			if (xmlText?.length > 0) {
                document.getElementById("txtAreaID").textContent = vkbeautify.xml(xmlText, 2)
			}
        } else {
            document.getElementById("txtAreaID").textContent = vkbeautify.xmlmin(xmlText, 2)
			}

        return svgHmi;
    } else {
        console.error("error vkbeautify undefinded:", error);
        console.error("Stack Trace:", error.stack);
    }
    return null;
};

// Function for handling file Selection
function handleFileSelection(event) {
    const file = input.files[0];
    if (file) {
        fileNameID.value = file.name.split(".")[0];
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            function (event) {
                contents = event.target.result;
                try {
                    const parsedSVG = new DOMParser().parseFromString(contents, "image/svg+xml");
                    this.svgHmi = editor.setSVG(parsedSVG, fileNameID.value, getViewBox(parsedSVG));
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

    if (wireframeID.checked) {
        stageID.classList.toggle("wireframeID");
	}

    if (prettyViewID.checked) {
        prettyPrintXML(document.getElementById("txtAreaID").textContent);
    }

    if (wordWrapID.checked) {
        document.getElementById("txtAreaID").setAttribute("wrap", "off");
    }
    else {
        document.getElementById("txtAreaID").setAttribute("wrap", "soft");
    }
};
