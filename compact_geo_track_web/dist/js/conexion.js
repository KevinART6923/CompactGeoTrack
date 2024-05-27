// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();
export const auth = getAuth();


/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
export const saveTask = (title, description) =>
  addDoc(collection(db, "tasks"), { title, description });

export const onGetTasks = (callback) =>
  onSnapshot(collection(db, "tasks"), callback);

/**
 *
 * @param {string} id Task ID
 */
export const deleteTask = (id) => deleteDoc(doc(db, "tasks", id));

export const getTask = (id) => getDoc(doc(db, "tasks", id));

export const updateTask = (id, newFields) =>
  updateDoc(doc(db, "tasks", id), newFields);

export const getTasks = () => getDocs(collection(db, "tasks"));




export class ManageAccount {
  register(email, password, role) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, "users", user.uid), { role: role })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "¡Registro exitoso!",
              text: "Serás redirigido a la página de inicio de sesión."
            });
            setTimeout(() => {
              window.location.href = "./login.html";
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
  }
  


  
  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        getDoc(doc(db, "users", user.uid))
          .then((doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              const role = userData.role;

              switch (role) {
                case "Instructor":
                  window.location.href = "instructores.html";
                  break;
                case "Aprendiz":
                  window.location.href = "historial-aprendices.html";
                  break;
                case "Otro":
                  window.location.href = "historialOtros.html"; 
                  break;
                default:
                  alert('No funciono')
                  window.location.href = "./login.html";
                  break;
              }
            } else {
              console.error("No such document!");
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text:"Error al iniciar sesión, el usuario no tiene un Rol asignado "
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
      .then((_) => {
        window.location.href = "instructores.html";
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}