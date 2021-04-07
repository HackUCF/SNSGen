const el = document.querySelectorAll("input, textarea");
const twtr = document.getElementById("capture_twtr");
const insta = document.getElementById("capture_insta");

document.getElementById("img_one").onchange = evt => {updateImg(evt, '.image.one')};
document.getElementById("img_two").onchange = evt => {updateImg(evt, '.image.two')};

function update() {
    for (let i = 0; i < 2; i++) {
        document.querySelectorAll(".title.one")[i].innerHTML = document.getElementById("title_one").value;
        document.querySelectorAll(".sub.one")[i].innerHTML = document.getElementById("sub_one").value;
        document.querySelectorAll(".body.one")[i].innerHTML = document.getElementById("body_one").value.replace(/\n/g, "<br>");

        document.querySelectorAll(".title.two")[i].innerHTML = document.getElementById("title_two").value;
        document.querySelectorAll(".sub.two")[i].innerHTML = document.getElementById("sub_two").value;
        document.querySelectorAll(".body.two")[i].innerHTML = document.getElementById("body_two").value.replace(/\n/g, "<br>");
    }
    altText();
}

function updateImg(event, selector) {
    // from https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html#22369599
    let reader = new FileReader();
    reader.onload = () => {
        for (let i = 0; i < 2; i++) {
            let output = document.querySelectorAll(selector)[i];
            output.style.backgroundImage = `url(${reader.result})`;
        }
    }
    reader.readAsDataURL(event.target.files[0]);
}

function exportImg() {
    twtr.style.transform = "";
    insta.style.display = "block";
    domtoimage.toPng(insta).then((ex) => {
        insta.style.display = "none";
        window.open(ex, '_blank');
    });
    domtoimage.toPng(twtr).then((ex) => {
        twtr.style.transform = "translate(-250px, -120px) scale(0.5)";
        window.open(ex, '_blank');
    });
}

function dateStr(date) {
    return date.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " at " + date.toLocaleTimeString("en-US", {hour:'numeric', minute: 'numeric'})
}  

function altText() {
    const el = document.getElementById("altText");
    let out = "";

    // Append title 1
    out += document.querySelectorAll(".title.one")[0].innerText;

    // Date parsing 1
    let date1 = new Date(new Date(Date.now()).getFullYear() + "/" + document.querySelectorAll(".sub.one")[0].innerText.replaceAll("at ", "").replaceAll("ET", ""));
    if (date1.getTime()) {
        out += ` on ${dateStr(date1)}. `;
    } else {
        out += `: ${document.querySelectorAll(".sub.one")[0].innerText}. `;
    }

    // Append body 1
    out += document.querySelectorAll(".body.one")[0].innerText.replaceAll("\n", " ") + " ";


    // Append title 2
    out += document.querySelectorAll(".title.two")[0].innerText;

    // Date parsing 2
    let date2 = new Date(new Date(Date.now()).getFullYear() + "/" + document.querySelectorAll(".sub.two")[0].innerText.replaceAll("at ", "").replaceAll("ET", ""));
    if (date2.getTime()) {
        out += ` on ${dateStr(date2)}. `;
    } else {
        out += `: ${document.querySelectorAll(".sub.two")[0].innerText}. `;
    }

    // Append body 2
    out += document.querySelectorAll(".body.two")[0].innerText.replaceAll("\n", " ");

    el.innerText = out;
    return out;
}

// Returns next Friday's date as a string.
function wen_eta_friday(override) {
    // from https://stackoverflow.com/questions/25492523/javascript-get-date-of-next-tuesday-or-friday-closest
    let today = new Date(), friday, day, closest;

    if (typeof(override) === "undefined") {
        override = 5;
    }

    if (today.getDay() == override) {
        if (today.getHours() < 22) {
            return `${today.getMonth() + 1}/${today.getDate()}`;
        }
    } else {
        day = today.getDay();
        friday = today.getDate() - day + (day === 0 ? -6 : override);
    }
    closest = new Date(today.setDate(friday));

    return `${closest.getMonth() + 1}/${closest.getDate()}`;
}

// Update preview when typing
for (i in el) {
    el[i].onkeyup = update;
}

// Export button
document.getElementById("exporter").onclick = exportImg;

// Set default meeting times.
document.getElementById("sub_one").value = `${wen_eta_friday()} at 5:30 PM ET`;
document.getElementById("sub_two").value = `${wen_eta_friday(6)} at 12:00 PM ET`;


// Transform
twtr.style.transform = "translate(-250px, -120px) scale(0.5)";

// Update with above vals.
update();