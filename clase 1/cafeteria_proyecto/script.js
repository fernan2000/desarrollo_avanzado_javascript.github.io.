const btnPedido = document.getElementById("btnPedido");
const contenedor = document.getElementById("pedidos");

let contador = 1;

//evento para crear pedidos
btnPedido.addEventListener("click", () => {
  crearPedido();
});

//aqui la creacion del pedido
async function crearPedido() {
  const id = contador++;

  const pedidoElement = document.createElement("div");
  pedidoElement.classList.add("pedido");

  pedidoElement.innerHTML = `
    <p>Pedido #${id}</p>
    <p class="estado proceso">En Proceso...</p>
  `;

  contenedor.appendChild(pedidoElement);

  //simulacion asincronica
  await prepararPedido(pedidoElement);
}

//Simulacion con preparacion con settimeout
function prepararPedido(elemento) {
  return new Promise((resolve) => {

    const tiempo = Math.floor(Math.random() * 5000) + 1000;

    setTimeout(() => {
      actualizarEstado(elemento);
      resolve();
    }, tiempo);

  });
}

//async/await en accion para actualizar el estado del pedido
async function actualizarEstado(elemento) {
  const estado = elemento.querySelector(".estado");

  estado.textContent = "Completado";
  estado.classList.remove("proceso");
  estado.classList.add("completado");
}