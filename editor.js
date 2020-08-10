const opener = ["(","{","[","\"","`"];
const closer = [")","}","]","\"","`"];

let keyHistory = new Array();

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

function push(key) {
    if (!(key === "Shift" || key === " " || key === "Control")) {
        if (keyHistory.length >= 5) keyHistory.shift();
        keyHistory.push(key);
    }
}

function bracket(key) {
    const HTMLTagRegexp = /(<([^>]+)>)/;
    opener.forEach((bracket) => {
        if (key === bracket) {
            insert(editor.selectionStart,closer[opener.indexOf(bracket)],0);
            // temp = new Array();
            // for (var i = 0; i < editor.value.find(bracket).length; i++) {
            //     temp.push([editor.value.find(bracket)[i],editor.value.find(closer[opener.indexOf(bracket)])[i]]);
            // }
            // console.log(temp);
        }


        if (keyHistory[3] === bracket && keyHistory[4] === "Enter" && editor.value[editor.selectionStart] === closer[opener.indexOf(bracket)]) {
            insert(editor.selectionStart,"\n",0);
            insert(editor.selectionStart,"\t");
        }
    });

    // if (HTMLTagRegexp.test(editor.value) && fileExp.querySelector(".selected").classList.contains("HTML")) {
    //     const tagName = HTMLTagRegexp.exec(editor.value)[0].replace(/</,"").replace(/>/,"");
    //     if (!(tagName.includes("!") || tagName.includes("/"))) {
    //         insert(editor.selectionStart,`</${tagName}>`,0);
    //     }
    // }
}

function keyDownEvent(event) {
    const key = event.key;
    push(key,"down");
    if (key === "Tab") {
        event.preventDefault();
        insert(editor.selectionStart,"\t");
    }
    setTimeout(bracket,100,key);
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