// JavaScript Document
function diasLetivos(){
	
	var anoLetivo = new Date();
	anoLetivo = anoLetivo.getFullYear();		
	var countUteis = 0;
	
	var dataInicial = anoLetivo + "-01-01";
	var dataFinal =  anoLetivo + "-12-31";
	var ano;
	var feriadosDoAno = new Array();
	var cont = 0;
	
	
	var dataCalendario = getData("Calendario/feriados/"+anoLetivo, null);
	
	//console.log(dataCalendario);
	
	$.ajax({
		url: path+"Calendario/feriados/"+anoLetivo,
		type: "GET",
		crossDomain: true,
		dataType: 'json',
		async:false,
		success: function(dataCalendario){
			for(var i=0;i<dataCalendario.length;i++) {				
				var data="";		
				if((dataCalendario[i].dataInicio != null)&&(dataCalendario[i].dataFim != null)){		
					var dias = diasDecorridos(dataCalendario[i].dataInicio, dataCalendario[i].dataFim);			
					var diaIn = dataCalendario[i].dataInicio;			
					diaIn = diaIn.split("-");
							
					var dataInicial =(diaIn[0]+"-"+diaIn[1]+"-"+diaIn[2]);
					for(var j=0;j<=dias;j++){				
						if(dataCalendario[i].dataInicio == dataInicial){					
							data = dataCalendario[i].dataInicio;
							data = data.split("-");
							data = data[2]+"-"+data[1]+"-"+data[0];
							feriadosDoAno[cont] = data;
							dataInicial = diaIn[0]+"-"+diaIn[1]+"-"+(((parseInt(diaIn[2])+1).toString().length< 2) ? "0"+(parseInt(diaIn[2])+1) : (parseInt(diaIn[2])+1));
							cont++;
						}else{
							feriadosDoAno[cont] = (((parseInt(diaIn[2])+j).toString().length< 2) ? "0"+(parseInt(diaIn[2])+j) : (parseInt(diaIn[2])+j))+"-"+diaIn[1]+"-"+diaIn[0];
							cont++;
						}													
					}							
				}else if((dataCalendario[i].dataInicio != null)&&(dataCalendario[i].dataFim == null)){
					if(dataCalendario[i].dataInicio != null){
						data = dataCalendario[i].dataInicio;
						data = data.split("-");
						data = data[2]+"-"+data[1]+"-"+data[0];
						feriadosDoAno[cont] = data;
						cont++;
					}
				}			
			}
			
			dataInicial = Date.parse(dataInicial);
			dataFinal = Date.parse(dataFinal)-1;
				
			while (dataInicial <= dataFinal) {
				myDate = new Date(dataInicial);
				myDate.setDate(myDate.getDate()+1);	
				
				dataInicial = myDate;
				
				dia = dataInicial.getDay();	
				
				var diaAno = myDate.toLocaleDateString();	
			
				if(dia!="0" && dia != "6"){
					
					countUteis++;	
							
					$.each(feriadosDoAno, function( key, value ) {	
						var feriado = value.split('-');			
						feriado = parseInt(feriado[0])+"/"+parseInt(feriado[1])+"/"+feriado[2];	
						diaAno  = diaAno.split("/");
						diaAno = parseInt(diaAno[0])+"/"+parseInt(diaAno[1])+"/"+diaAno[2];				
						if(feriado == diaAno){
							countUteis--;
						}				
					})			
				}				
			}
			return countUteis;		
		}
	});	
}

function diasDecorridos(dt1, dt2){
    // variáveis auxiliares
    var minuto = 60000; 
    var dia = minuto * 60 * 24;
    var horarioVerao = 0;
    
	var dt1 = new Date(dt1);
	var dt2 = new Date(dt2);
	
    // ajusta o horario de cada objeto Date
    dt1.setHours(0);
    dt1.setMinutes(0);
    dt1.setSeconds(0);
    dt2.setHours(0);
    dt2.setMinutes(0);
    dt2.setSeconds(0);
    
    // determina o fuso horário de cada objeto Date
    var fh1 = dt1.getTimezoneOffset();
    var fh2 = dt2.getTimezoneOffset(); 
    
    // retira a diferença do horário de verão
    if(dt2 > dt1){
      horarioVerao = (fh2 - fh1) * minuto;
    } 
    else{
      horarioVerao = (fh1 - fh2) * minuto;    
    }
    
    var dif = Math.abs(dt2.getTime() - dt1.getTime()) - horarioVerao;
    return Math.ceil(dif / dia);
}