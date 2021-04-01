let pagina=1;

const cita={
    nombre:"",
    fecha:"",
    hora: "",
    servicios:[]
}

document.addEventListener("DOMContentLoaded",function(){
    iniciarApp();
})

function iniciarApp(){
    mostrarServicios();

    //Resalta el DIV actual segun el tab que presiona
    mostrarSeccion()

    //Oculta o muestrauna seccion segun el tab al que se presiona
    cambiarSeccion();

    //Paginacion Siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita o mensaje de erro en caso de no pasar la validacion
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();
    
    //Deshabilita dias pasados
    deshabilitaFechaAnterior();

    //Almacena la hora de la cita en el objeto
    horaCita();


function mostrarSeccion() {
    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior= document.querySelector(".mostrar-seccion");
    if(seccionAnterior){
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual=document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");
    
    //Eliminar la clase de actual en el tab anterior
    const tabAnterior=document.querySelector(".tabs .actual");
    if(tabAnterior){
        tabAnterior.classList.remove("actual"); 
    }
    
    

    //Resalta el tab actual
    const tab=document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
    
}



function cambiarSeccion() {
    const enlaces=document.querySelectorAll(".tabs button");
    enlaces.forEach((enlace)=>{
        enlace.addEventListener("click",(e)=>{
            e.preventDefault();
            pagina=parseInt(e.target.dataset.paso);

            //Llamar la funcion de mostrar seccion 
            mostrarSeccion();
            botonesPaginador();
        })
    })
    
}


async function mostrarServicios(){
    try {
      const resultado= await fetch("./servicios.json");
      const db=await resultado.json();
      const {servicios}=db;

      //Generar html
      servicios.forEach(servicio => {
          const {id, nombre, precio}=servicio;

          //DOM SCRIPTING
          //Generar nombre
          const nombreServicio=document.createElement("p");
          nombreServicio.textContent= nombre;
          nombreServicio.classList.add("nombre-servicio");
         
          //Generar precio
          const pecioServicio=document.createElement("p");
          pecioServicio.textContent=`$${precio}`;
          pecioServicio.classList.add("precio-servicio");

          //Generar div
          const servicioDiv=document.createElement("div");
          servicioDiv.classList.add("servicio");
          servicioDiv.dataset.idServicio=id;
          // Selecciona un servicio para la cita
          servicioDiv.onclick=seleccionarServicio;

          //Inyectar precio y nombre al div 
          servicioDiv.appendChild(nombreServicio);
          servicioDiv.appendChild(pecioServicio);
          //Inyectando a html
          document.querySelector("#servicios").appendChild(servicioDiv);
          
      });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName==="P"){
        elemento=e.target.parentElement;
    }
    else{
        elemento=e.target;
    }

    if(elemento.classList.contains("seleccionado")){
        elemento.classList.remove("seleccionado");
        const id=parseInt(elemento.dataset.idServicio)
        eliminarServicio(id);
    }
    else{
        elemento.classList.add("seleccionado");

        const servicioObj={
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
    
}

function eliminarServicio(id) {
    const {servicios}=cita;
    cita.servicios=servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}
function agregarServicio(objeto) {
    const {servicios}=cita;
    cita.servicios = [...servicios, objeto];
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente= document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", ()=>{
        pagina++;
        console.log(pagina);
        botonesPaginador();
    });
}
function paginaAnterior() {
    const paginaAnterior= document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", ()=>{
        pagina--;
        console.log(pagina);
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente= document.querySelector("#siguiente");
    const paginaAnterior= document.querySelector("#anterior");

    if(pagina===1){
        paginaAnterior.classList.add("ocultar");
    } 
    else if(pagina===3){
        paginaSiguiente.classList.add("ocultar")
        paginaAnterior.classList.remove("ocultar")

        mostrarResumen();//Estamos en la pagina 3, carga el resumen de la cita
    }
    else{
        paginaSiguiente.classList.remove("ocultar")
        paginaAnterior.classList.remove("ocultar")
    }

    mostrarSeccion()// Cambia la seccion que se muestra por la de la pagina 
    
}

function mostrarResumen() {
    //Destructuring
    const { nombre, fecha, hora, servicios}=cita;

    //Seleccionar resumen
    const resumenDiv=document.querySelector(".contenido-resumen");
    
    //Limpiar HTML PREVIO
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }


    //Validacion de objetos
    if(Object.values(cita).includes("")){
        const noServicios=document.createElement("p");
        noServicios.textContent="Faltan datos de servicios, hora, fecha o nombre.";

        noServicios.classList.add("invalidar-cita");

        //Agregar a resumen div
        resumenDiv.appendChild(noServicios);
        return;
    }
    //Mostrar Resumen
    const headingResumen=document.createElement("h3");
    headingResumen.textContent="Resumen de Cita";

    const nombreCita=document.createElement("p");
    nombreCita.innerHTML=`<span>Nombre:</span> ${nombre}`;

    const fechaCita=document.createElement("p");
    fechaCita.innerHTML=`<span>Fecha:</span> ${fecha}`;

    const horaCita=document.createElement("p");
    horaCita.innerHTML=`<span>Hora:</span> ${hora}`;

    const serviciosCita=document.createElement("div");
    serviciosCita.classList.add("resumen-servicios");

    const headingServicios=document.createElement("h3");
    headingServicios.textContent="Resumen de servicios";

    serviciosCita.appendChild(headingServicios);

    let cantidad=0;
    //Iterar sobre el arreglo de servicios 
    servicios.forEach((servicio)=>{

        const{nombre, precio}=servicio;

        const contenedorServicio=document.createElement("div");
        contenedorServicio.classList.add("conetenedor-servicio")

        const textoServicio=document.createElement("p");
        textoServicio.textContent=nombre;


        const precioServicio=document.createElement("p");
        precioServicio.textContent=precio;
        precioServicio.classList.add("precio");

        //Total
        const totalServicio=precio.split("$");
        cantidad += parseInt(totalServicio[1].trim())

        //Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio)
    })
    
    resumenDiv.appendChild(headingResumen);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);
    const cantidadPagar=document.createElement("p");
    cantidadPagar.classList.add("total");
    cantidadPagar.innerHTML=`<span>Total a pagar:</span> $${cantidad}`;
    resumenDiv.appendChild(cantidadPagar); 

}

function nombreCita() {
    const nombreInput=document.querySelector("#nombre");

    nombreInput.addEventListener("input",(e)=>{
        const nombreTexto= e.target.value.trim();
        //Validacion de que nombre texto debe tener algo 
        if(nombreTexto==""||nombreTexto.length<3 ){
            mostrarAlerta("Nombre no valido","error");
        }
        else{
            const alerta=document.querySelector(".alerta");
            if(alerta){
                alerta.remove();
            }
            cita.nombre=nombreTexto;
        }
    })
    
}

function mostrarAlerta(mensaje,tipo) {

    //Si hay una alerta previa, entonces no crear otra
    const alertaPrevia=document.querySelector(".alerta");
    if(alertaPrevia){
        return;
    }

    const alerta=document.createElement("div")
    alerta.textContent=mensaje;
    alerta.classList.add("alerta");
    if(tipo==="error"){
        alerta.classList.add("error");
    }
    //Insertar en el html
    const formulario=document.querySelector(".formulario");
    formulario.appendChild(alerta);

    //Eliminar la alerta despues de 3seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
    
}
function fechaCita() {
    const fechaInput=document.querySelector("#fecha");
    fechaInput.addEventListener("input",e=>{
        const dia= new Date(e.target.value).getUTCDay();
        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value="";
            mostrarAlerta("Fines de semana no validos","error");
        }
        else{
            cita.fecha=fechaInput.value;
            console.log(cita);
        }
    })

   
}
function deshabilitaFechaAnterior() {
    const inputFecha=document.querySelector("#fecha");
     const fechaAhora= new Date();
     const year=fechaAhora.getFullYear();
     const mes=fechaAhora.getMonth()+1;
     const dia=fechaAhora.getDate();
    //Formato deseado AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`
    inputFecha.min=fechaDeshabilitar;    
}

function horaCita() {
    const inputHora=document.querySelector("#hora");
    inputHora.addEventListener("input",e=>{
        const horCita=e.target.value
        const hora= horCita.split(":");
        if(hora[0]<10||hora[0]>18){
            mostrarAlerta("Hora no valida","error");
            setTimeout(() => {
                inputHora.value="";
            }, 3000);
            
        }
        else{
            cita.hora=horCita;
            console.log(cita);
        }
    });

}
}
