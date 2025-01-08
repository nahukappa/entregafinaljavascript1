// Variables globales
let productos = [];
let carrito = [];

// Elementos del DOM
const productosContainer = document.getElementById('productos-container');
const verCarritoBtn = document.getElementById('ver-carrito');
const carritoModal = document.getElementById('carrito-modal');
const cerrarModal = document.querySelector('.cerrar');
const carritoLista = document.getElementById('carrito-lista');
const totalCarrito = document.getElementById('total-carrito');
const cantidadCarrito = document.getElementById('cantidad-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

// Fetch de productos desde JSON
fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        mostrarProductos();
        cargarCarrito();
    })
    .catch(error => console.error('Error al cargar productos:', error));

// Mostrar productos en el DOM
function mostrarProductos() {
    productosContainer.innerHTML = '';
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>$${producto.precio.toFixed(2)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        productosContainer.appendChild(div);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        const existe = carrito.find(item => item.id === id);
        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarrito();
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#27ae60",
        }).showToast();
    } else {
        Swal.fire('Error', 'Producto no encontrado', 'error');
    }
}

// Actualizar carrito en el DOM y en Web Storage
function actualizarCarrito() {
    carritoLista.innerHTML = '';
    let total = 0;
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}`;
        carritoLista.appendChild(li);
        total += item.precio * item.cantidad;
    });
    totalCarrito.textContent = total.toFixed(2);
    cantidadCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    guardarCarrito();
}

// Guardar carrito en Web Storage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde Web Storage
function cargarCarrito() {
    const almacenado = localStorage.getItem('carrito');
    if (almacenado) {
        carrito = JSON.parse(almacenado);
        actualizarCarrito();
    }
}

// Mostrar modal del carrito
verCarritoBtn.addEventListener('click', () => {
    carritoModal.style.display = 'block';
});

// Cerrar modal del carrito
cerrarModal.addEventListener('click', () => {
    carritoModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target == carritoModal) {
        carritoModal.style.display = 'none';
    }
});

// Finalizar compra
finalizarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire('Carrito Vacío', 'Agrega productos al carrito antes de finalizar la compra.', 'info');
        return;
    }
    Swal.fire({
        title: '¿Deseas finalizar tu compra?',
        text: `Total a pagar: $${totalCarrito.textContent}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizarCarrito();
            carritoModal.style.display = 'none';
            Swal.fire('Compra Exitosa', 'Gracias por tu compra!', 'success');
        }
    });
});
