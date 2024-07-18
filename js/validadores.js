import { mostrarAlerta, crearElementoHTML  } from "./UI.js";
import { cliente } from "./app.js";
//Funciones que se encargan de validar informacion

//Formularios
export function comprobarFormulario(contenedor) {
    contenedor.forEach(campo => {
        const { value, name } = campo;
        if (value === "") return mostrarAlerta(crearElementoHTML("div", "invalid-feedback d-block alerta", `Agregue la ${name}`), campo.parentElement);
        cliente[name] = value;
    });
}

//Numeros
export const esNegativo = numero => numero <= 0;
