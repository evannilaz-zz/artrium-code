const fileExp = document.querySelector("#fileExplorer");
const editor = document.querySelector("textarea");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
const openFile = document.querySelector("#open");
const tabIndicator = document.querySelector("#edit #tabs");
const lineNumberIndicator = document.querySelector("#edit #lineNumber");
let files = new Array();
let fileShortcuts = new Array();
let tabShortcuts = new Array();

String.prototype.find = function(query) {
    let index = new Array();
    for (var i = 0; i < this.length; i++) {
        if (this[i] === query) index.push(i);
    }

    if (index.length > 0) {
        return index;
    } else {
        return null;
    }
}

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
    event.preventDefault();
    localStorage.setItem("files",JSON.stringify(files));
}

function moveToTab() {
    editor.value = files[parseInt(event.target.id)].code;
    tabIndicator.querySelectorAll(".tab").forEach((tab) => {tab.classList.remove("selected")});
    event.target.classList.add("selected");
    fileExp.querySelectorAll(".file").forEach((shortcut) => {
        if (shortcut.id === event.target.id) {
            shortcut.click();
        }
    })
}

const deactivateEditor = function() {
    editor.value = "No file selected";
    editor.style.pointerEvents = "none";
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
}

const activateEditor = function() {
    if (event.target.tagName === "DIV" || event.target.tagName === "SPAN") {
        if (fileExp.querySelector(".selected")) saveFile();
        if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
        editor.placeholder = "Your Code here...";
        editor.style.pointerEvents = "all";
        let clickedShortcut;
        if (event.target.tagName === "SPAN") {
            clickedShortcut = event.target.parentElement;
        } else {
            clickedShortcut = event.target;
        }
        
        clickedShortcut.classList.add("selected");
        
        const newTab = document.createElement("div");
        newTab.innerText = files[clickedShortcut.id].name;
        newTab.classList.add("tab");
        newTab.classList.add("selected");
        newTab.id = clickedShortcut.id;

        if (files[clickedShortcut.id].code.find("\n")) {
            for (var i = 0; i < files[clickedShortcut.id].code.find("\n").length; i++) {
                lineNumberIndicator.innerHTML += (i + 1).toString() + "\t";
            }
        }

        editor.value = files[clickedShortcut.id].code;
        editor.focus();
        editor.selectionStart = 0;
        editor.selectionEnd = 0;
        editor.scrollTop = 0;

        let multipleTab = false;

        tabIndicator.querySelectorAll(".tab").forEach((tab) => {
            if (tab.id === newTab.id) {
                multipleTab = true;
            }
        });

        if (!multipleTab) {
            tabIndicator.querySelectorAll(".tab").forEach((tab) => {tab.classList.remove("selected")});
            tabIndicator.appendChild(newTab);
        } else {
            tabIndicator.querySelectorAll(".tab").forEach((tab) => {
                if (tab.id === newTab.id) {
                    tab.click();
                }
            });
        }
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
    const parent = toDelete.parentElement;
    toDelete.parentElement.removeChild(toDelete);
    if (parent.id === "fileExplorer") {
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
    } else {
        if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
    }
}


function prepNewFile() {
    const input = fileCrtForm.querySelector("input");
    if (event.target.innerText.includes("+")) {
        hide(fileCrtBtn);
        hide(fileCrtForm);
        input.focus();
    } else {
        event.preventDefault();
        const name = input.value;
        const code = "";
        hide(fileCrtBtn);
        hide(fileCrtForm);
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
        tabShortcuts = document.querySelectorAll(".tab");
        tabShortcuts.forEach((shortcut) => {
            shortcut.addEventListener("click",moveToTab);
            shortcut.addEventListener("contextmenu",deleteFile);
        });
    });
}

init();