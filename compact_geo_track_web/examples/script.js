import { onGetRecords, saveRecordForCurrentUser, getRecord, updateRecord, uploadImage, deleteRecord } from "./conexion.js";

const recordForm = document.getElementById("task-form");
const recordsContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = "";

// Obtener el UID del usuario actual del almacenamiento local
const userUID = localStorage.getItem('currentUserUID');

// Función para mostrar los registros
function renderRecords(querySnapshot) {
  recordsContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const record = doc.data();

    recordsContainer.innerHTML += `
      <div class="card card-body mt-2 border-primary">
      <p>title task: ${record.title}</p>
        <p>Location: ${record.location}</p>
        <p>Soil Resistance: ${record.soilResistance}</p>
        <p>Penetration Depth: ${record.penetrationDepth}</p>
        <p>Coordinates: ${record.coordinates}</p>
        <p>Date and Time: ${record.dateTime}</p>
        <p>Additional Details: ${record.additionalDetails}</p>
        ${record.imageUrl ? `<img src="${record.imageUrl}" alt="Image" class="img-fluid"/>` : ""}
        <div>
          <button class="btn btn-primary btn-delete" data-id="${doc.id}">
            🗑 Delete
          </button>
          <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
            🖉 Edit
          </button>
        </div>
      </div>`;
  });

  // Agregar eventos a los botones de eliminar
  const btnsDelete = recordsContainer.querySelectorAll(".btn-delete");
  btnsDelete.forEach((btn) =>
    btn.addEventListener("click", async ({ target: { dataset } }) => {
      try {
        await deleteRecord(dataset.id);
      } catch (error) {
        console.log(error);
      }
    })
  );

  // Agregar eventos a los botones de editar
  const btnsEdit = recordsContainer.querySelectorAll(".btn-edit");
  btnsEdit.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      try {
        const doc = await getRecord(e.target.dataset.id);
        if (doc.exists()) { // Verifica si el documento existe
          const record = doc.data();
          // Coloca los datos del registro en el formulario para editar
          recordForm["task-title"].value = record.title;
          recordForm["task-location"].value = record.location;
          recordForm["task-soil-resistance"].value = record.soilResistance;
          recordForm["task-penetration-depth"].value = record.penetrationDepth;
          recordForm["task-coordinates"].value = record.coordinates;
          recordForm["task-date-time"].value = record.dateTime;
          recordForm["task-additional-details"].value = record.additionalDetails;


          editStatus = true;
          id = doc.id;
          recordForm["btn-task-form"].innerText = "Update";
        } else {
          console.error("El documento no existe.");
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

// Mostrar los registros al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  onGetRecords((querySnapshot) => {
    renderRecords(querySnapshot);
  });
});


recordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = recordForm["task-title"].value;
  const location = recordForm["task-location"].value;
  const soilResistance = recordForm["task-soil-resistance"].value;
  const penetrationDepth = recordForm["task-penetration-depth"].value;
  const coordinates = recordForm["task-coordinates"].value;
  const dateTime = recordForm["task-date-time"].value;
  const additionalDetails = recordForm["task-additional-details"].value;
  const imageFile = recordForm["task-img"].files[0];

  try {
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile, userUID); // Cambiado para usar el UID del usuario actual
    } else if (editStatus) {
      // Si estamos en modo edición y no se selecciona una nueva imagen, mantén la URL de la imagen existente
      const doc = await getRecord(id);
      if (doc.exists()) {
        imageUrl = doc.data().imageUrl || "";
      }
    }

    if (!editStatus) {
      await saveRecordForCurrentUser(title, location, soilResistance, penetrationDepth, coordinates, dateTime, additionalDetails, imageUrl); // Cambiado para usar la nueva función
    } else {
      await updateRecord(id, {
        title,
        location,
        soilResistance,
        penetrationDepth,
        coordinates,
        dateTime,
        additionalDetails,
        imageUrl
      });

      editStatus = false;
      id = "";
      recordForm["btn-task-form"].innerText = "Save";
    }

    // Volver a cargar los registros después de guardar o actualizar
    onGetRecords((querySnapshot) => {
      renderRecords(querySnapshot);
    });

    // Restablecer el formulario
    recordForm.reset();
    recordForm["task-location"].focus();
  } catch (error) {
    console.log(error);
  }
});
