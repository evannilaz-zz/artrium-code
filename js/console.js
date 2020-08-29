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
    console.stderr = console.error.bind(console);
    console.stdwrn = console.warn.bind(console);
    console.log = function() {
        document.querySelector("#terminal").innerHTML += `<div>>> ${arguments[0]}</div>`;
        document.querySelector("#terminal input").focus();
    }
    console.error = function() {
        document.querySelector("#problems div").classList.add("hidden");
        document.querySelector("#problems").innerHTML += `<div class="err">[${arguments[1] ? document.querySelector(".file.selected").innerText : 'Anonymous'}] ${arguments[0]}</div>`;
        document.querySelector("#mode div").click();
    }
    console.warn = function() {
        document.querySelector("#problems div").classList.add("hidden");
        document.querySelector("#problems").innerHTML += `<div class="wrn">[${arguments[1] ? document.querySelector(".file.selected").innerHTML : 'Anonymous'}] ${arguments[0]}</div>`;
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
    event.target.querySelector("input").value = "";
}

function runCode() {
    event.preventDefault();
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

function init() {
    setHistorySaver();
    document.querySelectorAll("#console #mode div").forEach((div) => {div.addEventListener("click",setMode)});
    document.querySelectorAll("#console #mode div")[1].click();
}

init();