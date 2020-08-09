const opener = ["(","{","[","\"","`"];
const closer = [")","}","]","\"","`"];

let keyHistory = {
    up: [],
    down: []
};

function insert(index,str,moveCursor = 1) {
    const cursor = editor.selectionStart;
    editor.value = editor.value.substring(0,index) + str + editor.value.substring(editor.selectionEnd);
    editor.selectionEnd = cursor + moveCursor;
    saveFile();
}

function push(key,history) {
    if (!(key === "Shift" || key === " " || key === "Control")) {
        if (keyHistory[history].length >= 5) keyHistory[history].shift();
        keyHistory[history].push(key);
    }
}

function bracketAutoComplete(key) {
    opener.forEach((bracket) => {
        if (key === bracket) insert(editor.selectionStart,closer[opener.indexOf(bracket)],0);

        if (keyHistory.down[3] === bracket && keyHistory.down[4] === "Enter") {
            insert(editor.selectionStart,"\n",0);
            insert(editor.selectionStart,"\t");
        }
    });
}

function keyDownEvent(event) {
    const key = event.key;
    push(key,"down");
    if (key === "Tab") {
        event.preventDefault();
        insert(editor.selectionStart,"\t");
    }
    setTimeout(() => {
        bracketAutoComplete(key);
    },100);
}

function init() {
    deactivateEditor();
    editor.addEventListener("keydown",keyDownEvent);
    // editor.addEventListener("keyup",(event) => {
    //     bracketAutoComplete(event.key);
    // });
    editor.addEventListener("input",(event) => {
        files[parseInt(fileExp.querySelector(".selected").id)].code = event.target.value;
        saveFile();
    });
}

init();