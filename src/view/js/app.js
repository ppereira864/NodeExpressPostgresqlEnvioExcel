let estado_carga = document.getElementById('estado_carga');

        const ArchivoCargandose = () => {

            estado_carga.classList.add('final');

        }

        let archivo_xls = document.getElementById('archivo_xls');

        archivo_xls.onclick = function(){

            console.log('holaaaaa')
            estado_carga.classList.classList.add('inicio');

        }

        archivo_xls.onchange = function(){

            ArchivoCargandose();

        }


// const xlsx = require("xlsx");

// const VerifyExcel = (ruta) => {

//     let fileRead = xlsx.readFile(ruta);

//     let sheetnames = fileRead.SheetNames;

//     let data = sheetnames[0];

//     numberColumn = fileRead.Sheets[data]["!ref"][1];

//     if (numberColumn == 1) {

//         nameHeader = fileRead.Sheets[data].A1.v;

//         if (nameHeader == "SKU" || nameHeader == "sku" ) return(' Proceso De Archivo Completado Sastifactoriamente ')
//         else return(' Disculpe Pero El Archivo No Posee En La Columna Posicion #1 El Nombre "SKU" ')

//     } else if (numberColumn > 1) return(' Disculpe Pero El Archivo En La Columna Posicion #1 Esta "VACIO"')

// }


// document.querySelector('error').innerHTML += VerifyExcel(path.resolve("./") + "\\cargarArchivoXls\\Mashini.xls");



// let peticion = new  XMLHttpRequest();

// peticion.upload.addEventListener("progress", (Event) =>{

//     let porcentaje = Math.round((Event.loaded / Event.total) * 100);
        
//     console.log(porcentaje);

//     barra_estado.style.width = porcentaje+'%';
        
//     span.innerHTML = porcentaje+'%';

// });

// peticion.addEventListener("load", () => {

//     barra_estado.classList.add('barra_verde');
        
//     span.innerHTML = "Carga De Archivo sastifactorio";

//     document.getElementById('envioBD').disabled = false;
    
// });

