var map;
var arrCapitales = [23]; //provincias
var arrCiudades = [23];  //ciudades de cada provincia
var cities = [];         //array para los marcadores

//para hacer request del openweather tuve que hacer una cuenta
//http://home.openweathermap.org/
//login: glhmaxi@live.com.ar pass: tupar1520
//anexamos el ID al final de cada request de openweather 
//ID: f3d95ae9eca49b0c5d1df03ca6bff3c7

// Estructura basica para ambos arreglos
function Ciudad(){
  this.nombreProvincia = "";
  this.nombreCiudad = "";
  this.latitud= 0;
  this.longitud=0;
}

// Tomo los datos del archivo y lo almaceno en la variable allText. Luego separo las lineas y las almaceno en el arreglo allTextLines. Hago un for recorriendo ese arreglo y por cada posicion llamo a cargarArreglo
function cargar(arreglo, url){
  
  // Con un string que obtengo del archivo la divido por las comas. Luego guardo los datos en una posicion del arreglo. En cada posicion del arreglo hay una ciudad distinta
  function cargarArreglo(arreglo, cadena){
    var auxiliar = new Ciudad();
    var res = cadena.split(",");
    auxiliar.nombreProvincia= res[0];
    auxiliar.nombreCiudad= res[1];
    auxiliar.latitud= res[2];
    auxiliar.longitud= res[3];
    arreglo.push(auxiliar);
  }
  
  var textfile = new XMLHttpRequest();
  textfile.open ("GET", url , false);

  textfile.onreadystatechange = function(){
    allText = textfile.responseText;
    allTextLines = allText.split(/\r\n|\n/);
    for(var i=0; i < allTextLines.length; i++){    
      cargarArreglo(arreglo,allTextLines[i]);
    }
  }
  textfile.send();
}

//NO LO USO, uso la carga anterior = cargar(arrCapitales,urlCapitales);
/*function cargarArregloCapitales(){
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
       
    
}*/
//Codigo Provincias: 0=Jujuy, 1=Salta, 2=Formosa, 3=Chaco, 4=Tucuman, 5=Catamarca, 6=Sokantiago del Estero, 7=Santa Fe, 8=Misiones, 9=Corrientes,
// 10=Entre Rios, 11=Cordoba, 12=La Rioja, 13=San Juan, 14=Mendoza, 15=San Luis, 16=Buenos Aires, 17=La Pampa, 18=Neuquen, 19=Rio Negro, 20=Chubut, 
//21=Santa Cruz, 22= Tierra del fuego

function cargarArregloCiudades(urlCiudades){
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
            var auxiliar = new Ciudad();
            auxiliar.nombreProvincia= res[0];
            auxiliar.nombreCiudad= res[1];
            auxiliar.latitud= res[2];
            auxiliar.longitud= res[3];
            arrCiudades[posI][posJ]=auxiliar;
          if (posJ < 6) posJ++;
          else
          {
            posI++;
            posJ= 0;
          }
		} 
		
    }
    arch.send();
    
}

//funcion que agrega los marcadores
function agregarmarcadores(arreglo,botonDerActivado){
  
  function averiguarclima(lat,lng,callbackFunction){
    gettingData = true;
    var requestString = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid=f3d95ae9eca49b0c5d1df03ca6bff3c7";
    request = new XMLHttpRequest();
    request.onload = function() {callbackFunction(this.response);}
    request.open("get", requestString, true);
    request.send();
  };
  //JSON que trae el request averiguarclima
  /* 
  {"coord":{"lon":-65.3,"lat":-24.19},"weather":[{"id":800,"main":"Clear","description":"Sky is Clear","icon":"01n"}],"base":"cmc stations","main":{"temp":277.087,"pressure":825.04,"humidity":89,"temp_min":277.087,"temp_max":277.087,"sea_level":1026.93,"grnd_level":825.04},"wind":{"speed":1.13,"deg":350.502},"clouds":{"all":0},"dt":1448073327,"sys":{"message":0.0066,"country":"AR","sunrise":1448097936,"sunset":1448146125},"id":3836564,"name":"San Salvador de Jujuy","cod":200}
  */
  
  function averiguarclimaext(lat,lng,callbackFunction){
    gettingData = true;
    var requestString = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lng+"&appid=f3d95ae9eca49b0c5d1df03ca6bff3c7";
    
    //{ciudad.latitud}&lon={ciudad.longitud};
    request = new XMLHttpRequest();
    request.onload = function() {$("#contenedor").html(this.response);}
    request.open("get", requestString, true);
    request.send();
  };
  
  arreglo.forEach(function(ciudad){
    averiguarclima(parseFloat(ciudad.latitud),parseFloat(ciudad.longitud),function(response){
      var info=JSON.parse(response);
      var icono = "http://openweathermap.org/img/w/"+info.weather[0].icon+".png";
        cities[ciudad.nombreProvincia] = new google.maps.Marker({
        position: {lat: parseFloat(ciudad.latitud), lng: parseFloat(ciudad.longitud)},
        map: map,
        icon: icono,
        title: ciudad.nombreProvincia
      });
      
      //click izq: info marcador
      google.maps.event.addListener(cities[ciudad.nombreProvincia], 'click', function (event){
        averiguarclimaext(parseFloat(ciudad.latitud),parseFloat(ciudad.longitud));
      });
      //click der: zoom en el marcador
      if (botonDerActivado){
        google.maps.event.addListener(cities[ciudad.nombreProvincia], 'rightclick', function (event) {
          map.setZoom(8);
          map.setCenter(this.getPosition());
          agregarmarcadores(arrCiudades,false);
        });
      }
    });
  });
};


function init() {
  var latlng = new google.maps.LatLng(-40.528611, -64.136344); //Vista Argentina

  //opciones mapa
  var mapOptions = {
    zoom:5,                                    //zoom distance
    center:latlng,                             //where is the center?                                    
    mapTypeId:google.maps.MapTypeId.HYBRID,	   //tipo de mapa
	zoomControl: false,						   //sin zoom buttons
	streetViewControl: false,				   //sin street view
	scrollwheel: false,						   //sin scroll wheel
	draggable: false,						   //sin drag
    keyboardShortcuts:false,                   //keyboard sin controls sobre el mapa
    disableDoubleClickZoom: true               //no double click function por default

  };
  
  map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
  geocoder = new google.maps.Geocoder();
  
  var urlCapitales = 'https://dl.dropboxusercontent.com/s/sy1tb3iwof0634p/capitales.txt';
  var urlCiudades = 'https://dl.dropboxusercontent.com/s/00i60snrt36w7i3/ciudades.txt';

  cargarArregloCiudades(urlCiudades);
  cargar(arrCapitales,urlCapitales);
  agregarmarcadores(arrCapitales,true);//cargar solamente las capitales de las provincias
  
  /*
  ArrayProvincias.forEach(function(provincia){

    //console.log(provincia[0]);
    
      var image = 'img/sunny.png';
      var beachMarker = new google.maps.Marker({
        position: {lat: provincia[1], lng: provincia[2]},
        map: map,
        title: provincia[0],
        icon: image

     
    });
  });*/
  
  //marcadores
  /*
  marker = new google.maps.Marker({
    position: map.getCenter(), //en el centro del google maps
    map: map,
    title: 'Plaza Centro Tandil'
  });

  // cambiar imagenes Markadores
    var image = 'img/sunny.png';
    var beachMarker = new google.maps.Marker({
    position: {lat: -37.328611, lng: -60.136344},
    map: map,
    icon: image
  });
  */

  
  /*
  google.maps.event.addListener(marker, 'click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
  */
  
  

// boton derecho del mouse en cualquier parte del mapa que no sea un marcador, vuelve a mostrar toda la argentina con el zoom alejado
google.maps.event.addListener(map,'rightclick', function(event){map.setZoom(5); map.setCenter(latlng);});
}

google.maps.event.addDomListener(window,'load',init);


//variables viejas
/* 
var marker;
var posi = [];  //array de objetos: guarda la posicion latLong por cada marcador nuevo
var p=0;        //identificador de cada boton con un marcador especifico dentro del array de objetos posi
*/

//funciones en deshuso
/*
function gotolatlng(){
  if (document.getElementById('latitud').value != "" && document.getElementById('longitud').value != ""){
    var lat = parseFloat(document.getElementById('latitud').value);
    var lng = parseFloat(document.getElementById('longitud').value);
    var latlng = {lat: lat, lng: lng};
    map.panTo(latlng);
  }
  else {alert("complete latitud y longitud");}
}

function gociudad(lat,lng){
  var latlng = {lat: lat, lng: lng};
  map.panTo(latlng);
}
function agregarbotonmark(nombre,p){
  document.getElementById('marcadores').innerHTML += '<input style="float=right" onclick="mappan('+p+')" type="button" value="'+nombre+'" />';
}

function mappan(p){map.panTo(posi[p]);}
  
function goto(){
  var address = document.getElementById('goto').value;
  if (address != ""){
    geocoder.geocode ({'address':address},function(results,status){
      if (status == google.maps.GeocoderStatus.OK){map.panTo(results[0].geometry.location);}
      else {alert('Error al procesar direccion: '+ address);}
    });
  }
  else {alert('complete a que calle quiere ir');}
}

function agregarMark(){
  var markname = document.getElementById('markname').value;
  var address = document.getElementById('direc').value;
  if (markname != "" && address != ""){
    geocoder.geocode ({'address':address},function(results,status){
      if (status == google.maps.GeocoderStatus.OK)
          {
            marker = new google.maps.Marker({
                    position:results[0].geometry.location,
                    map:map,
                    title: (String(markname) + '(' + String(address) + ')')
            });
            posi[p]=results[0].geometry.location;
            map.panTo(posi[p]);
            agregarbotonmark(markname,p);
            p++;
          }
      else {alert('Error al procesar direccion: '+ address);}
      });
    map.setCenter(marker.getPosition());
    }
  else {alert('complete todos los campos');}
  
}

*/