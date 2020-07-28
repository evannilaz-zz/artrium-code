const editor = document.querySelector("textarea");

let symbols = ["(","{","[","\"","'","`"];

let keyHistory = {
    full: new Array(),
    down: new Array(),
    up: new Array()
};

function stringInsert(thisString,index,string,rem = 0) {
    return thisString.slice(0,index) + string + thisString.slice(index + rem);
}

function symbolAutocomplete(key) {
    function autocomplete(closing) {
        const cursor = editor.selectionStart;
        editor.value = stringInsert(editor.value,cursor,closing);
        editor.setSelectionRange(cursor,cursor);
    }
    symbols.forEach((symbol) => {
        if (key === symbol) {
            if (symbol === "{") {
                autocomplete("}");
            } else if (symbol === "(") {
                autocomplete(")");
            } else if (symbol === "[") {
                autocomplete("]");
            } else {
                autocomplete(symbol);
            }
        }
    });
}

function push(key,history) {
    if (!(key === "Shift" || key === " " || key === "Control")) {
        if (keyHistory[history].length >= 2) {
            const lastKey = keyHistory[history][1];
            for (var i = 0; i < 2; i++) {
                keyHistory[history].pop();
            }
            keyHistory[history].push(lastKey);
        }
        keyHistory[history].push(key);
    }
}

function keyDownEvent(event) {
    const key = event.key;
    keyHistory.full.push(key);
    push(key,"down");
    if (key === "Tab") {
        event.preventDefault();
        editor.value = stringInsert(editor.value,editor.selectionStart,"\t");
        editor.setSelectionRange(editor.selectionStart - 2,editor.selectionStart - 2);
    }
}

function keyUpEvent(event) {
    const key = event.key;
    push(key,"up");
    symbolAutocomplete(key);
    if (keyHistory.up[0] === "{" && keyHistory.up[1] === "Enter" && !(keyHistory.up.includes("Backspace"))) {
        let cursor = editor.selectionStart;
        editor.value = stringInsert(editor.value,cursor,"\n");
        cursor = editor.selectionStart;
        editor.value = stringInsert(editor.value,cursor - 2,"\t");
        editor.setSelectionRange(cursor - 1, cursor - 1);
    }

    // if (editor.value.lastIndexOf("{") < editor.value.lastIndexOf("}") && editor.selectionStart < editor.value.lastIndexOf("}")) {
    //     editor.value = stringInsert(editor.value,editor.selectionStart - 2,"\t");
    // }
}

function init() {
    editor.addEventListener("keydown",keyDownEvent);
    editor.addEventListener("keyup",keyUpEvent);
}

init();