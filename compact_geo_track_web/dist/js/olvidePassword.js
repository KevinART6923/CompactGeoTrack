// Import Firebase and Firestore
import { auth } from './conexion.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.toLowerCase();

    try {
        await sendPasswordResetEmail(auth, email);

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

        Swal.fire({
            icon: 'success',
            title: 'Correo de restablecimiento de contraseña enviado',
            text: `Se ha enviado un correo para restablecer tu contraseña a ${email}.`
        });

    } catch (error) {
        console.error("Error al enviar el correo de restablecimiento de contraseña:", error);

        let errorMessage = "";
        if (error.code === "auth/invalid-email") {
            errorMessage = "Error al enviar: <strong style = 'color: red'>El correo es inválido</strong>.";
        } else {
            errorMessage = `Error al enviar:  <strong style = 'color: red'>${error.message}</strong>`;
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `Ocurrió un error al enviar el correo de restablecimiento de contraseña: <br> ${errorMessage}`
        });
    }
});