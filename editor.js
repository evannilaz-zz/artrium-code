const opener = ["(","{","[","\"","`"];
const closer = [")","}","]","\"","`"];

let keyHistory = new Array();
let keyHistory2 = new Array();

let tagName;

function insert(index,str,moveCursor = 1) {
    const cursor = editor.selectionStart;
    editor.value = editor.value.substring(0,index) + str + editor.value.substring(editor.selectionEnd);
    editor.selectionEnd = cursor + moveCursor;
}

function push(key) {
    if (!(key === "Shift" || key === " " || key.includes("Arrow"))) {
        if (keyHistory.length >= 5) keyHistory.shift();
        keyHistory.push(key);
    }
}

function bracket(key) {
    opener.forEach((bracket) => {
        if (key === bracket) {
            insert(editor.selectionStart,closer[opener.indexOf(bracket)],0);
        }


        if (keyHistory[3] === bracket && keyHistory[4] === "Enter" && editor.value[editor.selectionStart] === closer[opener.indexOf(bracket)]) {
            insert(editor.selectionStart,"\n",0);
            insert(editor.selectionStart,"\t");
        }
    });

    if (fileExp.querySelector(".selected").classList.contains("HTML")) {
        let angBracket_L = editor.value.find("<");
        let angBracket_R = editor.value.find(">");

        if (angBracket_L !== null && angBracket_R !== null) {
            angBracket_L = angBracket_L.filter((bracket) => {return bracket < editor.selectionStart});
            angBracket_L = Math.max(...angBracket_L);

            angBracket_R = angBracket_R.filter((bracket) => {return bracket >= editor.selectionStart});
            angBracket_R = Math.min(...angBracket_R);

            const tag = editor.value.slice(angBracket_L,angBracket_R);
            if (/<[a-z][\s\S]*>/i.test(tag) && !tag.includes(`</${tagName}`) && !tag.includes("!") && !tag.includes("/>")) {
                tagName = tag.split(" ")[0].replace("<","").replace(">","");
                insert(editor.selectionStart,`</${tagName}>`,0);
            }
        }

        if (keyHistory[3] === ">" && keyHistory[4] === "Enter" && editor.value.slice(editor.selectionStart,editor.selectionStart + 2) === "</") {
            insert(editor.selectionStart,"\n",0);
            insert(editor.selectionStart,"\t");
        }
    }
    
}

function editorScroll() {
    lineNumberIndicator.scrollTop = editor.scrollTop;
}

function keyDownEvent(event) {
    const key = event.key;
    push(key);
    if (key === "Tab") {
        event.preventDefault();
        insert(editor.selectionStart,"\t");
    }

    setTimeout(() => {
        bracket(key);
        files[parseInt(fileExp.querySelector(".selected").id)].code = editor.value;
    },100);
}

function shortcutKey(event) {
    keyHistory2.push(event.key);
    if (keyHistory2[keyHistory2.length - 2] === "Control" && keyHistory2[keyHistory2.length - 1] === "s") {
        event.preventDefault();
        saveFile(true);
    } else if (keyHistory2[keyHistory2.length - 2] === "Command" && keyHistory2[keyHistory2.length - 1] === "s") {
        event.preventDefault();
        saveFile(true);
    } /* else if (keyHistory2[keyHistory2.length - 2] === "Control" && keyHistory2[keyHistory2.length - 1] === ",") {
        location.href += "settings";
    } else if (keyHistory2[keyHistory2.length - 2] === "Command" && keyHistory2[keyHistory2.length - 1] === ",") {
        location.href += "settings";
    } */ else if (keyHistory2[keyHistory2.length - 2] === "Alt" && /^[1-9]$/.test(keyHistory2[keyHistory2.length - 1]) && document.getElementById(parseInt(keyHistory2[keyHistory2.length - 1]) - 1)) {
        document.getElementById(parseInt(keyHistory2[keyHistory2.length - 1]) - 1).click();
    } else if (keyHistory2[keyHistory2.length - 2] === "Option" && /^[1-9]$/.test(keyHistory2[keyHistory2.length - 1]) && document.getElementById(parseInt(keyHistory2[keyHistory2.length - 1]) - 1)) {
        document.getElementById(parseInt(keyHistory2[keyHistory2.length - 1]) - 1).click();
    }
}

function init() {
    deactivateEditor();
    editor.addEventListener("keydown",keyDownEvent);
    editor.addEventListener("scroll",editorScroll);
    document.querySelectorAll("*").forEach((element) => {element.addEventListener("keydown",shortcutKey)});
}

init();