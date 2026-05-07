//callback es una funcion que se pasa a otra funcion como argumento, y luego se ejecuta dentro de esa funcion externa para completar alguna accion o rutina.

const myfunc = (param, callback) => {
    console.log(`el texto original era ${param} y su transformacion es ${callback(param)}`);
}

const todoAMayusculas = (texto) => {
    return texto.toUpperCase();
}

const todoAMinusculas = (texto) => {
    return texto.toLowerCase();
}

myfunc("Hola Mundo", todoAMayusculas);
myfunc("Hola Mundo", todoAMinusculas);
