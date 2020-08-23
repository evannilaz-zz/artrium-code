let cm_editor = CodeMirror.fromTextArea(document.querySelector("textarea"),{
    theme: "material",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    indentUnit: 3,
    autofocus: true,
    dragDrop: false,
    htmlMode: true,
    // lint: true,
    // gutters: ["CodeMirror-lint-markers"],
    extraKeys: {"Ctrl-Space": "autocomplete"},
    styleActiveLine: true
});

const languageLists = {
    js: "javascript",
    json: "javascript",
    html: "xml",
    rst: "rust",
    py: "python",
    sh: "shell",
    ps1: "powershell",
    rb: "ruby",
    md: "markdown"
};

let cm = document.querySelector(".CodeMirror");

function configure(event) {
    let lang = languageLists[event.target.classList[1]];
    let temp = false;
    if (!lang) lang = event.target.classList[1];

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

function syntaxHighlight() {
    document.querySelectorAll("span.cm-keyword").forEach((keyword) => {
        if (keyword.innerHTML !== "var" && keyword.innerHTML !== "const" && keyword.innerHTML !== "let" && keyword.innerHTML !== "function" && !keyword.classList.contains("cm-conditional")) {
            keyword.classList.add("cm-conditional");
        }
    });
    document.querySelectorAll("span.cm-variable").forEach((variable) => {
        document.querySelectorAll("span.cm-def").forEach((func) => {
            if (func.innerHTML === variable.innerHTML) {
                variable.classList.add("cm-def");
                variable.classList.remove("cm-variable");
            }
        });
    });
}

function init() {
    setInterval(() => {fileShortcuts.forEach((shortcut) => {shortcut.addEventListener("click",configure)})});
    setInterval(syntaxHighlight,10);
    cm.querySelector("textarea").addEventListener("input",saveChanges);
}

init();