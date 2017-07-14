/**
 * Este archivo javascript contiene la aplicación principal. 
 * El punto de ejecución es la función $(window).ready que se ejecuta 
 * automáticamnete una vez que la página html que arga este .js 
 * termina de cargar
 */

var CONST = {
  uriServer  : "http://localhost:8080/Ejemplo/"  
};
/**
 * Esta función se llama en el call-back de getJSON en loadData
 * @param res representa la data leida del servicio. Se asume que 
 * contiene un arreglo con obetos JSON con los atributos userid, 
 * applabel y activitycount
 */


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
var testData=[];
var max = [531,1200,2707,1920];
//topics contiene los nombres de cada tópico del curso
var topics = {
	  "variables":"0", "Comparison":"1", "if_statements":"2", "logical_operators":"3", "loops":"4", 
	  "output_formatting":"5", "Functions":"6", "Lists":"7", "strings":"8", "dictionary":"9",
	  "values_references":"10", "exceptions":"11", "file_handling":"12", "classes_objects":"13"};
var exercise=["quizpet","parsons","webex","animatedex"];
function loadData(){
	var route = "http://146.83.216.206/INFO175_Servicios/GetDataByGroup";
	$.ajax({
		url:route,
		async:false,
		dataType:"json",
		type:"get",
		success:function(data){
			$(data).each(function(index,value){
			for(var i=0;i<4;i++){
				var currentDate=new Date();
				var mes = value.id;
				currentDate.setMonth(parseInt(topics[mes]));
				currentDate.setDate(1 + (2*i) + (8*(parseInt(value.n_group) - 1)));
				if(i==0){
					  var act= parseInt(value.quizpet_act);  
				  }else if(i==1){
					  act= parseInt(value.parsons_act)	;
				  }else if(i==2){
					  act= parseInt(value.webex_act);
				  }else{
					  act= parseInt(value.animatedexamples_act);
				  }
				
				testData.push({
					tipo:"CO",
					date: currentDate,
					colors: i,
					group: parseInt(value.n_group),
					top:mes,
					value: (act*2/max[i])+0.3,
					exer: exercise[i],
					tvalue: act,
					maxa:max[i]
				})
				testData.push({
					tipo:"AE",
					date: currentDate,
					colors: i,
					group: parseInt(value.n_group),
					top:mes,
					value: (act*2/max[2]),
					exer: exercise[i],
					tvalue: act,
					maxa:max[2]
				})
			
			}
		})
	}
	
	});
}


$(window).ready(function() {
   
	loadData(); // llama a la función loadData más arriba
//-------Código de visualización propiamente tal---------
    //Se definen las variables básicas de la espiral
    var width = 600,
    height = 500,
    start = 0,
    end = 2.25,
    numSpirals = 2.5
    margin = {top:1000,bottom:50,left:0,right:50};
  
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

  //Función encargada del procesamiento de fechas 
  //(Sólo influye en la posicion de despliegue de las barras en la espiral)
  var timeScale = d3.scaleTime()
    .domain(d3.extent(testData, function(d){
      return d.date;
    }))
    .range([0, spiralLength]);
  
  // yScale for the bar height
  var maxx = d3.max(testData,function(d){
	  return d.value;
  })
  var yScale = d3.scaleLinear()
    .domain([0,maxx])
    .range([0, (r / numSpirals) - 40]);
  
  //Genera las barras de acuerdo a la data ingresada
  console.log("<283");
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
    	if(d.value>(maxx*0.3)){
    		return yScale(d.value);
    	}else{
    		return yScale((d.value+0.15));
    	}
      
    })
    .style("fill", function(d){return color(d.colors);}) //aquí se el asigna el color
    .style("stroke", "none")
    .attr("transform", function(d){
      return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
    });
  
  // add date labels
  var tF = d3.timeFormat("%b %Y"),
      firstInMonth = {};
  console.log("<325");
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

     $('input[name=op3]').click(function () {
    	   svg.selectAll("rect").style('display', 'none').style('opacity',0).style("stroke", "none");
    	   svg.selectAll("rect").filter(function(f){
    		   return (f.tipo==$('input[name=op3]:checked').val());
    	   })
    	   .style('display','block').style('opacity',1);
 
       });

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
  tooltip.append('tipo')
  .attr('class','tipo')
  //le agrega la función a todas las barras
  svg.selectAll("rect")
  .on('mouseover', function(d) {
	  
	  //Selecciona y muestra en el recuadro la siguiente info.
      tooltip.select('.value').html("Visualizaciones: <b>" + d.tvalue + "<b>/"+d.maxa);
      tooltip.select('.top').html("tópico: <b>"+ d.top + "<b>");
      tooltip.select('.group').html("grupo: <b>"+ d.group + "<b>");
      tooltip.select('.tipo').html("tipo Ex: <b>"+ d.exer +"<b>");
      
      var val2 = $('[name=op3]:checked').val();
      svg.selectAll("rect")/*.filter(function(e){
    		  return e.tipo==val2;
      })*/
      .style("opacity",0.5)
      //estilo del recuadro
      svg.selectAll("rect").filter(function(e) {
    	  var val1 = $('[name=op1]:checked').val();
    	  
    	  if(val1=='PT'){
    		  return (e.colors==d.colors);// && e.tipo==val2);
    	  }
    	  else if(val1=='PG'){
    		  return (e.group==d.group);// && e.tipo==val2);
    	  }
    	  else{
    		 return (e.colors== d.colors && e.group==d.group);// && e.tipo==val2);
    	  }})
      .style("stroke","#000000")
      .style("stroke-width","1px")
      .style("opacity",1);

      tooltip.style('display', 'block');
      tooltip.style('opacity',2);


  var theta = function(r) {
    return -2*Math.PI*r;
  };

  var arc = d3.svg.arc()
    .startAngle(0)
    .endAngle(2*Math.PI);
  var angle = d3.scale.linear()
    .domain([0,num_axes])
    .range([0,360])

  var svg2 = d3.select("#chart").append("svg2")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width/2 + "," + (height/2+8) +")");

  var pieces = d3.range(start, end+0.001, (end-start)/1000);

  var spiral2 = d3.svg2.line.radial()
    .interpolate("cardinal")
    .angle(theta)
    .radius(radius);
      

  })
  //movimiento del recuadro
  .on('mousemove', function(d) {
      tooltip.style('top', '70px')
      .style('left', '420px')
  })
  //Devuelve la estado inicial las barras y retira el cuadro de texto
  .on('mouseout', function(d) {
	  var val2 = $('[name=op3]:checked').val();
      d3.selectAll("rect").filter(function(e){
    	  return (e.tipo==val2);
      })
      .style("fill", function(d){return color(d.colors);})
      .style("stroke", "none")
      .style("opacity",1);
      tooltip.style('display', 'block');
      tooltip.style('opacity',0);

      
  });
      
});
