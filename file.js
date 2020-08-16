const fileExp = document.querySelector("#fileExplorer");
const editor = document.querySelector("textarea");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
const openFile = document.querySelector("#open");
const tabIndicator = document.querySelector("#edit #tabs");
const lineNumberIndicator = document.querySelector("#edit #lineNumber");
const logoPage = document.querySelector("#edit #logoPage");
let files = new Array();
let fileShortcuts = new Array();

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

function filterFileName(fileName) {
    if (!/^[0-9a-zA-Z ... ]+$/.test(fileName) || fileName.split(".")[1] === undefined) {
        alert("The file name you've entered is unavailable.");
        return false;
    } else if (!(fileName.split(".")[1] === "html" || fileName.split(".")[1] === "css" || fileName.split(".")[1] === "js" || fileName.split(".")[1] === "txt")) {
        alert("Only HTML, CSS, and JavaScript is supported in Artrium Code currently.");
        return false;
    } else {
        return true;
    }
}

const saveFile = function(notify = false) {
    if (notify) alert("File successfully saved.");
    localStorage.setItem("files",JSON.stringify(files));
}

function moveToTab(event) {
    files.forEach((file) => {
        if (file.name === event.target.innerText) {
            editor.value = files[file.no].code;
        }
    });
    tabIndicator.querySelectorAll(".tab").forEach((tab) => {tab.classList.remove("selected")});
    event.target.classList.add("selected");
    fileExp.querySelectorAll(".file").forEach((shortcut) => {if (shortcut.innerText.split("\n")[1] === event.target.innerText) shortcut.click()})
}

function showLogoPage() {
    if (logoPage.style.display !== "none") {
        editor.style.pointerEvents = "none";
        tabIndicator.style.display = "none";
        editor.style.display = "none";
        document.querySelector("#parent").style.display = "none";
    } else {
        editor.style.pointerEvents = "all";
        tabIndicator.style.display = "flex";
        editor.style.display = "initial";
        document.querySelector("#parent").style.display = "flex";
    }
}

const deactivateEditor = function() {
    logoPage.style.display = "flex";
    editor.value = "";
    showLogoPage();
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
    editor.blur();
}

const activateEditor = function(event) {
    if (event.target.tagName === "DIV" || event.target.tagName === "IMG") {
        if (fileExp.querySelector(".selected")) saveFile();
        if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
        logoPage.style.display = "none";
        showLogoPage();
        let clickedShortcut = event.target;
        if (event.target.tagName === "IMG") {
            clickedShortcut = event.target.parentElement.parentElement;
        }
        
        clickedShortcut.classList.add("selected");
        
        const newTab = document.createElement("div");
        newTab.innerText = files[clickedShortcut.id].name;
        newTab.classList.add("tab");
        newTab.classList.add("selected");

        // if (files[clickedShortcut.id].code.find("\n") < 1) {
        //     lineNumberIndicator.textContent += "1\r\n";
        // } else if (files[clickedShortcut.id].code.find("\n")) {
        //     for (var i = 0; i < files[clickedShortcut.id].code.find("\n").length; i++) {
        //         lineNumberIndicator.textContent += (i + 1).toString() + "\r\n";
        //     }
        // }
        logoPage.style.display = "none";
        editor.value = files[clickedShortcut.id].code;
        editor.focus();
        editor.setSelectionRange(0,0);
        editor.scrollTop = 0;

        let multipleTab = false;
        tabIndicator.querySelectorAll(".tab").forEach((tab) => {
            if (tab.innerText === newTab.innerText) {
                multipleTab = true;
                if (tab.innerText === newTab.innerText) tab.click();
            }
        });

        if (!multipleTab) {
            tabIndicator.querySelectorAll(".tab").forEach((tab) => {tab.classList.remove("selected")});
            tabIndicator.appendChild(newTab);
        }
    }
}


function renameFile(event) {
    if (event.target.tagName === "DIV") {
        let clickedShortcut = event.target;
        prevFileName = clickedShortcut.innerText
        clickedShortcut.innerHTML = clickedShortcut.innerHTML.slice(0,clickedShortcut.innerHTML.lastIndexOf(">") + 1);
        clickedShortcut.querySelector("form").style.display = "initial";
        clickedShortcut.querySelector("form>input").value = prevFileName;
        clickedShortcut.querySelector("form>input").focus();
    } else if (event.target.tagName === "FORM") {
        event.preventDefault();
        const inputValue = event.target.querySelector("input").value;
        let cancel;

        files.forEach((file) => {
            if (file.name === inputValue && prevFileName !== inputValue) {
                cancel = true;
                alert("The file with the same name already exists.");
                return;
            }
        });

        if (!cancel) {
            if (filterFileName(inputValue)) {
                files[parseInt(event.target.parentElement.id)].name = inputValue;
                files[parseInt(event.target.parentElement.id)].type = inputValue.split(".")[1].toUpperCase();
                event.target.parentElement.className = `file ${inputValue.split(".")[1].toUpperCase()}`;
                event.target.parentElement.innerHTML = `<span><img src="assets/${inputValue.split(".")[1].toUpperCase()}.webp"></span><form><input type="text"></form>${inputValue}`;
                tabIndicator.querySelectorAll(".tab").forEach((tab) => {if (tab.innerText === prevFileName) tab.innerText = inputValue});
                saveFile();
            }
        }
    }
}

function hide(element) {
    element.classList.toggle("hidden");
}

function deleteFile(event) {
    event.preventDefault();
    let toDelete = event.target;
    if (toDelete.parentElement.id === "fileExplorer") {
        let fileName = toDelete.innerText;
        toDelete.parentElement.removeChild(toDelete);
        files = files.filter((file) => {
            return file.no !== parseInt(toDelete.id);
        });
        files.forEach((file) => {file.no = files.indexOf(file)});
        for (var i = 0; i < document.querySelectorAll(".file").length; i++) {
            document.querySelectorAll(".file")[i].id = i;
        }
        tabIndicator.querySelectorAll(".tab").forEach((tab) => {
            if (tab.innerText === fileName) {
                tab.parentElement.removeChild(tab);
                if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
                else deactivateEditor();
            }
        });
        saveFile();
    } else if (toDelete.className.includes("tab")) {
        toDelete.parentElement.removeChild(toDelete);
        if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
        else deactivateEditor();
    }
}


function prepNewFile(event) {
    const input = fileCrtForm.querySelector("input");
    if (event.target.innerText.includes("+")) {
        hide(fileCrtBtn);
        hide(fileCrtForm);
        input.focus();
    } else {
        event.preventDefault();
        const name = input.value;
        const code = "";
        crtNewFile(name,code);
        input.value = "";
        input.blur();
    }
}

function crtNewFile(fileName,innerCode) {
    let cancel = false;
    files.forEach((file) => {
        if (file.name === fileName) {
            cancel = true;
            alert("The file with the same name already exists.");
            return;
        }
    });
    if (cancel === false) {
        if (filterFileName(fileName)) {
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
    div.innerHTML = `<span><img src="assets/${file.type}.webp"></span><form><input type="text"></form>${file.name}`;
    div.draggable = "true";
    div.classList.add("file");
    div.id = file.no;
    fileExp.appendChild(div);
}

function drag(event) {
    event.dataTransfer.setData("text/plain",JSON.stringify([event.target.outerHTML,event.target.id]));
    event.target.classList.add("dragged");
}

function drop(event) {
    event.preventDefault();
    fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("dragged")});
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    const droppedElement = event.target.outerHTML;
    const droppedElementId = event.target.id;
    const droppedFile = files[parseInt(droppedElementId)];
    const draggedFile = files[parseInt(data[1])];
    document.getElementById(data[1]).outerHTML = droppedElement;
    event.target.outerHTML = data[0];
    for (var i = 0; i < document.querySelectorAll(".file").length; i++) {
        document.querySelectorAll(".file")[i].id = i;
    }
    files.forEach((file) => {
        if (file.no === parseInt(droppedElementId)) {
            files[parseInt(droppedElementId)] = draggedFile;
            file.no = parseInt(data[1]);
        } else if (file.no === parseInt(data[1])) {
            files[parseInt(data[1])] = droppedFile;
            file.no = parseInt(droppedElementId);
        }
    });
    saveFile();
}

function allowDrop(event) {
    event.preventDefault();
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
    fileCrtForm.querySelector("input").addEventListener("blur",() => {
        hide(fileCrtBtn);
        hide(fileCrtForm);
    });
    openFile.addEventListener("input",getFile);
    fileExp.addEventListener("mousemove",() => {
        fileShortcuts = document.querySelectorAll(".file");
        fileShortcuts.forEach((shortcut) => {
            shortcut.addEventListener("dblclick",renameFile);
            shortcut.addEventListener("click",activateEditor);
            shortcut.addEventListener("contextmenu",deleteFile);
            shortcut.querySelector("form").addEventListener("submit",renameFile);
            shortcut.addEventListener("dragstart",drag);
            shortcut.addEventListener("drop",drop);
            shortcut.addEventListener("dragover",allowDrop);
        });
        document.querySelectorAll(".tab").forEach((shortcut) => {
            shortcut.addEventListener("click",moveToTab);
            shortcut.addEventListener("contextmenu",deleteFile);
        });
    });
}

init();