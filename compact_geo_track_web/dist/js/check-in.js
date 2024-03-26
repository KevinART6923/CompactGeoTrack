/*-----------------------------------*\
 * #Code Created by: Kevin - 2024
\*-----------------------------------*/

//==================== Parametros de Contraseña ====================\\

let password = [];
let password2 = [];

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
    let selectedRole = ""; // Variable para almacenar el rol seleccionado
  
    $(".dropdown").click(function () {
      $(".menu").toggleClass("showMenu");
    });
  
    $(".menu > li").click(function (event) {
      event.stopPropagation(); 
      selectedRole = $(this).data("value"); 
      $(".dropdown > p").html($(this).html());
      $(".menu").removeClass("showMenu");
      console.log("Rol seleccionado:", selectedRole); 
    });
  });
  
  
  

//==================== Parametros para enviar el registro ====================\\

function redirectToLogin(e) {
  e.preventDefault();

  const email = document.getElementById("username").value.toLowerCase();
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password-verify').value;

  //==================== Verificar si el correo electrónico es incorrecto ====================\\

  if (email !== "artunduaga00@gmail.com") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡Email incorrecto!"
    });
    return;
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

  const selectElement = document.getElementById('rolSelect');
  let select;

selectElement.addEventListener('change', function () {
  const selectedValue = this.value;
  select = selectedValue;
});


  //==================== Si esta todo bien lo redirige al login ====================\\

  window.location.href = "../dist/login.html";
}

//==================== Asociar la función redirectToLogin al evento submit del formulario ====================\\

$(document).ready(function () {
  $('.login').submit(redirectToLogin);
});


