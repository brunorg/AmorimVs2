//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

    var alunoID = 2;
    var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao


//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataTutoria 				=	getData("Tutoria", null);
	var dataProfessorFuncionario    =   getData("ProfessorFuncionario", null);
	var dataAlunoVariavel 			=	getData("AlunoVariavel", null);
	var dataPeriodo 				=	getData("Periodo", null);
	var dataAnoEstudo 				=	getData("AnoEstudo", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery



$(document).ready(function() {	
	/*Listagem dos anos de estudo*/

		var Limite = dataAnoEstudo.length;	   
		var HtmlContent = "";

		for(var a = 0; a < Limite; a++)
		{
			HtmlContent += '<option value="'+dataAnoEstudo[a].ano+'">'+dataAnoEstudo[a].ano+'º</option>';
		}		
		$('#anoEstudo').html(HtmlContent);


	/*Listagem dos periodo*/

		var Limite = dataPeriodo.length;
		var HtmlContent = "";
		for(var a = 0; a < Limite; a++){
			HtmlContent += '<option value="'+dataPeriodo[a].idperiodo+'">'+dataPeriodo[a].periodo+'</option>';
		}		
		$('#periodo').html(HtmlContent);

	/*Listagem dos Professores para atribuir tutoria*/
	var LimiteC = dataProfessorFuncionario.length;
	var HtmlContentC = "";
	HtmlContentC += '<option value="-1">Selecione</option>';
	for(var a = 0; a < LimiteC; a++){
		HtmlContentC += '<option value="'+dataProfessorFuncionario[a].idprofessorFuncionario+'">'+dataProfessorFuncionario[a].nome+'</option>';
	}		
	HtmlContentC += '<option value="N_A">Não Atribuido</option>';
	$('.tutoria').html(HtmlContentC);	

	/*Listagem dos Tutores já com uma tutoria atribuida*/
	var Limite = dataTutoria.length;
	var HtmlContent = "";
	HtmlContent += '<option value="Todas">Todas</option>';
	for(var a = 0; a < Limite; a++){
		HtmlContent += '<option value="'+dataTutoria[a].idtutoria+'">'+dataTutoria[a].tutor.nome+'</option>';
	}		
	HtmlContent += '<option value="N_A">Não Atribuido</option>';
	$('.tutoriaT').html(HtmlContent);	
	MostrarGrupos();   



	$( "#anoEstudo" ).change(function() {

		MostrarGrupos()
		
	});

	$( "#periodo" ).change(function() {

		MostrarGrupos()
		
	});

	$( ".tutoriaT" ).change(function() {

		MostrarGrupos()
		
	});

});

function MostrarGrupos()
{
	var Limite = dataAlunoVariavel.length;	
	   
	var grupo;
	var aluno;
	var Linha_N_A = false;		
	
	$('#box_grupo_info').html('');
	
	for(var a = 0; a < Limite; a++)
	{
		var HtmlContent = "";

		var Encontrado = false;

		if(dataAlunoVariavel[a].grupo != null && 
			$('#periodo').val() == dataAlunoVariavel[a].periodo.idperiodo &&
			($('.tutoriaT').val() == dataAlunoVariavel[a].grupo.tutoria.idtutoria || $('.tutoriaT').val() == "Todas"))
		{
			for(var b=0; b < $('.linha').length; b++)
			{
				if((dataAlunoVariavel[a].grupo.nomeGrupo).substr(2) == $(document.getElementsByClassName('linha')[b]).attr("id"))
				{
					Encontrado = true;
				}
			
			}

			if(!Encontrado){
				aluno=dataAlunoVariavel[a].aluno.nome;
				HtmlContent += '<div class="boxGrupo'+dataAlunoVariavel[a].grupo.idgrupo+' linha" id="'+dataAlunoVariavel[a].grupo.idgrupo+'">';
				HtmlContent += '<div class="grupoCaixa">';
				HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].grupo.nomeGrupo+'</div>';
				HtmlContent += '<div class="Aluno_Grupo nomes'+dataAlunoVariavel[a].grupo.idgrupo+'"><span class="titulo">Alunos:</span> '+aluno+'</div>';
				HtmlContent += '<div class="tutor"> Tutor:</div>';
				HtmlContent += '<div class="tutor_nome">'+(dataAlunoVariavel[a].grupo.tutoria != null ? (dataAlunoVariavel[a].grupo.tutoria.tutor.nome):'Não Atribuido')+'</div>';
				HtmlContent += '</div>';
				HtmlContent += '<div class="btEditar" onclick="montagemEdicao('+dataAlunoVariavel[a].grupo.idgrupo+');"></div>';
				HtmlContent += '<div class="btExcluir" onclick="montagemExclusao('+dataAlunoVariavel[a].grupo.idgrupo+');"></div>';
				HtmlContent += '</div>';
				grupo=dataAlunoVariavel[a].grupo.idgrupo;
				
				$('#box_grupo_info').append(HtmlContent);

			} else {
				$('.linha[id='+(dataAlunoVariavel[a].grupo.nomeGrupo).substr(2)+']').find('.Aluno_Grupo').append('; '+dataAlunoVariavel[a].aluno.nome);
			}
		
		} else if((dataAlunoVariavel[a].grupo == null && ($('.tutoriaT').val() == "N_A" || $('.tutoriaT').val() == "Todas")) && 
			$('#anoEstudo').val() == dataAlunoVariavel[a].anoEstudo.ano &&
			$('#periodo').val() == dataAlunoVariavel[a].periodo.idperiodo){
			
			for(var b=0; b < $('.linha').length; b++)
			{
				if(dataAlunoVariavel[a].grupo != null)
				{
					if(dataAlunoVariavel[a].grupo.idgrupo == document.getElementsByClassName('linha')[b].id)
					{
						Encontrado = true;
					}
				}
				
			}

			if((!Encontrado) && (dataAlunoVariavel[a].grupo != null)){

				aluno=dataAlunoVariavel[a].aluno.nome;
				HtmlContent += '<div class="boxGrupo'+dataAlunoVariavel[a].grupo.idgrupo+' linha" id="'+dataAlunoVariavel[a].grupo.idgrupo+'">';
				HtmlContent += '<div class="grupoCaixa">';
				HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].grupo.nomeGrupo+'</div>';
				HtmlContent += '<div class="Aluno_Grupo nomes'+dataAlunoVariavel[a].grupo.idgrupo+'"><span class="titulo">Alunos:</span> '+aluno+'</div>';
				HtmlContent += '<div class="tutor"> Tutor:</div>';
				HtmlContent += '<div class="tutor_nome">Não Atribuido</div>';
				HtmlContent += '</div>';
				HtmlContent += '<div class="btEditar" onclick="montagemEdicao('+dataAlunoVariavel[a].grupo.idgrupo+');"></div>';			
				HtmlContent += '</div>';
				grupo=dataAlunoVariavel[a].grupo.idgrupo;
				
				$('#box_grupo_info').append(HtmlContent);

			} else {

				if(!Linha_N_A)
				{

					HtmlContent += '<div class="boxGrupo_N_A" linha" id="N_A">';
					HtmlContent += '<div class="grupoCaixa">';
					HtmlContent += '<div class="grupoTitulo"></div>';
					HtmlContent += '<div class="Aluno_Grupo"><span class="titulo">Alunos:</span> '+dataAlunoVariavel[a].aluno.nome+'</div>';
					HtmlContent += '<div class="tutor"> Tutor:</div>';
					HtmlContent += '<div class="tutor_nome">Não Atribuido</div>';
					HtmlContent += '</div>';
					HtmlContent += '<div class="btEditar"></div>';				
					HtmlContent += '</div>';
					
					$('#box_grupo_info').append(HtmlContent);

					Linha_N_A = true;
				} else {
					
					$('.boxGrupo_N_A').find('.Aluno_Grupo').append('; '+dataAlunoVariavel[a].aluno.nome);
					$('#box_grupo_info').append($('.boxGrupo_N_A'));
				}

			}

		}
	
	}		
} 

function grupoNovo(){
	var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var periodoId = $("#S_Periodo").val();
	var professorId = $("#tutoria").val();
	var elementos = $('.S_Aluno');
	var bool = false;
	var msg;
	
	anoEstudo = anoEstudo.substring(0, 1);
	periodo = periodo.substring(0, 1);
	
	for (var i = 0; i < elementos.length; i++) {				
		if($("#"+elementos[i].id).val() != "-1"){			
			bool = true;				
		}else{
			msg = "Escolha pelo menos um aluno!";
		}					
	}
	if(professorId=="-1"){
		msg = "Escolha um tutor!";
	}
	
	if(professorId!="-1" && bool == true){
		$.ajax({
			url: path+"Grupo/",
			type: "POST",
			async:false,
			crossDomain: true,
			dataType: 'json',
			contentType: false,	
			beforeSend: function(){
				$('.boxGlobal').css("display","block");
			},
			data:"action=create&anoEstudo="+anoEstudo+"&periodo="+periodo+"&idProfessor="+professorId+"&lider=0&id=0"+"&idPeriodo="+periodoId,					
			success: function(data) {					
				//aqui pego todos os elementos por classe				
				var alunos=""; 
				var valores=new Array();
				var contId=0;						
				
				for (var i = 0; i < elementos.length; i++) {				
					if($("#"+elementos[i].id).val() != ""){
						valores[contId] = $("#"+elementos[i].id).val();
						contId++;		
					}						
				}
				
				for (var x = 0; x < valores.length; x++) {	
					if(x == valores.length-1){
						alunos += valores[x];
					}else{
						alunos += valores[x]+";";
					}
				}
				$.ajax({
					url: path+"AlunoVariavel/alunoGrupo/",
					type: "POST",
					async:false,
					crossDomain: true,
					dataType: 'json',
					contentType: false,	
					data:"action=update&alunos="+alunos+"&grupo="+data,			
					success: function(data) {						
						dataTutoria 				=	getData("Tutoria", null);
						dataAlunoVariavel 			=	getData("AlunoVariavel", null);
						dataPeriodo 				=	getData("Periodo", null);
						dataAnoEstudo 				=	getData("AnoEstudo", null);										
						/*Limpa as combobox*/							
						var opcaoLimpar = $('.S_Aluno');
						opcaoLimpar.val(opcaoLimpar.find('option[value="-1"]').val());					
						var opcaoTutoria = $('.tutoria');
						opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());	
						mensagem("Grupo cadastrado com sucesso!","OK","bt_ok","sucesso");  
					},
				});										
			},
			complete: function(){
				$('.boxGlobal').css("display","none");
			}
		});	
	}else{
		mensagem(msg,"OK","bt_ok","alerta"); 
	}	
}



function montagemEdicao(id)
{

	$("#bt_Pesquisar").removeClass("bt_Pesquisar_Ativo");	
	$("#container_Pesquisa").css("display","none");
	$("#bt_Inserir").addClass("bt_Inserir_Ativo_Grupo");	
	$("#container_Inserir").css("display","block");	
	$("#editarGrupo").css("display","block");
	$("#cadastrarGrupo").css("display","none");		
	$("#action").val("update");
	$("#grupo").val(id);


	var dataAlunoGrupo;
	$.ajax({
		url: path + "Grupo/AlunoGrupo/" + id,
		async: false,
		crossDomain: true,
		type: "GET",
		success: function (data){
			dataAlunoGrupo = data;
		}
	});

	for (var i = 0; (i < dataAlunoGrupo.length || i < $(".S_Aluno").length); i++)
	{
		if ( i >= $(".S_Aluno").length)
			$("#btAdd").trigger("click");
		if( i < dataAlunoGrupo.length)
			alimentaComboAluno("S_Aluno"+(i+1), dataAlunoGrupo[i]);
		else
			alimentaCombo("S_Aluno"+(i+1));
	}

	var tutor = dataAlunoGrupo[0].grupo.tutoria.tutor.idprofessorFuncionario;

	$("#tutoria option[value='"+tutor+"']").attr("selected","true");




	/*var alunos = new Array();
	
	$("#bt_Pesquisar").removeClass("bt_Pesquisar_Ativo");	
	$("#container_Pesquisa").css("display","none");
	$("#bt_Inserir").addClass("bt_Inserir_Ativo_Grupo");	
	$("#container_Inserir").css("display","block");	
	$("#editarGrupo").css("display","block");
	$("#cadastrarGrupo").css("display","none");		
	$("#action").val("update");
	$("#grupo").val(id);	
	var elementos = $('.S_Aluno');
	var HtmlContent = new Array();
	var cont = 0;	
	
	/*Recarrega os valores nas combos que estão vazias*/
	/*for (var i = 0; i < elementos.length; i++) {				
		if($("#"+elementos[i].id).val() == "-1"){			
			$("#"+elementos[i].id).html("");				
		}					
	}	
	
	var dataAlunoGrupo  =	getData("Grupo/AlunoGrupo", id);
	
	var dataGrupo       =	getData("Grupo", id);
	var contemAluno; 
	for(i=0;i<dataAlunoGrupo.length;i++)
	{				
		for(j=0;j<dataAlunoGrupo[i].length;j++){	
			if(dataAlunoGrupo[i][j].grupo != null){
				if(dataAlunoGrupo[i][j].grupo.idgrupo == id){
					if(alunos.length>0){
						contemAluno = false;
						for(k=0;k<alunos.length;k++){
							if(alunos[k] == dataAlunoGrupo[i][j].idalunoVariavel ){
								contemAluno = true;
							}
						}						
						if(contemAluno==false){
							alunos[cont] = dataAlunoGrupo[i][j].idalunoVariavel;
							cont++;
						}												
					}else{
						alunos[cont] = dataAlunoGrupo[i][j].idalunoVariavel;
						cont++;
					}
					HtmlContent[i] += '<option value="'+dataAlunoGrupo[i][j].idalunoVariavel+'">'+dataAlunoGrupo[i][j].aluno.nome+' | '+dataAlunoGrupo[i][j].anoEstudo.ano+'°</option>';				
				}						
			}
			if(dataAlunoGrupo[i][j].grupo == null){
				HtmlContent[i] += '<option value="'+dataAlunoGrupo[i][j].idalunoVariavel+'">'+dataAlunoGrupo[i][j].aluno.nome+' | '+dataAlunoGrupo[i][j].anoEstudo.ano+'°</option>';
			}			
		}
	}
	
	var opcaoTutoria = $('#tutoria');
	opcaoTutoria.val(opcaoTutoria.find('option[value="'+dataGrupo.tutoria.tutor.idprofessorFuncionario+'"]').val());
			
	//Alimenta as combos com os valores	
	for (var e = 0; e < dataAlunoGrupo.length; e++) {				
		if($("#"+elementos[e].id).val() == null){			
			$("#"+elementos[e].id).html(HtmlContent[e]);				
		}					
	}

	if(typeof alunos != 'undefined'){		
		if(alunos.length>0){
			while(alunos.length > $('#marginAlunos .linha').length-2)
			{
				CriarNovaLinha();
			}	
			//console.log("croiu Linhas");
			
			for(l=0;l<alunos.length;l++)
			{
				var opcaoAluno = $('#marginAlunos .linha:nth-child('+(l+2)+') .S_Aluno');
				opcaoAluno.val(opcaoAluno.find('option[value="'+alunos[l]+'"]').val());
				//console.log("croiu opcoes");
			}		
		}
	}	
	$(".checkLimpar").attr("checked",false);*/
}

function alimentaCombo(id){
	/*Limpa os valores na combo*/
	$("#"+id).html("");

	$.ajax({
        url: path+"AlunoVariavel/html/"+$('#S_AnoEstudo').val()+"/"+$('#S_Periodo').val(),
        dataType : 'html',
        success: function(d) {
            $('#'+id).html("<option value=-1></option>"+d);
        }
    });
}

function alimentaComboAluno(idCombo, AlunoVariavel){

	$("#"+idCombo).html("");

	$.ajax({
        url: path+"AlunoVariavel/html/"+AlunoVariavel.anoEstudo.idanoEstudo+"/"+AlunoVariavel.periodo.idperiodo,
        dataType : 'html',
        success: function(d) {
            $('#'+idCombo).html("<option value=-1></option>"+d+"<option value="+AlunoVariavel.idalunoVariavel+" selected>"+AlunoVariavel.aluno.nome+"</option>");
        }
    });

}

function montagemExclusao(id)
{
	var AlunoAtual = "";
	var b=0;

	for(var a=0; a< dataAlunoVariavel.length; a++)
	{
		if(dataAlunoVariavel[a].grupo != null)
		{
			if(dataAlunoVariavel[a].grupo.idgrupo == id)
			{
				AlunoAtual += (b == 0 ? (dataAlunoVariavel[a].idalunoVariavel):(';'+dataAlunoVariavel[a].idalunoVariavel));
				b++;
			}
		}
	}

	$.ajax({
		url: path+"AlunoVariavel/alunoGrupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,	
		data:"action=update&alunos="+AlunoAtual+"&grupo=",			
		success: function(data) {
			//console.log("Grupo zerado");
			$('#'+id).remove();
		},error: function(d) {
			//console.log("Erro update dos alunos");
		}
	});		
}

function editarGrupoFun(){	
	var grupoId = $("#grupo").val();
	var alunosGrupo= new Array();
	var cont = 0;
	var alunos="";
	var valores = new Array();
	var contId = 0;
	var tutoria="";

	$("#S_AnoEstudo").attr('disabled', false);
	$("#S_Periodo").attr('disabled', false);
	
	$.ajax({
		url: path+"Grupo/AlunoGrupo/"+grupoId,
		type: "GET",
		async:false,
		crossDomain: true,
		dataType: 'json',		
		success: function(data) {
			console.log(data);
		}
	});	
	
	
	for(n=0;n<dataAlunoVariavel.length;n++){
		if(dataAlunoVariavel[n].grupo!=null){
			if(dataAlunoVariavel[n].grupo.idgrupo == grupoId){
				if(tutoria==""){
					tutoria = dataAlunoVariavel[n].grupo.tutoria.idtutoria;
				}
				alunosGrupo[cont] = dataAlunoVariavel[n].idalunoVariavel;
				cont++;
			}
		}	
	}	
	
	
	for(i=0;i<alunosGrupo.length;i++){		
		if(i == alunosGrupo.length-1){
			alunos += alunosGrupo[i];
		}else{
			alunos += alunosGrupo[i]+";";
		}		
	}
	
	$.ajax({
		url: path+"AlunoVariavel/alunoGrupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,	
		data:"action=update&alunos="+alunos+"&grupo=",			
		success: function(data) {
			//console.log("Grupo zerado");
		},error: function(d) {
			//console.log("Erro update dos alunos");
		}
	});	

	
	var dataGrupo = getData("Grupo",grupoId);	
	var lider="";
	if(dataGrupo.lider != null){
		lider = dataGrupo.lider.idAluno;
	}else{
		lider = 0;
	}	
	
	var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var periodoId = $("#S_Periodo").val();
	var professorId = $("#tutoria").val();
	
	anoEstudo = anoEstudo.substring(0, 1);
	periodo = periodo.substring(0, 1);
	
	
	$.ajax({
		url: path+"Grupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,	
		
		data:"action=update&id="+grupoId+"&anoEstudo="+anoEstudo+"&periodo="+periodo+"&idProfessor="+professorId+"&tutoria="+tutoria+"&lider="+lider,	
				
		success: function(d){
			//aqui pego todos os elementos por classe
			var elementos = $('.S_Aluno');					
			var alunos=""; 
			
			for (var i = 0; i < elementos.length; i++) {									
				if( $("#"+elementos[i].id).val() != ""){
					valores[contId] = $("#"+elementos[i].id).val();
					contId++;	
				}
			}
			
			for (var x = 0; x < valores.length; x++) {	
				if(x == valores.length-1){
					alunos += valores[x];
				}else{
					alunos += valores[x]+";";
				}
			}
								
			$.ajax({
				url: path+"AlunoVariavel/alunoGrupo/",
				type: "POST",
				async:false,
				crossDomain: true,
				dataType: 'json',
				contentType: false,	
				data:"action=update&alunos="+alunos+"&grupo="+grupoId,		
				success: function(data) {
					dataAlunoVariavel =	getData("AlunoVariavel", null);
					
					/*Volta as combos da página de pesquisar para o ponto inicial*/
					var opcaoAno = $('#anoEstudo');
					opcaoAno.val(opcaoAno.find('option[value="1"]').val());
					var opcaoPeriodo = $('#periodo');
					opcaoPeriodo.val(opcaoPeriodo.find('option[value="5"]').val());
					var opcaoTutoria = $('#tutoriaT');
					opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());					
					
					/*Volta as combos da página de criar grupos para o ponto inicial*/
					var opcaoLimpar = $('.S_Aluno');
					opcaoLimpar.val(opcaoLimpar.find('option[value="-1"]').val());
					var opcaoTutoria = $('.tutoria');
					opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());
					
					$("#box_grupo_info").html("");
					mensagem("Grupo editado com sucesso!","OK","bt_ok","sucesso"); 
					//$("#loader").remove();
				},error: function(d) {
					console.log("Erro update dos alunos");
					//$("#loader").remove();
				}
			});	
			
		},error: function(d) {
			console.log("Erro update no nome do grupo");
			//$("#loader").remove();
		}
	});	
}