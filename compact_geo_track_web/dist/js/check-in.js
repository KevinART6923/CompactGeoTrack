/*-----------------------------------*\
 * #Code Created by: Kevin - 2024
\*-----------------------------------*/

import { ManageAccount } from '../../examples/conexion.js';

//==================== Parametros de Contraseña ====================\\

let password = [];
let password2 = [];
let selectValue;

$(document).ready(function () {
  password = $('#password');
  password2 = $('#password-verify');
  let i = document.getElementById('fa-solid');
  let i_2 = document.getElementById('fa-solid-2');

  let ruleValidator = function () {
    let pswd = $(this).val();

    //==================== Verificar Longitud de la contraseña ====================\\

    if (pswd.length < 8) {
      $('#length').removeClass('valid').addClass('invalid');
    } else {
      $('#length').removeClass('invalid').addClass('valid');
    }

    //==================== Verificar si contiene una letra minúscula ====================\\

    if (pswd.match(/[a-z]/)) {
      $('#letter').removeClass('invalid').addClass('valid');
    } else {
      $('#letter').removeClass('valid').addClass('invalid');
    }

    //==================== Verificar si contiene una letra mayúscula ====================\\

    if (pswd.match(/[A-Z]/)) {
      $('#capital').removeClass('invalid').addClass('valid');
    } else {
      $('#capital').removeClass('valid').addClass('invalid');
    }

    //==================== Verificar si contiene un número ====================\\

    if (pswd.match(/\d/)) {
      $('#number').removeClass('invalid').addClass('valid');
    } else {
      $('#number').removeClass('valid').addClass('invalid');
    }

    //==================== Verificar si contiene un carácter especial ====================\\

    if (pswd.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
      $('#special').removeClass('invalid').addClass('valid');
    } else {
      $('#special').removeClass('valid').addClass('invalid');
    }
  }

  //==================== Mostrar los requerimientos cuando password este focus ====================\\

  password.focus(function () {
    $('.pswd_info').fadeIn('low');
  });
  password.blur(function () {
    $('.pswd_info').fadeOut('low');
  });

  //==================== Funcion para ver la contraseña en el Password ====================\\

  $('.pswd_show').click(function () {
    password2.toggleClass('showPswd');
    if (password2.hasClass('showPswd')) {
      password2.attr('type', 'text');
      i.classList.add('fa-eye-slash');
      i.classList.remove('fa-eye');
    } else {
      password2.attr('type', 'password');
      i.classList.add('fa-eye');
      i.classList.remove('fa-eye-slash');
    }
  });

  //==================== Funcion para ver la contraseña en el Confirmar Password ====================\\

  $('.pswd_show_2').click(function () {
    password.toggleClass('showPswd');
    if (password.hasClass('showPswd')) {
      password.attr('type', 'text');
      i_2.classList.add('fa-eye-slash');
      i_2.classList.remove('fa-eye');
    } else {
      password.attr('type', 'password');
      i_2.classList.add('fa-eye');
      i_2.classList.remove('fa-eye-slash');
    }
  });
  password.keyup(ruleValidator);
});


  //==================== Funcion para ver el menu del select ====================\\

  $(document).ready(function () {
    let selectedRole = "";
  
    $(".dropdown").click(function () {
      $(".menu").toggleClass("showMenu");
    });
  
    $(".menu > li").click(function (event) {
      event.stopPropagation(); 
      selectedRole = $(this).data("value"); 
      $(".dropdown > p").html($(this).html());
      $(".menu").removeClass("showMenu");
      selectValue = selectedRole;
    });
  });
  

//==================== Parametros para enviar el registro ====================\\

function isValidEmail(email) {
  // Expresión regular para validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function handleFormSubmit(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById("email").value.toLowerCase();
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password-verify').value;
  const role = selectValue;

  //==================== Verificar si el correo electrónico es incorrecto ====================\\

  
  if (!role) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡Por favor selecciona un rol!"
    });
    return;
  }

  if (!isValidEmail(email)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡Por favor ingresa un correo electrónico válido!"
    });
    return;
  } else if (!email.endsWith(".com")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡El correo electrónico debe terminar en '.com'!"
    });
    return;
  }


  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //==================== Verificar si las contraseñas no coinciden ====================\\

  if (password2 !== password) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡Las contraseñas no son iguales!"
    });
    return;
  }

  //==================== Verificar si la contraseña cumple todos los parametros ====================\\

  if (password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/) || !password.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡La contraseña no cumple con todos los requisitos!"
    });
    return;
  }



    const account = new ManageAccount();
  account.register(nombre, email, password, role);



}

//==================== Asociar la función redirectToLogin al evento submit del formulario ====================\\

$(document).ready(function () {

  $('.check-in').submit(handleFormSubmit);
});


