import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  query,
  where,
  collectionGroup,
  FieldPath
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import { deleteObject } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyCxeYDlp50ovVaTUMELQDlxZeNnObU07CY",
  authDomain: "proyectouno-6d3a3.firebaseapp.com",
  databaseURL: "https://proyectouno-6d3a3-default-rtdb.firebaseio.com",
  projectId: "proyectouno-6d3a3",
  storageBucket: "proyectouno-6d3a3.appspot.com",
  messagingSenderId: "793505485676",
  appId: "1:793505485676:web:815c602ab4c9e713691949",
  measurementId: "G-WK4C6L8H0H"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage(app);



// Función para subir imagen a Firebase Storage y obtener la URL de descarga

export const uploadImage = async (file, userUID) => {
  const storageRef = ref(storage, `images/${userUID}/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
};



export const saveRecordForCurrentUser = async (title, location, soilResistance, penetrationDepth, coordinates, dateTime, additionalDetails, imageUrl) => {
  const currentUserUID = localStorage.getItem('currentUserUID');
  if (currentUserUID) {
   const recordsCollectionRef = collection(doc(db, 'records', currentUserUID), 'registros'); 

    await addDoc(recordsCollectionRef, {
      title,
      location,
      soilResistance,
      penetrationDepth,
      coordinates,
      dateTime,
      additionalDetails,
      imageUrl
    });
  } else {
    console.error('No se ha iniciado sesión o el UID del usuario no está disponible.');
  }
};




export const onGetRecords = (callback) => {
  const currentUserUID = localStorage.getItem('currentUserUID');
  if (currentUserUID) {
    const recordsCollectionRef = collection(db, 'records', currentUserUID, 'registros'); // Reemplaza 'registros' por el nombre de tu subcolección
    onSnapshot(recordsCollectionRef, callback);
  } else {
    console.error('No se ha iniciado sesión o el UID del usuario no está disponible.');
  }
};

export const onGetAllRecords = (callback) => {
  const registrosCollectionGroupRef = collectionGroup(db, 'registros');
  onSnapshot(registrosCollectionGroupRef, callback);
};



export async function getUserName(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().name;
  } else {
    return "Usuario no encontrado";
  }
}




export const deleteRecord = async (id) => {
  try {
    const currentUserUID = localStorage.getItem('currentUserUID');
    if (currentUserUID) {
      const recordDocRef = doc(db, "records", currentUserUID, "registros", id);
      const recordDoc = await getDoc(recordDocRef);
      
      if (recordDoc.exists()) {
        const recordData = recordDoc.data();
        if (recordData.imageUrl) {
          const storageRef = ref(storage, recordData.imageUrl);
          await deleteObject(storageRef);
        }
        await deleteDoc(recordDocRef);
      } else {
        console.error("El registro no existe.");
      }
    } else {
      console.error('No se ha iniciado sesión o el UID del usuario no está disponible.');
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    throw error;
  }
};



export const getRecord = async (id) => {
  const currentUserUID = localStorage.getItem('currentUserUID');
  if (currentUserUID) {
    return await getDoc(doc(db, "records", currentUserUID, "registros", id));
  } else {
    console.error('No se ha iniciado sesión o el UID del usuario no está disponible.');
    throw new Error('No se ha iniciado sesión o el UID del usuario no está disponible.');
  }
};


export const updateRecord = async (id, newFields) => {
  try {
    const currentUserUID = localStorage.getItem('currentUserUID');
    if (currentUserUID) {
      const recordDocRef = doc(db, "records", currentUserUID, "registros", id);
      await updateDoc(recordDocRef, newFields);
    } else {
      console.error('No se ha iniciado sesión o el UID del usuario no está disponible.');
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    throw error;
  }
};


export const getRecords = () => getDocs(collection(db, "records"));

export class ManageAccount {
  register(nombre, email, password, role) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, "users", user.uid), { 
          name: nombre,
          role: role 
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "Serás redirigido a la página de inicio de sesión."
          });
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 3000); 
        })
        .catch((error) => {
          console.error("Error storing user role: ", error);
          let errorMessage = "";
          if (error.code === "auth/email-already-in-use") {
            errorMessage = "Error al registrar: El correo ya existe.";
          } else {
            errorMessage = "Error al registrar: " + error.message;
          }
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: errorMessage
          });
        });
      })
      .catch((error) => {
        console.error(error.message);
        let errorMessage = "";
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "Error al registrar: El correo ya está registrado.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Error al registrar: El correo es inválido.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Error al registrar: Necesitas tener una conexión a Internet.";
        } else {
          errorMessage = "Error al registrar: " + error.message;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage
        });
      });
  }

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('currentUserUID', user.uid);
        getDoc(doc(db, "users", user.uid))
          .then((doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              const role = userData.role;
              localStorage.setItem('userEmail', user.email);
              localStorage.setItem('userName', userData.name);
              localStorage.setItem('userId', user.uid);
              localStorage.setItem('userEmail', user.email);
              switch (role) {
                case "Instructor":

                  window.location.href = "instructores.html";
                  break;
                case "Aprendiz":
                  window.location.href = "historial-aprendices.html";
                  break;
                case "Otros":
                  window.location.href = "historialOtros.html";
                  break;
                default:
                  alert('Estamos teniendo dificultades, por favor intentalo de nuevo');
                  window.location.href = "./index.html";
                  break;
              }
            } else {
              console.error("No such document!");
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al iniciar sesión, el usuario no tiene un Rol asignado "
              });
            }
          })
          .catch((error) => {
            console.error("Error getting user role:", error);
            const alertEl = document.getElementById('error-message');
            const alertMsgEl = alertEl.querySelector("div");
            alertEl.classList.add("show-me");
            alertEl.addEventListener("click", (e) => {
              if (e.target != alertMsgEl) {
                alertEl.classList.remove("show-me");
              }
            });
            return false;
          });
      })
      .catch((error) => {
        console.error(error.message);
        const alertEl = document.getElementById('error-message');
        const alertMsgEl = alertEl.querySelector("div");
        alertEl.classList.add("show-me");
        alertEl.addEventListener("click", (e) => {
          if (e.target != alertMsgEl) {
            alertEl.classList.remove("show-me");
          }
        });
        return false;
      });
  }

  signOut() {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('currentUserUID');
        window.location.href = "index.html";
        history.pushState(null, null, 'index.html');
        window.addEventListener('popstate', function(event) {
          history.pushState(null, null, 'index.html');
        });
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: " + error.message);
      });
  }

  
}
