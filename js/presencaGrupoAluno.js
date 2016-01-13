// JavaScript Document
var action;
var ArrayChamada = [];

/*Botões de fechar as caixas*/
$(document).ready(function(e) {
	
	if(usuario == "Aluno"){	
	/*Aqui vai o grupo do usuário logado*/
		var alunoVariavel = JSON.parse(localStorage.getItem("objetoAlunoVariavel"));
		//console.log(alunoVariavel);
		var grupo = alunoVariavel.grupo.idgrupo;		 
		
		//Listagem de alunos do grupo
		var dataAlunoVariavel = getData("AlunoVariavel/grupo", grupo);		

		/*alterar para serviço que vai trazer somente nome e id do aluno variavel*/
		var cont = 0;
		var alunosP = new Array();	
		
		var dadosChamada;
		
		$.ajax({
			url: path+"Chamada/dataChamadaAtual/"+grupo,
			type: "GET",
			async:false,
			dataType:"json",
			success: function(data){								 			
				for(var a = 0; a < data.length; a++){
					dadosChamada = data;										
					alunosP[cont] = {
						idAluno: data[a].idAluno,
						nomeAluno: data[a].nome,
						statusChamada: data[a].status,
						idAlunoVariavel: data[a].idAlunoVariavel,
						idChamada: data[a].idChamada
					}
					cont++;
				}
			}
		});

		if(dadosChamada[0].existe == 0){			
			var HtmlContent = "";			
			var status="";
			for(p=0;p<alunosP.length;p++){											
				if((alunosP[p].statusChamada == 0)){
					status = "unselecionado";														
				}else{
					status = "preSelecionado";
				}					
				action = "update";
				HtmlContent += '<input id="'+alunosP[p].idChamada+'" type="checkbox" name="presenca_opcao" value="alu_1" class="presenca_check">';
				HtmlContent += '<label for="'+alunosP[p].idChamada+'" id="'+alunosP[p].idAluno +'"  class="css-label '+status+'">'+abreviaNome(alunosP[p].nomeAluno)+'</label>';
				HtmlContent += '<br>';			
			}
		}else{
			var HtmlContent = "";
			var selecionado="";
			for(p=0;p<alunosP.length;p++){	
				action = "create";
				HtmlContent += '<input id="'+alunosP[p].idAluno +'" type="checkbox" name="presenca_opcao" value="alu_1" class="presenca_check">';
				HtmlContent += '<label for="'+alunosP[p].idAluno +'" id="'+alunosP[p].idAluno +'"  class="css-label unselecionado">'+abreviaNome(alunosP[p].nomeAluno)+'</label>';
				HtmlContent += '<br>';
			}
		}				
		
		console.log(HtmlContent);
		
		$('.presenca_opcao').html(HtmlContent);
	}
	
	$(".css-label").click(function(){		
		$(this).toggleClass("preSelecionado");
		$(this).toggleClass("unselecionado")			
	});	
		
	$(".btn_pres").click(function(){
		ConfirmaPresencaGrupo(dadosChamada[0].existe);
	});
	
});

function ConfirmaPresencaGrupo(bool) {
	var elementosAC = $('.preSelecionado');
	var valores="";
	var presenca;
	//debugger;
	if(bool==1)
		presenca = false;	
	else
		presenca = true;
	
	//console.log(elementosAC.length);
	
	for (var i = 0; i < elementosAC.length; i++) {
		var data = new Date();
		var diaCorrido = data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate();

		if (presenca == false)
		{
			action = "create";
			valores = "&data="+diaCorrido+"&presenca=1&aluno="+$(elementosAC[i]).attr("id");
		}
		
		else
		{
			action = "update";
			valores = "&data="+diaCorrido+"&presenca=1&aluno="+$(elementosAC[i]).attr("id")+"&id="+$(elementosAC[i]).attr("for");
		}

		var contAC = 0;
		$.ajax({
			type: "POST",
			crossDomain: true,
			url: path+"Chamada",
			data: "action="+action+valores,
			beforeSend: function () {
				loading("inicial");
			},
			success: function(retorno){
				$(elementosAC[contAC]).attr("for", retorno);
				mensagem("Presença apontada com sucesso!","OK","bt_ok","sucesso");
				contAC++;				
			},
			error: function(retorno){
				mensagem("Erro ao apontar presença!","OK","bt_ok","erro");
			},
			complete: function () {
				loading("final");
			}        
		});
	}	

	var elementosN = $('.unselecionado');
	
	for (var i = 0; i < elementosN.length; i++) {
		console.log("iteração " + i + " Não selecionado");
		var data = new Date();
		var diaCorrido = data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate();


		if (presenca == false)
		{
			action = "create";
			valores = "&data="+diaCorrido+"&presenca=0&aluno="+$(elementosN[i]).attr("id");
		}
		
		else
		{
			action = "update";
			valores = "&data="+diaCorrido+"&presenca=0&aluno="+$(elementosN[i]).attr("id")+"&id="+$(elementosN[i]).attr("for");
		}
		
		contN = 0;	
		$.ajax({
			type: "POST",
			crossDomain: true,
			url: path+"Chamada",
			data: "action="+action+valores,
			success: function(retorno){
				$(elementosN[contN]).attr("for", retorno);
				mensagem("Presença apontada com sucesso!","OK","bt_ok","sucesso");
				console.log(retorno + "---------" + i + "------" + contN);
				contN++;			
			},
			error: function(retorno){
				mensagem("Erro ao apontar presença!","OK","bt_ok","erro");
			}        
		});
	}
}

function loading(estado) {
    if(estado == "inicial"){
		$('.boxGlobal').load("preloader_JS.html").css({"display":"block","padding-top":"300px"});
	}
	if(estado == "final"){
		$('.boxGlobal').html("").hide();
	}
};

//Function fecha div de Evento e Chamada
function fecharBox(idBox){
	$("#"+idBox).hide();
}

function abreviaNome(nome){
	nome = nome.split(" ");
	var nomeFinal = new Array();
	var nomeAbreviado = "";
	nome = nome.filter(function(item, index, array){
		if(item != "de" && item != "De"){
			return item;
		}		
	});	
	for(var i=0;i<nome.length;i++){
		if(i<1){
			nomeFinal[i] = nome[i];
		}else if(i==nome.length-1){
			nomeFinal[i] = nome[i];
		}else{
			nomeFinal[i] = nome[i].substring(0, 1)+"."; 
		}
		nomeAbreviado += nomeFinal[i]+" ";
	}	
	return nomeAbreviado;
}
