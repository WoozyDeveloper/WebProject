var pic1 = document.getElementById("pic1");
var pic2 = document.getElementById("pic2");
var pic3 = document.getElementById("pic3");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    for(var i=3600;i>=0;i--)
    {
            console.log(i);
            pic1.style.transform = "rotate(" + i + "deg)";
            pic2.style.transform = "rotate(" + -i + "deg)";
            pic3.style.transform = "rotate(" + i + "deg)";
            await sleep(10);
    }
}

demo();