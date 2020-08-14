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

const saveFile = function() {
    event.preventDefault();
    localStorage.setItem("files",JSON.stringify(files));
}

function moveToTab() {
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
    logoPage.style.display = "initial";
    editor.value = "";
    showLogoPage();
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
    editor.blur();
}

const activateEditor = function() {
    if (event.target.tagName === "DIV" || event.target.tagName === "SPAN") {
        if (fileExp.querySelector(".selected")) saveFile();
        if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
        logoPage.style.display = "none";
        showLogoPage();
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


function renameFile() {
    if (event.target.tagName === "DIV" || event.target.tagName === "SPAN") {
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
            if (filterFileName(inputValue)) {
                if (inputValueType === "js") {
                    indicatedFileType = "JavaScript";
                } else if (inputValueType === "txt") {
                    indicatedFileType = "Text File";
                } else {
                    indicatedFileType = inputValueType.toUpperCase();
                }
    
                files[parseInt(event.target.parentElement.id)].name = inputValue;
                files[parseInt(event.target.parentElement.id)].type = inputValueType.toUpperCase();
                event.target.parentElement.className = `file ${inputValueType.toUpperCase()}`;
                event.target.querySelector("input").value = "";
                event.target.parentElement.innerHTML = `<span>${indicatedFileType}</span><form style="display: none"><input type="text"></form>${inputValue}`;
                tabIndicator.querySelectorAll(".tab").forEach((tab) => {if (tab.innerText === prevFileName) tab.innerText = inputValue});
                saveFile();
            }
        }
    }
}

function hide(element) {
    element.classList.toggle("hidden");
}

function deleteFile() {
    event.preventDefault();
    let toDelete = event.target;
    if (toDelete.parentElement.id === "fileExplorer" || toDelete.parentElement.parentElement.id === "fileExplorer") {
        if (toDelete.parentElement.parentElement.id === "fileExplorer") {
            toDelete = event.target.parentElement;
        }
        let fileName = toDelete.innerText.split("\n")[1];
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
    } else {
        toDelete.parentElement.removeChild(toDelete);
        if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
        else deactivateEditor();
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
        document.querySelectorAll(".tab").forEach((shortcut) => {
            shortcut.addEventListener("click",moveToTab);
            shortcut.addEventListener("contextmenu",deleteFile);
        });
    });
}

init();