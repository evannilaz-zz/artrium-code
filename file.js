const fileExp = document.querySelector("#fileExplorer");
const editor = document.querySelector("textarea");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
const openFile = document.querySelector("#open");
let files = new Array();
let fileShortcuts = new Array();

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

function drag() {
    event.preventDefault();
    const data = event.dataTransfer;
    console.log(data);
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
    if (event.target.tagName === "DIV" || event.target.tagName === "SPAN") {
        if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected"); shortcut.classList.add("unselected");});
        editor.placeholder = "Your Code here...";
        editor.style.pointerEvents = "all";
        let clickedShortcut;
        if (event.target.tagName === "SPAN") {
            clickedShortcut = event.target.parentElement;
        } else {
            clickedShortcut = event.target;
        }
        clickedShortcut.classList.remove("unselected");
        clickedShortcut.classList.add("selected");
        editor.value = files[clickedShortcut.id].code;
        editor.focus();
    }
}


function renameFile() {
    if (event.target.tagName === "DIV" || event.target.tagName === "SPAN") {
        deactivateEditor();
        editor.blur();
        let clickedShortcut;
        if (event.target.tagName === "SPAN") {
            clickedShortcut = event.target.parentElement;
        } else {
            clickedShortcut = event.target;
        }
        const innerText = clickedShortcut.innerText.split("\n");
        prevFileName = innerText[1];
        clickedShortcut.innerHTML = `<span>${innerText[0]}</span><form style="display: initial"><input type="text"></form>`;
        clickedShortcut.querySelector("form>input").value = innerText[1];
        clickedShortcut.querySelector("form>input").focus();
    } else if (event.target.tagName === "FORM") {
        event.preventDefault();
        const inputValue = event.target.querySelector("input").value;
        const inputValueType = inputValue.split(".")[1];
        let indicatedFileType;
        let cancel;

        files.forEach((file) => {
            if (file.name === inputValue && prevFileName !== inputValue) {
                cancel = true;
                alert("The file with the same name already exists.");
                return;
            }
        });

        if (!cancel) {
            if (!/^[0-9a-zA-Z ... ]+$/.test(inputValue)) {
                alert("The file name you've entered is unavailable.");
                return;
            }

            if (inputValueType === "js") {
                indicatedFileType = "JavaScript";
            } else if (inputValueType === "txt") {
                indicatedFileType = "Text File";
            } else if (inputValueType === "html" || inputValueType === "css") {
                indicatedFileType = inputValueType.toUpperCase();
            } else if (inputValueType === undefined) {
                alert("You didn't enter any file extension.");
                return;
            } else {
                alert("Only HTML, CSS, and JavaScript is supported in Artrium Code currently.");
                return;
            }

            files[parseInt(event.target.parentElement.id)].name = inputValue;
            files[parseInt(event.target.parentElement.id)].type = inputValueType.toUpperCase();
            event.target.parentElement.className = `file ${inputValueType.toUpperCase()}`;
            event.target.querySelector("input").value = "";
            event.target.parentElement.innerHTML = `<span>${indicatedFileType}</span><form style="display: none"><input type="text"></form>${inputValue}`;
            saveFile();
        }
    }
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
        // input.removeEventListener("focusout",toggleHide);
        hide(fileCrtBtn);
        hide(fileCrtForm);
        input.focus();
        // input.addEventListener("focusout",toggleHide);
    } else {
        event.preventDefault();
        const name = input.value;
        const code = "";
        hide(fileCrtBtn);
        hide(fileCrtForm);
        // input.removeEventListener("focusout",toggleHide);
        crtNewFile(name,code);
        fileCrtForm.querySelector("input").value = "";
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
        if (!/^[0-9a-zA-Z ... ]+$/.test(fileName) || fileName.split(".")[1] === undefined) {
            alert("The file name you've entered is unavailable.");
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
            displayFile(fileInfo);
        }
    }
}

function displayFile(file) {
    const div = document.createElement("div");
    let fileType;
    if (file.type === "JS") {
        fileType = "JavaScript";
    } else if (file.type === "TXT") {
        fileType = "Text File";
    } else {
        fileType = file.type;
    }
    div.innerHTML = `<span>${fileType}</span><form><input type="text"></form>${file.name}`;
    div.draggable = "true";
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
    fileExp.addEventListener("mousemove",() => {
        fileShortcuts = document.querySelectorAll(".file");
        fileShortcuts.forEach((shortcut) => {
            shortcut.addEventListener("dblclick",renameFile);
            shortcut.addEventListener("click",activateEditor);
            shortcut.addEventListener("contextmenu",deleteFile);
            shortcut.querySelector("form").addEventListener("submit",renameFile);
        });
    });
}

init();