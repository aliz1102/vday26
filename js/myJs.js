// js/myJs.js
// Works with your index.html (jQuery + SweetAlert2 v9)
// Popup #1: forced typing (text9 hijack) ✅
// Popup #2: real reason textarea ✅
// Optional: send to Discord via webhook ✅
// Final popup + redirect ✅

const textConfig = {
  text1: "He luu my cutie cat!",
  text2: "There's something I want to ask uuu",
  text3: "Will you be my valentine <3 ._.",
  text4: ":3",
  text5: "Nope :))",
  text6: "YESSSS <3",
  text7: "Tell me a reason why you love me? :vvvv",
  text8: "Send me <3",
  text9: "Because Alice is super handsome super cool super cute:)))",
  text10: "Ehehehe",
  text11: "I love u",
  text12: "Love u too <3",
};

// ⚠️ Put your own webhook here. Leaving it blank disables sending.
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1469032612310810645/WSxFMN6Rg2Zkzr3i7c35BvQChvCwukx18YFG6nK10Pd9aUVBPklXwf4IiaBGiD_uImW0";

async function sendToDiscord(payloadText) {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    const form = new URLSearchParams({ content: payloadText }).toString();

    // sendBeacon is best-effort and doesn't block navigation
    if (navigator.sendBeacon) {
      const blob = new Blob([form], {
        type: "application/x-www-form-urlencoded;charset=UTF-8",
      });
      navigator.sendBeacon(DISCORD_WEBHOOK_URL, blob);
      return;
    }

    // no-cors => you won't get a readable response, but it will send
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: form,
    });
  } catch (err) {
    console.warn("Discord webhook failed:", err);
  }
}

$(document).ready(function () {
  console.log("myJs loaded ✅");

  // ===== Preloader =====
  setTimeout(function () {
    firstQuestion();
    $(".spinner").fadeOut();
    $("#preloader").delay(350).fadeOut("slow");
    $("body").delay(350).css({ overflow: "visible" });
  }, 600);

  // Fill UI text
  $("#text3").html(textConfig.text3);
  $("#text4").html(textConfig.text4);
  $("#no").html(textConfig.text5);
  $("#yes").html(textConfig.text6);

  function firstQuestion() {
    $(".content").hide();
    Swal.fire({
      title: textConfig.text1,
      text: textConfig.text2,
      imageUrl: "img/cuteCat.jpg",
      imageWidth: 300,
      imageHeight: 300,
      background: '#fff url("img/iput-bg.jpg")',
      imageAlt: "Custom image",
    }).then(function () {
      $(".content").show(200);
    });
  }

  // ===== NO button swap / move =====
  function switchButton() {
    try {
      new Audio("sound/duck.mp3").play();
    } catch (e) {}

    const $no = $("#no");
    const $yes = $("#yes");

    const leftNo = $no.css("left");
    const topNo = $no.css("top");
    const leftYes = $yes.css("left");
    const topYes = $yes.css("top");

    $no.css({ left: leftYes, top: topYes });
    $yes.css({ left: leftNo, top: topNo });
  }

  function moveButton() {
    try {
      new Audio("sound/Swish1.mp3").play();
    } catch (e) {}

    const x = screen.width <= 600 ? Math.random() * 300 : Math.random() * 500;
    const y = Math.random() * 500;
    $("#no").css({ left: x + "px", top: y + "px" });
  }

  let dodgeCount = 0;
  $("#no").on("mousemove", function () {
    if (dodgeCount < 1) switchButton();
    else moveButton();
    dodgeCount++;
  });

  $("#no").on("touchstart touchmove", function (ev) {
    ev.preventDefault();
    if (dodgeCount < 1) switchButton();
    else moveButton();
    dodgeCount++;
  });

  $("#no").on("click", () => {
    if (screen.width >= 900) switchButton();
  });

  // ===== Forced typing (hijack) =====
  // This uses the *actual popup input element* (reliable).
  function textGenerate(inputEl) {
    let out = "";
    const text = " " + textConfig.text9; // leading space keeps your old indexing trick
    const chars = Array.from(text);

    const count = (inputEl.value || "").length;

    if (count > 0) {
      for (let i = 1; i <= count; i++) {
        out += chars[i] ?? "";
        if (i >= text.length - 1) break; // stop at end
      }
    }

    inputEl.value = out;

    // Keep caret at end (feels like "typing")
    try {
      inputEl.setSelectionRange(out.length, out.length);
    } catch (e) {}
  }

  let handleWriteText = null;

  // ===== YES click flow (Popup #1 -> Popup #2 -> Final) =====
  $("#yes").on("click", async function () {
    console.log("YES clicked ✅");
    try {
      new Audio("sound/tick.mp3").play();
    } catch (e) {}

    // Popup #1: forced typing shown to client
    const res1 = await Swal.fire({
      title: textConfig.text7,
      width: 900,
      padding: "3em",
      html: "<input type='text' class='form-control' id='txtReason' placeholder='Whyyy'>",
      background: '#fff url("img/iput-bg.jpg")',
      backdrop: `
        rgba(0,0,123,0.4)
        url("img/giphy2.gif")
        left top
        no-repeat
      `,
      showCancelButton: false,
      confirmButtonColor: "#fe8a71",
      confirmButtonText: textConfig.text8,

      didOpen: () => {
        const input = Swal.getPopup().querySelector("#txtReason");
        if (!input) return;

        // Start hijack immediately
        clearInterval(handleWriteText);

        // Most reliable: hijack on every input event
        input.oninput = () => textGenerate(input);

        // Also keep your interval (optional but fine)
        handleWriteText = setInterval(() => textGenerate(input), 10);

        input.focus();
      },

      willClose: () => {
        clearInterval(handleWriteText);
        handleWriteText = null;
      },
    });

    if (!res1.isConfirmed) return;

    // Popup #2: real reason textarea
    let realAnswer = "";
    try {
      const res2 = await Swal.fire({
        title: "Okay okay 😌 for real though…",
        input: "textarea",
        inputPlaceholder: "Type your real reason here 💖",
        width: 900,
        background: '#fff url("img/iput-bg.jpg")',
        confirmButtonColor: "#83d0c9",
        confirmButtonText: "Send 💌",
        showCancelButton: false,
        inputValidator: (value) => {
          if (!value || !value.trim()) return "Write somethinggg 😭💗";
        },
      });

      if (res2.isConfirmed) realAnswer = (res2.value || "").trim();
    } catch (e) {}

    // Send to Discord if real answer exists
    if (realAnswer) {
      const time = new Date().toLocaleString();
      const payload =
        `💌 **Valentine response**\n` +
        `🕒 ${time}\n\n` +
        `**Real:** ${realAnswer}\n` +
        `**Forced:** ${textConfig.text9}`;

      await sendToDiscord(payload);
    }

    // Final popup + redirect
    Swal.fire({
      width: 900,
      confirmButtonText: textConfig.text12,
      background: '#fff url("img/iput-bg.jpg")',
      title: textConfig.text10,
      text: textConfig.text11,
      confirmButtonColor: "#83d0c9",
    }).then(() => {
      window.location =
        "https://i.pinimg.com/originals/0c/da/2f/0cda2f2d00fcdfb94e6efd7aeec005e0.gif";
    });
  });
});
