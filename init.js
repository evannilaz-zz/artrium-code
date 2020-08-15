const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function checkMobile() {
    if (mobile.test(navigator.userAgent)) {
        alert("Sorry, Artrium Code is not for mobile yet.");
        location.replace("about:blank");
    }
}

checkMobile();