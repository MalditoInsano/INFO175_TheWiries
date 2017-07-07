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
var exercise=["quizpet","parsons","webex","animatedex"]
function loadData(){
	var url = CONST.uriServer + "GetDataByGroup";
    
    $.getJSON( url , function(gData){
    	for(var i=0;i<3;i++){
    		  for(var j=0;j<14;j++){
    			  for(var k=0;k<4;k++){
    				  var currentDate=new Date();
    				  var mes = gData[(14*i)+j].id;
    				  currentDate.setMonth(parseInt(topics[mes]));
    				  currentDate.setDate(1+(8*i)+(2*k));
    				  if(k==0){
    					  var act= parseInt(gData[(14*i)+j].quizpet_act);  
    				  }else if(k==1){
    					  act= parseInt(gData[(14*i)+j].parsons_act)	;
    				  }else if(k==2){
    					  act= parseInt(gData[(14*i)+j].webex_act);
    				  }else{
    					  act= parseInt(gData[(14*i)+j].animatedexamples_act);
    				  }
    				  testData.push({
    					  tipo:"CO",
    					  date: currentDate,
    					  colors: k,
    					  group: parseInt(gData[(14*i)+j].n_group),
    					  top: mes,
    					  value: (act*2/max[k])+0.3,
    					  exer: exercise[k],
    				  	  tvalue: act,
    				  	  maxa:max[k]
    					  });
    				  testData.push({
    					  tipo:"AE",
    					  date: currentDate,
    					  colors: k,
    					  group: parseInt(gData[(14*i)+j].n_group),
    					  top: mes,
    					  value: (act*2)/max[2],
    					  exer: exercise[k],
    				  	  tvalue: act,
    				  	  maxa: max[2]
    					  });
    			  }
    		  }
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

  
  //TestData es donde se almacena la información a desplegar
  var gData = [
	  	{"n_group":"1", "id":"classes_objects", "activity":"812", "quizpet_act":"125", "quizpet_act_succ":"69", "parsons_act":"77", "parsons_act_succ":"28", "webex_act":"125", "animatedexamples_act":"485"},
	    {"n_group":"1", "id":"Comparison", "activity":"1044", "quizpet_act":"158", "quizpet_act_succ":"89", "parsons_act":"255", "parsons_act_succ":"177", "webex_act":"232", "animatedexamples_act":"399"},
	    {"n_group":"1", "id":"dictionary", "activity":"850", "quizpet_act":"84", "quizpet_act_succ":"58", "parsons_act":"111", "parsons_act_succ":"78", "webex_act":"105", "animatedexamples_act":"550"},
	    {"n_group":"1", "id":"exceptions", "activity":"793", "quizpet_act":"62", "quizpet_act_succ":"37", "parsons_act":"489", "parsons_act_succ":"23", "webex_act":"136", "animatedexamples_act":"106"},
	    {"n_group":"1", "id":"file_handling", "activity":"684", "quizpet_act":"0", "quizpet_act_succ":"0", "parsons_act":"169", "parsons_act_succ":"21", "webex_act":"96", "animatedexamples_act":"419"},
	    {"n_group":"1", "id":"Functions", "activity":"1211", "quizpet_act":"107", "quizpet_act_succ":"66", "parsons_act":"355", "parsons_act_succ":"193", "webex_act":"241", "animatedexamples_act":"508"},
	    {"n_group":"1", "id":"if_statements", "activity":"3279", "quizpet_act":"205", "quizpet_act_succ":"176", "parsons_act":"370", "parsons_act_succ":"107", "webex_act":"1204", "animatedexamples_act":"1500"},
	    {"n_group":"1", "id":"Lists", "activity":"1106", "quizpet_act":"328", "quizpet_act_succ":"159", "parsons_act":"72", "parsons_act_succ":"57", "webex_act":"143", "animatedexamples_act":"563"},
	    {"n_group":"1", "id":"logical_operators", "activity":"805", "quizpet_act":"135", "quizpet_act_succ":"74", "parsons_act":"123", "parsons_act_succ":"52", "webex_act":"262", "animatedexamples_act":"285"},
	    {"n_group":"1", "id":"loops", "activity":"1487", "quizpet_act":"371", "quizpet_act_succ":"210", "parsons_act":"210", "parsons_act_succ":"150", "webex_act":"219", "animatedexamples_act":"687"},
	    {"n_group":"1", "id":"output_formatting", "activity":"695", "quizpet_act":"515", "quizpet_act_succ":"193", "parsons_act":"0", "parsons_act_succ":"0", "webex_act":"52", "animatedexamples_act":"128"},
	    {"n_group":"1", "id":"strings", "activity":"350", "quizpet_act":"156", "quizpet_act_succ":"51", "parsons_act":"53", "parsons_act_succ":"42", "webex_act":"68", "animatedexamples_act":"73"},
	    {"n_group":"1", "id":"values_references", "activity":"552", "quizpet_act":"150", "quizpet_act_succ":"78", "parsons_act":"16", "parsons_act_succ":"15", "webex_act":"149", "animatedexamples_act":"237"},  
	    {"n_group":"1", "id":"variables", "activity":"4231", "quizpet_act":"440", "quizpet_act_succ":"310", "parsons_act":"840", "parsons_act_succ":"279", "webex_act":"1654", "animatedexamples_act":"1297"},
	    {"n_group":"2", "id":"classes_objects", "activity":"1678", "quizpet_act":"261", "quizpet_act_succ":"129", "parsons_act":"103", "parsons_act_succ":"44", "webex_act":"380", "animatedexamples_act":"934"},
	    {"n_group":"2", "id":"Comparison", "activity":"1255", "quizpet_act":"195", "quizpet_act_succ":"104", "parsons_act":"253", "parsons_act_succ":"195", "webex_act":"317", "animatedexamples_act":"490"},
	    {"n_group":"2", "id":"dictionary", "activity":"1179", "quizpet_act":"77", "quizpet_act_succ":"53", "parsons_act":"117", "parsons_act_succ":"85", "webex_act":"145", "animatedexamples_act":"840"},
	    {"n_group":"2", "id":"exceptions", "activity":"972", "quizpet_act":"77", "quizpet_act_succ":"53", "parsons_act":"521", "parsons_act_succ":"24", "webex_act":"220", "animatedexamples_act":"154"},
	    {"n_group":"2", "id":"file_handling", "activity":"1155", "quizpet_act":"0", "quizpet_act_succ":"0", "parsons_act":"164", "parsons_act_succ":"24", "webex_act":"154", "animatedexamples_act":"837"},
	    {"n_group":"2", "id":"Functions", "activity":"1565", "quizpet_act":"145", "quizpet_act_succ":"89", "parsons_act":"413", "parsons_act_succ":"235", "webex_act":"294", "animatedexamples_act":"713"},
	    {"n_group":"2", "id":"if_statements", "activity":"3797", "quizpet_act":"225", "quizpet_act_succ":"191", "parsons_act":"429", "parsons_act_succ":"117", "webex_act":"1273", "animatedexamples_act":"1870"},
	    {"n_group":"2", "id":"Lists", "activity":"1703", "quizpet_act":"300", "quizpet_act_succ":"165", "parsons_act":"98", "parsons_act_succ":"58", "webex_act":"246", "animatedexamples_act":"1059"},
	    {"n_group":"2", "id":"logical_operators", "activity":"1107", "quizpet_act":"145", "quizpet_act_succ":"75", "parsons_act":"120", "parsons_act_succ":"54", "webex_act":"396", "animatedexamples_act":"446"},
	    {"n_group":"2", "id":"loops", "activity":"1869", "quizpet_act":"355", "quizpet_act_succ":"202", "parsons_act":"239", "parsons_act_succ":"159", "webex_act":"299", "animatedexamples_act":"976"},
	    {"n_group":"2", "id":"output_formatting", "activity":"781", "quizpet_act":"500", "quizpet_act_succ":"193", "parsons_act":"0", "parsons_act_succ":"0", "webex_act":"86", "animatedexamples_act":"195"},
	    {"n_group":"2", "id":"strings", "activity":"450", "quizpet_act":"165", "quizpet_act_succ":"67", "parsons_act":"83", "parsons_act_succ":"62", "webex_act":"70", "animatedexamples_act":"132"},
	    {"n_group":"2", "id":"values_references", "activity":"808", "quizpet_act":"194", "quizpet_act_succ":"94", "parsons_act":"27", "parsons_act_succ":"24", "webex_act":"256", "animatedexamples_act":"331"},
	    {"n_group":"2", "id":"variables", "activity":"5687", "quizpet_act":"510", "quizpet_act_succ":"338", "parsons_act":"1049", "parsons_act_succ":"309", "webex_act":"2432", "animatedexamples_act":"1696"},
	    {"n_group":"3", "id":"classes_objects", "activity":"662", "quizpet_act":"96", "quizpet_act_succ":"61", "parsons_act":"82", "parsons_act_succ":"19", "webex_act":"147", "animatedexamples_act":"337"},
	    {"n_group":"3", "id":"Comparison", "activity":"1322", "quizpet_act":"217", "quizpet_act_succ":"113", "parsons_act":"296", "parsons_act_succ":"201", "webex_act":"342", "animatedexamples_act":"467"},
	    {"n_group":"3", "id":"dictionary", "activity":"614", "quizpet_act":"57", "quizpet_act_succ":"41", "parsons_act":"88", "parsons_act_succ":"65", "webex_act":"78", "animatedexamples_act":"391"},
	    {"n_group":"3", "id":"exceptions", "activity":"421", "quizpet_act":"70", "quizpet_act_succ":"37", "parsons_act":"191", "parsons_act_succ":"14", "webex_act":"90", "animatedexamples_act":"70"},
	    {"n_group":"3", "id":"file_handling", "activity":"428", "quizpet_act":"0", "quizpet_act_succ":"0", "parsons_act":"66", "parsons_act_succ":"12", "webex_act":"61", "animatedexamples_act":"301"},
	    {"n_group":"3", "id":"Functions", "activity":"1076", "quizpet_act":"97", "quizpet_act_succ":"69", "parsons_act":"266", "parsons_act_succ":"152", "webex_act":"245", "animatedexamples_act":"468"},
	    {"n_group":"3", "id":"if_statements", "activity":"4257", "quizpet_act":"238", "quizpet_act_succ":"213", "parsons_act":"475", "parsons_act_succ":"125", "webex_act":"1624", "animatedexamples_act":"1920"},
	    {"n_group":"3", "id":"Lists", "activity":"816", "quizpet_act":"234", "quizpet_act_succ":"127", "parsons_act":"68", "parsons_act_succ":"54", "webex_act":"123", "animatedexamples_act":"391"},
	    {"n_group":"3", "id":"logical_operators", "activity":"1002", "quizpet_act":"154", "quizpet_act_succ":"79", "parsons_act":"150", "parsons_act_succ":"56", "webex_act":"326", "animatedexamples_act":"372"},
	    {"n_group":"3", "id":"loops", "activity":"1817", "quizpet_act":"428", "quizpet_act_succ":"243", "parsons_act":"251", "parsons_act_succ":"168", "webex_act":"275", "animatedexamples_act":"863"},
	    {"n_group":"3", "id":"output_formatting", "activity":"632", "quizpet_act":"433", "quizpet_act_succ":"176", "parsons_act":"0", "parsons_act_succ":"0", "webex_act":"56", "animatedexamples_act":"143"},
	    {"n_group":"3", "id":"strings", "activity":"300", "quizpet_act":"123", "quizpet_act_succ":"47", "parsons_act":"53", "parsons_act_succ":"36", "webex_act":"58", "animatedexamples_act":"66"},
	    {"n_group":"3", "id":"values_references", "activity":"370", "quizpet_act":"112", "quizpet_act_succ":"55", "parsons_act":"20", "parsons_act_succ":"14", "webex_act":"85", "animatedexamples_act":"153"},
	    {"n_group":"3", "id":"variables", "activity":"6055", "quizpet_act":"531", "quizpet_act_succ":"373", "parsons_act":"1200", "parsons_act_succ":"341", "webex_act":"2707", "animatedexamples_act":"1617"}
	]
  
  
  // Ciclo iterativo encargado que procesa la información del json
  // a desplegar en la visualización
  	for(var i=0;i<3;i++){
	  for(var j=0;j<14;j++){
		  for(var k=0;k<4;k++){
			  var currentDate=new Date();
			  var mes = gData[(14*i)+j].id;
			  currentDate.setMonth(parseInt(topics[mes]));
			  currentDate.setDate(1+(8*i)+(2*k));
			  if(k==0){
				  var act= parseInt(gData[(14*i)+j].quizpet_act);  
			  }else if(k==1){
				  act= parseInt(gData[(14*i)+j].parsons_act)	;
			  }else if(k==2){
				  act= parseInt(gData[(14*i)+j].webex_act);
			  }else{
				  act= parseInt(gData[(14*i)+j].animatedexamples_act);
			  }
			  testData.push({
				  tipo:"CO",
				  date: currentDate,
				  colors: k,
				  group: parseInt(gData[(14*i)+j].n_group),
				  top: mes,
				  value: (act*2/max[k])+0.3,
				  exer: exercise[k],
			  	  tvalue: act,
			  	  maxa:max[k]
				  });
			  testData.push({
				  tipo:"AE",
				  date: currentDate,
				  colors: k,
				  group: parseInt(gData[(14*i)+j].n_group),
				  top: mes,
				  value: (act*2)/max[2],
				  exer: exercise[k],
			  	  tvalue: act,
			  	  maxa: max[2]
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
  var maxx = d3.max(testData,function(d){
	  return d.value;
  })
  var yScale = d3.scaleLinear()
    .domain([0,maxx])
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
