import { deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { db } from "../../examples/conexion.js";
import { onGetRecords, getRecord, updateRecord, uploadImage, deleteRecord, onGetAllRecords } from "../../examples/conexion.js";
import { ManageAccount, auth } from '../../examples/conexion.js';


const nav = document.querySelector(".nav"),
  searchIcon = document.getElementById("searchIcon"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn"),
  buttons = document.querySelectorAll('#btn'),
  editar = document.querySelectorAll('.fa-pen-to-square'),
  eliminar = document.querySelectorAll('.fa-trash'),
  recordForm = document.getElementById('recordForm');



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


const recordsContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = "";



// Obtener el UID del usuario actual del almacenamiento local
const userUID = localStorage.getItem('currentUserUID');


// Función para obtener el nombre del usuario
async function getUserName(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().name;
    } else {
      throw new Error("El documento de usuario no existe");
    }
  } catch (error) {
    console.error("Error al obtener el nombre de usuario:", error);
    return null; 
  }
}// Función para mostrar los registros
async function renderRecords(querySnapshot) {



  if (querySnapshot.docs.length === 0) {
    Swal.fire({
      title: "<h2 class='detalles-medicion'>Todavía no tienes registros</h2>",
      html: "<p class='p-register'>Aún no has creado ningún registro.</p>",
      icon: "info",
      confirmButtonColor: '#8f2c24',
      showClass: {
        popup: "animate__animated animate__backInDown animate__faster"
      },
      hideClass: {
        popup: "animate__animated animate__zoomOutDown animate__faster"
      },
      backdrop: `
        hsla(5, 100%, 100%, 0.5)
        url("../img/gato.gif")
        left center
        no-repeat
      `
    });
    return; // Salir de la función para evitar continuar con el renderizado
  }
  
  recordsContainer.innerHTML = "";

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];
    const record = doc.data();
    const userName = await getUserName(doc.ref.parent.parent.id);

    recordsContainer.innerHTML += `
      <div class="htrl-items">
        <a class="htrl-img example-image-link" href="${record.imageUrl}" data-lightbox="example-1">
          ${record.imageUrl ? `<img src="${record.imageUrl}" alt="Registro Imagen" class="img-fluid" title="Ver Imagen"/>` : "Error al cargar la imagen"}
        </a>
        
        <div class="htrl-icons">
          <i class="fa-solid fa-pen-to-square icons btn-edit" title="Editar Medición" data-id="${doc.id}"></i>
          <i style="color:#b3150a;" class="fa-solid fa-trash icons btn-delete" title="Eliminar Medición" data-id="${doc.id}"></i>
          <p class="icons p-icon">${userName}</p>
        </div>
        <div class="htrl-text">
          <h1>${record.title}</h1>
          <p>${record.dateTime}</p>
        </div>
        <div class="htrl-button">
          <button type="submit" class="button-htrl btn-details" data-id="${doc.id}" id="btn"><span>Ver Detalles</span><img src="https://cdn-icons-png.flaticon.com/512/7324/7324116.png" rel="icono detalles"></button>
        </div>
      </div>
      <br><br>
    `;
  }



  const btnsDetails = recordsContainer.querySelectorAll(".btn-details");
  btnsDetails.forEach(button => {
    button.addEventListener('click', function () {
      const recordId = this.dataset.id;
      const userName = localStorage.getItem('userName');
      const record = querySnapshot.docs.find(doc => doc.id === recordId).data();
      const pdfContent = `
        <h2 class="detalles-medicion">Detalles de la Medición del Usuario : ${userName}</h2>
        <div class="historial-ventana">
          <h1 id="title-medicion">${record.title}</h1><br>
          <h2>Localización</h2>
          <p>${record.location}</p>
          <h2>Resistencia del suelo</h2>
          <p>${record.soilResistance}</p>
          <h2>Profundidad de Penetración</h2>
          <p>${record.penetrationDepth}</p>
          <h2>Coordenadas</h2>
          <p>${record.coordinates}</p>
          <h2>Fecha y Hora</h2>
          <p>${record.dateTime}</p>
          <h2>Comentarios adicionales</h2>
          <p>${record.additionalDetails}</p>
        </div>
      `;

      Swal.fire({
        title: '<h2 class ="detalles-medicion">Detalles de la Medición</h2>',
        showClass: {
          popup: `animate__animated animate__backInDown animate__faster`
        },
        hideClass: {
          popup: `animate__animated animate__zoomOutDown animate__faster`
        },
        html: `
          <div class="historial-ventana">
            <h1 id="task-title">${record.title}</h1><br>
            <img id="task-image" class="img-historial" src="${record.imageUrl}" style="width: 50%;" alt="Imagen del registro">
            <h2>Localización</h2>
            <p id="task-location">${record.location}</p>
            <h2>Resistencia del suelo</h2>
            <p id="task-soil-resistance">${record.soilResistance}</p>
            <h2>Profundidad de Penetración</h2>
            <p id="task-penetration-depth">${record.penetrationDepth}</p>
            <h2>Coordenadas</h2>
            <p id="task-coordinates">${record.coordinates}</p>
            <h2>Fecha y Hora</h2>
            <p id="task-datetime">${record.dateTime}</p>
            <h2>Comentarios adicionales</h2>
            <p id="task-additional-details">${record.additionalDetails}</p>
          </div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: `Aceptar <i class="fa-solid fa-person-walking-arrow-loop-left"></i>`,
        cancelButtonText: `Descargar <i class="fa-solid fa-download"></i>`,
        confirmButtonClass: 'btn-custom',
        confirmButtonColor: '#8f2c24',
        cancelButtonClass: 'btn-custom',
        cancelButtonColor: '#4caf50'
      }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
            const opt = {
                margin: 1,
                filename: `detalles_medicion_${record.title}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(pdfContent).set(opt).save();
        }
      });
    });
  });
  

  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener('click', async function () {
      const item = this.closest('.htrl-items');
      const recordId = this.dataset.id;

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
          url("../img/gato.gif")
          left center
          no-repeat
        `
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteRecord(recordId); 
            item.remove();
            Swal.fire({
              title: "<h2 class='detalles-medicion'>Eliminada con éxito!</h2>",
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
                url("../img/gato.gif")
                left center
                no-repeat
              `
            });
          } catch (error) {
            console.log(error);
            Swal.fire({
              title: "<h2 class='detalles-medicion'>Error al eliminar</h2>",
              html: "<p class='p-register'>Hubo un problema al eliminar el registro.</p>",
              icon: "error",
              showClass: {
                popup: "animate__animated animate__backInDown animate__faster"
              },
              hideClass: {
                popup: "animate__animated animate__zoomOutDown animate__faster"
              },
              confirmButtonColor: "#8f2c24",
              backdrop: `
                hsla(5, 100%, 100%, 0.5)
                url("../img/gato.gif")
                left center
                no-repeat
              `
            });
          }
        }
      });
    });
  });

  // Agregar eventos a los botones de editar
  const btnsEdit = recordsContainer.querySelectorAll(".btn-edit");
  btnsEdit.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      try {
        const doc = await getRecord(e.target.dataset.id);
        if (doc.exists()) {
          const record = doc.data();

          // Aquí se muestra el SweetAlert con el formulario para editar el registro
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
            
              '<form class="historial-ventana" id="recordForm">' +
              '<input type="file" title="Cambiar imagen"  id="task-img" accept="image/*" placeholder="Editar tu imagen" class="editImg" > <label for="task-img">Editar tu imagen</label>' +
              `<h1>Título</h1>` +
              `<input id="task-title" class="swal2-input" placeholder="Editar título" value="${record.title}" required>` +
              '<h1>Localización</h1>' +
              `<input id="task-location" class="swal2-input" placeholder="Ejemplo(Nombre del Terreno)" value="${record.location}" required>` +
              '<h1>Resistencia del Suelo</h1>' +
              `<input id="task-soil-resistance" class="swal2-input" placeholder="Resistencia del suelo" value="${record.soilResistance}" required>` +
              '<h1>Profundidad de Penetración</h1>' +
              `<input id="task-penetration-depth" class="swal2-input" placeholder="Profundidad de la Penetración" value="${record.penetrationDepth}" required>` +
              '<h1>Datos adicionales</h1>' +
              `<textarea id="task-additional-details" class="swal2-input textarea-form" placeholder="Digita algun otro registro o comentario adicional" required>${record.additionalDetails}</textarea>` +
              '</form>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: `Aceptar <i class="fa-solid fa-user-check"></i>`,
            confirmButtonClass: 'btn-custom',
            confirmButtonColor: '#8f2c24',
            background: "#fff url(../img/fondo.jpg) no-repeat center ",
            backdrop: `
          hsla(5, 100%, 100%, 0.5)
            url("../img/gato.gif")
            left center
            no-repeat
          `
          }).then(async (result) => {
            if (result.isConfirmed) {
  
              // Obtener los valores actualizados del formulario
              const title = document.getElementById("task-title").value;
              const location = document.getElementById("task-location").value;
              const soilResistance = document.getElementById("task-soil-resistance").value;
              const penetrationDepth = document.getElementById("task-penetration-depth").value;
              const additionalDetails = document.getElementById("task-additional-details").value;
              const imageFile = document.getElementById("task-img").files[0];

              try {
                let imageUrl = "";

                // Subir nueva imagen si se selecciona
                if (imageFile) {
                  imageUrl = await uploadImage(imageFile, userUID);
                } else {
                  // Obtener la URL de la imagen actual si no se selecciona una nueva
                  imageUrl = record.imageUrl || "";
                }

                // Actualizar el registro
                await updateRecord(e.target.dataset.id, {
                  title,
                  location,
                  soilResistance,
                  penetrationDepth,
                  additionalDetails,
                  imageUrl
                });

                // Mostrar mensaje de éxito
                Swal.fire({
                  title: "<h2 class='detalles-medicion'>¡Está hecho!</h2>",
                  icon: "success",
                  confirmButtonColor: '#8f2c24',
                  showClass: {
                    popup: "animate__animated animate__backInDown animate__faster"
                  },
                  hideClass: {
                    popup: "animate__animated animate__zoomOutDown animate__faster"
                  },
                  backdrop: `
                    hsla(5, 100%, 100%, 0.5)
                      url("../img/gato.gif")
                      left
                      center
                      no-repeat
                    `
                });
              } catch (error) {
                console.error("Error updating record: ", error);
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Hubo un problema al guardar los cambios. Por favor, inténtalo de nuevo más tarde.",
                  confirmButtonColor: '#8f2c24',
                  showClass: {
                    popup: "animate__animated animate__backInDown animate__faster"
                  },
                  hideClass: {
                    popup: "animate__animated animate__zoomOutDown animate__faster"
                  },
                  backdrop: `
                    hsla(5, 100%, 100%, 0.5)
                      url("../img/gato.gif")
                      left center
                      no-repeat
                    `
                });
              }
            } else if (result.isDenied) {
              Swal.fire({
                icon: "info",
                title: "Los cambios no se guardaron",
                confirmButtonColor: '#8f2c24',
                showClass: {
                  popup: "animate__animated animate__backInDown animate__faster"
                },
                hideClass: {
                  popup: "animate__animated animate__zoomOutDown animate__faster"
                },
                backdrop: `
                  hsla(5, 100%, 100%, 0.5)
                    url("../img/gato.gif")
                    left center
                    no-repeat
                  `
              });
            }
          });

          document.getElementById('task-img').addEventListener('change', function() {
            var file = this.files[0].name;
            var dflt = this.getAttribute("placeholder");
            if (this.value != "") {
              this.nextElementSibling.innerText = file;
            } else {
              this.nextElementSibling.innerText = dflt;
            }
          });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    });
  });

}


window.addEventListener("DOMContentLoaded", async () => {
  const currentPath = window.location.pathname;

  if (currentPath.includes('historial-otros-Ins.html')) {
    onGetAllRecords((querySnapshot) => {
      renderRecords(querySnapshot);
    });

    document.querySelectorAll('.btn-edit').forEach(button => {
      button.style.display = 'none';
    });
    document.querySelectorAll('.btn-delete').forEach(button => {
      button.style.display = 'none';
    });

  } else {
    onGetRecords((querySnapshot) => {
      renderRecords(querySnapshot);
    });
  }
});

document.getElementById("logout-button").addEventListener("click", (event) => {
  event.preventDefault();
  const manageAccount = new ManageAccount(auth);
  manageAccount.signOut();
});

document.getElementById("about").addEventListener("click", (e) => {
  e.preventDefault();

  Swal.fire({
    title: '<h2 style="color: #8f2c24; font-family: var(--font-texto);">Sobre Nosotros</h2>',
    html: '<p style="font-family: var(--font-texto);">Somos una empresa dedicada a ofrecer soluciones tecnológicas innovadoras y eficientes. Nuestro equipo está compuesto por profesionales apasionados por la tecnología y el desarrollo de software. Trabajamos para transformar ideas en realidad y contribuir al éxito de nuestros clientes.</p>',
    showConfirmButton: true,
    confirmButtonColor: '#8f2c24',
    confirmButtonText: 'Cerrar',
    showClass: {
      popup: `
        animate__animated
        animate__fadeInTopRight
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutTopRight
        animate__faster
      `}
  });
});

document.getElementById("email-user").addEventListener("click", (e) => {
  e.preventDefault();

  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  Swal.fire({
    title: '<h2 style="color: #8f2c24; font-family: var(--font-texto);">Mis Datos</h2>',
    html: `
      <p style="font-family: var(--font-texto);"><b>${userName ? userName : 'Nombre no encontrado'}</b></p>
      <p style="font-family: var(--font-texto);">${userEmail ? userEmail : 'Correo electrónico no encontrado'}</p>
    `,
    showConfirmButton: true,
    confirmButtonColor: '#8f2c24',
    confirmButtonText: 'Cerrar',
    showCancelButton: true,
    cancelButtonText: 'Editar',
    cancelButtonColor: '#3085d6',
    cancelButtonAriaLabel: 'Editar nombre',
    showClass: {
      popup: `
        animate__animated
        animate__fadeInTopRight
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutTopRight
        animate__faster
      `
    }
  }).then((result) => {
    if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {

      Swal.fire({
        title: 'Editar Nombre',
        input: 'text',
        inputPlaceholder: 'Ingrese su nuevo nombre',
        inputValue: userName ? userName : '',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#8f2c24',
        cancelButtonColor: '#3085d6',
        cancelButtonAriaLabel: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar un nombre válido';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const newName = result.value;
          if (newName !== userName && newName.trim() !== '') {
            const user = auth.currentUser;
            if (user) {
              const userId = user.uid;
              const userRef = doc(db, 'users', userId);
              updateDoc(userRef, { name: newName })
                .then(() => {
                  localStorage.setItem('userName', newName);
                  Swal.fire({
                    icon: 'success',
                    title: '¡Cambio de nombre exitoso!',
                    text: 'El cambio de nombre ha sido exitoso. Serás redirigido para actualizar tus datos.',
                    confirmButtonColor: '#8f2c24',
                    confirmButtonText: 'Aceptar',
                    showClass: {
                      popup: 'animate__animated animate__fadeIn'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOut'
                    }
                  }).then(() => {
                    window.location.href = "./index.html";
                    history.pushState(null, null, 'index.html');
                    window.addEventListener('popstate', function (event) {
                      history.pushState(null, null, 'index.html');
                    });
                  });
                })
                .catch((error) => {
                  console.error('Error al actualizar el nombre:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un error al actualizar tu nombre. Por favor, inténtalo de nuevo.',
                    confirmButtonColor: '#8f2c24',
                    confirmButtonText: 'Aceptar',
                    showClass: {
                      popup: 'animate__animated animate__fadeIn'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOut'
                    }
                  });
                });
            } else {
              console.error('Error: Usuario no autenticado');
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo encontrar el usuario autenticado. Por favor, vuelva a iniciar sesión.',
                confirmButtonColor: '#8f2c24',
                confirmButtonText: 'Aceptar',
                showClass: {
                  popup: 'animate__animated animate__fadeIn'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOut'
                }
              });
            }
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Sin cambios',
              text: 'No se realizó ningún cambio en el nombre.',
              confirmButtonColor: '#8f2c24',
              confirmButtonText: 'Aceptar',
              showClass: {
                popup: 'animate__animated animate__fadeIn'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut'
              }
            });
          }
        }
      });
    }
  });
});


document.getElementById("delete-account").addEventListener("click", (e) => {
  e.preventDefault();

  Swal.fire({
    title: '<h2 style="color: #8f2c24; font-family: var(--font-texto);">Eliminar Cuenta</h2>',
    html: '<p style="font-family: var(--font-texto);">¿Estás seguro de que quieres eliminar tu cuenta?</p>',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    showClass: {
      popup: `
        animate__animated
        animate__fadeInTopRight
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutTopRight
        animate__faster
      `
    }
  }).then((result) => {
    if (result.isConfirmed) {

      const user = auth.currentUser;


      deleteDoc(doc(db, "users", user.uid))
        .then(() => {

          user.delete()
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Cuenta eliminada',
                text: 'Tu cuenta ha sido eliminada exitosamente.',
                confirmButtonColor: '#8f2c24'
              }).then(() => {
                window.location.href = "./index.html";
                history.pushState(null, null, 'index.html');
                window.addEventListener('popstate', function (event) {
                  history.pushState(null, null, 'index.html');
                });
              });
            })
            .catch((error) => {
              console.error("Error al eliminar la cuenta de usuario:", error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar tu cuenta. Por favor, intenta nuevamente.',
                confirmButtonColor: '#8f2c24'
              });
            });
        })
        .catch((error) => {
          console.error("Error al eliminar el rol del usuario:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar tu rol. Por favor, intenta nuevamente.',
            confirmButtonColor: '#8f2c24'
          });
        });
    }
  });
});


(function () {
  emailjs.init('YWgVjInWSJBc8jOBJ');
})();

document.getElementById("message").addEventListener("click", (e) => {
  e.preventDefault();

  Swal.fire({
    title: '<h2 style="color: #8f2c24; font-family: var(--font-texto);">Contáctanos</h2>',
    html: `
                  <form id="contact-form">
                      <legend>Email</legend>
                      <input type="email" id="email" name="email" required>
                      <br>
                      <label>
                      <textarea id="contact-message" name="message" required placeholder="Dejanos tu mensaje"></textarea></label><br>
                      <button type="submit" class="contact-button">Enviar</button>
                  </form>
              `,
    showConfirmButton: false,
    showCancelButton: true,
    showClass: {
      popup: `
                  animate__animated
                  animate__fadeInTopRight
                  animate__faster
                `
    },
    hideClass: {
      popup: `
                  animate__animated
                  animate__fadeOutTopRight
                  animate__faster
                `}
  });

  document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("contact-message").value;

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
      Swal.showValidationMessage('El correo electrónico no es válido');
      return;
    }

    if (!email.endsWith(".com")) {
      Swal.showValidationMessage('El correo electrónico debe terminar en .com');
      return;
    }

    if (message) {
      const wordCount = message.trim().split(/\s+/).length;
      if (wordCount < 5) {
        Swal.showValidationMessage('El mensaje debe contener al menos 5 palabras');
        return;
      }
    } else {
      Swal.showValidationMessage('El mensaje no puede estar vacío');
      return;
    }
    emailjs.send('service_g26z4pr', 'template_ygd8mcv', {
      from_name: email,
      message: message
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Nos pondremos en contacto contigo pronto.',
        confirmButtonColor: '#8f2c24'
      });
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.',
        confirmButtonColor: '#8f2c24'
      });
    });
  });
});

