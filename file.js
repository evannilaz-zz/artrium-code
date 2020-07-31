const fileExp = document.querySelector("#fileExplorer");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
let files = new Array();
let fileShortcuts;

const deactivateEditor = function() {
    const textarea = document.querySelector("textarea");
    textarea.placeholder = "No file selected";
    textarea.style.pointerEvents = "none";
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
}

const activateEditor = function() {
    const shortcutId = event.target.id;
    const textarea = document.querySelector("textarea");
    textarea.value = files[shortcutId].code;
    console.log(fileShortcuts);
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
    event.target.classList.add("selected");
}

function saveFile() {
    localStorage.setItem("files",JSON.stringify(files));
}

function hide(element) {
    element.classList.toggle("hidden");
}

function prepNewFile() {
    const input = fileCrtForm.querySelector("input");
    hide(fileCrtBtn);
    hide(fileCrtForm);
    input.focus();
}

function crtNewFile() {
    event.preventDefault();
    const fileName = event.target.querySelector("input").value;
    if ((fileName.match(/\./g) || []).length > 1 || fileName.includes(" ") || fileName.includes("?") || fileName.includes("*") || fileName.includes("\"") || fileName.includes("'")) {
        alert("Spaces, dots, and special characters other than file extension are not allowed in file's name.");
        event.target.querySelector("input").value = "";
    } else if (fileName === "") {
        hide(fileCrtForm);
        hide(fileCrtBtn);
    } else if (!(fileName.split(".")[1] === "html" || fileName.split(".")[1] === "css" || fileName.split(".")[1] === "js")) {
        alert("Only HTML, CSS, JavaScript is supported in Artrium Code currently.");
    } else {
        const fileInfo = {
            name: fileName,
            type: fileName.split(".")[1].toUpperCase(),
            no: files.length,
            code: ""
        };
        files.push(fileInfo);
        saveFile();
        event.target.querySelector("input").value = "";
        hide(fileCrtForm);
        hide(fileCrtBtn);
        displayFile(fileInfo);
    }
}

function displayFile(file) {
    const div = document.createElement("div");
    div.innerText = file.name;
    div.classList.add("file");
    div.classList.add(file.type);
    div.id = file.no;
    fileExp.appendChild(div);
}

function init() {
    let loadedFiles = JSON.parse(localStorage.getItem("files"));
    if (loadedFiles !== null) {
        loadedFiles.forEach((loadedFile) => {
            displayFile(loadedFile);
        });
        files = loadedFiles;
    }
    fileCrtBtn.addEventListener("click",prepNewFile);
    fileCrtForm.addEventListener("submit",crtNewFile);
    setInterval(() => {
        fileShortcuts = document.querySelectorAll(".file");
        fileShortcuts.forEach((shortcut) => {shortcut.addEventListener("click",activateEditor)});
    });
}

init();