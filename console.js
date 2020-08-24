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
    console.logs = {history: new Array(), clear: function() {this.history.length = 0}};
    console.log = function() {
        console.logs.history.push(...arguments);
        console.stdlog.apply(console,arguments);
    }
}

function runCode() {
    event.preventDefault();
    const code = `
    try {
        ${cm_editor.getValue()}
        document.querySelector("#terminal").innerHTML += "<div>" + document.querySelector(".file.selected").innerText + ": " + console.logs.history[console.logs.history.length - 1] + "</div>";
    } catch (err) {
        let errMsg = new Array();
        err.message.split(" ").forEach((str) => {
            errMsg.push(str[0].toUpperCase() + str.slice(1));
        });
        document.querySelector("#error").innerHTML = err;
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
        terminal.style.display = "block";
        terminal.style.transform = "none"
        full = false;
    }
}

function init() {
    setHistorySaver();
    document.querySelectorAll("#console #mode div").forEach((div) => {div.addEventListener("click",setMode)});
    document.querySelectorAll("#console #mode div")[1].click();
}

init();