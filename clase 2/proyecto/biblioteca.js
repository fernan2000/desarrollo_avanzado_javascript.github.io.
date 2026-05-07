
let inventarioJSON = {
  libros: [
    { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Realismo mágico", disponible: true },
    { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Fábula", disponible: false },
    { id: 3, titulo: "1984", autor: "George Orwell", genero: "Distopía", disponible: true },
    { id: 4, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", genero: "Novela", disponible: true },
  ],
};

function leerDatos(callback) {
  console.log("⏳ Leyendo datos del inventario...");
  setTimeout(() => {
    const datos = JSON.parse(JSON.stringify(inventarioJSON));
    callback(null, datos);
  }, 500);
}

function guardarDatos(nuevosDatos, callback) {
  console.log("💾 Guardando cambios...");
  setTimeout(() => {
    inventarioJSON = JSON.parse(JSON.stringify(nuevosDatos));
    callback(null, "✅ Datos guardados correctamente.");
  }, 300);
}

function consultarLibros(callback) {
  leerDatos((error, datos) => {
    if (error) return callback(error);
    callback(null, datos.libros);
  });
}

function agregarLibro(nuevoLibro, callback) {
  leerDatos((error, datos) => {
    if (error) return callback(error);

    if (!nuevoLibro.titulo || !nuevoLibro.autor || !nuevoLibro.genero) {
      return callback(new Error("❌ El libro debe tener título, autor y género."));
    }

    const maxId = datos.libros.reduce((max, l) => Math.max(max, l.id), 0);
    const libro = {
      id: maxId + 1,
      titulo: nuevoLibro.titulo,
      autor: nuevoLibro.autor,
      genero: nuevoLibro.genero,
      disponible: nuevoLibro.disponible !== undefined ? nuevoLibro.disponible : true,
    };

    datos.libros.push(libro);

    guardarDatos(datos, (errorGuardar, mensaje) => {
      if (errorGuardar) return callback(errorGuardar);
      callback(null, { libro, mensaje });
    });
  });
}

function actualizarDisponibilidad(id, disponible, callback) {
  leerDatos((error, datos) => {
    if (error) return callback(error);

    const libro = datos.libros.find((l) => l.id === id);
    if (!libro) {
      return callback(new Error(`❌ No se encontró un libro con ID ${id}.`));
    }

    libro.disponible = disponible;
    const estadoTexto = disponible ? "Disponible" : "Prestado";

    guardarDatos(datos, (errorGuardar, mensaje) => {
      if (errorGuardar) return callback(errorGuardar);
      callback(null, { libro, mensaje, estadoTexto });
    });
  });
}

function buscarLibros(criterio, valor, callback) {
  leerDatos((error, datos) => {
    if (error) return callback(error);

    const camposValidos = ["autor", "genero", "titulo"];
    if (!camposValidos.includes(criterio)) {
      return callback(new Error(`❌ Criterio inválido. Usa: ${camposValidos.join(", ")}`));
    }

    const resultados = datos.libros.filter((l) =>
      l[criterio].toLowerCase().includes(valor.toLowerCase())
    );

    callback(null, resultados);
  });
}


function mostrarNotificacion(mensaje, esError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.className = `toast ${esError ? 'error' : ''}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function renderizarLibros(libros) {
  const container = document.getElementById('listaLibros');
  
  if (!libros || libros.length === 0) {
    container.innerHTML = '<div class="loading">📭 No hay libros para mostrar</div>';
    return;
  }
  
  container.innerHTML = libros.map(libro => `
    <div class="book-card" data-id="${libro.id}">
      <div class="book-header">
        <span class="book-id">ID: ${libro.id}</span>
        <span class="book-status ${libro.disponible ? 'status-available' : 'status-borrowed'}">
          ${libro.disponible ? '✅ Disponible' : '🔴 Prestado'}
        </span>
      </div>
      <div class="book-title">${escapeHtml(libro.titulo)}</div>
      <div class="book-author">✍️ ${escapeHtml(libro.autor)}</div>
      <div class="book-genre">📚 ${escapeHtml(libro.genero)}</div>
      <div class="book-actions">
        <button class="btn ${libro.disponible ? 'btn-warning' : 'btn-success'}" 
                onclick="cambiarDisponibilidad(${libro.id}, ${!libro.disponible})">
          ${libro.disponible ? '🔒 Marcar como Prestado' : '🔓 Marcar como Disponible'}
        </button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function cargarTodosLosLibros() {
  consultarLibros((error, libros) => {
    if (error) {
      mostrarNotificacion(error.message, true);
      return;
    }
    renderizarLibros(libros);
    mostrarNotificacion(`📚 ${libros.length} libros cargados correctamente`);
  });
}

function handleAgregarLibro(event) {
  event.preventDefault();
  
  const titulo = document.getElementById('titulo').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const genero = document.getElementById('genero').value.trim();
  const disponible = document.getElementById('disponible').checked;
  
  if (!titulo || !autor || !genero) {
    mostrarNotificacion('Por favor complete todos los campos', true);
    return;
  }
  
  agregarLibro({ titulo, autor, genero, disponible }, (error, resultado) => {
    if (error) {
      mostrarNotificacion(error.message, true);
      return;
    }
    
    mostrarNotificacion(resultado.mensaje);
    mostrarNotificacion(`📖 Libro agregado: "${resultado.libro.titulo}"`);
    
    document.getElementById('agregarLibroForm').reset();
    document.getElementById('disponible').checked = true;
    
    cargarTodosLosLibros();
  });
}

function cambiarDisponibilidad(id, nuevoEstado) {
  actualizarDisponibilidad(id, nuevoEstado, (error, resultado) => {
    if (error) {
      mostrarNotificacion(error.message, true);
      return;
    }
    
    mostrarNotificacion(resultado.mensaje);
    mostrarNotificacion(`🔄 "${resultado.libro.titulo}" ahora está: ${resultado.estadoTexto}`);
    
    cargarTodosLosLibros();
  });
}

function handleBuscarLibros() {
  const criterio = document.getElementById('criterioBusqueda').value;
  const valor = document.getElementById('valorBusqueda').value.trim();
  
  if (!valor) {
    mostrarNotificacion('Ingrese un valor para buscar', true);
    return;
  }
  
  buscarLibros(criterio, valor, (error, resultados) => {
    if (error) {
      mostrarNotificacion(error.message, true);
      return;
    }
    
    if (resultados.length === 0) {
      mostrarNotificacion(`No se encontraron libros con ${criterio} = "${valor}"`);
    } else {
      mostrarNotificacion(`🔍 Encontrados ${resultados.length} libro(s) con ${criterio} = "${valor}"`);
    }
    
    renderizarLibros(resultados);
  });
}

function resetearBusqueda() {
  document.getElementById('valorBusqueda').value = '';
  cargarTodosLosLibros();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Biblioteca Web inicializada');
  
  document.getElementById('agregarLibroForm').addEventListener('submit', handleAgregarLibro);
  document.getElementById('buscarBtn').addEventListener('click', handleBuscarLibros);
  document.getElementById('resetBusquedaBtn').addEventListener('click', resetearBusqueda);
  document.getElementById('refrescarBtn').addEventListener('click', cargarTodosLosLibros);
  
  cargarTodosLosLibros();
});

window.cambiarDisponibilidad = cambiarDisponibilidad;