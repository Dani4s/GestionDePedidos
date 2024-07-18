import {guardarCliente} from "./activadores.js"

export const cliente = {mesa: "", hora: "", pedido: []};
export const categorias = { 1: "Comida", 2: "Bebida",3: "Postre"};

document.addEventListener("DOMContentLoaded", () => {
    const btnGuardarCliente = document.getElementById("guardar-cliente");
    btnGuardarCliente.addEventListener("click", guardarCliente);
})


