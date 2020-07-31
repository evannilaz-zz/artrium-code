const fileExp = document.querySelector("#fileExplorer");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
let files = new Array();

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
    } else {
        const fileObj = {
            name: fileName,
            type: fileName.split(".")[1].toUpperCase()
        };
        files.push(fileObj);
        saveFile();
        event.target.querySelector("input").value = "";
        hide(fileCrtForm);
        hide(fileCrtBtn);
        displayFile(fileObj);
    }
}

function displayFile(file) {
    const div = document.createElement("div");
    div.innerText = file.name;
    div.classList.add("fileName");
    div.classList.add(file.type);
    fileExp.appendChild(div);
}

function init() {
    const loadedFiles = JSON.parse(localStorage.getItem("files"));
    if (loadedFiles !== null) {
        loadedFiles.forEach((loadedFile) => {
            displayFile(loadedFile);
        });
    }
    fileCrtBtn.addEventListener("click",prepNewFile);
    fileCrtForm.addEventListener("submit",crtNewFile);
}

init();