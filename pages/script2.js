console.log("inicio")

fetch('./info.json')
  .then(response =>
    response.json()
  )
  .then(datos => {
    productos = datos //  variable productos
    principal()  
  })
  .catch(error => 
    console.log(error)
  )
  
  
  let carrito = []
  let categoriaActual = "todos"
  const botonVerCarrito = document.getElementById("verCarrito")
  const contenedorIconoCarrito = document.getElementById("carritoIcono")
  const contenedorProductos = document.getElementById("productos")
  const contenedorCarrito = document.getElementById("carrito")
  const contenedorPorFiltros = document.getElementById("filtrosdecategorias")
  
//funcion principal
function principal(){
  backup()
  crearTarjetaDeProductos(productos)
  filtrarPorCategoria(productos)
  mostrarCarrito()
  actualizarBotonComprar()
  contadorCarrito()
}



// Listeners
carritoIcono.addEventListener("click", verOcultar)

// Funciones del carrito
function actualizarBotonComprar() {
  const botonComprarCarrito = document.getElementById("comprarTodo")
  botonComprarCarrito.disabled = carrito.length === 0
  actualizarBotonVaciar()
}

function actualizarBotonVaciar() {
  const botonBorrarCarrito = document.getElementById("borrarCarrito")
  botonBorrarCarrito.disabled = carrito.length === 0
}

function contadorCarrito() {
  // Verifica si hay productos en el carrito
  if (carrito.length === 0) {
    contenedorIconoCarrito.innerHTML = `
      <button id="botonVerCarrito" class="boton-transparente"></button>
    `
  } else {
    let carritoNumero = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    contenedorIconoCarrito.innerHTML = `
      <button id="botonVerCarrito" class="boton-transparente cargacarrito">${carritoNumero}</button>
    `
  }
}

function mostrarCarrito() {
  let total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0)
  contenedorCarrito.innerHTML = `<h4>Carrito de compras</h4>`

  carrito.forEach((producto, index) => {
    let productoSeleccionado = document.createElement("div")
    productoSeleccionado.classList.add("compras")
    productoSeleccionado.innerHTML = `
      <h3>• ${producto.nombre} - precio: $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}
      <button class="boton-eliminar" data-index="${index}"></button></h3>
    `
    contenedorCarrito.appendChild(productoSeleccionado)
  })

  contenedorCarrito.innerHTML += `
    <h4>Total a pagar: $${total}</h4>
    <button class="botoncar boton" id="borrarCarrito">Vaciar carrito</button>
    <button class="botoncar boton" id="comprarTodo">Realizar compra</button>        
    <button id="verProductos" class="botoncar boton">← Volver a Productos</button>
  `

  document.getElementById("borrarCarrito").addEventListener("click", limpiarCar)
  document.getElementById("comprarTodo").addEventListener("click", () => {
    comprarCar()
    SweetAlertCompra()
  });
  document.getElementById("verProductos").addEventListener("click", verOcultar)

  document.querySelectorAll(".boton-eliminar").forEach((boton) => {
    boton.addEventListener("click", () => {
      eliminarProducto(boton.getAttribute("data-index"))
    })
  })

  actualizarBotonComprar()
}

function eliminarProducto(index) {
  let productoEnCarrito = carrito[index]
  let producto = productos.find((p) => p.id === productoEnCarrito.id)
  producto.stock += productoEnCarrito.cantidad

  carrito.splice(index, 1)
  mostrarCarrito()
  carritoJson(carrito)
  crearTarjetaDeProductos(filtrarProductosPorCategoria(categoriaActual))
  contadorCarrito()
}

function limpiarCar() {
  carrito.forEach((producto) => {
    let productoOriginal = productos.find((p) => p.id === producto.id)
    productoOriginal.stock += producto.cantidad
  })

  stockJson(productos)
  carrito = []
  mostrarCarrito()
  crearTarjetaDeProductos(filtrarProductosPorCategoria(categoriaActual))
  contadorCarrito()
}

function comprarCar() {
  stockJson(productos)
  carrito = []
  mostrarCarrito()
  carritoJson(carrito)
  crearTarjetaDeProductos(filtrarProductosPorCategoria(categoriaActual))
  contadorCarrito()
}

function verOcultar() {
  contenedorCarrito.classList.toggle("oculto")
  contenedorProductos.classList.toggle("oculto")
}
//funciones de productos
function crearTarjetaDeProductos(productos) {
  contenedorProductos.innerHTML = ""
  productos.forEach((producto) => {
    let productoHTML = document.createElement("div")
    productoHTML.classList.add("articulos")

    let stockClass = producto.stock <= 2 ? "stock-rojo" : ""
    let stockTexto = producto.stock > 0 
      ? `<p class="${stockClass}">Quedan ${producto.stock} uni.</p>`
      : `<p class="sin-stock stock-rojo">Producto agotado</p>`
    let botonEstado = producto.stock > 0 ? "" : "disabled"

    productoHTML.innerHTML = `
      <p><img src="${producto.texto}"></p>
      <h3>${producto.nombre}</h3>
      <p>${producto.categoria}</p>
      ${stockTexto}
      <p>$${producto.precio}</p>
      <button class="botong boton" ${botonEstado}>Agregar al carrito</button>
    `
    contenedorProductos.appendChild(productoHTML)

    let botonAgregarAlCarrito = productoHTML.querySelector("button")
    if (producto.stock > 0) {
      botonAgregarAlCarrito.addEventListener("click", () => agregarAlCarrito(producto))
    }
  })
}

function agregarAlCarrito(producto) {
  let productoEnCarrito = carrito.find((c) => c.id === producto.id)

  if (productoEnCarrito) {
    if (producto.stock > 0) {
      productoEnCarrito.cantidad += 1
      producto.stock -= 1
    }
  } else if (producto.stock > 0) {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      cantidad: 1,
    });
    producto.stock -= 1
  }

  TostadaLauncher("Producto Agregado!")
  mostrarCarrito()
  carritoJson(carrito)
  crearTarjetaDeProductos(filtrarProductosPorCategoria(categoriaActual))
  actualizarBotonComprar()
  contadorCarrito()
}

function filtrarProductosPorCategoria(categoria) {
  return categoria === "todos"
    ? productos
    : productos.filter((p) => p.categoria === categoria)
}

function filtrarPorCategoria(listaDeProductos) {
  let categorias = []
  contenedorPorFiltros.innerHTML = "<h2>Tu Guía Definitiva para la Aventura</h2>"

  listaDeProductos.forEach((producto) => {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria)
      let boton = document.createElement("button")
      boton.innerText = producto.categoria
      boton.classList.add("botonf", "boton")
      boton.addEventListener("click", () => {
        categoriaActual = producto.categoria
        crearTarjetaDeProductos(filtrarProductosPorCategoria(categoriaActual))
      });
      contenedorPorFiltros.appendChild(boton)
    }
  })

  let botonMostrarTodo = document.createElement("button")
  botonMostrarTodo.innerText = "Mostrar todo"
  botonMostrarTodo.classList.add("botonf", "boton")
  botonMostrarTodo.addEventListener("click", () => {
    categoriaActual = "todos"
    crearTarjetaDeProductos(productos)
  })
  contenedorPorFiltros.appendChild(botonMostrarTodo)
}

// funciones de almacenamiento de datos
function carritoJson(carrito) {
  localStorage.setItem("precompra", JSON.stringify(carrito))
}

function stockJson(productos) {
  localStorage.setItem("stock", JSON.stringify(productos))
}

function backup() {
  let carritoMemory = localStorage.getItem("precompra")
  if (carritoMemory) {
    carrito = JSON.parse(carritoMemory)
    actualizarStockDesdeCarrito()
    mostrarCarrito()
  }
  let stockMemory = localStorage.getItem("stock")
  if (stockMemory) {
    productos = JSON.parse(stockMemory)
    actualizarStockDesdeCarrito()
    mostrarCarrito()
  }

  function actualizarStockDesdeCarrito() {
    carrito.forEach((itemEnCarrito) => {
      let producto = productos.find((p) => p.id === itemEnCarrito.id)
      if (producto) {
        producto.stock -= itemEnCarrito.cantidad
      }
    })
  }
}

// funciones de sweetalert2 y tost

function SweetAlertCompra() {
  Swal.fire({
    imageUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_743564-MLM46309606646_062021-F.webp",
    title: "¡Su pedido ha sido registrado!",
    text: "Será informado de su envío en la brevedad.",
    imageAlt: "imagen gracias",
    confirmButtonText: '<i class="fa fa-thumbs-up"></i> ¡Continuar navegando!',
    customClass: { image: "saimg", confirmButton: "saboton" },
  })
}

function TostadaLauncher(text) {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
    style: { background: "linear-gradient(to right, #00999b, #96993d)" },
    onClick: verOcultar,
  }).showToast()
}

console.log("final")