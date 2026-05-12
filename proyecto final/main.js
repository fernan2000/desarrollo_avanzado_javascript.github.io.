let numeroSecreto;
let intentos;
let historialJugadas;
let juegoTerminado;


const inputNumero   = document.getElementById('numero');
const botonAdivinar = document.getElementById('adivinar');
const mensaje       = document.getElementById('mensaje');
const contadorIntentos = document.getElementById('intentos');
const mejorScore    = document.getElementById('mejor');
const rangoDisplay  = document.getElementById('rango');
const historialEl   = document.getElementById('historial');
const pantallaVictoria = document.getElementById('victoria');
const victoriaMsg   = document.getElementById('victoriaMsg');
const botonReiniciar = document.getElementById('reiniciar');
const termoFill     = document.getElementById('termoFill');
const termoMarker   = document.getElementById('termoMarker');
const termoHint     = document.getElementById('termoHint');

function iniciarJuego() {
  numeroSecreto  = Math.floor(Math.random() * 100) + 1;
  intentos       = 0;
  historialJugadas = [];
  juegoTerminado = false;


  inputNumero.value  = '';
  mensaje.textContent = '';
  mensaje.className  = 'mensaje';
  historialEl.innerHTML = '';
  contadorIntentos.textContent = '0';
  rangoDisplay.textContent = '1 — 100';
  pantallaVictoria.classList.add('hidden');

  actualizarTermometro(50, null);
  termoHint.textContent = '?';


  const mejor = localStorage.getItem('mejorScore');
  mejorScore.textContent = mejor ?? '--';

  inputNumero.focus();

  console.log('%c🔒 Número secreto listo. ¡A adivinar!', 'color: #e8ff3d; font-weight: bold;');
}



function procesarIntento() {
  if (juegoTerminado) return;

  const numeroJugador = parseInt(inputNumero.value);

  //validacion
  if (isNaN(numeroJugador) || numeroJugador < 1 || numeroJugador > 100) {
    mostrarMensaje('⚠ Ingresa un número válido entre 1 y 100.', 'error');
    sacudirInput();
    return;
  }

  intentos++;
  contadorIntentos.textContent = intentos;
  historialJugadas.push(numeroJugador);

  //calcular proximidad (0-100%)
  const distancia = Math.abs(numeroJugador - numeroSecreto);
  const proximidad = Math.round(((100 - distancia) / 100) * 100);

  if (numeroJugador === numeroSecreto) {
    // 🎉 
    juegoTerminado = true;
    agregarChip(numeroJugador, 'exacto');
    actualizarTermometro(100, 'exacto');
    termoHint.textContent = '✓';
    guardarMejorScore();
    setTimeout(mostrarVictoria, 400);

  } else if (numeroJugador < numeroSecreto) {
    mostrarMensaje(`↑ El número es MÁS ALTO que ${numeroJugador}`, 'bajo');
    agregarChip(numeroJugador, 'bajo');
    actualizarTermometro(proximidad, 'bajo');
    termoHint.textContent = '↑';
    actualizarRango(numeroJugador, null);

  } else {
    mostrarMensaje(`↓ El número es MÁS BAJO que ${numeroJugador}`, 'alto');
    agregarChip(numeroJugador, 'alto');
    actualizarTermometro(proximidad, 'alto');
    termoHint.textContent = '↓';
    actualizarRango(null, numeroJugador);
  }

  inputNumero.value = '';
  inputNumero.focus();
}

function actualizarTermometro(pct, tipo) {
  termoFill.style.height = `${pct}%`;
  termoMarker.style.bottom = `${pct}%`;

  if (tipo === 'alto') {
    termoFill.style.background = 'var(--accent2)';
  } else if (tipo === 'bajo') {
    termoFill.style.background = 'var(--accent3)';
  } else if (tipo === 'exacto') {
    termoFill.style.background = 'var(--accent)';
  } else {
    termoFill.style.background = 'var(--accent)';
  }
}

let limiteMin = 1;
let limiteMax = 100;

function actualizarRango(nuevoMin, nuevoMax) {
  if (nuevoMin !== null && nuevoMin > limiteMin) limiteMin = nuevoMin;
  if (nuevoMax !== null && nuevoMax < limiteMax) limiteMax = nuevoMax;
  rangoDisplay.textContent = `${limiteMin} — ${limiteMax}`;
}

function agregarChip(numero, tipo) {
  const chip = document.createElement('span');
  chip.className = `chip ${tipo === 'exacto' ? 'bajo' : tipo}`;

  const icono = tipo === 'alto' ? '↓' : tipo === 'bajo' ? '↑' : '✓';
  chip.textContent = `${icono}${numero}`;
  historialEl.appendChild(chip);
}
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}


function sacudirInput() {
  inputNumero.classList.remove('shake');
  void inputNumero.offsetWidth; // reflow para reiniciar animación
  inputNumero.classList.add('shake');
  inputNumero.addEventListener('animationend', () => {
    inputNumero.classList.remove('shake');
  }, { once: true });
}

function mostrarVictoria() {
  const mejor = localStorage.getItem('mejorScore');
  const esMejor = mejor == intentos;

  victoriaMsg.innerHTML = `
    Número secreto: <strong style="color:var(--accent)">${numeroSecreto}</strong><br>
    Lo encontraste en <strong style="color:var(--accent)">${intentos} intento${intentos !== 1 ? 's' : ''}</strong>.<br>
    ${esMejor && intentos <= 1 ? '¡Increíble, a la primera!' : esMejor ? '🏆 ¡Nuevo récord personal!' : ''}
  `;
  pantallaVictoria.classList.remove('hidden');
}

function guardarMejorScore() {
  const actual = localStorage.getItem('mejorScore');
  if (!actual || intentos < parseInt(actual)) {
    localStorage.setItem('mejorScore', intentos);
    mejorScore.textContent = intentos;
  }
}

botonAdivinar.addEventListener('click', procesarIntento);

inputNumero.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') procesarIntento();
});

botonReiniciar.addEventListener('click', () => {
  limiteMin = 1;
  limiteMax = 100;
  iniciarJuego();
});

iniciarJuego();