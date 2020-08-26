document.querySelectorAll("div>button")[0].addEventListener("click",() => {
    localStorage.setItem("files","");
    location.href = "../index.html";
});

document.querySelectorAll("div>button")[1].addEventListener("click",() => {
    location.href = "https://github.com/ldhan0715/artrium-code/#readme";
});