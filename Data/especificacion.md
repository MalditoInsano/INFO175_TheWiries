//Formato

[

	{ 
		"value":int, 			            //value del ejercicio
		"color":int,						//determina el color de la barra y por ende, el tipo de ejercicio 0-3
		"group":integer, 					//id del grupo 1-3
		"data": date,				     	//Fecha correspondiente a la posicion en Eje X
	    "topico": string[]					//Unidad (tópico) del curso
	},
	{ 
		"value":int, 			            //value de cada tipo-ejercicio
		"color":int,						//determina el color de la barra y por ende, el tipo de ejercicio 0-3
		"group":integer, 					//id del grupo 1-3
		"data": date,				     	//Fecha correspondiente a la posicion en Eje X
	    "topico": string[]					//Unidad (tópico) del curso
	}
]


//Ejemplo

[

	{ 
		value:0.7,
		color:1,
		group:1,
	    topico: "if-while"
	},
	{ 
		value:0.54,
		color:2,
		group:1,
	    topico: "if-while"
	},{ 
		value:0.89,
		color:3,
		group:1,
	    topico: "if-while"
	},{ 
		value:0.72,
		color:4,
		group:1,
	    topico: "if-while"
	},{ 
		value:0.17,
		color:1,
		group:2,
	    topico: "if-while"
	},{ 
		value:0.23,
		color:2,
		group:2,
	    topico: "if-while"
	},
]
