let paramDef = "";
let contents;
//

const editor = new Editor(stage);
editor.setSource(new Source(textarea));

wireframe.addEventListener("change", function () {
  stage.classList.toggle("wireframe");
});

// LOAD

const form = document.createElement("form");
form.style.display = "none";
document.body.appendChild(form);

const input = document.createElement("input");
input.type = "file";
input.addEventListener("change", function (event) {
  const file = input.files[0];

  title.value = file.name.split(".")[0];

  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function (event) {
      contents = event.target.result;
      editor.setSVG(
        new DOMParser().parseFromString(contents, "image/svg+xml"),
        paramDef
      );
    },
    false
  );
  reader.readAsText(file);

  form.reset();
});
form.appendChild(input);

load.addEventListener("click", function () {
  input.click();
});

// SAVE
const Name = `AutomationSet_${Math.floor(Math.random() * 1000)}`;
const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link);

save.addEventListener("click", function () {
  const saveEditor = document.getElementById("textarea").textContent;
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(saveEditor, "text/xml");
  const s = new XMLSerializer();
  const str = s.serializeToString(xmlDoc);
  // console.log(str);
  const blob = new Blob([str], { type: "text/plain" });
  link.href = URL.createObjectURL(blob);
  link.download = title.value + "_" + Name + ".svghmi";
  link.click();
});

// CLEAR

clear.addEventListener("click", function () {
  editor.clear();
});

// paramDef
const paraName = document.getElementById("paramName");
const paraType = document.getElementById("paraType");
const add = document.getElementById("add");
add.addEventListener("click", (e) => {
  addParamDef();
});
//ADD

function addParamDef() {
  let defVal;
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  switch (paraType.value) {
    case "HmiColor":
      defVal = `0xFF${randomColor}`;
      break;
    case "number":
      defVal = "0";
      break;
    case "boolean":
      defVal = "false";
      break;
    default:
      break;
  }
  paramDef += `<hmi:paramDef name="${paraName.value}"      type="${paraType.value}"  default="${defVal}"  />\n`;
  editor.setSVG(
    new DOMParser().parseFromString(contents, "image/svg+xml"),
    paramDef
  );
  // console.log(paramDef);
}
