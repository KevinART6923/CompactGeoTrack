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

// Save a New Task in Firestore
export const saveTask = (title, description) =>
  addDoc(collection(db, "tasks"), { title, description });

export const onGetTasks = (callback) =>
  onSnapshot(collection(db, "tasks"), callback);

export const deleteTask = (id) => deleteDoc(doc(db, "tasks", id));

export const getTask = (id) => getDoc(doc(db, "tasks", id));

export const updateTask = (id, newFields) =>
  updateDoc(doc(db, "tasks", id), newFields);

export const getTasks = () => getDocs(collection(db, "tasks"));

// Save a New Record for a User in Firestore
export const saveUserRecord = (userId, recordData) =>
  addDoc(collection(db, "users", userId, "records"), recordData);

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
        getDoc(doc(db, "users", user.uid))
          .then((doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              const role = userData.role;

              localStorage.setItem('userEmail', user.email);
              localStorage.setItem('userName', userData.name);
              localStorage.setItem('userId', user.uid);  
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
                  alert('No funciono');
                  window.location.href = "./index.html";
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
      .then(() => {
        window.location.href = "index.html";
        history.pushState(null, null, 'index.html');
        window.addEventListener('popstate', function (event) {
          history.pushState(null, null, 'index.html');
        });
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: " + error.message);
      });
  }
}
