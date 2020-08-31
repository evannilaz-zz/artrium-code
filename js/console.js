const terminal = document.querySelector("#console");
const terminalHistory = new Array();
let full = false;
let currentIndex;

function setMode(event) {
    if (terminal.querySelector(".selected")) terminal.querySelector(".selected").classList.remove("selected");
    event.target.classList.add("selected");
    document.querySelectorAll("#console>div").forEach((div) => {if (div.id !== "mode") div.classList.add("hidden")});
    document.querySelector(`#${event.target.innerHTML.toLowerCase()}`).classList.remove("hidden");
}

function setHistorySaver() {
    console.stdlog = console.log.bind(console);
    console.stderr = console.error.bind(console);
    console.stdwrn = console.warn.bind(console);
    console.log = function() {
        document.querySelector("#terminal").innerHTML += `<div>>> ${arguments[0]}</div>`;
    }
    console.error = function() {
        document.querySelector("#problems div").classList.add("hidden");
        document.querySelector("#problems").innerHTML += `<div class="err">[${arguments[1] ? document.querySelector(".file.selected").innerText : 'anonymous'}] ${arguments[0]}</div>`;
        document.querySelector("#mode div").click();
    }
    console.warn = function() {
        document.querySelector("#problems div").classList.add("hidden");
        document.querySelector("#problems").innerHTML += `<div class="wrn">[${arguments[1] ? document.querySelector(".file.selected").innerHTML : 'anonymous'}] ${arguments[0]}</div>`;
        document.querySelector("#mode div").click();
    }
    clear = function() {
        document.querySelectorAll("#terminal>div").forEach((div) => {
            if (div.id !== "termInput") {
                div.parentElement.removeChild(div);
            }
        });
    }
}

function runCode_terminal(event) {
    event.preventDefault();
    eval(`
    try {
        ${event.target.querySelector("input").value};
    } catch (err) {
        console.error(err,false);
    }
    `);
    terminalHistory.push(event.target.querySelector("input").value);
    event.target.querySelector("input").value = "";
    document.querySelector("#terminal input").focus();
}

function runCode() {
    event.preventDefault();
    if (full) hideConsole();
    const code = `
    try {
        ${cm_editor.getValue()}
    } catch (err) {
        console.error(err,true);
    }
    `;
    eval(code);
}

const hideConsole = function() {
    const terminal = document.querySelector("#console");
    const editor = document.querySelector("#edit");
    if (!full) {
        terminal.style.display = "none";
        editor.style.height = "100%";
        full = true;
    } else {
        editor.style.height = "66%";
        terminal.style.display = "initial";
        full = false;
    }
}

function recoverHistory(event) {
    const termInput = document.querySelector("#termInput");
    if (terminalHistory[0] !== undefined) {
        debugger;
        console.stdlog(terminalHistory[0])
        if (!currentIndex) currentIndex = terminalHistory.length - 1;
        console.stdlog(currentIndex);
        // if (event.key === "ArrowUp") {
        //     terminalInput.value = terminalHistory[currentIndex--];
        // } else if (event.key === "ArrowDown") {
        //     terminalInput.value = terminalHistory[currentIndex++];
        // }
    }
}

function init() {
    setHistorySaver();
    document.querySelectorAll("#console #mode div").forEach((div) => {div.addEventListener("click",setMode)});
    document.querySelectorAll("#console #mode div")[1].click();
    // document.querySelector("#termInput").addEventListener("keydown",recoverHistory);
}

init();