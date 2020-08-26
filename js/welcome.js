document.querySelectorAll("div>button")[0].addEventListener("click",() => {
    localStorage.setItem("files",JSON.stringify(new Array()));
    location.replace("main");
});

document.querySelectorAll("div>button")[1].addEventListener("click",() => {
    location.href = "https://github.com/ldhan0715/artrium-code/#readme";
});

if (localStorage.getItem("files") !== null) {
    location.replace("main.html");
}