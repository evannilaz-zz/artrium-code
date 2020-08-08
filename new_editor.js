const brackets = ["(","{","[","\"","`"];

let keyHistory = {
    up: [],
    down: []
};

function insert(index,str) {
    const cursor = editor.selectionStart;
    editor.value = editor.value.substring(0,index) + str + editor.value.substring(editor.selectionEnd);
    editor.selectionEnd = cursor + 1;
}

function keyUpEvent(event) {
    event.preventDefault();
    const key = event.key;
    keyHistory.up.push(key);
    if (key === "Tab") {
        insert(editor.selectionStart,"\t");
    }
}

function init() {
    deactivateEditor();
    // editor.addEventListener("keydown",keyDownEvent);
    editor.addEventListener("keyup",keyUpEvent);
    editor.addEventListener("input",(event) => {
        files[parseInt(fileExp.querySelector(".selected").id)].code = event.target.value;
        saveFile();
    });
}

init();