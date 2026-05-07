const restaurante = {
  nombre: "La Buena Mesa",
  mesasDisponibles: 19,       
};

const iconos = { info: "🔵", success: "✅", error: "❌", warning: "⚠️" };
function log(mensaje, tipo = "info", detalle = "") {
  const contenedor = document.getElementById("log");
  const entrada = document.createElement("div");
  entrada.className = `log-entry ${tipo}`;
  entrada.innerHTML = `
    <span class="log-icon">${iconos[tipo]}</span>
    <div class="log-content">
      <strong>${new Date().toLocaleTimeString("es-MX")}</strong>
      ${mensaje}
      ${detalle ? `<div style="margin-top:4px;opacity:0.75;font-size:0.82rem">${detalle}</div>` : ""}
    </div>`;
  contenedor.prepend(entrada);
}

function actualizarContadorMesas() {
  document.getElementById("mesas-disp").textContent =
    restaurante.mesasDisponibles;
}

// si hay disponibilidad
function verificarDisponibilidad(mesasSolicitadas) {
  return new Promise((resolve, reject) => {
    log("Verificando disponibilidad de mesas...", "info");

    setTimeout(() => {
      if (mesasSolicitadas <= restaurante.mesasDisponibles) {
        resolve({
          mensaje: `Hay ${restaurante.mesasDisponibles} mesas disponibles.`,
          mesas: mesasSolicitadas,
        });
      } else {
        reject(
          new Error(
            `No hay suficientes mesas. Solicitadas: ${mesasSolicitadas}, ` +
            `disponibles: ${restaurante.mesasDisponibles}.`
          )
        );
      }
    }, 800); 
  });
}


function confirmarReserva(nombreCliente, mesasSolicitadas) {
  return new Promise((resolve) => {
    log("Confirmando la reserva...", "info");

    setTimeout(() => {
      restaurante.mesasDisponibles -= mesasSolicitadas;
      actualizarContadorMesas();

      resolve({
        cliente: nombreCliente,
        mesas: mesasSolicitadas,
        folio: "RES-" + Math.floor(Math.random() * 9000 + 1000),
        hora: new Date().toLocaleTimeString("es-MX"),
      });
    }, 600);
  });
}

// ── coreo de confirmaciion
function enviarConfirmacionReserva(nombreCliente, folio) {
  return new Promise((resolve, reject) => {
    log("Enviando correo de confirmación...", "info");

    setTimeout(() => {
      const exito = Math.random() < 0.8; // 80% éxito

      if (exito) {
        resolve(`Correo enviado a ${nombreCliente} con folio ${folio}.`);
      } else {
        reject(
          new Error("Fallo en el servidor de correo. Intenta reenviar manualmente.")
        );
      }
    }, 700);
  });
}

//  Función principal con async/await 
async function hacerReserva(nombreCliente, mesasSolicitadas) {
  const btn = document.getElementById("btn-reservar");
  btn.disabled = true;
  btn.textContent = "Procesando...";

  log(`Nueva solicitud de ${nombreCliente} — ${mesasSolicitadas} mesa(s)`, "info");

  try {
    // vrificar disponibilidad
    const disponibilidad = await verificarDisponibilidad(mesasSolicitadas);
    log("Mesas disponibles confirmadas.", "success", disponibilidad.mensaje);

    // confirmar reserva
    const reserva = await confirmarReserva(nombreCliente, mesasSolicitadas);
    log(
      `Reserva confirmada para <strong>${reserva.cliente}</strong>.`,
      "success",
      `Folio: ${reserva.folio} · Mesas: ${reserva.mesas} · Hora: ${reserva.hora}`
    );

    // Paso 3 — Enviar correo (puede fallar sin cancelar la reserva)
    try {
      const correo = await enviarConfirmacionReserva(reserva.cliente, reserva.folio);
      log(correo, "success");
    } catch (errorCorreo) {
      log(
        "La reserva está confirmada, pero el correo no se pudo enviar.",
        "warning",
        errorCorreo.message
      );
    }

  } catch (error) {
//error de disponiblidad o confirmacion
    log("No se pudo completar la reserva.", "error", error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Hacer reserva";
  }
}

function iniciarReserva() {
  const nombre = document.getElementById("nombre").value.trim();
  const mesas  = parseInt(document.getElementById("mesas").value, 10);

  if (!nombre) {
    log("Escribe el nombre del cliente.", "warning");
    return;
  }
  if (!mesas || mesas < 1) {
    log("Ingresa un número válido de mesas (mínimo 1).", "warning");
    return;
  }

  hacerReserva(nombre, mesas);
}