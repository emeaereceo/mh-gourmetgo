// * 1. Crear funcion para la busqueda
//   TODO : Revisar api para conocer los parametros que se le pueden pasar
// * 2. Vincular funcion al boton del formulario, al escuchar el evento
// * 3. Funcion retorna una lista de objetos, se recorre la lista para crear cards con la info

// Busqueda de receta por ingrediente
async function buscarRecetas(ingrediente) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    // console.log("Recetas encontradas:", datos.meals);
    return datos.meals;
  } catch (error) {
    console.error("Error al buscar la receta:", error);
  }
}

// Detalle de la receta por ID
async function detalleReceta(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    // console.log(datos);
    return datos.meals[0];
  } catch (error) {
    console.error("Error al buscar la receta:", error);
  }
}

// buscarRecetas("beef");
const searchBtn = document.getElementById("btn-buscar");

searchBtn.addEventListener("click", async () => {
  const ingrediente = document.getElementById("input-ingrediente").value.trim();
  const contenedor = document.getElementById("resultado");

  contenedor.innerHTML = `
  <div class="w-100 d-flex justify-content-center">
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Buscando</span>
    </div>
  </div>`;

  const recetas = await buscarRecetas(ingrediente);

  if (!recetas) {
    contenedor.innerHTML = `<p>No se encontraron recetas con ingrediente ${ingrediente}.</p>`;
    return;
  }

  contenedor.innerHTML = recetas
    .map(
      (meal) => `
        <div class="col-12 col-md-6 col-lg-4">
         <div class="recipe-card card h-100 shadow-sm border-0">
            <img
              src="${meal.strMealThumb}"
              class="card-img-top"
              alt="${meal.strMeal}"
            />
            <div class="card-body">
              <h5 class="card-title fw-semibold">${meal.strMeal}</h5>
              <a href="#" class="btn btn-outline-success rounded-pill ver-receta" data-id=${meal.idMeal}
                >Ver receta</a
              >
            </div>
          </div>
        </div>
      `
    )
    .join("");
});

document.addEventListener("click", async (evento) => {
  if (!evento.target.classList.contains("ver-receta")) return;

  const id = evento.target.dataset.id;

  const receta = await detalleReceta(id);

  // Pasarlos al modal
  document.getElementById("modalTitulo").textContent = receta.strMeal;
  document.getElementById("modalImagen").src = receta.strMealThumb;
  document.getElementById("modalImagen").alt = receta.strMeal;
  document.getElementById("modalDetalle").textContent = receta.strInstructions;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalReceta"));
  modal.show();
});
