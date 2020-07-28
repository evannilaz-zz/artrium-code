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

function bracketAutocomplete(key) {
    function closeBracket(closing) {
        function checkMultipleBracket(closer) {
            console.log(editor.value[cursor] + editor.value[cursor + 1]);
            if (editor.value[cursor] + editor.value[cursor + 1] === `${closer}${closer}`) {
                editor.value = editor.value.slice(0,cursor) + editor.value.slice(cursor + 2);
                editor.setSelectionRange(cursor,cursor);
            }
        }
        const cursor = editor.selectionStart;
        editor.value = stringInsert(editor.value,cursor,closing);
        editor.setSelectionRange(cursor,cursor);
        ["}",")","]","\"","'","`"].forEach((bracket) => {
            checkMultipleBracket(bracket);
        });
    }
    symbols.forEach((symbol) => {
        if (key === symbol) {
            if (symbol === "{") {
                closeBracket("}");
            } else if (symbol === "(") {
                closeBracket(")");
            } else if (symbol === "[") {
                closeBracket("]");
            } else {
                closeBracket(symbol);
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
        editor.value = stringInsert(editor.value,editor.selectionStart,"\t");
        editor.setSelectionRange(editor.selectionStart - 2,editor.selectionStart - 2);
    }
}

function keyUpEvent(event) {
    const key = event.key;
    push(key,"up");
    bracketAutocomplete(key);
    if (keyHistory.up[0] === "{" && keyHistory.up[1] === "Enter" && !keyHistory.up.includes("Backspace")) {
        let cursor = editor.selectionStart;
        editor.value = stringInsert(editor.value,cursor,"\n");
        cursor = editor.selectionStart;
        editor.value = stringInsert(editor.value,cursor - 2,"\t");
        editor.setSelectionRange(cursor - 1, cursor - 1);
    }
    
    const openingIndex = editor.value.lastIndexOf("{");
    const closingIndex = editor.value.lastIndexOf("}");

    if (openingIndex < closingIndex && openingIndex + 3 < editor.selectionStart && editor.selectionStart < closingIndex && keyHistory.down.includes("Enter")) {
        editor.value = stringInsert(editor.value,editor.selectionStart,"\t");
        editor.setSelectionRange(editor.selectionStart - 2,editor.selectionStart - 2);
    }
}

function init() {
    editor.addEventListener("keydown",keyDownEvent);
    editor.addEventListener("keyup",keyUpEvent);
}

init();