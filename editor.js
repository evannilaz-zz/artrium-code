const opener = ["(","{","[","\"","`"];
const closer = [")","}","]","\"","`"];

let keyHistory = {
    up: [],
    down: []
};

String.prototype.find = function(query) {
    let index = new Array();
    for (var i = 0; i < this.length; i++) {
        if (this[i] === query) index.push(i);
    }

    return index;
}

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

function bracket(key) {
    opener.forEach((bracket) => {
        if (key === bracket) {
            insert(editor.selectionStart,closer[opener.indexOf(bracket)],0);
            // temp = new Array();
            // for (var i = 0; i < editor.value.find(bracket).length; i++) {
            //     temp.push([editor.value.find(bracket)[i],editor.value.find(closer[opener.indexOf(bracket)])[i]]);
            // }
            // console.log(temp);
        }


        if (keyHistory.down[3] === bracket && keyHistory.down[4] === "Enter" && editor.value[editor.selectionStart] === closer[opener.indexOf(bracket)]) {
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
    setTimeout(() => bracket(key),100);
}

function init() {
    deactivateEditor();
    editor.addEventListener("keydown",keyDownEvent);
    editor.addEventListener("input",(event) => {
        files[parseInt(fileExp.querySelector(".selected").id)].code = event.target.value;
        saveFile();
    });
}

init();