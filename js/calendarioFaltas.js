// JavaScript Document
/*Funcao js que chama o plugin datepicher para montar o calendario*/
$(document).ready(function() 
{	
	var calendarioP = new Array();
	var chamadaP = new Array();

	chamadaP = chamadaPresente();
	//console.log(chamadaP);
	
	$.each(chamadaP, function(n, val){
		calendarioP.push({
			'data' : val.data,
			'presenca': val.presenca
		});								
    });
	
	$("#calendario_relatorio").datepicker({
		showOtherMonths:true,
		dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
					 'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'],
		dateFormat: 'yy-mm-dd',
		inline: true,
		beforeShowDay: function (date){
			var mm = date.getMonth() + 1, 
				dd = date.getDate(),	
				yy = date.getFullYear();
			var dt = yy + "-" + mm + "-" + dd;
			var verif = 0;		
			var presFalta;						
			$.each(calendarioP, function(n, val){				
				var myDate = new Date(val.data);
				mmC = myDate.getMonth() + 1, 
				ddC = myDate.getDate(),	
				yyC = myDate.getFullYear();	
				//console.log(mmC,ddC,yyC);
						
				if(val.data!=null){				
					if ((dd == ddC) && (mm == mmC)){											
						verif = 1;
						presFalta = val.presenca;
						return false;					
					}
				}
			});	



			if(verif == 1){	
				if(presFalta == 1){
					return [true, "presenca"];
				}else{
					return [true, "falta"];
				}					
			}else{
				return [true, "my_class"];
			}			
			
			return [false, ""];
		},
		
		onSelect: function(date){
			
			$.each(calendario, function(n, val){
				if (date == val.dataInicio){							
					$("#presenca").hide();
					$('#Evento').show();	
					$("#Evento #Titulo").html(val.evento);						
					$('#Evento #EventDesc').html(val.descricao);
					if(val.imagem){
						$('#Foto_evento').show();
						$('#Evento').css({'top':'-479px','height':'387px'});
						$('#Evento_Info').css('padding','15px 25px');
						$('#Foto_evento').html("<img src='"+val.imagem+"' width='100%'/>");
					}else{
						$('#Foto_evento').hide();
						$('#Evento_Info').css('padding','65px 25px');
						$('#Evento').css({'top':'-248px','height':'622px'});
					}
				}							
			});			
		}
	});
	
});

function chamadaPresente(){

	var ONE_YEAR = 12*30*24*60*60*1000;

	var d = new Date();
	var endDate = d.getTime();
	var startDate = endDate - ONE_YEAR;


	var chamada = getData("Chamada/list", alunoID + "?startDate=" + startDate + "&endDate=" + endDate);

	//console.log(chamada);
	var chamadaP = new Array();
	$.each(chamada, function(n, val){
		chamadaP.push(val);
	});
	return chamadaP;

}
