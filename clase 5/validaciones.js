const form = document.getElementById("registro-form");


function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (el) el.textContent = mensaje;
}

function limpiarError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = "";
}

function marcarInput(inputId, esValido) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.toggle("valid",   esValido);
  el.classList.toggle("invalid", !esValido);
}

// ── Validaciones individuales ────────────────────────────────

//nombre
function validarNombre() {
  const val = document.getElementById("nombre").value.trim();
  if (!val) {
    mostrarError("err-nombre", "El nombre es obligatorio.");
    marcarInput("nombre", false); return false;
  }
  if (val.length < 3) {
    mostrarError("err-nombre", "El nombre debe tener al menos 3 caracteres.");
    marcarInput("nombre", false); return false;
  }
  if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(val)) {
    mostrarError("err-nombre", "Solo se permiten letras y espacios.");
    marcarInput("nombre", false); return false;
  }
  limpiarError("err-nombre");
  marcarInput("nombre", true); return true;
}

//correo
function validarCorreo() {
  const val = document.getElementById("correo").value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!val) {
    mostrarError("err-correo", "El correo es obligatorio.");
    marcarInput("correo", false); return false;
  }
  if (!regex.test(val)) {
    mostrarError("err-correo", "Ingresa un correo válido, ej. nombre@dominio.com");
    marcarInput("correo", false); return false;
  }
  limpiarError("err-correo");
  marcarInput("correo", true); return true;
}



//telefono
function validarTelefono() {
  const val = document.getElementById("telefono").value.trim();
  if (!val) {
    mostrarError("err-telefono", "El teléfono es obligatorio.");
    marcarInput("telefono", false); return false;
  }
  if (!/^\d{10}$/.test(val)) {
    mostrarError("err-telefono", "El teléfono debe tener exactamente 10 dígitos.");
    marcarInput("telefono", false); return false;
  }
  limpiarError("err-telefono");
  marcarInput("telefono", true); return true;
}

//edad
function validarEdad() {
  const val = parseInt(document.getElementById("edad").value, 10);
  if (!val) {
    mostrarError("err-edad", "La edad es obligatoria.");
    marcarInput("edad", false); return false;
  }
  if (val < 18) {
    mostrarError("err-edad", "Debes ser mayor de 18 años para registrarte.");
    marcarInput("edad", false); return false;
  }
  if (val > 100) {
    mostrarError("err-edad", "Ingresa una edad válida (máximo 100).");
    marcarInput("edad", false); return false;
  }
  limpiarError("err-edad");
  marcarInput("edad", true); return true;
}

//intereses
function validarIntereses() {
  const seleccionados = document.querySelectorAll('input[name="intereses"]:checked');
  if (seleccionados.length < 2) {
    mostrarError("err-intereses", "Selecciona al menos 2 intereses.");
    return false;
  }
  limpiarError("err-intereses"); return true;
}

//horario
function validarHorario() {
  const seleccionado = document.querySelector('input[name="horario"]:checked');
  if (!seleccionado) {
    mostrarError("err-horario", "Elige un horario para asistir al evento.");
    return false;
  }
  limpiarError("err-horario"); return true;
}

function validarFecha() {
  const val = document.getElementById("fecha").value;
  if (!val) {
    mostrarError("err-fecha", "Selecciona la fecha del evento.");
    marcarInput("fecha", false); return false;
  }
  const hoy     = new Date(); hoy.setHours(0, 0, 0, 0);
  const elegida = new Date(val + "T00:00:00");
  if (elegida <= hoy) {
    mostrarError("err-fecha", "La fecha debe ser posterior a hoy.");
    marcarInput("fecha", false); return false;
  }
  limpiarError("err-fecha");
  marcarInput("fecha", true); return true;
}

//verificar tipo y tamaño (max. 2 MB)
function validarArchivo() {
  const archivo = document.getElementById("archivo").files[0];
  if (!archivo) { limpiarError("err-archivo"); return true; } // Opcional

  const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];
  if (!tiposPermitidos.includes(archivo.type)) {
    mostrarError("err-archivo", "Solo se permiten archivos PDF, JPG o PNG.");
    return false;
  }
  const maxBytes = 2 * 1024 * 1024; // 2 MB
  if (archivo.size > maxBytes) {
    mostrarError("err-archivo", "El archivo no debe superar los 2 MB.");
    return false;
  }
  limpiarError("err-archivo"); return true;
}

function validarTerminos() {
  const aceptado = document.getElementById("terminos").checked;
  if (!aceptado) {
    mostrarError("err-terminos", "Debes aceptar los términos y condiciones.");
    return false;
  }
  limpiarError("err-terminos"); return true;
}

document.getElementById("nombre").addEventListener("blur",    validarNombre);
document.getElementById("correo").addEventListener("blur",    validarCorreo);
document.getElementById("telefono").addEventListener("blur",  validarTelefono);
document.getElementById("edad").addEventListener("blur",      validarEdad);
document.getElementById("fecha").addEventListener("change",   validarFecha);
document.getElementById("archivo").addEventListener("change", () => {
  const archivo = document.getElementById("archivo").files[0];
  const texto   = archivo ? `📎 ${archivo.name}` : "📎 Seleccionar archivo";
  document.getElementById("file-text").textContent = texto;
  validarArchivo();
});


form.addEventListener("submit", (e) => {
  e.preventDefault();



  const todo_valido = [
    validarNombre(),
    validarCorreo(),
    validarTelefono(),
    validarEdad(),
    validarIntereses(),
    validarHorario(),
    validarFecha(),
    validarArchivo(),
    validarTerminos(),
  ].every(Boolean); 

  if (!todo_valido) return;


  const nombre   = document.getElementById("nombre").value.trim();
  const horarios = { manana: "Mañana (9–12h)", tarde: "Tarde (13–16h)", noche: "Noche (17–20h)" };
  const horario  = horarios[document.querySelector('input[name="horario"]:checked').value];
  const fecha    = new Date(document.getElementById("fecha").value + "T00:00:00")
                    .toLocaleDateString("es-MX", { day:"numeric", month:"long", year:"numeric" });



                    document.getElementById("modal-msg").textContent =
    `Hola ${nombre}, tu lugar está confirmado para el ${fecha} en el horario de ${horario}. ` +
    `Recibirás un correo de confirmación pronto.`;

  document.getElementById("modal").classList.remove("hidden");
  form.reset();
  document.querySelectorAll("input.valid, input.invalid").forEach(el => {
    el.classList.remove("valid", "invalid");
  });
  document.getElementById("file-text").textContent = "📎 Seleccionar archivo";
});

function cerrarModal() {
  document.getElementById("modal").classList.add("hidden");
}