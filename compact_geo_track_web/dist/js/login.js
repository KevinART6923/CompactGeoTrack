//==================== Input Password ====================\\
/* Copyright (c) 2024 by Mikael Ainalem (https://codepen.io/ainalem/pen/RwWgexd)*/

const container = document.querySelector(".container");
const hidden = document.querySelector(".hidden");
const hiddenInput = document.querySelector(".hidden-input");
const revealed = document.querySelector(".revealed");
const revealedInput = document.querySelector(".revealed-input");
const button = document.querySelector(".button");
const containerId = document.getElementById('container');


const timeline = anime
  .timeline({
    duration: 300,
    easing: "cubicBezier(.4, 0, .2, 1)",
    autoplay: false,
  })
  .add(
    {
      targets: document.querySelector(".eye-lid"),
      d:
        "M -5,-5 V 37 H 15.6 C 15.6,37 21.35124,23.469343 34.312131,23.469343 47.273022,23.469343 53.4,37 53.4,37 H 77 V -5 Z",
    },
    0
  )
  .add(
    {
      targets: document.querySelector(".eye-lashes"),
      rotateX: ["180deg", "0deg"],
    },
    0
  );
hiddenInput.addEventListener("input", () => {
  if (!container.classList.contains("active")) {
    revealedInput.value = hiddenInput.value;

  }
});
revealedInput.addEventListener("input", () => {
  if (container.classList.contains("active")) {
    hiddenInput.value = revealedInput.value;
  }
});
button.addEventListener("click", () => {
  container.classList.toggle("active");
  timeline.reverse();
  timeline.play();
  if (container.classList.contains("active")) {
    revealedInput.focus();
    container.classList.add('border');
    container.classList.remove('blanco');
  } else {
    hiddenInput.focus();
    container.classList.remove('border');
    container.classList.add('blanco');
  }
});
timeline.reverse();
timeline.play();

//==================== Parametros de Inicio ====================\\

// function redirectToInstructores() {
//   const username = document.getElementById("email").value;
//   const passwordHidden = document.querySelector(".password-hidden").value;
//   const passwordRevealed = document.querySelector('.password-revealed').value;

//   const alertEl = document.getElementById('error-message');
//   const alertMsgEl = alertEl.querySelector("div");

//     if (username === "artunduaga00@gmail.com" && (passwordHidden === "12345678" || passwordRevealed === '12345678')) {
//       window.location.href = "../dist/instructores.html";
//     } else {
//       alertEl.classList.add("show-me");
//     }
//   alertEl.addEventListener("click", (e) => {
//     if (e.target != alertMsgEl) {
//       alertEl.classList.remove("show-me");
//     }
//   });
  
//   return false;
// }



import { ManageAccount } from './conexion.js';

document.getElementById("formulario-sesion").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const account = new ManageAccount();
  account.authenticate(email, password);

});




