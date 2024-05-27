/*-----------------------------------*\
 * #Code Created by: Kevin - 2024
\*-----------------------------------*/

//==================== Cajas ====================\\

const boxes = document.getElementById('boxes');
const box_1 = document.querySelector('.box_1');
const box_2 = document.querySelector('.box_2');

box_1.addEventListener('mouseover', (e) => {
  box_2.style.scale = (0.9);
  box_2.classList.add('filter');
})

box_1.addEventListener('mouseout', (e) => {
  box_2.style.scale = (1);
  box_2.classList.remove('filter');
})

box_2.addEventListener('mouseover', (e) => {
  box_1.style.scale = (0.9);
  box_1.classList.add('filter');
})

box_2.addEventListener('mouseout', (e) => {
  box_1.style.scale = (1);
  box_1.classList.remove('filter');
})


box_1.addEventListener('click', (e) => {
  document.location.href = "../dist/historial.html"
}) 

box_2.addEventListener('click', (e) => {
  document.location.href = "../dist/historial-otros.html"
}) 