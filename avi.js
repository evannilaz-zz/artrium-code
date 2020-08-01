const navHeader = document.querySelector("nav h3");
const navBtn = document.querySelector("nav button");

navHeader.addEventListener("mouseenter",() => {
    navHeader.querySelector("div").style.width = "100%";
});

navHeader.addEventListener("mouseleave",() => {
    navHeader.querySelector("div").style.width = "0";
});

navBtn.addEventListener("click",() => {
    const explorer = document.querySelector("#fileExplorer");
    const editor = document.querySelector("#edit");
    if (explorer.style.width === "0%") {
        editor.style.width = "80%";
        explorer.style.width = "20%";
    } else {
        explorer.style.width = "0%";
        editor.style.width = "100%";
    }
})