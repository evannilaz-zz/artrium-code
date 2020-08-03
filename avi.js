const navHeader = document.querySelector("nav h3");
const navToggle = document.querySelector("nav #toggle");
const navDownload = document.querySelector("nav #download");

navHeader.addEventListener("mouseenter",() => {
    navHeader.querySelector("div").style.width = "100%";
});

navHeader.addEventListener("mouseleave",() => {
    navHeader.querySelector("div").style.width = "0";
});

navToggle.addEventListener("click",() => {
    const explorer = document.querySelector("#fileExplorer");
    const editor = document.querySelector("#edit");
    if (explorer.style.width === "0%") {
        editor.style.paddingLeft = "20%";
        explorer.style.width = "20%";
        setTimeout(() => {document.querySelectorAll("#fileExplorer>*").forEach((element) => {element.style.display = "flex"})},240);
    } else {
        document.querySelectorAll("#fileExplorer>*").forEach((element) => {element.style.display = "none";})
        explorer.style.width = "0%";
        editor.style.paddingLeft = "0";
    }
})

navDownload.addEventListener("click",() => {
    if (document.querySelector(".selected")) {
        const file = new Blob([editor.value]);
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = document.querySelector(".selected").innerText.split("\n")[1];
        document.body.append(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },10000);
    } else {
        alert("You have to select the file to download first.");
    }
});