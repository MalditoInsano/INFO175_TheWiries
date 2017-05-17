# Servicios
## GetDataByGroup

### Descripción
El servicio resume la información de actividades de los distintos tipos por grupos, entregandonos solo aquello que nos sirve.

### Salida

```javascript
[
	Group,
	...
]

//Group object
{ 	
	"groupnum": "1"							//Número del grupo.
	"q_att": "10" 							//Cantidad de Quizjet intentados por topico.
	"q_att_succ": "6"						//Quizjet exitosos por topico.
	"p_att": "16",				    			//Intentos en Parsons por topico.
	"p_att_succ": "16"						//Parsons exitosos por topico.
	"dist_e": "3"							//Examples completados por topico.
	"e_lines": "12"							//Lineas de Examples vistas.
	"dist_ae": "5"							//Animated Examples completados.
	"ae_lines": "21"						//Lineas de Animated Examples vistas.
	"q_time": "200"							//Tiempo promedio de Quizjet.
	"p_time": "301"							//Tiempo promedio de Parsons.
	"e_time": "400"							//Tiempo promedio de Examples.
	"ae_time": "362"						//Tiempo promedio de Animated Examples.
}
```

### Consulta SQL
```SQL
select A.`user`, S.treatments_16 as vis,  			//¡user cambiar por group?
	sum(if(A.appid=41,1,0)) as q_att, 
	sum(if(A.appid=41 AND A.result=1,1,0)) as q_att_succ, 
	sum(if(A.appid=38,1,0)) as p_att, 
	sum(if(A.appid=38 AND result=1,1,0)) as p_att_succ, 
	count(distinct(if(A.appid=3,A.parentname,0)))-1 as dist_e, 
	sum(if(A.appid=3,1,0)) as e_lines, 
	count(distinct(if(A.appid=35,A.parentname,0)))-1 as dist_ae, 
	sum(if(A.appid=35,1,0)) as ae_lines,
	sum(if(A.appid=41,A.durationseconds,0)) as q_time, 
	sum(if(A.appid=38,A.durationseconds,0)) as p_time, 
	sum(if(A.appid=3,A.durationseconds,0)) as e_time, 
	sum(if(A.appid=35,A.durationseconds,0)) as ae_time 
from activity_traces A, student_info S 
	where A.`user` = S.`userid` and A.durationseconds > 0 and A.appid > -1 
	group by S.treatments_16
```

