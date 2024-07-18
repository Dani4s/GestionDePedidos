import { imprimirMenuHTML } from "./UI.js"; 
//funciones para consultas en la API
export default async function obtenerPlatillos() {
    const url = "http://localhost:4000/platillos";
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        imprimirMenuHTML(resultado)
    } catch (error) {
        console.log(error);
    }
   
}