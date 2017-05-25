# Servicios
## GetDataByGroup

### Descripción
El servicio resume la información de actividades de los distintos tipos por grupos, entregandonos solo aquello que nos sirve.

### Salida

```javascript
[
	Topico
	...
]

//Topico object
{
	"id": ""
	"grupo": [Grupo]
}

[
	Grupo
	...
]
//Grupo object
{
	"quizpet_act": ""
	"quizpet_act_succ": ""
	/**
	*Cantidad de quizpet intentados y exitosos respectivamente.
	*/
	"parsons_act": ""
	"parsons_act_succ": ""
	/**
	*Número de actividades parsons intentados y exitosos respectivamente.
	*/
	"webex_act": ""
	"animatedexamples_act": ""
	/**
	*Cantidad de Web examples y Animated Examples vistos por completo.
	*/
}
```

### Consulta SQL

```Sql
select S.treatments_16, A.topicname as id, count(*) as activity, count(distinct(A.`user`)) as `users`,
	sum(if(A.appid=41,1,0)) as quizpet_act, 
	sum(if(A.appid=41 and  A.result=1,1,0)) as quizpet_act_correct,
	sum(if(A.appid=38,1,0)) as parsons_act, 
	sum(if(A.appid=38 and A.result=1,1,0)) as parsons_act_succ,
	sum(if(appid=3,1,0)) as webex_act,
	sum(if(appid=35,1,0)) as animatedexamples_act
	/**
	* Separamos cada actividad por grupo y topico, agrupando los quizpet,parson,examples,
	*animated examples en distintas variables.
	*/
from activity_traces A, student_info S 
	where A.appid > -1 and S.userid = A.`user` 
	group by S.treatments_16, A.topicname
	order by S.treatments_16, A.topicorder
	/**
	* Quitamos la informacion que no nos era necesaria(movimientos en interfaz por ejemplo), y entrega
	*ordenado por grupo y orden de topico(Quizpet, parsons, webex, animated example).
	*/
```
