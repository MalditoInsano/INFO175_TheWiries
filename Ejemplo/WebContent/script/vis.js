/**
 * Este archivo javascript contiene la aplicación principal. 
 * El punto de ejecución es la función $(window).ready que se ejecuta 
 * automáticamnete una vez que la página html que arga este .js 
 * termina de cargar
 */

var CONST = {
  uriServer  : "http://localhost:8080/Ejemplo/"  
};

var data = null;

/**
 * Esta función se llama en el call-back de getJSON en loadData
 * @param res representa la data leida del servicio. Se asume que 
 * contiene un arreglo con obetos JSON con los atributos userid, 
 * applabel y activitycount
 */
function displayData(res){
    data = res;
    // para poner la información leida en la página web (index.html)
    // accedemos al elemento con id working_area y le agregamos
    // un elemento html de tipo table, que tiene a su vez el id
    // "data_table".
    $( "#working_area" ).append("<table id=\"data_table\">");
    
    // secuencialmente agregamos filas (<tr>) y celdas (<td>) a la
    // tabla "data_table".  
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        $( "#data_table" ).append( "<tr><td>" + row.userid + "</td>" + "<td>" + row.applabel + "</td>" + "<td>" + row.activitycount + "</td></tr>\n");
    }
    
    $( "#working_area" ).append("</table>");
}

/**
 * Esta función usa la función getJSON de jquery para hacer una llamada
 * a una dirección Web que devuelve un json. Aca llamamos al servicio 
 * GetSampleData implementado en Java y corriendo en el servidor tomcat.
 * getJSON es de jquery, y se reconoce porque se invoca desde el objeto $
 * El segundo parámetro de getJSON es un afunción de "call-back".Como 
 * la llamada AJAX producida por getJSON es asíncrona, la ejecución de getJSON 
 * no espera por la respuesta, sinó que pasa la "data" leida del servicio a una 
 * siguiente función. Esta es la forma como javascript secuencia llamadas 
 * asíncronas (leer un poco de AJAX sería bastante bueno!). 
 */
function loadData(){
	var url = CONST.uriServer + "GetSampleData";
    
    $.getJSON( url , function(data){
        displayData(data);
    });
}


$(window).ready(function() {
    loadData(); // llama a la función loadData más arriba
//-------Código de visualización propiamente tal---------
    //Se definen las variables básicas de la espiral
    var width = 500,
    height = 500,
    start = 0,
    end = 2.25,
    numSpirals = 2.5
    margin = {top:1000,bottom:50,left:50,right:50};
  
  var theta = function(r) {
    return numSpirals * Math.PI * r;
  };

  /* asigna el color a las barras de acuerdo al "tipo" de ejercicio 
    de ese tópico*/
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  //Radio de la espiral de acuerdo a los parámetros anteriores
  var r = d3.min([width, height]) / 2 - 20;

  var radius = d3.scaleLinear()
    .domain([start, end])
    .range([20, r]);

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var points = d3.range(start, end + 0.001, (end - start) / 1000);

  var spiral = d3.radialLine()
    .curve(d3.curveCardinal)
    .angle(theta)
    .radius(radius);
  //Genera la espiral a mostrar con el estilo especificado
  var path = svg.append("path")
    .datum(points)
    .attr("id", "spiral")
    .attr("d", spiral)
    .style("fill", "none") //le quita el relleno a la figura
    .style("stroke", "steelblue"); //color de línea
  
  //Delimita los límites de la espiral, a partir de la cantidad
  //de info a mostrar (N)
  var spiralLength = path.node().getTotalLength(),
      N = 168,
      barWidth = (spiralLength / N) - 1;
  //TestData es donde se almacena la información a desplegar
  var testData = [];
  //cars contiene los nombres de cada tópico del curso
  var cars = ["variables", "compilation", "ifs", "logicalOp", "loops", 
	  "out format", "functions", "lists", "String", "dictionary",
	  "RefValues", "Exception", "fileHandling", "class"];
  
  // Ciclo iterativo encargado de generar la información de prueba
  // a desplegar en la visualización
  // Esta se modificara una vez tengamos los servicios funcionando
  for (var i = 0; i < N/12; i++) {//topico
	  for(var j=0; j<3; j++){//grupos
		  for(var k=0;k<4;k++){//tipoEx
			var currentDate = new Date();
			currentDate.setMonth(i);
			currentDate.setDate(1+(8*j)+(2*k));
		  	testData.push({
		  		date: currentDate,
		  		value: Math.random()+0.3,
		  		colors: k,
		  		group:j+1,
		  		top: cars[i]
		  	});
		  }
  	  }
  }
  //Función encargada del procesamiento de fechas 
  //(Sólo influye en la posicion de despliegue de las barras en la espiral)
  var timeScale = d3.scaleTime()
    .domain(d3.extent(testData, function(d){
      return d.date;
    }))
    .range([0, spiralLength]);
  
  // yScale for the bar height
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(testData, function(d){
      return d.value;
    })])
    .range([0, (r / numSpirals) - 40]);
  
  //Genera las barras de acuerdo a la data ingresada
  svg.selectAll("rect")
    .data(testData)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
      
      var linePer = timeScale(d.date),
          posOnLine = path.node().getPointAtLength(linePer),
          angleOnLine = path.node().getPointAtLength(linePer - barWidth);
    
      d.linePer = linePer; // % distance are on the spiral
      d.x = posOnLine.x; // x postion on the spiral
      d.y = posOnLine.y; // y position on the spiral
      
      d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

      return d.x;
    })
    .attr("y", function(d){
      return d.y;
    })
    .attr("width", function(d){
      return barWidth;
    })
    .attr("height", function(d){
      return yScale(d.value);
    })
    .style("fill", function(d){return color(d.colors);}) //aquí se el asigna el color
    .style("stroke", "none")
    .attr("transform", function(d){
      return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
    });
  
  // add date labels
  var tF = d3.timeFormat("%b %Y"),
      firstInMonth = {};

  svg.selectAll("text")
    .data(testData)
    .enter()
    .append("text")
    .attr("dy", 10)
    .style("text-anchor", "start")
    .style("font", "15px arial")
    .append("textPath")
    // only add for the first of each month
    .filter(function(d){
      var sd = tF(d.date);
      if (!firstInMonth[sd]){
        firstInMonth[sd] = 1;
        return true;
      }
      return false;
    })
    .text(function(d){
      return d.top;
    })
    // place text along spiral
    .attr("xlink:href", "#spiral")
    .style("fill", "blue")
    .attr("startOffset", function(d){
      return ((d.linePer / spiralLength) * 100) + "%";
    })

  //Codigo encargado de la interacción del usuario con las barras
  var tooltip = d3.select("#chart")
  .append('div')
  .attr('class', 'tooltip');
  //define los atributos a mostrar
  tooltip.append('div')
  .attr('class', 'date');
  tooltip.append('div')
  .attr('class', 'value');
  tooltip.append('div')
  .attr('class', 'top')
  tooltip.append('div')
  .attr('class', 'group')
  //le agrega la función a todas las barras
  svg.selectAll("rect")
  .on('mouseover', function(d) {
	  //Selecciona y muestra en el recuadro la siguiente info.
      tooltip.select('.value').html("Value: <b>" + Math.round(d.value*100)/100 + "<b>");
      tooltip.select('.top').html("tópico: <b>"+ d.top + "<b>");
      tooltip.select('.group').html("grupo: <b>"+ d.group + "<b>");
      //estilo del recuadro
      d3.select(this)
      .style("fill","#FFFFFF")
      .style("stroke","#000000")
      .style("stroke-width","2px");

      tooltip.style('display', 'block');
      tooltip.style('opacity',2);

  })
  //movimiento del recuadro
  .on('mousemove', function(d) {
      tooltip.style('bottom', '10px')
      .style('left', '250px')
      .style('top','600px');
  })
  //Devuelve la estado inicial las barras y retira el cuadro de texto
  .on('mouseout', function(d) {
      d3.selectAll("rect")
      .style("fill", function(d){return color(d.colors);})
      .style("stroke", "none")

      tooltip.style('display', 'block');
      tooltip.style('opacity',2);
  });
      
});
