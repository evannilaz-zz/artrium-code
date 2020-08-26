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
    xhtml: "xml",
    rst: "rust",
    py: "python",
    sh: "shell",
    ps1: "powershell",
    rb: "ruby",
    md: "markdown",
    txt: "text",
};

const keywords = ["const","var","let","func","function","def","class"];

let cm = document.querySelector(".CodeMirror");

function importLang(file) {
    let lang = languageLists[file.classList[1]];
    if (!lang) lang = file.classList[1];
    if (!document.head.querySelector(`script[src='https://codemirror.net/mode/${lang}/${lang}.js']`) && lang !== "text") {
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
    if (lang === "xml") cm_editor.setOption("htmlMode",false); else cm_editor.setOption("htmlMode",true);
}

function saveChanges() {
    files[document.querySelector(".file.selected").id].code = cm_editor.getValue();
}

function syntaxHighlight() {
    if (document.querySelector(".file.selected") && (document.querySelector(".file.selected").classList.contains("txt") || document.querySelector(".file.selected").classList.contains("md"))) {
        cm.classList.remove("CodeMirror-default");
    } else if (document.querySelector(".file.selected")) {
        cm.classList.add("CodeMirror-default");
    }
    document.querySelectorAll("span.cm-keyword").forEach((keyword) => {
        if (!keywords.includes(keyword.innerHTML)) {
            keyword.classList.add("cm-keyword-2");
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