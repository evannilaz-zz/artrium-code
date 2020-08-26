const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function checkMobile() {
    if (mobile.test(navigator.userAgent)) {
        alert("Sorry, Artrium Code is not for mobile yet.");
        location.replace("about:blank");
    }
}

function bringOfflineResource() {
    document.head.querySelectorAll("script").forEach((scriptTag) => {
        scriptTag.src = scriptTag.src.replace("https://codemirror.net","codemirror");
    });
}

checkMobile();

if (!localStorage.getItem("visited")) {
    location.replace("welcome");
}

if (location.href.includes("127.0.0.1") || location.href.includes("localhost") || location.href.includes("C:/")) {
    bringOfflineResource();
}
