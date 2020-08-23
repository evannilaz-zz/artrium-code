const navHeader = document.querySelector("nav h3");
const navToggle = document.querySelector("nav #toggle");
const navDownload = document.querySelector("nav #download");
let temp;
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
        editor.style.width = "97.45%";
        editor.style.right = "0";
        editor.style.width = "79%";
        explorer.style.transform = "none";
        setTimeout(() => {cm.style.borderRadius = "10px 0 0 10px"},240);
    } else {
        explorer.style.transform = "translateX(-100%)";
        editor.style.width = "95%";
        editor.style.borderRadius = "10px";
        editor.style.right = "2.5%";
        cm.style.width = "98%";
        cm.style.borderRadius = "10px";
    }
})

navDownload.addEventListener("click", () => {
    if (fileExp.querySelector(".selected")) {
        const file = new Blob([cm_editor.getValue()]);
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

setInterval(() => {
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