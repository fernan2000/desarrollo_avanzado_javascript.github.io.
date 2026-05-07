const planetas = require('./planetas');

function filtrarHabitables(listaPlanetas) {
  return listaPlanetas.filter(p => p.habitable === true);
}

function mostrarResumen(listaPlanetas) {
  const habitables = filtrarHabitables(listaPlanetas);
  console.log('==========================================');
  console.log('       RESUMEN DE LA EXPEDICION          ');
  console.log('========================================');
  console.log(`Total de planetas registrados : ${listaPlanetas.length}`);
  console.log(`Planetas potencialmente habitables: ${habitables.length}`);
  console.log('============================\n');
}



function mostrarPlanetas(listaPlanetas) {
  console.log('\nREGISTRO PLANETARIO - EXPEDICION ESPACIAL 🚀\n');

  listaPlanetas.forEach((planeta, index) => {
    console.log(`#${index + 1} ★ ${planeta.nombre}`);
    console.log(`Tipo: ${planeta.tipo}`);
    console.log(`Descripcion: ${planeta.descripcion}`);
    console.log(`Descubierto: ${planeta.descubiertoEn}`);
    console.log(`Habitable: ${planeta.habitable ? 'Sí 🌱' : 'No ❌'}`);
    console.log('   -----------------------------------------');
  });
}


mostrarPlanetas(planetas);
mostrarResumen(planetas);

console.log('¡Mision cumplida, Explorador Espacial! ');