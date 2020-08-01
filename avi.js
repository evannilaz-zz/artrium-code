document.querySelector("h3").addEventListener("mouseenter",() => {
    document.querySelector("h3").querySelector("div").style.width = "100%";
});

document.querySelector("h3").addEventListener("mouseleave",() => {
    document.querySelector("h3").querySelector("div").style.width = "0";
});