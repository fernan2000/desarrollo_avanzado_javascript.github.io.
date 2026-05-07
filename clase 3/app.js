//  CONSUMO DE APIs 

const API_URL = "https://rickandmortyapi.com/api/character";

const contenedor   = document.getElementById("data-container");
const loading      = document.getElementById("loading");
const errorMsg     = document.getElementById("error-msg");
const metodoActivo = document.getElementById("metodo-activo");


function mostrarLoading(visible) {
  loading.style.display = visible ? "block" : "none";
}

function mostrarError(mensaje) {
  errorMsg.style.display = "block";
  errorMsg.textContent   = "❌ " + mensaje;
}

function limpiarUI(metodo) {
  contenedor.innerHTML   = "";
  errorMsg.style.display = "none";
  metodoActivo.innerHTML = `Método activo: <span>${metodo}</span>`;
}



function mostrarPersonajes(personajes) {
  if (!personajes || personajes.length === 0) {
    contenedor.innerHTML = "<p style='text-align:center;color:#888'>Sin personajes para mostrar.</p>";
    return;
  }

  contenedor.innerHTML = personajes.map((p) => {
    const statusClass = p.status === "Alive" ? "alive"
                      : p.status === "Dead"  ? "dead"
                      : "unknown";

    return `
      <div class="card">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>
            <span class="status-dot ${statusClass}"></span>
            ${p.status} · ${p.species}
          </p>
          <p style="margin-top:4px">${p.origin.name}</p>
        </div>
      </div>`;
  }).join("");
}

// 1
function obtenerConFetch() {
  limpiarUI("fetch");
  mostrarLoading(true);

  fetch(API_URL)
    .then((response) => {

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();           
    })
    .then((data) => {
      mostrarPersonajes(data.results);  
    })
    .catch((error) => {
      mostrarError("Fetch falló: " + error.message);
    })
    .finally(() => {
      mostrarLoading(false);
    });
}



function obtenerConAxios() {
  limpiarUI("Axios");
  mostrarLoading(true);





  axios.get(API_URL)
    .then((response) => {
      mostrarPersonajes(response.data.results);
    })
    .catch((error) => {

        const mensaje = error.response
        ? `Error HTTP ${error.response.status}: ${error.response.statusText}`
        : error.message;
      mostrarError("Axios falló: " + mensaje);
    })
    .finally(() => {
      mostrarLoading(false);
    });
}