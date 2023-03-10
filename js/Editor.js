/**
 * @author mrdoob / http://mrdoob.com
 */

class Editor {
  constructor(svg) {
    this.svg = svg;
    this.source = null;
  }

  setSource(source) {
    this.source = source;
  }

  setSVG(svg, paramDef) {
    this.svg.innerHTML = svg.documentElement.innerHTML;
    this.source.setText(this.toString(paramDef));
  }

  clear() {
    this.svg.textContent = "";
    this.source.setText(this.toString());
  }

  toString(paramDef) {
    // TODO Checkbox for auto-formating
    const Name = `FEST_${Math.floor(Math.random() * 1000)}`;
    return [
      '<!DOCTYPE svg PUBLIC "-//SIEMENS//DTD SVG 1.0 TIA-HMI//EN" "http://tia.siemens.com/graphics/svg/1.4/dtd/svg14-hmi.dtd">\n',
      "<!-- Fest GmbH M.Alsouki -->\n",
      '<svg xmlns="http://www.w3.org/2000/svg"\n',
      'xmlns:xlink="http://www.w3.org/1999/xlink"\n',
      'xmlns:hmi-bind--xlink="http://svg.siemens.com/hmi/bind/xlink/"\n',
      'xmlns:hmi="http://svg.siemens.com/hmi/"\n',
      'xmlns:hmi-bind="http://svg.siemens.com/hmi/bind/"\n',
      'xmlns:hmi-element="http://svg.siemens.com/hmi/element/"\n',
      'xmlns:hmi-feature="http://svg.siemens.com/hmi/feature/"\n',
      'xmlns:hmi-event="http://svg.siemens.com/hmi/event/"\n',
      'viewBox="0 0 600 400"\n',
      ' preserveAspectRatio="none">\n',
      `<hmi:self type="widget" displayName="${Name}" name="extended.${Name}" version="1.0.1" performanceClass="L">\n`,
      paramDef,
      "</hmi:self>\n",
      this.svg.innerHTML,
      "</svg>",
    ].join("");
  }
}
