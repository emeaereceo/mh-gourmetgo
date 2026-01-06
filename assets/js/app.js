// Traducir texto español a ingles para el ingrediente
const ingredienteEspaniolaIngles = async (texto) => {
  try {
    // langpair se puede modificar para otra traduccion
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${texto}&langpair=es|en`
    );

    // const datos = await res.json();
    const {
      responseData: { translatedText },
    } = await res.json();
    console.log("Traduccion", translatedText);
    return translatedText;
  } catch (error) {
    console.error("Error al traducir:", error);
    return texto;
  }
};

// Traducir texto ingles a español para las instrucciones
const instruccionInglesaEspañol = async (texto) => {
  if (!texto) return "";

  // Se divide el texto en oraciones (usando el punto como separador)
  const oraciones = texto.split(".");
  const chunks = [];
  let chunkActual = "";

  // las Oraciones en pedazos de menos de 450 caracteres
  oraciones.forEach((oracion) => {
    if (chunkActual.length + oracion.length < 450) {
      chunkActual += oracion + ".";
    } else {
      chunks.push(chunkActual);
      chunkActual = oracion + ".";
    }
  });
  if (chunkActual) chunks.push(chunkActual);

  try {
    // Se traducen los fragmentos en paralelo.
    // Chunks y promiseAll no lo hemos visto en clases aun
    const promesas = chunks.map(async (fragmento) => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        fragmento
      )}&langpair=en|es`;
      const res = await fetch(url);
      const {
        responseData: { translatedText },
      } = await res.json();
      return translatedText;
    });

    const resultados = await Promise.all(promesas);

    // Unimos nuevamente la data
    return resultados.join(" ");
  } catch (error) {
    console.error("Error traduciendo fragmentos:", error);
    return texto; // Fallback: devolvemos el original
  }
};

// Busqueda de receta por ingrediente
const buscarRecetas = async (ingrediente) => {
  if (!ingrediente) return null;
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    // console.log("Recetas encontradas:", datos.meals);
    return datos.meals;
  } catch (error) {
    console.error("Error al buscar la receta:", error);
  }
};

// Detalle de la receta por ID
const detalleReceta = async (id) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    // console.log(datos);
    return datos.meals[0];
  } catch (error) {
    console.error("Error al buscar la receta:", error);
  }
};

// muestro resultados de la busqueda
const renderizarBusqueda = async () => {
  const ingrediente = input.value.trim();
  const errorMessage = document.getElementById("error-message");
  const contenedor = document.getElementById("resultado");

  // Validacion input
  if (ingrediente === "") {
    contenedor.innerHTML = "";
    errorMessage.classList.remove("d-none");
    input.focus();

    return;
  }

  errorMessage.classList.add("d-none");

  contenedor.innerHTML = `
  <div class="w-100 d-flex justify-content-center">
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Buscando</span>
    </div>
  </div>`;

  const ingredienteTraducido = await ingredienteEspaniolaIngles(ingrediente);
  const recetas = await buscarRecetas(ingredienteTraducido);

  if (!recetas) {
    contenedor.innerHTML = `
     <div class="col-12 d-flex justify-content-center">
      <div class="alert alert-warning text-center shadow-sm w-100" role="alert" style="max-width: 500px;">
        <h5 class="mb-2">😕 No se encontraron recetas.</h5>
        <p class="mb-0">Intenta con otro ingrediente.</p>
      </div>
    </div>`;
    return;
  }

  contenedor.innerHTML = recetas
    .map(
      ({ strMealThumb, strMeal, idMeal }) => `
        <div class="col-12 col-md-6 col-lg-4">
         <div class="recipe-card card h-100 shadow-sm border-0">
            <img
              src="${strMealThumb}"
              class="card-img-top"
              alt="${strMeal}"
            />
            <div class="card-body">
              <h5 class="card-title fw-semibold">${strMeal}</h5>
              <a href="#" class="btn btn-outline-success rounded-pill ver-receta" data-id=${idMeal}
                >Ver receta</a
              >
            </div>
          </div>
        </div>
      `
    )
    .join("");
};

// Ejecuto busqueda si presiono enter en el input
const input = document.getElementById("input-ingrediente");
input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    renderizarBusqueda();
  }
});

// Ejecuto busqueda mediante el boton buscar
const searchBtn = document.getElementById("btn-buscar");
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  renderizarBusqueda();
});

// En escucha de botones ver receta.
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("ver-receta")) return;
  e.preventDefault();

  const id = e.target.dataset.id;

  const { strMeal, strMealThumb, strInstructions } = await detalleReceta(id);
  const instruccionesTraducidas = await instruccionInglesaEspañol(
    strInstructions
  );
  // Pasarlos al modal
  document.getElementById("modalTitulo").textContent = strMeal;
  document.getElementById("modalImagen").src = strMealThumb;
  document.getElementById("modalImagen").alt = strMeal;
  document.getElementById("modalDetalle").textContent = instruccionesTraducidas;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalReceta"));
  modal.show();
});
