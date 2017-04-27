//Formato
[
	{ 
		"value":[int,int,int,int], 			//value de cada tipo-ejercicio
											// Su posición determina el tipo-ejercicio y su color
		"group":integer 					//id del grupo 1-3
	    "topico": string[]					//Unidad, Posición eje X
	},
	{ 
		"value":[int,int,int,int], 			//value de cada tipo-ejercicio
											// Su posición determina el tipo-ejercicio y su color
		"group":integer 					//id del grupo 1-3
	    "topico": string[]					//Unidad, Posición eje X
	}
]


//Ejemplo
[
	{ 
		value:[0.6,0.75,10,8],
		group:1,
	    topico: "if-while"
	},
	{ 
		value:[0.42,0.55,6,15],
		group:2,
	    topico: "if-while"
	},
	{ 
		value:[0.26,0.90,17,6],
		group:3,
	    topico: "if-while"
	},
	{ 
		value:[0.7,0.24,6,18],
		group:1,
	    topico: "boolean"
	},
	{ 
		value:[0.85,0.7,10,5],
		group:2,
	    topico: "boolean"
	}
]