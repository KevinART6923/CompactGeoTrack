
  const nav = document.querySelector(".nav"),
  searchIcon = document.getElementById("searchIcon"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn"),
  buttons = document.querySelectorAll('#btn'),
  editar = document.querySelectorAll('.fa-pen-to-square'),
  eliminar = document.querySelectorAll('.fa-trash');




searchIcon.addEventListener("click", () => {
  nav.classList.toggle("openSearch");
  nav.classList.remove("openNav");
  if (nav.classList.contains("openSearch")) {
    return searchIcon.classList.replace("uil-search", "uil-times");
  }
  searchIcon.classList.replace("uil-times", "uil-search");
});

navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
  nav.classList.remove("openSearch");
  searchIcon.classList.replace("uil-times", "uil-search");
});
navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});


document.addEventListener("keyup", e => {
  if (e.target.matches("#input-search")) {
    if (e.key === "Escape") e.target.value = "";

    document.querySelectorAll(".htrl-items").forEach(item => {
      item.textContent.toLowerCase().includes(e.target.value.toLowerCase())
        ? item.classList.remove("filtro")
        : item.classList.add("filtro");
    });
  }
});



editar.forEach(elemento => {
  elemento.setAttribute('title', 'Editar Medición');
});

eliminar.forEach(elemento => {
  elemento.setAttribute('title', 'Eliminar Medición');
  elemento.style.color = '#b3150a';
});


document.addEventListener("DOMContentLoaded", function() {



  editar.forEach(button => {

    button.addEventListener('click', function () {
      let currentDate = new Date();

      let fecha = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
      
      let hora = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();

      Swal.fire({
        title: '<h2 class="detalles-medicion">Editar Registro</h2>',
        showClass: {
          popup: `
            animate__animated
            animate__backInDown
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__zoomOutDown
            animate__faster
          `
        },
        html:
          '<div class="historial-ventana">' +
          '<img class="img-historial" src="../dist/img/vis_urban.jpg">' +
          '<h1>Ubicación</h1>' +
          '<input id="ubicacion" class="swal2-input" placeholder="Ubicación" value="Mosquera, Colombia" required>' +
          '<h1>Localización</h1>' +
          '<input id="localizacion" class="swal2-input" placeholder="Localización" value="Terreno 1" required>' +
          '<h1>Coordenadas</h1>' +
          '<input id="coordenadas" class="swal2-input" placeholder="Coordenadas" value="40.7128, -74.0060" required>' +
          '<h1>Fecha y Hora</h1>' +
          `<p>Fecha: ${fecha}</p>` + 
          `<p>Hora: ${hora}</p>` + 
          '</div>',
        focusConfirm: false,
        confirmButtonText: `Aceptar <i class="fa-solid fa-user-check"></i>`,
        confirmButtonClass: 'btn-custom',
        confirmButtonColor: '#8f2c24',
        background: "#fff url(../dist/img/fondo.jpg) no-repeat center ",
        backdrop: `
        hsla(5, 100%, 100%, 0.5)
          url("../dist/img/gato.gif")
          left center
          no-repeat
        `
      }).then((result) => {
        if (result.isConfirmed) {
          const ubicacion = document.getElementById('ubicacion').value;
          const localizacion = document.getElementById('localizacion').value;
          const coordenadas = document.getElementById('coordenadas').value;
          Swal.fire({
            title: "<h2 class='guardar-cambios-white'>¿Quieres guardar los cambios?</h2>",
            showClass: {
          popup: `
            animate__animated
            animate__backInDown
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__zoomOutDown
            animate__faster
          `
        },
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar <i class='fa-solid fa-cloud-arrow-up'></i>",
            denyButtonText: `No guardar <i class="fa-solid fa-xmark"></i>`,
            background: "#fff url(../dist/img/lofi.gif) no-repeat center ",
            backdrop: `
            rgba(21,21,40,0.8)
              url("../dist/img/gato.gif")
              left center
              no-repeat
            `
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "<h2 class='detalles-medicion'>¡Está hecho!</h2>",
                icon: "success",
                confirmButtonColor:'#8f2c24',
                showClass: {
                  popup: "animate__animated animate__backInDown animate__faster"
                },
                hideClass: {
                  popup: "animate__animated animate__zoomOutDown animate__faster"
                },
                backdrop: `
                hsla(5, 100%, 100%, 0.5)
                  url("../dist/img/gato.gif")
                  left center
                  no-repeat
                `
              });
            } else if (result.isDenied) {
              Swal.fire({
                title: "<h2 class='guardar-cambios'>¡Los cambios no han sido guardados!</h2>",
                icon: "info",
                confirmButtonColor:'#8f2c24',
                showClass: {
                  popup: "animate__animated animate__backInDown animate__faster"
                },
                hideClass: {
                  popup: "animate__animated animate__zoomOutDown animate__faster"
                },
                backdrop: `
                hsla(5, 100%, 100%, 0.5)
                  url("../dist/img/gato.gif")
                  left center
                  no-repeat
                `
              });
            }
            
          });
        }
      });
    });
});



eliminar.forEach(button => {
  button.addEventListener('click', function () {
    const item = this.closest('.htrl-items'); 
    eliminar.forEach(button => {
      button.addEventListener('click', function () {
        const item = this.closest('.htrl-items'); 
        Swal.fire({
          title: "<h2 class='detalles-medicion'>¿Quieres eliminar esta medición?</h2>",
          showClass: {
            popup: "animate__animated animate__backInDown animate__faster"
          },
          hideClass: {
            popup: "animate__animated animate__zoomOutDown animate__faster"
          },
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, borrarlo! <i class='fa-regular fa-trash-can'></i>",
          backdrop: `
                hsla(5, 100%, 100%, 0.5)
                  url("../dist/img/gato.gif")
                  left center
                  no-repeat
                `
        }).then((result) => {
          if (result.isConfirmed) {
            item.remove();
            Swal.fire({
              title: "<h2 class='detalles-medicion'>Eliminada con exito!</h2>",
              html: "<p class='p-register'>Tu registro ha sido borrado.</p>",
              icon: "success",
              
              showClass: {
                popup: "animate__animated animate__backInDown animate__faster"
              },
              hideClass: {
                popup: "animate__animated animate__zoomOutDown animate__faster"
              },
              confirmButtonColor: "#8f2c24",
              backdrop: `
                hsla(5, 100%, 100%, 0.5)
                  url("../dist/img/gato.gif")
                  left center
                  no-repeat
                `
            });
          }
        });
      });
    });
    
  });
});


  buttons.forEach(button => {

      button.addEventListener('click', function () {
        let currentDate = new Date();

        let fecha = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        
        let hora = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
        
        Swal.fire({
            title: '<h2 class ="detalles-medicion">Detalles de la Medición<h1>',
            showClass: {
              popup: `
                animate__animated
                animate__backInDown
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__zoomOutDown
                animate__faster
              `
            },
            html:
              '<div class="historial-ventana">'+
                '<img class="img-historial" src="../dist/img/vis_urban.jpg">' + 
                '<h1>Ubicación </h1>' +
                '<p>Sena CBA - Mosquera, Colombia</p>'+
                '<h1>Localización</h1>' +
                '<p>Terreno 1</p>'+
                '<h1>Coordenadas</h1>' +
                '<p>40.7128, -74.0060</p>'+
                '<h1>Fecha y Hora </h1>'+
                `<p>${fecha} ${hora}</p>`+
                '</div>',
            focusConfirm: false,
            confirmButtonText: `Aceptar <i class="fa-solid fa-person-walking-arrow-loop-left"></i>`,
            confirmButtonClass: 'btn-custom',
            confirmButtonColor:'#8f2c24'
        });
      });
  });
});


