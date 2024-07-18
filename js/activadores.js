import {ocultarModal, mostrarSecciones, crearPedidoHTML} from "./UI.js";
import obtenerPlatillos from "./consultasAPI.js";
import { platilloRepetido, agregarPlatillo, modificarPlatillo  } from "./gestionDePedido.js";
import { comprobarFormulario} from "./validadores.js";
//Funciones que se encargan de iniciar una serie de procesos
function mostrarMenu() {
    ocultarModal();
    mostrarSecciones();
    obtenerPlatillos();
}

export function tomarOrden(platillo) {
    const { cantidad } = platillo;
    const repetido = platilloRepetido(platillo);
    repetido ? modificarPlatillo(platillo, cantidad) : agregarPlatillo(platillo);
    crearPedidoHTML();
}

export function guardarCliente() {
    const mesa = document.getElementById("mesa");
    const hora = document.getElementById("hora");
    const camposVacios = [mesa, hora];
    const sinDatosVacios = camposVacios.every(campo => campo.value !== "");
    if (!sinDatosVacios) return comprobarFormulario(camposVacios);
    mostrarMenu();
}