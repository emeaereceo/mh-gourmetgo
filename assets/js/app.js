// // * 1. Crear funcion para la busqueda
// //   TODO : Revisar api para conocer los parametros que se le pueden pasar
// // * 2. Vincular funcion al boton del formulario, al escuchar el evento
// // * 3. Funcion retorna una lista de objetos, se recorre la lista para crear cards con la info
// //  [{}, {}, {}]

// async function buscarRecetas(ingrediente) {
//   const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`;

//   try {
//     const respuesta = await fetch(url);
//     const datos = await respuesta.json();

//     console.log("Recetas encontradas:", datos.meals);
//     return datos.meals;
//   } catch (error) {
//     console.error("Error al buscar la receta:", error);
//   }
// }

// // buscarRecetas("beef");

// document.getElementById("btn-buscar").addEventListener("click", async () => {
//   const ingrediente = document.getElementById("input-ingrediente").value.trim();
//   const contenedor = document.getElementById("resultado");

//   contenedor.innerHTML = "<p>Cargando...</p>";

//   const recetas = await buscarRecetas(ingrediente);

//   if (!recetas) {
//     contenedor.innerHTML = "<p>No se encontraron recetas.</p>";
//     return;
//   }

//   contenedor.innerHTML = recetas
//     .map(
//       (meal) => `
//         <div class="col-12 col-md-6 col-lg-4">
//          <div class="recipe-card card h-100 shadow-sm border-0">
//             <img
//               src="${meal.strMealThumb}"
//               class="card-img-top"
//               alt="${meal.strMeal}"
//             />
//             <div class="card-body">
//               <h5 class="card-title fw-semibold">${meal.strMeal}</h5>
//               <a href="#" class="btn btn-outline-primary rounded-pill"
//                 >Ver receta</a
//               >
//             </div>
//           </div>
//         </div>
//       `
//     )
//     .join("");
// });

// Js Minimo para activar el modal con la imagen y el titulo
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("ver-receta")) return;

  const boton = e.target;

  // Obtener datos del botón
  const titulo = boton.dataset.title;
  const imagen = boton.dataset.img;

  // Pasarlos al modal
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modalImagen").src = imagen;
  document.getElementById("modalImagen").alt = titulo;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalReceta"));
  modal.show();
});
