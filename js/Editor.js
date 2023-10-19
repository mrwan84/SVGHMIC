class Editor {
    constructor(svg) {
        // Original SVG Element.
        this.svg = svg;

        // Textarea to display the SVG's XML code.
        this.txtSource = null;

        // Clone of the original SVG for manipulation.
        this.clonedSvg = null;

        this.viewBox = "";

        // Meta-information Vals.
        this.selfVals = [
            ["type", "widget"],
            ["displayName", ""],
            ["name", ""],
            ["version", "1.0.1"],
            ["performanceClass", "L"]
        ];

        // Parameter definition Vals.
        this.paramDefVals = [
            ["name", ""],
            ["type", ""],
            ["default", ""],
            ["id", ""]
        ];

        // Namespace URLs.
        this.svgHmiNS = {
            svg: "http://www.w3.org/2000/svg",
            xlink: "http://www.w3.org/1999/xlink",
            hmi: "http://svg.siemens.com/hmi/",
            hmiBind: "http://svg.siemens.com/hmi/bind/",
            hmiBindXlink: "http://svg.siemens.com/hmi/bind/xlink/",
            hmiElement: "http://svg.siemens.com/hmi/Element/",
            hmiFeature: "http://svg.siemens.com/hmi/feature/",
            hmiEvent: "http://svg.siemens.com/hmi/event/",
            hmiSelf: "http://svg.siemens.com/hmi/self/",
            siemensDocType: "http://tia.siemens.com/graphics/svg/1.4/dtd/svg14-hmi.dtd"
        };
    }

    // Initialize the 'selfVals' array with a new filename.
    initSelfArray(fileNameID) {
        this.selfVals[1][1] = fileNameID;
        this.selfVals[2][1] = `extended.${fileNameID}`;
    }

    // paramDefVals[i][x] <-- paramDef[i]
    // Initialize the 'arrDest[i][x]' <-- 'arrSrc[i]' array.
    initArr(arrDest, startDest, arrSrc, startSrc, count) {
        const maxSrc = arrSrc.length - startSrc - count;
        const maxDest = arrDest.length - startDest - count;
        let tOfValSrc = typeof arrSrc;
        let tOfValDest = typeof arrDest;


        if (((maxDest >= 0) && (this.getArrDim(arrDest) == 2)) && ((maxSrc >= 0) && (this.getArrDim(arrSrc) == 1))) {

            if (this.checkArrTypes(tOfValDest, tOfValSrc) == null) {
                return null;
            }

            for (let i = 0; i < count; i++) {
                tOfValDest = typeof arrDest[startDest+i][0];
                tOfValSrc = typeof arrSrc[startSrc+i];

                if (this.checkArrTypes(tOfValDest, tOfValSrc) == null) {
                    return null;
                }

                arrDest[startDest + i][1] = arrSrc[startSrc + i];
            }
        }
    }

    checkArrTypes(arrDest, arrSrc) {
        let tOfValSrc = typeof arrSrc;
        let tOfValDest = typeof arrDest;

        if (tOfValDest !== tOfValSrc) {
            console.log(`"Error wrong type: tOfValDest = ${tOfValDest} ---- tOfValSrc = ${tOfValSrc}"`);

            return null;
        }
        return 1;
    }

    // Set the text area source.
    setSource(txtSource) {
        this.txtSource = txtSource;
    }

    // Update or add a new parameter definition to the SVG.
    setParamDef(paramDef) {
        const hmiParamElement = this.clonedSvg.documentElement.querySelector('self').querySelector(`paramDef[name="${paramDef[0]}"]`);

        this.initArr(this.paramDefVals, 0, paramDef, 0, 4);

        if (!hmiParamElement) {
            // empty for prettyview
            this.clonedSvg.documentElement.querySelector('self').appendChild(document.createTextNode('\n'));  

            const newSvgHmiElement = document.createElementNS(this.svgHmiNS.hmi, "paramDef");
            this.setXmlElementAttribute(newSvgHmiElement, this.paramDefVals, 0, 3);                        
            this.clonedSvg.documentElement.querySelector('self').appendChild(newSvgHmiElement); 
        }
        else {
            this.setXmlElementAttribute(hmiParamElement, this.paramDefVals, 1, 2);
        }

        this.txtSource?.setText(this.toString(this.viewBox, this.clonedSvg?.documentElement.innerHTML));
    }

    // Set the SVG data.
    setSVG(svg, fileNameID, viewBox) {
        this.viewBox = viewBox;
        this.initSelfArray(fileNameID);
        this.svg.innerHTML = svg.documentElement.innerHTML;

        //
        this.clonedSvg = svg.cloneNode(true);
        const hmiElement = this.clonedSvg.documentElement.querySelector('self');

        if (!hmiElement) {
            //remove 'defs' when it exist and add new empty 'defs' after 'hmi:self'
            let hmiDefsElement = this.clonedSvg.documentElement.querySelector('defs');
            if (hmiDefsElement) {
                //remove svgElement 'defs'
                hmiDefsElement.remove();
            }
            
            //add new svgElement 'defs'
            const newHmiDefsElement = document.createElement("defs");
            this.clonedSvg.documentElement.prepend(newHmiDefsElement);
            this.clonedSvg.documentElement.prepend(document.createTextNode('\n'));

            //add new hmiElement 'hmi:self'
            const newSvgHmiElement = document.createElementNS(this.svgHmiNS.hmi, "hmi:self");            
            this.setXmlElementAttribute(newSvgHmiElement, this.selfVals, 0, 5);
            this.clonedSvg.documentElement.prepend(newSvgHmiElement);
        }
        else {
            //change value when hmiElement exists
            this.setXmlElementAttribute(hmiElement, this.selfVals, 0, 5);
        }
        //-> textarea
        this.txtSource.setText(this.toString(this.viewBox, this.clonedSvg?.documentElement?.innerHTML));

        return this.txtSource;
    }

    setXmlElementAttribute(xmlElement, arrAttributes, arrStart, arrCount) {
        const arrDim = this.getArrDim(arrAttributes);

        if (!Array.isArray(arrAttributes)) {
            console.log(`"Error wrong type: !Array.isType(arrAttributes) = ${typeof arrAttributes}"`);
            return null;
        }

        if (arrDim != 2) {
            console.log(`"Error wrong Dimension: should arr[[,],[,]] (2) = arrAttributes had "`);
            return null;
        }

        for (let i = arrStart; i < arrStart+arrCount; i++) {
            let AttributeName = arrAttributes[i][0];
            let AttributeVal = arrAttributes[i][1];
            xmlElement.setAttribute(AttributeName, AttributeVal);
        }
    }

    // Clear the existing SVG and text content.
    clear() {
        this.svg.textContent = "";
        this.clonedSvg = null;
    }

    getArrDim(arr, dimension = 1) {
        if (Array.isArray(arr)) {
            return this.getArrDim(arr[0], dimension + 1);
        }
        return dimension - 1;
    }

    // Convert SVG to string format.
    toString(viewBox, innerHTML) {
        if (viewBox?.length > 0 && innerHTML?.length > 0) {
            return [
                `<!DOCTYPE svg PUBLIC "-//SIEMENS//DTD SVG 1.0 TIA-HMI//EN" "${this.svgHmiNS.siemensDocType}">\n`,
                `<svg xmlns="${this.svgHmiNS.svg}"\n`,
                `xmlns:xlink="${this.svgHmiNS.xlink}"\n`,
                `xmlns:hmi="${this.svgHmiNS.hmi}"\n`,
                `xmlns:hmi-bind="${this.svgHmiNS.hmiBind}"\n`,
                `xmlns:hmi-bind--xlink="${this.svgHmiNS.hmiBindXlink}"\n`,
                `xmlns:hmi-Element="${this.svgHmiNS.hmiElement}"\n`,
                `xmlns:hmi-feature="${this.svgHmiNS.hmiFeature}"\n`,
                `xmlns:hmi-event="${this.svgHmiNS.hmiEvent}"\n`,
                `viewBox="${viewBox}"\n`,
                'preserveAspectRatio="none">\n',
                innerHTML,
                "</svg>",
            ].join("");
        }
        return null;
    }
}