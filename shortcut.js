const keyHistory = new Array();

function shortcutKey(event) {
    const lastKey = keyHistory[keyHistory.length - 1];
    if ((lastKey === "Control" || lastKey === "Command") &&  event.key === "s") {
        event.preventDefault();
        saveFile(true);
    } else if ((lastKey === "Alt" || lastKey === "Option") && /^[1-9]$/.test(event.key) && document.getElementById(parseInt(event.key) - 1)) {
        document.getElementById(parseInt(event.key) - 1).click();
    } else if ((lastKey === "Alt" || lastKey === "Option") && (event.key === "w" || event.key === "n") && tabIndicator.querySelector(".tab")) {
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
                    document.querySelector(".tab").click();
                }
            },150);
        } else if (event.key === "n") {
            if (document.querySelectorAll(".tab")[tabIndex + 1]) {
                document.querySelectorAll(".tab")[tabIndex + 1].click();
            } else {
                document.querySelector(".tab").click();
            }
        }
    } else if (event.key === "F5" && lastKey === "Shift" && document.querySelector(".file.selected").classList.contains("js")) {
        runCode();
    } /* else if (event.key === "`" && (lastKey === "Control" || lastKey === "Command")) {
        event.preventDefault();
        const terminal = document.querySelector("#console");
        const editor = document.querySelector("#edit");
        if (editor.style.height !== "inherit") {
            terminal.style.transform = "translateY(130%)";
            const height = window.getComputedStyle(fileExp).getPropertyValue("height");
            document.querySelector("#edit").style.height = window.getComputedStyle(fileExp).getPropertyValue("height");
        } else {
            terminal.style.transform = "none";
            editor.style.height = "66%";
        }
    } */
    keyHistory.push(event.key);
}

function init() {
    document.querySelectorAll("*").forEach((element) => {
        element.addEventListener("keydown",shortcutKey);
        element.addEventListener("mousedown",(event) => {if (event.target.id !== "contextmenu" && event.target.parentElement.id !== "contextmenu") document.querySelector("#contextmenu").classList.add("hidden")})
    });
}

init();