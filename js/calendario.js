// JavaScript Document
/*Funcao js que chama o plugin datepicher para montar o calendario*/
$(document).ready(function() 
{
	var calendario = new Array();
	var eventos = new Array();
	var datasInicio = new Array();
	
	eventos = getSelectedDates();	
	
	$.each(eventos, function(n, val){
		if (val.tipoEvento == null){
			tipoEvento = '';
		}else tipoEvento = val.tipoEvento.tipoEvento;
		
		calendario.push({
			'dataInicio' : val.dataInicio,
			'dataFim' : val.dataFim,
			'descricao' : val.descricao,
			'evento' : val.evento, 
			'tipoEvento' : tipoEvento,
			'ideventos' : val.ideventos,
			'imagem' : val.imagem,
			'feriado':val.feriado,
			'aula' : val.aula
		});
		
		//Salva as datas em um vetor para verificar as datas iniciais posteriormente
		data = val.dataInicio.split('-');
		datasInicio.push(
			parseInt(data[2])
		);
		
    });
	

	var verif = 1;	
	var vai = false;	// Gatilho para saber se existe um evento em andamento 
	var diaFinal = '';	// Dia final do evento em andamento
	var mesFinal = '';  // Mes final do evento em andamento
	var classe = '';	// Classe do evento em andamento
	var dia = false;	// Dia verifica se já existe um andamento no dia corrente!!
	var inicio = '';	// Váriavel verificadora se é o inicio de um evento!

	$("#datepicker").datepicker({
		showOtherMonths:true,
		dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
					 'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'],
		dateFormat: 'yy-mm-dd',
		inline: true,
		beforeShowDay: function (date){
			
			var mm = date.getMonth() + 1,
				dd = date.getDate();
				yy = date.getFullYear();
			var dt = yy + "-" + mm + "-" + dd;
						
			//coloca os valores padrões nas variaveis
			verif = '';
			inicio = '';
			dia = false;
			
			//Verifica se tem um evento em andamento!
			if (vai == true){

				//Verifica qual a classe deverá ser utilizada
				if (classe == 'azul'){
					verif = 0;
				}else{
					verif = 1;
				}
				//Se for o ultimo do evento a váriavel $vai passa a ser falsa@
				if ((dd == diaFinal)&&(mm == mesFinal)){
					vai = false;
				}
				
			//Se não tiver nenhum evento em andamento...
			}else{
				//Percorre o mês
				$.each(calendario, function(n, val){
					
					if (dia == false){	//Se ainda não tiver evento cadastrado no dia!!
						if(val.dataInicio!=null){ //Se a data inicial não for nula
							data = val.dataInicio.split('-');
							
							//Verifica se a data final não é nula e salva os dia e o mes do evento
							if(val.dataFim!=null){
								dataF = val.dataFim.split('-');
								diaFinal = parseInt(dataF[2]);
								mesFinal = parseInt(dataF[1]);
							}else{
								// Força o dia como 32. Assim o dia final corrente sempre será menor
								diaFinal = 32;
							}
							
							//Verifica se no dia corrente tem algum evento iniciando ou em andamento
							if (((dd >= parseInt(data[2])) && (dd <= diaFinal)) && (mm == (parseInt(data[1]))) && (yy == parseInt(data[0]))){

								//Confirma se é um inicio de evento, se sim coloca o nome da classe na var $inicio
								if (dd == parseInt(data[2]) && mm == parseInt(data[1]) && yy == parseInt(data[0])){

									inicio = 'inicioEventos';
								}else{
									inicio = '';
								}
		
								//$sia recebe true para não precisar repetir as rotinas desse dia
								dia = true;
								
								//Verifica qual a classe deverá ser utilzida de acordo com os campos aula e feriado
								if ((val.aula == 0) && (val.feriado == 1)){
									verif = 1;
									classe = 'cinza'; 
								}else if ((val.aula == 0) && (val.feriado == 0)){
									verif = 1;
									classe = 'cinza';
								}else{
									verif = 0;
									classe = 'azul';
								}
								
								//Verifica se a data final é a data corrente
								if(val.dataFim!=null){
									if ((mesFinal == mm) && (diaFinal == dd)){
										vai = false;
									}else{
										vai = true;
									}
								}else{
									vai = false;
								}

							}
						}
					}

				});	
			}
			
			if(verif == '0'){				
				return [true, "eventoAtivo "+inicio];
			}else if(verif == '1'){
				return [true, "feriado "+inicio];
			}			
			
			return [true, "myClass"];
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
						//$('#Evento').css({'top':'-479px','height':'387px'});
						$('#Evento').addClass("eventoImagem");
						$('#Evento_Info').css('padding','15px 25px');
						$('#Foto_evento').html("<img src='"+val.imagem+"' width='100%'/>");
					}else{
						$('#Foto_evento').hide();
						$('#Evento').removeClass("eventoImagem");
						$('#Evento_Info').css('padding','65px 25px');
						//$('#Evento').css({'top':'-251px','height':'640px'});
					}
				}							
			});
			
		}
	});
	
});

function getSelectedDates()
{
	var eventos = new Array();
    
	$.ajax({
        url: path+'Calendario',
        dataType: 'json',
        async: false,
        success: function(data){
			$.each(data, function(n, val){
				if(val.dataInicio!=null){
					dataEvento = val.dataInicio.split('-');
				}
				var ano = dataEvento[0];
				var mes = parseInt(dataEvento[1]);
				var dia = dataEvento[2];
				var d = new Date();					
				
				if(ano+""+mes+""+dia >= d.getFullYear()+""+(d.getMonth()+1)+""+(d.getDate().toString().length<2 ? "0"+d.getDate():d.getDate())){					
					eventos.push(val);				
           		}
			});
        }
    });
    return eventos;
}
