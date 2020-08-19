const navHeader = document.querySelector("nav h3");
const navToggle = document.querySelector("nav #toggle");
const navDownload = document.querySelector("nav #download");
let temp = 0;
let saved;

navHeader.addEventListener("mouseenter",() => {
    navHeader.querySelector("div").style.width = "95%";
    navHeader.querySelector("a>span").style.filter = "opacity(1)";
    document.querySelector("nav>span").style.filter = "opacity(1)";
});

navHeader.addEventListener("mouseleave",() => {
    navHeader.querySelector("div").style.width = "0";
    navHeader.querySelector("div").style.marginLeft = "95%";
    navHeader.querySelector("a>span").style.filter = "opacity(0)";
    document.querySelector("nav>span").style.filter = "opacity(0)";
    setTimeout(() => {navHeader.querySelector("div").style.marginLeft = "0"},200);
});

navToggle.addEventListener("click",() => {
    const explorer = document.querySelector("#fileExplorer");
    const editor = document.querySelector("#edit");
    if (editor.style.width === "95%") {
        editor.querySelector("#lineNumber").style.width = "2.55%";
        editor.querySelector("textarea").style.width = "97.45%";
        editor.style.right = "0";
        editor.style.width = "79%";
        explorer.style.transform = "none";
        setTimeout(() => {editor.style.borderRadius = "10px 0 0 10px"},240);
    } else {
        explorer.style.transform = "translateX(-100%)";
        editor.style.width = "95%";
        editor.style.borderRadius = "10px";
        editor.style.right = "2.5%";
        editor.querySelector("#lineNumber").style.width = "2%";
        editor.querySelector("textarea").style.width = "98%";
    }
})

navDownload.addEventListener("click",() => {
    if (fileExp.querySelector(".selected")) {
        const file = new Blob([editor.value]);
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileExp.querySelector(".selected").innerText;
        document.body.append(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },1000);
    } else {
        alert("You have to select the file to download first.");
    }
});

window.addEventListener('beforeunload', (event) => {
    if (!(location.href.includes("127.0.0.1") || location.href.includes("localhost") || location.href.includes("C:/"))) {
        if (!saved) {
            event.preventDefault();
            event.returnValue = '';
            return '';
        }
    }
});

editor.addEventListener("input",() => {
    const lineNumber = document.createElement("div");
    if (!editor.value.find("\n")) {
        lineNumberIndicator.innerHTML = "1\r\n";
    } else if (editor.value.find("\n").length + 2 !== lineNumberIndicator.innerHTML.split("\n").length) {
        for (var i = 0; i < editor.value.find("\n").length; i++) {
            lineNumber.innerHTML += (i + 1) + "\r\n";
        }
        lineNumber.innerHTML += lineNumber.innerHTML.split("\n").length + "\r\n";
        lineNumberIndicator.innerHTML = lineNumber.innerHTML;
    }
});

setInterval(() => {
    if (tabIndicator.innerHTML === "") {
        tabIndicator.style.height = "0";
        document.querySelector("#edit #parent").style.height = "100%";
        lineNumberIndicator.style.display = "none";
        editor.style.width = "100%";
        deactivateEditor();
    } else {
        editor.style.width = "98%";
        lineNumberIndicator.style.display = "block";
        document.querySelector("#edit #parent").style.height = "95%";
        tabIndicator.style.height = "5%";
    }

    const loadedFiles = JSON.parse(localStorage.getItem("files"));

    if (files.length === loadedFiles.length) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].name !== loadedFiles[i].name || files[i].type !== loadedFiles[i].type || files[i].no !== loadedFiles[i].no || files[i].code !== loadedFiles[i].code) {
                saved = false;
            } else {
                saved = true;
            }
        }
    } else {
        saved = false;
    }
});