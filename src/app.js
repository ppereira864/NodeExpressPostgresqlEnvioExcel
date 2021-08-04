// ---------------------------------------------------------------------- //
// Seccion de los require de los paquetes de Node
// ---------------------------------------------------------------------- //
const xlsx = require("xlsx");
const path = require("path");
const { Pool, Client } = require("pg");
const express = require('express');
const multer = require('multer');
const mimeType = require('mime-types');
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// Seccion de las Constante
// ---------------------------------------------------------------------- //
const app = express();
var env = require('node-env-file');
env(path.resolve("./") + "//.env");
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// Seccion de setting del pool 
// ---------------------------------------------------------------------- //
const setting = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

const pool = new Pool(setting);
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// CargarMulter es para establecer configuracion de donde estara  
// alojando el archivo xls o xlsx y asignandole un nombre base como lo
//  sera Mashini 
// ---------------------------------------------------------------------- //
const cargarMulter = multer.diskStorage({

    destination: process.env.LUGAR_A_GUARDAR,
    filename: function (req, file, cb) {
        cb("", "Mashini." + mimeType.extension(file.mimetype));

    }

});

const cargar = multer({ storage: cargarMulter })
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// Seccion de verificar excel para convertirlo en json
// ---------------------------------------------------------------------- //
let jsonData, ItemBase;

const VerifyExcel = (ruta) => {

    let LeerArchivo = xlsx.readFile(ruta);
    let NombreHoja = LeerArchivo.SheetNames;
    let data = NombreHoja[0];
    let ColumnaBase = LeerArchivo.Sheets[data]["!ref"][1];
    jsonData = xlsx.utils.sheet_to_json(LeerArchivo.Sheets[data]);

    let msj1 = ' Proceso Completado Sastifactoriamente ';
    let msj2 = ' Disculpe Pero El Archivo No Posee En La Columna Posicion #1 El Nombre "SKU" ';
    let msj3 = ' Disculpe Pero El Archivo En La Columna Posicion #1 Esta "VACIO" ';

    if (ColumnaBase == 1) {

        ItemBase = LeerArchivo.Sheets[data].A1.v;

        if (ItemBase == "SKU" || ItemBase == "sku") return { msj: msj1, error: 1 }
        else return { msj: msj2, error: 2 }

    } else if (ColumnaBase > 1) return { msj: msj3, error: 3 }

}
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// Seccion de Insertar los datos del Json a Postgresql
// ---------------------------------------------------------------------- //

const InsertSku_tablaSku = async () => {

    let querySql, data_value, values, resultado_querySql, i = 0;
    let resultadoFinal = [];

    querySql = 'truncate table ' + process.env.DB_TABLA;
    resultado_querySql = await pool.query(querySql);
    
    for (data of jsonData) {

        
        try {
    
            i ++;
            querySql = 'INSERT INTO ' + process.env.DB_TABLA + ' (sku) VALUES ($1)';
            data_value = data[ItemBase];
            values = [data_value];
            resultado_querySql = await pool.query(querySql, values);
            /////console.log('Guardado Sastifactorio De Dato SKU ' + i);
            resultadoFinal.push('Guardado SKU '+ data_value +' id: '+ i);
    
        } catch (e) {

            //////console.log(e.message);
            //////console.log('Error al Insertar Dato SKU ' + i);
            resultadoFinal.push('Error SKU '+ data_value +'e.message');
    
        }
        
    }

    return resultadoFinal;

}
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// Rutas de la aplicacion 
// ---------------------------------------------------------------------- //
app.get("/", (req, res) => {

    pool.query('SELECT NOW()', (err, response) => {

        if (response) {

            console.log(response.rows);
            pool.connect();
            res.sendFile(__dirname + "/view/index.html");

        } else {

            res.send(err.message);
        }

    });

});
// ---------------------------------------------------------------------- //
app.post("/receivingFile", cargar.single('archivo_xls'), (req, res) => {

    let MsjError = VerifyExcel(path.resolve("./") + process.env.DIR_ARCHIVO);

    if (MsjError.error >= 2)
        res.send('<h3>' + MsjError.msj + ' <a href="http://localhost:3000">Inicio</a></h3>');

    else if (MsjError.error == 1)
        res.send('<h3>' + MsjError.msj + ' <a href="http://localhost:3000/EnvioDatosBD">CLIC</a> Para Traspaso De SKU A La Base De Datos</h3>')

})
// ---------------------------------------------------------------------- //
app.get("/EnvioDatosBD", (req, res) => {

    (
        async () => {
            res.send(await InsertSku_tablaSku())
        }
    )()
    
})
// ---------------------------------------------------------------------- //



// ---------------------------------------------------------------------- //
// configuracion del listener de express
// ---------------------------------------------------------------------- //
app.listen(process.env.SRV_PORT, () =>

    console.log(`Server is running on http://${process.env.SRV_HOST}:${process.env.SRV_PORT}`)
);
