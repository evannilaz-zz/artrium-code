const keyHistory = new Array();

function shortcutKey(event) {
    const lastKey = keyHistory[keyHistory.length - 1];
    if ((lastKey === "Control" || lastKey === "Command") &&  event.key === "s") {
        event.preventDefault();
        saveFile(true);
    } /* else if (keyHistory[keyHistory.length - 2] === "Control" && event.key === ",") {
        if (lastKey === "Control" || lastKey === "Command") location.href += "settings";
    } */ else if ((lastKey === "Alt" || lastKey === "Option") && /^[1-9]$/.test(event.key) && document.getElementById(parseInt(event.key) - 1)) {
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
    }
    keyHistory.push(event.key);
}

function init() {
    document.querySelectorAll("*").forEach((element) => {element.addEventListener("keydown",shortcutKey)});
}

init();