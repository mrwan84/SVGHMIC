# SVG to SVGHMI Converter – Professional Editor

A robust, browser-based tool for converting SVG files to SVGHMI format, tailored for Siemens WinCC Unified. Streamline your HMI development workflow with advanced editing, parameter management, and export capabilities.

## Key Features

- **Intuitive SVG Editing:** Visual canvas with wireframe and pretty-format display modes.
- **Parameter Management:** Add, configure, and connect global parameters for dynamic HMI objects.
- **Efficient File Handling:** Load SVG files, clear canvas, and export SVGHMI files with ease.
- **Code Beautification:** Integrated [vkBeautify](js/vkBeautify/vkbeautify.js) for XML, JSON, CSS, and SQL formatting.
- **Modern UI:** Responsive sidebar, toolbar, and code panel for streamlined user experience.
- **Clipboard Integration:** One-click copy of generated SVGHMI code.

## Getting Started

1. **Open `index.html` in your browser.**
2. **Load an SVG:** Click **Load SVG** and select your file.
3. **Edit & Configure:** Use the sidebar to manage parameters and display options.
4. **Export:** Save your project as SVGHMI for WinCC Unified integration.

## Project Structure

- `index.html` – Main application interface
- `js/` – Source scripts
  - `app.js` – Core logic and event handling
  - `Editor.js` – SVG editor functionality
  - `Source.js` – Source code management
  - `vkBeautify/` – Code beautification library
- `Style/style.css` – Application styling
- `img/` – Branding and UI images

## License

This project is licensed under the MIT License.

---

### Resources

- **YouTube Channel:** [Automation Set](https://www.youtube.com/c/automationset)
- **Tutorial:** [How to create dynamic SVG for WinCC Unified (SVGHMI) | TIA Portal V17](https://www.youtube.com/watch?v=YCGwq2Hzmn0)

---

> This open-source project is under active development. New features and improvements are added regularly to enhance SVG-to-SVGHMI conversion and HMI parameter
