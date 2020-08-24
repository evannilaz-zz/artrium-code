const terminal = document.querySelector("#console");

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

function init() {
    setHistorySaver();
    document.querySelectorAll("#console #mode div").forEach((div) => {div.addEventListener("click",setMode)});
    document.querySelectorAll("#console #mode div")[1].click();
}

init();