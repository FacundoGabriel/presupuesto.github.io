// variables
const formulario = document.querySelector('.info');
const gastoListado = document.querySelector('.lista_gastos');


// eventos
eventListeners();

function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto);
}



// clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();  
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
    

}


class UI{
    insertarPresupuesto( cantidad ){

        // extrayendo los valores
        const {presupuesto, restante} = cantidad;

        // agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
            const divMensaje = document.createElement('div'); 
            
            const agregarError = document.querySelector('#agregar_hijo_gasto');

            if(tipo === 'error'){       
                divMensaje.classList.add('alerta_error');
                agregarError.appendChild(divMensaje);  
                 
                // sacar el error
                setTimeout(() => {
                    divMensaje.remove();
                }, 3000);
            }
            else{
                divMensaje.classList.add('alerta_correcto');
                agregarError.appendChild(divMensaje);

                //sacar el mensaje de correcto 
                setTimeout(() => {
                    divMensaje.remove();
                }, 3000);
            }

            divMensaje.textContent = mensaje;
    }

    mostrarGastos(gastos){
 

        this.limpiarHTML(); //elimina el html previo
        
        // Iterar sobre los gastos 
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            //crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.classList.add('list_group')
            // const nuevoGasto = document.querySelector('.list_group');
            // nuevoGasto.setAttribute('data-id',id); // hace lo mismo que lo de abajo
            nuevoGasto.dataset.id = id;


            // agregar el HTML
            nuevoGasto.innerHTML = `${nombre} <span class = "lista_cantidad">  $${cantidad} </span>`


            // btn para borrar datos
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn_borrar');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);


            // agregarmos al HTML
            gastoListado.appendChild(nuevoGasto);
            gastoListado.style.display = 'block';
        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // comprobar 25%
        if( ( presupuesto / 4 ) > restante ){
            restanteDiv.classList.remove('.presupuesto', 'alert_amarilla')
            restanteDiv.classList.add('alert_roja');
        } else if( (presupuesto) / 2 > restante ){ //comprobar 50%
            restanteDiv.classList.remove('.presupuesto')
            restanteDiv.classList.add('alert_amarilla');
        } else{
            restanteDiv.classList.remove('alert_roja', 'alert_amarilla' );
            restanteDiv.classList.add('.presupuesto')
        }

        // si el total es menor a cero

        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se agotó', 'error');

            formulario.querySelector('input[type="submit"]').disabled = true;
        }
    }
}

//instaciar 
const ui = new UI();

let presupuesto;

// funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')
    
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload()
    }

    // presupuesto valido

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}

// añadir gastos
function agregarGasto(e){
  
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos deben ser obligatorios', 'error');
        
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantdad no valida', 'error');
        
        return;
    }
    

    // generar un objeto con el gasto

    const gasto = {
        nombre, 
        cantidad, 
        id:Date.now()
    }

    // añade un nuevo presupuesto
    presupuesto.nuevoGasto( gasto );


    // mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente', 'correcto')

    // Imprime los gastos
    const {gastos , restante} = presupuesto;
    ui.mostrarGastos(gastos);

    //actualizar restante
    ui.actualizarRestante(restante);


    ui.comprobarPresupuesto(presupuesto);

    // reiniciar el formulario
    formulario.reset();
}


function eliminarGasto(id){
    // elimina de la clase
    presupuesto.eliminarGasto(id);

    // elimina gasto del hmtl
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}