var urlCiudades = 'https://dl.dropboxusercontent.com/s/00i60snrt36w7i3/ciudades.txt';
var arrCiudades = [23];
var urlCapitales = 'https://dl.dropboxusercontent.com/s/sy1tb3iwof0634p/capitales.txt';
var arrCapitales = [];

//////////////////////////////////////////////////////////////////////

// Estructura basica para ambos arreglos
function Ciudad(){
    this.nombreProvincia = "";
    this.nombreCiudad = "";
    this.latitud= 0;
    this.longitud=0;
}

// Con un string que obtengo del archivo la divido por las comas. Luego guardo los datos en una posicion del arreglo. 
// En cada posicion del arreglo hay una ciudad distinta

function cargarArreglo(arreglo, cadena)
{
    var auxiliar = new Ciudad();
    var res = cadena.split(",");
    auxiliar.nombreProvincia= res[0];
    auxiliar.nombreCiudad= res[1];
    auxiliar.latitud= res[2];
    auxiliar.longitud= res[3];
    arreglo.push(auxiliar);
    
}

// Tomo los datos del archivo y lo almaceno en la variable allText. Luego separo las lineas y las almaceno en el arreglo 
// allTextLines. Hago un for recorriendo ese arreglo y por cada posicion llamo a cargarArreglo

function cargarArregloCapitales()
{
    var arch = new XMLHttpRequest();
    arch.open ("GET", urlCapitales , false);
        
    arch.onreadystatechange = function()
    {
		textoCompleto = arch.responseText;
		arrLineas = textoCompleto.split(/\r\n|\n/);
		for(var i=0; i < arrLineas.length; i++)
		{    
		  cargarArreglo(arrCapitales,arrLineas[i]);
		} 
    }
    arch.send();
       
    
}

//Codigo Provincias: 0=Jujuy, 1=Salta, 2=Formosa, 3=Chaco, 4=Tucuman, 5=Catamarca, 6=Santiago del Estero, 7=Santa Fe, 8=Misiones, 9=Corrientes,
// 10=Entre Rios, 11=Cordoba, 12=La Rioja, 13=San Juan, 14=Mendoza, 15=San Luis, 16=Buenos Aires, 17=La Pampa, 18=Neuquen, 19=Rio Negro, 20=Chubut, 
//21=Santa Cruz, 22= Tierra del fuego
function cargarArregloCiudades()
{
	var arch = new XMLHttpRequest();
    arch.open ("GET", urlCiudades , false);
    
    arch.onreadystatechange = function()
    {
        textoCompleto = arch.responseText;
        arrLineas = textoCompleto.split(/\r\n|\n/);


		for (i = 0; i < 23; i++){
		arrCiudades[i]=[6];
		}

		var res;
		var posI= 0;
		var posJ= 0;
		for (var i=0; i<arrLineas.length; i++)
		{
			res = arrLineas[i].split(",");
		 
			if (posJ < 6)
			{
				var auxiliar = new Ciudad();
				auxiliar.nombreProvincia= res[0];
				auxiliar.nombreCiudad= res[1];
				auxiliar.latitud= res[2];
				auxiliar.longitud= res[3];
				arrCiudades[posI][posJ]=auxiliar;
				posJ++;
			}
			else
			{
				posI++;
				posJ= 0;
				var auxiliar = new Ciudad();
				auxiliar.nombreProvincia= res[0];
				auxiliar.nombreCiudad= res[1];
				auxiliar.latitud= res[2];
				auxiliar.longitud= res[3];
				arrCiudades[posI][posJ]=auxiliar;
				posJ++;
				
			}
		} 
		
    }
    arch.send();
    
}
   window.addEventListener('load', inicio, false);

    function inicio() 
	{
        cargarArregloCapitales ();
        cargarArregloCiudades();   
// FORMA DE ACCEDER A LAS POSICIONES DEL ARREGLO DE CIUDADES		
		document.getElementById("editor").innerHTML= arrCiudades[22][5].nombreCiudad;
    }


