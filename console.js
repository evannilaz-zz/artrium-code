const terminal = document.querySelector("#console");
let full = false;

function setMode(event) {
    if (terminal.querySelector(".selected")) terminal.querySelector(".selected").classList.remove("selected");
    event.target.classList.add("selected");
    document.querySelectorAll("#console>div").forEach((div) => {if (div.id !== "mode") div.classList.add("hidden")});
    document.querySelector(`#${event.target.innerHTML.toLowerCase()}`).classList.remove("hidden");
}

function setHistorySaver() {
    console.stdlog = console.log.bind(console);
    console.stderr = console.log.bind(console);
    console.log = function() {
        console.stdlog.apply(console,arguments);
        if (!document.querySelector(".file.selected")) {
            document.querySelector("#terminal").innerHTML += `<div>Console: ${arguments[0]}</div>`;
            document.querySelector("#terminal input").focus();
        } else {
            document.querySelector("#terminal").innerHTML += `<div>${document.querySelector(".file.selected").innerText}: ${arguments[0]}</div>`;
        }
    }
    console.error = function() {
        console.stderr.apply(console,arguments);
        document.querySelector("#error").innerHTML = arguments[0];
    }
}

function runCode_terminal(event) {
    event.preventDefault();
    const selected = document.querySelector(".file.selected");
    if (selected) selected.classList.remove("selected");
    eval(`
    try {
        ${event.target.querySelector("input").value};
    } catch (err) {
        console.error(err);
    }
    `);
    if (selected) selected.classList.add("selected");
}

function runCode() {
    event.preventDefault();
    const code = `
    try {
        ${cm_editor.getValue()}
    } catch (err) {
        console.error(err);
        document.querySelector("#mode div").click();
    }
    `;
    eval(code);
}

const hideConsole = function() {
    const terminal = document.querySelector("#console");
    const editor = document.querySelector("#edit");
    if (!full) {
        terminal.style.transform = "translateY(130%)";
        terminal.style.display = "none";
        editor.style.height = "100%";
        full = true;
    } else {
        editor.style.height = "66%";
        terminal.style.display = "flex";
        terminal.style.transform = "none"
        full = false;
    }
}

function init() {
    setHistorySaver();
    document.querySelectorAll("#console #mode div").forEach((div) => {div.addEventListener("click",setMode)});
    document.querySelectorAll("#console #mode div")[1].click();
    document.querySelector("#console #terminal form").addEventListener("submit",runCode_terminal);
}

init();