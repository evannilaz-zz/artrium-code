let cm_editor = CodeMirror.fromTextArea(document.querySelector("textarea"),{
    theme: "material",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    indentUnit: 3,
    autofocus: true,
    dragDrop: false,
    htmlMode: true,
    smartIndent: true
});

function configure(event) {
    let configMode;
    if (event.target.classList.contains("HTML")) {
        configMode = "xml";
    } else if (event.target.classList.contains("JS") || event.target.classList.contains("JSON")) {
        configMode = "javascript";
    } else {
        configMode = event.target.classList.value.replace("file","").replace("selected","").replace(" ","").toLowerCase();
    }
    
    cm_editor.setOption("mode",configMode);
    cm_editor.setValue(files[event.target.id].code);
}

function saveChanges(event) {
    files[document.querySelector(".file.selected").id].code = cm_editor.getValue();
}

function init() {
    setInterval(() => {fileShortcuts.forEach((shortcut) => {shortcut.addEventListener("click",configure)})});
}

init();