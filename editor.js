let cm_editor = CodeMirror.fromTextArea(document.querySelector("textarea"),{
    theme: "material",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    indentUnit: 3,
    autofocus: true,
    dragDrop: false,
    htmlMode: true,
    extraKeys: {"Ctrl-Space": "autocomplete", "Ctrl-/": "toggleComment"},
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
    md: "markdown",
    txt: ""
};

let cm = document.querySelector(".CodeMirror");

function importLang(file) {
    let lang = languageLists[file.classList[1]];
    if (!lang) lang = file.classList[1];
    if (!document.head.querySelector(`script[src='https://codemirror.net/mode/${lang}/${lang}.js']`)) {
        const newScript = document.createElement("script");
        newScript.src = `https://codemirror.net/mode/${lang}/${lang}.js`;
        document.head.appendChild(newScript);
    }
}

function configure(event) {
    let lang = languageLists[event.target.classList[1]];
    if (!lang) lang = event.target.classList[1];
    cm_editor.setValue(files[event.target.id].code);
    setTimeout(() => cm_editor.setOption("mode",lang));
}

function saveChanges() {
    files[document.querySelector(".file.selected").id].code = cm_editor.getValue();
}

function syntaxHighlight() {
    document.querySelectorAll("span.cm-keyword").forEach((keyword) => {
        if (keyword.innerHTML !== "var" && keyword.innerHTML !== "const" && keyword.innerHTML !== "let" && keyword.innerHTML !== "function" && !keyword.classList.contains("cm-conditional")) {
            keyword.classList.add("cm-conditional");
            keyword.classList.add("cm-keyword");
        }
    });
    document.querySelectorAll("span.cm-variable").forEach((variable) => {
        document.querySelectorAll("span.cm-def").forEach((func) => {
            if (func.innerHTML === variable.innerHTML && !variable.classList.contains("cm-def")) {
                variable.classList.add("cm-def");
                variable.classList.remove("cm-variable");
            }
        });
    });
    if (cm_editor.options.mode === "" || cm_editor.options.mode === "markdown") {
        document.querySelectorAll(".CodeMirror *").forEach((element) => {element.style.color = "#c8d6e5"});
    } else {
        document.querySelectorAll(".CodeMirror *").forEach((element) => {element.style.color = "#89ddff"});
    }
}

function init() {
    setInterval(() => {
        document.querySelectorAll(".file").forEach((shortcut) => {
            shortcut.addEventListener("click",configure);
            importLang(shortcut);
        })
        syntaxHighlight();
    });
    cm.querySelector("textarea").addEventListener("input",saveChanges);
}

init();