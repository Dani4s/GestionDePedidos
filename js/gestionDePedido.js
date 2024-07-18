import { cliente } from "./app.js";
import { mostrarDatosPedido } from "./UI.js";
export const platilloRepetido = platillo => cliente.pedido.some(repetido => repetido.id === platillo.id);
export const editarPlatillo = platillo => cliente.pedido = cliente.pedido.map(platilloAModificar => platilloAModificar.id === platillo.id ? platillo : platilloAModificar);
export const agregarPlatillo = platillo =>  cliente.pedido = [...cliente.pedido, platillo];
export const eliminarPlatillo = platillo =>  cliente.pedido = cliente.pedido.filter(platilloEliminado => platilloEliminado.id !== platillo.id);
export const modificarPlatillo = (platillo, cantidad) =>  cantidad > 0 ? editarPlatillo(platillo) : eliminarPlatillo(platillo);
export const calcularSubTotal = (precio, cantidad) =>  precio * cantidad;

export function calcularSubTotalPedido(){
    let totalPedido = 0;
    cliente.pedido.map(platillo => totalPedido += calcularSubTotal(platillo.precio, platillo.cantidad));
    return totalPedido;
}

export function calcularPropina(propinaPorcentaje, subTotal, contenedor){
     const propinaDada = (subTotal * (propinaPorcentaje / 100));
     mostrarDatosPedido(contenedor, propinaDada);
}