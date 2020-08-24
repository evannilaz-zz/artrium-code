const fileExp = document.querySelector("#fileExplorer");
const fileCrtBtn = fileExp.querySelector("button");
const fileCrtForm = fileExp.querySelector("form");
const openFile = document.querySelector("#open");
const tabIndicator = document.querySelector("#edit #tabs");
const logoPage = document.querySelector("#edit #logoPage");
const contextmenu = document.querySelector("#contextmenu");
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
    } else {
        return true;
    }
}

const saveFile = function(notify = false) {
    if (notify) alert("File successfully saved.");
    localStorage.setItem("files",JSON.stringify(files));
}

function moveToTab(event) {
    let clickedTab;
    files.forEach((file) => {
        if (file.name === event.target.innerText) {
            clickedTab = files[file.no];
        }
    });

    tabIndicator.querySelectorAll(".tab").forEach((tab) => {tab.classList.remove("selected")});
    event.target.classList.add("selected");
    fileExp.querySelectorAll(".file").forEach((shortcut) => {if (shortcut.innerText === event.target.innerText) shortcut.click()});
}

function showLogoPage(hide) {
    if (hide) {
        logoPage.style.display = "flex";
        document.querySelector("#edit").style.background = "#263238";
        document.querySelector("#edit").style.justifyContent = "center";
        tabIndicator.style.display = "none";
        cm.classList.add("hidden");
    } else {
        logoPage.style.display = "none";
        document.querySelector("#edit").style.background = "none";
        document.querySelector("#edit").style.justifyContent = "flex-start";
        tabIndicator.style.display = "flex";
        cm.classList.remove("hidden");
    }
}

const deactivateEditor = function() {
    showLogoPage(true);
    if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
}

const activateEditor = function(event) {
    if (event.target.tagName === "DIV" || event.target.tagName === "IMG") {
        if (fileExp.querySelector(".selected")) saveFile();
        if (fileShortcuts) fileShortcuts.forEach((shortcut) => {shortcut.classList.remove("selected")});
        showLogoPage(false);
        let clickedShortcut = event.target;
        if (event.target.tagName === "IMG") {
            clickedShortcut = event.target.parentElement.parentElement;
        }
        
        clickedShortcut.classList.add("selected");
        
        const newTab = document.createElement("div");
        newTab.classList.add("tab");
        newTab.classList.add("selected");
        newTab.innerHTML = `<div></div><input type="button" value="✖">`;
        newTab.style.width = "0";

        let multipleTab = false;
        tabIndicator.querySelectorAll(".tab").forEach((tab) => {
            if (tab.querySelector("div").innerText === files[clickedShortcut.id].name) {
                multipleTab = true;
                tab.click();
            }
        });

        if (!multipleTab) {
            tabIndicator.querySelectorAll(".tab").forEach((tab) => {tab.classList.remove("selected")});
            tabIndicator.appendChild(newTab);
            setTimeout(() => {newTab.style.width = "9.5%"});
            setTimeout(() => {newTab.querySelector("div").innerText = files[clickedShortcut.id].name;},180);
            // cm_editor.focus();
        }
    }
}


function renameFile(event) {
    if (contexted.tagName === "DIV") {
        let clickedShortcut = contexted;
        prevFileName = clickedShortcut.innerText;
        clickedShortcut.innerHTML = clickedShortcut.innerHTML.slice(0,clickedShortcut.innerHTML.lastIndexOf(">") + 1);
        clickedShortcut.querySelector("form").style.display = "initial";
        clickedShortcut.querySelector("form>input").value = prevFileName;
        clickedShortcut.querySelector("form>input").focus();
        tabIndicator.querySelectorAll(".tab").forEach((tab) => {
            if (tab.innerText === prevFileName) {
                tab.parentElement.removeChild(tab);
                if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
                else deactivateEditor();
            }
        });
        contextmenu.classList.add("hidden");
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
                files[parseInt(event.target.parentElement.id)].type = inputValue.split(".")[1];
                event.target.parentElement.className = `file ${inputValue.split(".")[1]}`;
                event.target.parentElement.innerHTML = `<span><img src="https://raw.githubusercontent.com/dmhendricks/file-icon-vectors/master/dist/icons/high-contrast/${inputValue.split(".")[1]}.svg"></span><form><input type="text"></form>${inputValue}`;
                tabIndicator.querySelectorAll(".tab").forEach((tab) => {if (tab.innerText === prevFileName) tab.innerText = inputValue});
                saveFile();
            }
        }
    }
}

function hide(element) {
    if (element) element.classList.toggle("hidden");
}

function deleteFile(event) {
    event.preventDefault();
    let toDelete = event.target;
    if (toDelete.parentElement.className.includes("tab")) {
        toDelete = event.target.parentElement;
        toDelete.innerText = "";
        setTimeout(() => {toDelete.style.width = "0"});
        setTimeout(() => {
            toDelete.parentElement.removeChild(toDelete);
            if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
            else deactivateEditor();
        },150);
    } else if (contexted.parentElement.id === "fileExplorer") {
        let fileName = contexted.innerText;
        contexted.style.filter = "opacity(0)";
        setTimeout(() => {contexted.parentElement.removeChild(contexted);},200);
        files = files.filter((file) => {
            return file.no !== parseInt(contexted.id);
        });
        files.forEach((file) => {file.no = files.indexOf(file)});
        setTimeout(() => {
            for (var i = 0; i < document.querySelectorAll(".file").length; i++) {
                document.querySelectorAll(".file")[i].id = i;
            }
        },200);
        tabIndicator.querySelectorAll(".tab").forEach((tab) => {
            if (tab.innerText === fileName) {
                tab.innerText = "";
                setTimeout(() => {tab.style.width = "0"});
                setTimeout(() => {
                    tab.parentElement.removeChild(tab)
                    if (tabIndicator.querySelector(".tab")) tabIndicator.querySelector(".tab").click();
                    else deactivateEditor();
                },150);
            }
        });
        setTimeout(() => {contextmenu.classList.add("hidden")},200);
        saveFile();
    }
}

function showContextmenu(event) {
    event.preventDefault();
    contextmenu.classList.remove("hidden");
    contextmenu.style.top = event.pageY + "px";
    contextmenu.style.left = event.pageX + "px";
    contexted = event.target;
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
                type: fileName.split(".")[1],
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
    div.innerHTML = `<span><img src="https://raw.githubusercontent.com/dmhendricks/file-icon-vectors/master/dist/icons/high-contrast/${file.type}.svg"></span><form><input type="text"></form>${file.name}`;
    div.draggable = "true";
    div.classList.add("file");
    div.classList.add(file.type);
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
    if (data[1] != droppedElementId) {
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
}

function allowDrop(event) {
    event.preventDefault();
}

function init() {
    deactivateEditor();
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
            shortcut.addEventListener("click",activateEditor);
            shortcut.addEventListener("contextmenu",showContextmenu);
            // shortcut.querySelector("form").addEventListener("submit",(e) => {e.preventDefault()});
            shortcut.addEventListener("dragstart",drag);
            shortcut.addEventListener("drop",drop);
            shortcut.addEventListener("dragover",allowDrop);
        });
        document.querySelectorAll(".tab").forEach((shortcut) => {
            shortcut.addEventListener("click",moveToTab);
            shortcut.querySelector("input").addEventListener("click",deleteFile);
        });
    });
    document.querySelector("#delete").addEventListener("click",deleteFile);
    document.querySelector("#rename").addEventListener("click",() => {alert("Sorry. Renaming file is not available for a moment.\nWe'll fix this as soon as we can.")});
}

init();