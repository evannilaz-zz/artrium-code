let next_fired = false;
let hidden = false;

function shortcutKey(event) {
    if (event.ctrlKey &&  event.key === "s") {
        event.preventDefault();
        saveFile(true);
    } else if (event.altKey && /^[1-9]$/.test(event.key) && document.getElementById(parseInt(event.key) - 1)) {
        document.getElementById(parseInt(event.key) - 1).click();
    } else if (event.altKey && (event.key === "w" || event.key === "n") && tabIndicator.querySelector(".tab")) {
        const toDelete = document.querySelector(".tab.selected");
        let tabIndex = new Array();
        document.querySelectorAll(".tab").forEach((tab) => tabIndex.push(tab));
        tabIndex = tabIndex.indexOf(document.querySelector(".tab.selected"));
        if (event.key === "w") {
            toDelete.innerText = "";
            setTimeout(() => {toDelete.style.width = "0"});
            setTimeout(() => {
                toDelete.parentElement.removeChild(toDelete);
                if (document.querySelectorAll(".tab")[tabIndex - 1]) {
                    document.querySelectorAll(".tab")[tabIndex - 1].click();
                } else {
                    deactivateEditor();
                }
            },150);
        } else if (event.key === "n" && !next_fired) {
            if (document.querySelectorAll(".tab")[tabIndex + 1]) {
                document.querySelectorAll(".tab")[tabIndex + 1].click();
            } else {
                document.querySelector(".tab").click();
            }
        }
    } else if (event.key === "F5" && event.shiftKey && document.querySelector(".file.selected").classList.contains("js")) {
        runCode();
    } else if (event.ctrlKey && event.key === "`") {
        event.preventDefault();
        hideConsole();
    } else if (event.ctrlKey && event.key === "b") {
        const explorer = document.querySelector("#fileExplorer");
        const editor = document.querySelector("#full-edit");
        if (hidden) {
            editor.style.width = "78%";
            explorer.style.transform = "none";
            hidden = false;
        } else {
            explorer.style.transform = "translateX(-110%)";
            editor.style.width = "98%";
            cm.style.width = "98%";
            hidden = true;
        }
    }
}

function init() {
    window.addEventListener("keydown",shortcutKey);
    window.addEventListener("keyup",() => {next_fired = false});
    window.addEventListener("mousedown",(event) => {if (event.target.id !== "contextmenu" && event.target.parentElement.id !== "contextmenu") document.querySelector("#contextmenu").classList.add("hidden")});
}

init();