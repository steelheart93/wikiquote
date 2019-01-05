/**
 * Script de la página oficial de Wikiquote, adaptado y corregido.
 * @author Stiven Muñoz Murillo
 * @version 2.0
 */

function enlace() {
  window.location = document.getElementById("imagen").src;
}

function pon_frase_en_span(data) {
  console.log(data);
  var texto = data['parse']['text']['*'];

  // Esto hace que los hipervinculos (que no utilizo) funcionen.
  texto = texto.replace(/\/wiki\//g, "https://es.wikiquote.org/wiki/");

  // Filtro las claves de las imagenes.
  var matches = texto.match(/thumb\/\w\/\w\w\//g);

  // Busco la ruta de la primera imagen.
  var regularExpression = /thumb/g;
  var ruta = matches[0].replace(regularExpression, "https://upload.wikimedia.org/wikipedia/commons");
  ruta += data['parse']['images']['0'];

  // Agrego la ruta de la imagen al documento.
  document.getElementById("imagen").src = ruta;

  // Para terminar, lo agrego al documento.
  texto = filtrar(texto);
  document.getElementById("contenido").innerHTML = texto;
};

function dame_frase_wikiquote() {
  var now = new Date()
  var month = now.getMonth() + 1;
  var date = now.getDate();

  month = agregarCero(month);
  date = agregarCero(date);

  var titulo = "{{" + month + date + "}}";
  // titulo = "{{0106}}";

  if (navigator.onLine) {
    var url = 'https://es.wikiquote.org/w/api.php?action=parse&text=';
    url += titulo + '&format=json&callback=pon_frase_en_span';

    var elem = document.createElement('script');
    elem.setAttribute('src', url);
    elem.setAttribute('type', 'text/javascript');
    var head = document.getElementsByTagName('head');
    head[0].appendChild(elem);
  } else {
    var write = "<div style='text-align: center; margin-top: 10%;'>";
    write += "<p style='font-size: 1.3em; font-weight: bold;'>Error, (navigator.onLine == false):</p>";
    write += "<p style='font-size: 1.3em;'>Compruebe su conexión a Internet.</p>";
    document.write(write + "</div>");
  }
};

/**
 * Función hecha completamente por mi que sirve para eliminar toda la basura que me retorna la API
 * @param frase, es la frase que voy a filtra & c es la frase ya filtrada
 */
function filtrar(frase) {
  // Detecto el inicio de cada parrafo y señalo con mayor qué.
  var regExp = /<td|<br/g;
  frase = frase.replace(regExp, "> <");
  // Elimino todas las etiquetas.
  var regExp1 = /<[^>]*>/g;
  frase = frase.replace(regExp1, "");
  // Hago un Trim.
  var regExp2 = /\s+/g;
  frase = frase.replace(regExp2, " ");
  // Elimino los espacios sobrantes
  var cadenas = frase.split(">");

  // ES5 version
  function removeAll(array, element) {
    for (var i = array.length; i >= 0; i--) {
      if (array[i] === element) {
        array.splice(i, 1);
      }
    }
  }
  removeAll(cadenas, " ");

  // Ordeno todo.
  var c = cadenas[0];

  cantidad = cadenas.length;
  for (let i = 1; i < cantidad - 2; i++) {
    c += "<br>" + cadenas[i];
  }

  var autor = cadenas[cantidad - 2];
  var datos = cadenas[cantidad - 1];

  c = "<p id='cadena'><span>Frase del día: </span>\"" + c.trim() + "\".</p>";
  c += "<p id='autor'><span>Acerca del Autor: </span>" + autor + ";</p>";
  c += "<p id='datos'>" + datos + "</p>";

  return c;
}

function agregarCero(num) {
  var retorno = "0";
  (num < 10) ? retorno += num : retorno = num;

  return retorno;
}
