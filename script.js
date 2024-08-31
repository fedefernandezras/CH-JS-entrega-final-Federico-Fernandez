console.log("inicio")

fetch('./info.json')
  .then(response =>
    response.json()
  )
  .then(datos => {
    reglas = datos; //  variable productos
    funcionInicial()  
  })
  .catch(error => 
    console.log(error)
  )
  
  let aprendido = []
// funciones principales
function funcionInicial (){
cargaDeRegistros()
mostrarRegistro() 
crearTargetaDeReglas(reglas)
filtrarPorCategoria(reglas)
}
function cargaDeRegistros(){
  
  
  //cargar historial(si lo hay)
  let aprendidoRec = localStorage.getItem("estudiado")
  if (aprendidoRec) {
    aprendido = JSON.parse(aprendidoRec)
    mostrarRegistro()
  }
}

function crearTargetaDeReglas(reglas) {
  let contenedorReglas = document.getElementById("rulebox")
  contenedorReglas.innerHTML = ""
  reglas.forEach(regla => {
    let reglaHTML = document.createElement("div")
    reglaHTML.classList.add("ruling")
    reglaHTML.innerHTML = `
      <h3>${regla.nombre}</h3>
      <h3>Categoría:</h3><p>${regla.categoria}</p>
      <p><img src="${regla.texto}"></p>
      <button class="botonl boton">Leído</button>
    `
    contenedorReglas.appendChild(reglaHTML)
    
    
    let botonAgregarAlHistorial = reglaHTML.querySelector("button")
    botonAgregarAlHistorial.addEventListener("click", () => {
      sumarAlHistorial(regla)
    })
  })
  
}

// push al array de historial
function sumarAlHistorial(regla) {
  if (!aprendido.some(r => r.id === regla.id)) { 
    aprendido.push({
      id: regla.id,
      nombre: regla.nombre,
      categoria: regla.categoria,
    })


    mostrarRegistro()
    aprendidoJson(aprendido)
    
   
  }
}
//setea el historial en el localstorage
function aprendidoJson (aprendido){
  let aprendidoString = JSON.stringify(aprendido)
  localStorage.setItem("estudiado",aprendidoString)
}



function mostrarRegistro() {
  let contenedorRegistros = document.getElementById("registros")
  let porcentaje = aprendido.length * 10
  contenedorRegistros.innerHTML = `<h2>Historial de lecturas (leído el ${porcentaje}% del tutorial):</h2>
  
  `
  aprendido.forEach(regla => {
    let reglaLeida = document.createElement("div")
    reglaLeida.classList.add("historial")
    reglaLeida.innerHTML = `
      <h3>• ${regla.nombre} - Categoría: ${regla.categoria}.</h3>
    `
    contenedorRegistros.appendChild(reglaLeida)
  })
  contenedorRegistros.innerHTML += `
  <button class="botonb boton" id="borrarHistorial">Limpiar historial</button>
  `
  let botonBorrarHistorial = document.getElementById("borrarHistorial");
  botonBorrarHistorial.addEventListener("click", () => {
    limpiarReg()
  })
}

function filtrarPorCategoria(listadereglas) {
  let categorias = []
  let contenedorPorFiltros = document.getElementById("filtros")
  contenedorPorFiltros.innerHTML = "<h2>Guia para principiantes (D&D)</h2>"

  listadereglas.forEach(regla => {
    if (!categorias.includes(regla.categoria)) {
      categorias.push(regla.categoria)
      let boton = document.createElement("button")
      boton.innerText = regla.categoria;
      boton.classList.add("botonc", "boton")
      boton.addEventListener("click", () => {
        let reglasFiltradas = reglas.filter(r => r.categoria === regla.categoria)
        crearTargetaDeReglas(reglasFiltradas)
      })
      contenedorPorFiltros.appendChild(boton)
    }
  })

  
  let botonMostrarTodo = document.createElement("button")
  botonMostrarTodo.innerText = "Mostrar todas"
  botonMostrarTodo.classList.add("botonc", "boton")
  botonMostrarTodo.addEventListener("click", () => crearTargetaDeReglas(reglas))
  contenedorPorFiltros.appendChild(botonMostrarTodo)
}
//reinicia historial y su respaldo en localstorage
function limpiarReg (){
 
 localStorage.clear()
 aprendido = []
 mostrarRegistro() 
 
}
console.log("final")


