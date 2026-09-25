const shipButton = document.getElementById("set-sail");

const page1 = document.getElementById("page1");
const mainHall = document.getElementById("main-hall");

const galleyButton = document.querySelector(".galley-sign");
const galleyBackButton = document.querySelector(".galley-back");
const galleyRoom = document.getElementById("galley");

const danceButton = document.querySelector(".dance-sign");
const danceBackButton = document.querySelector(".dance-back");
const danceRoom = document.getElementById("dance");
const danceVideo = document.getElementById("dance-video");
const danceAudio = document.getElementById("dance-audio");

const exitButton = document.querySelector(".exit-sign");
const exitRoom = document.getElementById("exit");
const exitBackButton = document.querySelector(".exit-back");
const captainMessage = document.getElementById("captain-message");
const characterCount = document.getElementById("character-count");
const quill = document.querySelector(".quill");
const captainForm = document.getElementById("captain-form");
const messageData = document.getElementById("message-data");
const sendMessage = document.getElementById("send-message");


// =========================
// MAIN HALL
// =========================

shipButton.addEventListener("click", function() {
    page1.style.display = "none";
    mainHall.style.display = "block";
});


// =========================
// GALLEY
// =========================

galleyButton.addEventListener("click", function() {
    mainHall.style.display = "none";
    galleyRoom.style.display = "block";
});

galleyBackButton.addEventListener("click", function() {
    galleyRoom.style.display = "none";
    mainHall.style.display = "block";
});


// =========================
// DANCE ROOM
// =========================

danceButton.addEventListener("click", function() {
    mainHall.style.display = "none";
    danceRoom.style.display = "block";

    danceVideo.currentTime = 0;
    danceAudio.currentTime = 0;

    danceVideo.play();
    danceAudio.play();
});

danceBackButton.addEventListener("click", function() {
    danceRoom.style.display = "none";
    mainHall.style.display = "block";

    danceVideo.pause();
    danceAudio.pause();

    danceVideo.currentTime = 0;
    danceAudio.currentTime = 0;
});


// =========================
// EXIT ROOM
// =========================

exitButton.addEventListener("click", function() {
    mainHall.style.display = "none";
    exitRoom.style.display = "block";

    updateCharacterCount();
    updateQuill();
});

exitBackButton.addEventListener("click", function() {
    exitRoom.style.display = "none";
    mainHall.style.display = "block";
});
// =========================
// CAPTAIN'S MESSAGE
// =========================

let writingTimer;

captainMessage.addEventListener("input", function() {

    updateQuill();
    updateCharacterCount();

    // Start the feather's writing motion
    quill.classList.add("writing");

    // Reset the timer every time she types
    clearTimeout(writingTimer);

    writingTimer = setTimeout(function() {
        quill.classList.remove("writing");
    }, 250);
});

captainMessage.addEventListener("keyup", updateQuill);
captainMessage.addEventListener("click", updateQuill);
captainMessage.addEventListener("focus", updateQuill);


// =========================
// POSITION THE QUILL
// =========================

function updateQuill() {

    const selection = window.getSelection();

    if (!selection.rangeCount) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (!captainMessage.contains(range.startContainer)) {
        return;
    }

    const rect = range.getBoundingClientRect();

    const writingArea = document.querySelector(".writing-area");

    const areaRect = writingArea.getBoundingClientRect();

    /*
        Position the feather around
        the actual typing caret.
    */

    const x = rect.left - areaRect.left - 2;
    const y = rect.bottom - areaRect.top - 65;

    quill.style.left = `${x}px`;
    quill.style.top = `${y}px`;
}


// =========================
// CHARACTER COUNTER
// =========================

function updateCharacterCount() {

    const length = captainMessage.innerText.length;

    characterCount.textContent = `${length} / 1000`;
}


// =========================
// 1000 CHARACTER LIMIT
// =========================

captainMessage.addEventListener("beforeinput", function(event) {

    const currentLength = captainMessage.innerText.length;

    if (
        currentLength >= 1000 &&
        event.inputType.startsWith("insert")
    ) {
        event.preventDefault();
    }
});

captainForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const message = captainMessage.innerText.trim();

    if (message.length === 0) {
        return;
    }

    // Copy the visible message into the real form field
    messageData.value = message;

    // Prevent double-tapping
    sendMessage.disabled = true;

    const originalText = sendMessage.textContent;

    sendMessage.textContent = "⚓ SETTING SAIL...";

    try {

        const response = await fetch(
            "https://formspree.io/f/xrpblvva",
            {
                method: "POST",

                body: new FormData(captainForm),

                headers: {
                    Accept: "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Message failed to send.");
        }

        // SUCCESS
        captainForm.classList.add("sent");

        sendMessage.textContent = "✓ MESSAGE SENT";

    } catch (error) {

        // FAILED
        console.error(error);

        sendMessage.disabled = false;

        sendMessage.textContent = originalText;

        alert("The message couldn't set sail. Please try again.");

    }

});