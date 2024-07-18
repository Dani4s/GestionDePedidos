import { categorias, cliente } from "./app.js";
import { esNegativo } from "./validadores.js";
import { tomarOrden } from "./activadores.js";
import { calcularSubTotal, calcularSubTotalPedido, eliminarPlatillo, calcularPropina } from "./gestionDePedido.js";
//Funciones encargadas de crear elementos HTML

export function crearElementoHTML(etiqueta, clases, texto) {
    const html = document.createElement(etiqueta);
    if (clases) html.className = clases;
    if (texto) html.textContent = texto;
    return html;
}

function crearElementoConSpan(etiquetaPropiedades, spanPropiedades) {
    const etiquetaACrear = crearElementoHTML(...etiquetaPropiedades);
    const etiquetaACrearSpan = crearElementoHTML(...spanPropiedades);
    etiquetaACrear.append(etiquetaACrearSpan);
    return etiquetaACrear;
}

function crearFormularioPropinas(){
    const formulario = crearElementoHTML("div", "col-md-6 formulario");
    const divFormulario = crearElementoHTML("div", "card py-2 px-3 shadow");
    limpiarHTML(divFormulario);
    const formularioTitulo = crearElementoHTML("h3", "my-4 text-center", "Propina: ");

    const pedidoInfo = crearElementoHTML("div");

    const subTotalPrecio = calcularSubTotalPedido();
    const radioButton1 = crearRadioButtons(10,subTotalPrecio, pedidoInfo);
    const radioButton2 = crearRadioButtons(25,subTotalPrecio, pedidoInfo);
    const radioButton3 = crearRadioButtons(50,subTotalPrecio, pedidoInfo);

    mostrarDatosPedido(pedidoInfo);
    
    divFormulario.append(formularioTitulo, radioButton1, radioButton2, radioButton3, pedidoInfo);

    formulario.append(divFormulario);
    return formulario;
}

function crearRadioButtons(porcentajePropina, subTotal, contenedor){
    const radioButtonDiv = crearElementoHTML("div", "form-check");
    const radioButton =  crearElementoHTML("input", "form-check-input");
    radioButtonAtributos(radioButton, porcentajePropina);
    radioButton.addEventListener("click", () => calcularPropina(radioButton.value ,subTotal, contenedor));
    const radioLabel = crearElementoHTML("label", "form-check-label", `${porcentajePropina}%`);
    radioButtonDiv.append(radioButton, radioLabel);
    return radioButtonDiv;
}

//Funciones encargadas de modificar atributos
function inputAtributos(input, id) {
    input.type = "number";
    input.min = input.value = 0;
    input.id = `producto-${id}`;
}

function radioButtonAtributos(radioButton, valor) {
    radioButton.type = "radio";
    radioButton.name = "propina";
    radioButton.value= valor;
}

function actualizarSelectores(id, nuevoValor){
    const selector = document.getElementById(`producto-${id}`);
    selector.value = nuevoValor;
}

//Funciones encargadas de gestionar las alertas y mensajes

export function mostrarAlerta(alerta, contenedor) {
    const alertaPrevia = contenedor.querySelector(".alerta");
    alertaPrevia?.remove();
    contenedor.append(alerta);
    eliminarAlerta(alerta);
};

function eliminarAlerta(alerta) {
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

const mostrarMensaje = contenedor => contenedor.append(crearElementoHTML("h3", "my-4 text-center", "Seleccione sus platillos"));

//Funciones que modifican el DOM

export function imprimirMenuHTML(platillos) {
    const contenido = document.querySelector("#platillos .contenido");

    platillos.forEach(platillo => {
        const { nombre, precio, categoria, id } = platillo;
        const row = crearElementoHTML("div", "row");

        const nombrePlatillo = crearElementoHTML("div", "col-md-4", nombre);
        const precioPlatillo = crearElementoHTML("div", "col-md-3", `$${precio}`);
        const categoriaPlatillo = crearElementoHTML("div", "col-md-3", categorias[categoria]);

        const cantidadPlatillo = crearElementoHTML("input", "form-control", categorias[categoria]);
        inputAtributos(cantidadPlatillo, id);

        const agregarPlatillo = crearElementoHTML("div", "col-md-2");
        agregarPlatillo.append(cantidadPlatillo);
        agregarPlatillo.addEventListener("change", () => {
            const input = agregarPlatillo.firstChild;
            const negativo = esNegativo(parseInt(input.value));
            if (negativo) {
                eliminarPlatillo(platillo)
                input.value = 0;
                crearPedidoHTML();
                return;
            } 
            const cantidad = parseInt(cantidadPlatillo.value);
            tomarOrden({ ...platillo, cantidad });
        });
        row.append(nombrePlatillo, precioPlatillo, categoriaPlatillo, agregarPlatillo,);
        contenido.append(row);
    })
}

export function crearPedidoHTML() {
    const contenido = document.querySelector("#resumen .contenido");
    limpiarHTML(contenido);
    if (cliente.pedido.length <= 0) return mostrarMensaje(contenido);
    const resumen = crearElementoHTML("div", "col-md-6 card py-2 px-3  shadow");
    const titulo = crearElementoHTML("h3", "my-4 text-center", "Platillos seleccionados: ");
    const mesa = crearElementoConSpan(["p", "fw-bold", "Mesa: "], ["span", "fw-normal", `#${cliente.mesa}`]);
    const hora = crearElementoConSpan(["p", "fw-bold", "Hora del pedido: "], ["span", "fw-normal", cliente.hora]);
    const pedidos = crearElementoHTML("ul", "list-group list-unstyled");
    imprimirPedidos(pedidos);
    resumen.append(titulo, mesa, hora, pedidos);
    const formularioPropinas = crearFormularioPropinas();
    contenido.append(resumen, formularioPropinas);
}

function imprimirPedidos(pedidos) {
    cliente.pedido.forEach(pedido => {
        const { nombre, cantidad, precio, id } = pedido;
        const lista = crearElementoHTML("li", "list-group-item");
        const pedidoNombre = crearElementoHTML("li", "my-4", nombre);
        const pedidoCantidad = crearElementoConSpan(["li", "fw-bold my-2", `Cantidad: `], ["span", "fw-normal", cantidad]);
        const pedidoPrecio = crearElementoConSpan(["li", "fw-bold my-2", `Precio: `], ["span", "fw-normal", `$${precio}`]);
        const pedidoSubTotal = crearElementoConSpan(["li", "fw-bold my-2", `Subtotal: `], ["span", "fw-normal", `$${calcularSubTotal(precio, cantidad)}`]);
        const delateBtn = crearElementoHTML("button", "btn btn-danger my-2", "Eliminar el pedido");

        delateBtn.addEventListener("click", () => {
            eliminarPlatillo(pedido);
            crearPedidoHTML();
            actualizarSelectores(id, 0); 
        })

        lista.append(pedidoNombre, pedidoCantidad, pedidoPrecio, pedidoSubTotal, delateBtn);
        pedidos.append(lista);
    })
}

export function mostrarDatosPedido(contenedor, propina){
    limpiarHTML(contenedor);
    const subTotalValor = calcularSubTotalPedido();
    const subTotal = crearElementoConSpan(["p", "fw-bold my-2", "SubTotal: "], ["span", "fw-normal", `$${subTotalValor}`]);
    let propinaDada;
    if (propina)  propinaDada = crearElementoConSpan(["p", "fw-bold my-2", "Propina: "], ["span", "fw-normal", `$${propina}`]);
    const totalAPagar = crearElementoConSpan(["p", "fw-bold my-2", "Total a pagar: "], ["span", "fw-normal", `$${propina ? (subTotalValor + propina) : subTotalValor}`]);
    propinaDada ? contenedor.append(subTotal, propinaDada, totalAPagar): contenedor.append(subTotal, totalAPagar);
}

//Funciones que modifican clases css

export function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll(".d-none");
    seccionesOcultas.forEach(seccion => seccion.classList.remove("d-none"));
}

//Funciones para limpiar HTML

function limpiarHTML(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}

//Funciones para ocultar contenido
export function ocultarModal() {
    const modal = document.getElementById("formulario");
    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap.hide();
}




