const editor = document.querySelector("textarea");

let brackets = ["(","{","[","\"","'","`"];

let keyHistory = {
    full: new Array(),
    down: new Array(),
    up: new Array()
};

String.prototype.insert = function(index,string) {
    return this.slice(0,index) + string + this.slice(index);
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

function moveCursor(count,cursor = editor.selectionStart) {
    editor.setSelectionRange(cursor + count, cursor + count);
}

function bracketAutocomplete(key) {
    function closeBracket(closer) {
        function checkMultipleBracket(closer) {
            if (editor.value[cursor] + editor.value[cursor + 1] === `${closer}${closer}`) {
                editor.value = editor.value.slice(0,cursor) + editor.value.slice(cursor + 2);
                moveCursor(0,cursor);
            }
        }
        const cursor = editor.selectionStart;
        editor.value = editor.value.insert(cursor,closer);
        moveCursor(0,cursor);
        brackets.forEach((bracket) => {
            checkMultipleBracket(bracket);
        });
    }
    brackets.forEach((bracket) => {
        if (key === bracket) {
            if (bracket === "{") {
                closeBracket("}");
            } else if (bracket === "(") {
                closeBracket(")");
            } else if (bracket === "[") {
                closeBracket("]");
            } else {
                closeBracket(bracket);
            }
        }
    });
}

function keyDownEvent(event) {
    const key = event.key;
    keyHistory.full.push(key);
    push(key,"down");
    if (key === "Tab") {
        event.preventDefault();
        editor.value = editor.value.insert(editor.selectionStart,"\t");
        moveCursor(-2);
    }
}

function keyUpEvent(event) {
    const key = event.key;
    push(key,"up");
    bracketAutocomplete(key);
    if (keyHistory.up[0] === "{" && keyHistory.up[1] === "Enter" && !keyHistory.up.includes("Backspace")) {
        let cursor = editor.selectionStart;
        editor.value = editor.value.insert(cursor,"\n");
        cursor = editor.selectionStart;
        editor.value = editor.value.insert(cursor - 2,"\t");
        moveCursor(-1,cursor);
    }
    
    const openingIndex = editor.value.lastIndexOf("{");
    const closingIndex = editor.value.lastIndexOf("}");

    if (openingIndex < closingIndex && openingIndex + 4 < editor.selectionStart && editor.selectionStart < closingIndex && keyHistory.down.includes("Enter") && !keyHistory.up.includes("Backspace")) {
        editor.value = editor.value.insert(editor.selectionStart,"\t");
        moveCursor(-2);
    }

    localStorage.setItem("code",JSON.stringify(editor.value));
}

function init() {
    const savedCode = JSON.parse(localStorage.getItem("code"));
    if (savedCode !== null) {
        editor.value = savedCode;
    }
    editor.addEventListener("keydown",keyDownEvent);
    editor.addEventListener("keyup",keyUpEvent);
}

init();