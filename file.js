const fileExp = document.querySelector("#fileExplorer");
const editor = document.querySelector("textarea");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
let files = new Array();
let fileShortcuts;
let currentFile;

const css = document.querySelector("style");

const saveFile = function() {
    localStorage.setItem("files",JSON.stringify(files));
}

const deactivateEditor = function() {
    editor.value = "No file selected";
    editor.style.pointerEvents = "none";
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected"); shortcut.classList.remove("unselected")});
}

const activateEditor = function() {
    const shortcutId = event.target.id;
    currentFile = shortcutId;
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected"); shortcut.classList.add("unselected");});
    editor.placeholder = "Your Code here...";
    editor.style.pointerEvents = "all";
    if (shortcutId === "") {
        event.target.parentElement.classList.remove("unselected");
        event.target.parentElement.classList.add("selected");
        editor.value = files[event.target.parentElement.id].code;
    } else {
        event.target.classList.remove("unselected");
        event.target.classList.add("selected");
        editor.value = files[shortcutId].code;
    }
    editor.focus();
    editor.selectionStart = 0;
    editor.selectionEnd = 0;
}

function hide(element) {
    element.classList.toggle("hidden");
}

function deleteFile() {
    event.preventDefault();
    const toDelete = event.target;
    toDelete.parentElement.removeChild(toDelete);
    const filtered = files.filter((file) => {
        return file.no !== parseInt(toDelete.id);
    });
    files = filtered;
    files.forEach((file) => {file.no = files.indexOf(file)});
    deactivateEditor();
    saveFile();
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
    let cancel = false;
    files.forEach((file) => {
        if (file.name === fileName) {
            cancel = true;
            alert("The file with the same name already exists.");
            return;
        }
    });
    if (cancel === false) {
        if ((fileName.match(/\./g) || []).length > 1 || fileName.includes(" ") || fileName.includes("?") || fileName.includes("*") || fileName.includes("\"") || fileName.includes("'")) {
            alert("Spaces, dots, and special characters other than file extension are not allowed in file's name.");
            event.target.querySelector("input").value = "";
        } else if (fileName === "") {
            hide(fileCrtForm);
            hide(fileCrtBtn);
        } else if (!(fileName.split(".")[1] === "html" || fileName.split(".")[1] === "css" || fileName.split(".")[1] === "js" || fileName.split(".")[1] === "txt")) {
            alert("Only HTML, CSS, and JavaScript is supported in Artrium Code currently.");
        } else if (files.length > 9) {
            alert("Maximum count of files are 10.");
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
}

function displayFile(file) {
    const div = document.createElement("div");
    if (file.type === "JS") {
        div.innerHTML = `<span>JavaScript</span>${file.name}`;
    } else if (file.type === "TXT") {
        div.innerHTML = `<span>Text</span>${file.name}`;
    } else {
        div.innerHTML = `<span>${file.type}</span>${file.name}`;
    }
    // div.innerHTML = `<span><img src="${file.type}.png"></span>${file.name}`;
    div.classList.add("file");
    div.classList.add(file.type);
    div.id = file.no;
    fileExp.appendChild(div);
}

function init() {
    const loadedFiles = JSON.parse(localStorage.getItem("files"));
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
        fileShortcuts.forEach((shortcut) => {
            shortcut.addEventListener("click",activateEditor);
            shortcut.addEventListener("contextmenu",deleteFile);
        });
    });
}

init();