const fileExp = document.querySelector("#fileExplorer");
const editor = document.querySelector("textarea");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
const openFile = document.querySelector("#open");
let files = new Array();
let fileShortcuts = new Array();
let currentFile;

const css = document.querySelector("style");

function getFile() {
    const file = openFile.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = (event) => {
        crtNewFile(file.name,event.target.result);
    }
    reader.onerror = (event) => {
        alert("Error Reading File");
    }
}

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
    for (var i = 0; i < document.querySelectorAll(".file").length; i++) {
        document.querySelectorAll(".file")[i].id = i;
    }
    deactivateEditor();
    saveFile();
}

function prepNewFile() {
    const input = fileCrtForm.querySelector("input");
    function toggleHide() {
        hide(fileCrtBtn);
        hide(fileCrtForm);
        input.removeEventListener("focusout",toggleHide);
    }
    if (event.target.innerText.includes("+")) {
        input.removeEventListener("focusout",toggleHide);
        hide(fileCrtBtn);
        hide(fileCrtForm);
        input.focus();
        input.addEventListener("focusout",toggleHide);
    } else {
        event.preventDefault();
        const name = input.value;
        const code = "";
        crtNewFile(name,code);
        hide(fileCrtForm);
        hide(fileCrtBtn);
    }
}

function crtNewFile(fileName,innerCode) {
    event.preventDefault();
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
        } else if (!(fileName.split(".")[1] === "html" || fileName.split(".")[1] === "css" || fileName.split(".")[1] === "js" || fileName.split(".")[1] === "txt")) {
            alert("Only HTML, CSS, and JavaScript is supported in Artrium Code currently.");
        } else if (files.length > 9) {
            alert("Maximum count of files are 10.");
        } else {
            const fileInfo = {
                name: fileName,
                type: fileName.split(".")[1].toUpperCase(),
                no: files.length,
                code: innerCode
            };
            files.push(fileInfo);
            saveFile();
            fileCrtForm.querySelector("input").value = "";
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
    fileCrtForm.addEventListener("submit",prepNewFile);
    openFile.addEventListener("input",getFile);
    setInterval(() => {
        fileShortcuts = document.querySelectorAll(".file");
        fileShortcuts.forEach((shortcut) => {
            shortcut.addEventListener("click",activateEditor);
            shortcut.addEventListener("contextmenu",deleteFile);
        });
    });
}

init();