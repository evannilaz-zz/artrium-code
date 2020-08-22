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

const languageLists = {
    js: "javascript",
    json: "javascript",
    html: "xml",
    rst: "rust",
    py: "python",
    sh: "shell",
    ps1: "powershell",
    rb: "ruby"
}

function configure(event) {
    const lang = languageLists[event.target.classList[1]];
    let temp = false;

    document.head.querySelectorAll("script").forEach((scriptTag) => {
        if (!scriptTag.src.includes(lang) && !temp) {
            const newScript = document.createElement("script");
            newScript.src = `https://codemirror.net/mode/${lang}/${lang}.js`;
            document.head.appendChild(newScript);
            temp = true;
        }
    });
    
    setTimeout(() => {cm_editor.setOption("mode",lang)},100);
    cm_editor.setValue(files[event.target.id].code);
}

function saveChanges(event) {
    files[document.querySelector(".file.selected").id].code = cm_editor.getValue();
}

function init() {
    setInterval(() => {fileShortcuts.forEach((shortcut) => {shortcut.addEventListener("click",configure)})});
}

init();