// JavaScript Document// JavaScript Document
$(document).ready(function(e) {		
	//Verifica se já foi feita uma chamada no dia 
	var bool = false;
	var dataP = new Date();										
	var diaCorrido = dataP.getUTCFullYear()+"-"+(dataP.getUTCMonth()+1)+"-"+dataP.getUTCDate();	
	var dataPresenca = getData("PresencaProfessor",null);
	for(var j = 0; j < dataPresenca.length; j++){			
		var dataPres = dataPresenca[j].data.split("-");
		var ano = dataPres[0];
		var mes = parseInt(dataPres[1]);
		var dia = dataPres[2];
		dataPres = ano+"-"+mes+"-"+dia;
						
		if((diaCorrido == dataPres)){
			bool = true;
			break;											
		}
	}
	
	//Lista os professores ativo=1	
	$.ajax({
	   type: "GET",
	   crossDomain: true,
	   url: path+"ProfessorFuncionarioVariavel/listar/1"           
	}).then(function(data) {
		var profSelecao=[[]];
		$(".presenca_opcao").empty();	
		//lista todos os professores e coloca em profSelecao
		for(var i = 0; i < data.length;i++){			
			if(bool==false){
				addChamada(diaCorrido,data[i].idprofessorFuncionarioVariavel);			
			}
			
			// $('.presenca_opcao').append(data[i].nome + '<br>');
			$('.presenca_opcao').append( '<input id="' + data[i].idprofessorFuncionarioVariavel +'" type="checkbox" name="presenca_opcao" value="'+data[i].idprofessorFuncionarioVariavel+' "class="presenca_check"><span class="css-label" for="'+data[i].idprofessorFuncionarioVariavel+'" id="'+data[i].idprofessorFuncionarioVariavel+'"></span><label>'+data[i].professorFuncionario.nome+'</label><br>');	
			profSelecao[i]=[];
			profSelecao[i][0]=data[i];
			profSelecao[i][1]=0;
		}
		carregaCheck();
		var texto;
		$("#pesquisaProfessor" ).keyup(function(){
			//console.log();
			aux = [];
			texto = $( "#pesquisaProfessor" ).val();
			//Seleciona prefessores e coloca no aux e depois no profSelecao
			for(var i = 0; i < profSelecao.length;i++){
				if( ( (profSelecao[i][0].professorFuncionario.nome).toLowerCase() ).search( (texto.toLowerCase() ) )  == 0) {
					aux[aux.length]=[];
					aux[aux.length-1][0]=profSelecao[i][0];
					aux[aux.length-1][1]=profSelecao[i][1];
				}
			}
		
			$(".presenca_opcao").empty();
			for(var i = 0; i < aux.length;i++){
				if(aux[i][1] == 1){
					$('.presenca_opcao').append( '<input id="'+aux[i][0].idprofessorFuncionarioVariavel+'" type="checkbox" name="presenca_opcao" value="'+aux[i][0].idprofessorFuncionarioVariavel+' "class="presenca_check" checked><span class="css-label" for="'+aux[i][0].idprofessorFuncionarioVariavel+'" id="'+aux[i][0].idprofessorFuncionarioVariavel+'"></span><label>'+aux[i][0].professorFuncionario.nome+'</label><br>');
				} else {
					$('.presenca_opcao').append( '<input id="'+aux[i][0].idprofessorFuncionarioVariavel+'" type="checkbox" name="presenca_opcao" value="'+aux[i][0].idprofessorFuncionario+' "class="presenca_check" ><span class="css-label" for="'+aux[i][0].idprofessorFuncionarioVariavel+'" id="'+aux[i][0].idprofessorFuncionarioVariavel+'"></span><label>'+aux[i][0].professorFuncionario.nome+'</label><br>');					
				}
			}
			carregaCheck();
			carregaChamadaDia();
		});
	});
	window.setTimeout(function(){
		carregaChamadaDia();
	},200);	
	
	/*lista Periodo*/
	var dataPeriodo = getData("Periodo", null);	
	HtmlContent = ""; 
	for(var c=0;c<dataPeriodo.length; c++)
	{
		HtmlContent += "<option value='"+dataPeriodo[c].idperiodo+"'>"+(dataPeriodo[c].periodo)+"</option>";
	}
	$('#periodoPres').html("<option></option>"+HtmlContent);
});

function carregaCheck(){
	$(".css-label").click(function(){			
		var id = $(this).attr("id");
		if($(this).hasClass("selecionado") == false){
			$(this).css("background-position","-38px 0px").addClass("selecionado");
			var dataPresenca = getData("PresencaProfessor",null);
			for(var i = 0; i < dataPresenca.length; i++){			
				var dataP = new Date();										
				var diaCorrido = dataP.getUTCFullYear()+"-"+(dataP.getUTCMonth()+1)+"-"+dataP.getUTCDate();	
				var data = dataPresenca[i].data.split("-");
				var ano = data[0];
				var mes = parseInt(data[1]);
				var dia = data[2];
				data = ano+"-"+mes+"-"+dia;												
				if((diaCorrido == data)&&(id == dataPresenca[i].professor.idprofessorFuncionarioVariavel)){
					chamada(id,"1",dataPresenca[i].idpresencaProfessor);
				}					
			}
		}else{ 
			$(this).css("background-position","0px 0px").removeClass("selecionado");
			var dataPresenca = getData("PresencaProfessor",null);
			for(var i = 0; i < dataPresenca.length; i++){			
				var dataP = new Date();										
				var diaCorrido = dataP.getUTCFullYear()+"-"+(dataP.getUTCMonth()+1)+"-"+dataP.getUTCDate();	
				var data = dataPresenca[i].data.split("-");
				var ano = data[0];
				var mes = parseInt(data[1]);
				var dia = data[2];
				data = ano+"-"+mes+"-"+dia;												
				if((diaCorrido == data)&&(id == dataPresenca[i].professor.idprofessorFuncionarioVariavel)){
					chamada(id,"0",dataPresenca[i].idpresencaProfessor);
				}					
			}
		}	
	});	
}

function carregaChamadaDia(){	
	var dataP = new Date();										
	var diaCorrido = dataP.getUTCFullYear()+"-"+(dataP.getUTCMonth()+1)+"-"+dataP.getUTCDate();	
	var dataPresenca = getData("PresencaProfessor",null);
	
	for(var j = 0; j < dataPresenca.length; j++){			
		var data = dataPresenca[j].data.split("-");
		var ano = data[0];
		var mes = parseInt(data[1]);
		var dia = data[2];
		data = ano+"-"+mes+"-"+dia;
						
		if((diaCorrido == data)&&(dataPresenca[j].presenca==1)){
			$(".css-label[id='"+dataPresenca[j].professor.idprofessorFuncionarioVariavel+"']").css("background-position","-38px 0px").addClass("selecionado");
		}					
	}	
}


function chamada(professor,presenca,id){
	//console.log(presenca,id);
	var dataP = new Date();										
	var diaCorrido = dataP.getUTCFullYear()+"-"+(dataP.getUTCMonth()+1)+"-"+dataP.getUTCDate();	
	
	$.ajax({
		type: "POST",
		crossDomain: true,
		url: path+"PresencaProfessor",
		data: "action=update&data="+diaCorrido+"&presenca="+presenca+"&professor="+professor+"&calendario=2&id="+id,
		success: function(retorno){
			//console.log("ok=> "+id);		
		},
			error: function(retorno){
		}        
	});
}

function addChamada(diaCorrido,id){
	//console.log(diaCorrido,id);
	//var valores = "data="+diaCorrido+"&presenca=0&professor="+id+"&calendario=";
	//var resultado = setCreateData(Tabela,Valores);
	$.ajax({
		type: "POST",
		crossDomain: true,
		url: path+"PresencaProfessor",
		data: "action=create&data="+diaCorrido+"&presenca=0&professor="+id+"&calendario=",
		success: function(retorno){
			//console.log("ok=> "+id);			
		},
			error: function(retorno){
		}        
	});	
}
