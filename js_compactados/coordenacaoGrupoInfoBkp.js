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

	/*Listagem dos Tutores*/
	var LimiteC = dataTutoria.length;
	var HtmlContentC = "";
	HtmlContentC += '<option value="Todas">Todas</option>';
	for(var a = 0; a < dataTutoria.length; a++){
		HtmlContentC += '<option value="'+dataTutoria[a].idtutoria+'">'+dataTutoria[a].tutor.nome+'</option>';
	}		
	HtmlContentC += '<option value="N_A">Não Atribuido</option>';
	$('.tutoria').html(HtmlContentC);	

	/*Listagem dos Tutores*/
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

		if(dataAlunoVariavel[a].grupo != null && $('#anoEstudo').val() == dataAlunoVariavel[a].anoEstudo.ano &&
			$('#periodo').val() == dataAlunoVariavel[a].periodo.idperiodo &&
			($('.tutoriaT').val() == dataAlunoVariavel[a].grupo.tutoria.idtutoria || $('.tutoriaT').val() == "Todas"))
		{
			for(var b=0; b < $('.linha').length; b++)
			{

				/*if(dataAlunoVariavel[a].grupo.tutoria.tutor.nome == document.getElementsByClassName('tutor_nome')[b].innerHTML &&
					(dataAlunoVariavel[a].grupo.nomeGrupo).substr(2) == $(document.getElementsByClassName('tutor_nome')[b]).parent().parent().attr("id"))*/
				if((dataAlunoVariavel[a].grupo.nomeGrupo).substr(2) == $(document.getElementsByClassName('linha')[b]).attr("id"))
				{
					Encontrado = true;
				}
			
			}

			if(!Encontrado){

				aluno=dataAlunoVariavel[a].aluno.nome;
				HtmlContent += '<div class="boxGrupo'+dataAlunoVariavel[a].grupo.idgrupo+' linha" id="'+dataAlunoVariavel[a].grupo.idgrupo+'">';
				HtmlContent += '<div class="grupoCaixa">';
				//HtmlContent += '<div class="grupoTitulo">'+(data[a].grupo.nomeGrupo != "" ? data[a].grupo.nomeGrupo:(""+$('#anoEstudo').val()+""+($('#periodo').val() == 1 ? "M":"T")+""+data[a].grupo.idgrupo))+'</div>';
				HtmlContent += '<div class="grupoTitulo">'+(""+$('#anoEstudo').val()+""+($('#periodo').val() == 5 ? "M":"T")+""+dataAlunoVariavel[a].grupo.idgrupo)+'</div>';
				//HtmlContent += '<div class="grupoTitulo">'+(data[a].grupo.nomeGrupo != "" ? data[a].grupo.nomeGrupo:"Nao Acessivel")+'</div>';
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
				//$('.linha').filter(":contains('"+dataAlunoVariavel[a].grupo.tutoria.tutor.nome+"')").find('.Aluno_Grupo').append('; '+dataAlunoVariavel[a].aluno.nome);
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
				//HtmlContent += '<div class="grupoTitulo">'+(data[a].grupo.nomeGrupo != "" ? data[a].grupo.nomeGrupo:(""+$('#anoEstudo').val()+""+($('#periodo').val() == 1 ? "M":"T")+""+data[a].grupo.idgrupo))+'</div>';
				HtmlContent += '<div class="grupoTitulo">'+(""+$('#anoEstudo').val()+""+($('#periodo').val() == 5 ? "M":"T")+""+dataAlunoVariavel[a].grupo.idgrupo)+'</div>';
				//HtmlContent += '<div class="grupoTitulo">'+(data[a].grupo.nomeGrupo != "" ? data[a].grupo.nomeGrupo:"Nao Acessivel")+'</div>';
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

function novo(){
	carregando();
	setTimeout(
			grupoNovo,1000
	)
	return false;
}

function editar(){
	carregando();
	setTimeout(
			editarGrupoFun,1000
	)
	return false;
}


function carregando(){
	$('body').prepend('<div id="loader"><h2>Carregando...</h2></div>')
	return false;
}

function grupoNovo(){
	var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var tutoria = $("#tutoria").val();
	
	anoEstudo = anoEstudo.substring(0, 1);
	periodo = periodo.substring(0, 1);
	var codigoGrupo = anoEstudo+periodo;	
		
	/*$.ajax({
		url: path+"Grupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,		
		//data:"action=create&nomeGrupo="+codigoGrupo+"&tutoria="+tutoria+"&lider=0",	
		data:"action=create&anoEstudo="+anoEstudo+"&periodo="+periodo+"&tutoria="+tutoria+"&lider=0",		
		success: function(d) {			
			codigoGrupo = codigoGrupo+d;	*/		
			$.ajax({
				url: path+"Grupo/",
				type: "POST",
				async:false,
				crossDomain: true,
				dataType: 'json',
				contentType: false,	
				//data:"action=update&id="+d+"&nomeGrupo="+codigoGrupo+"&tutoria="+tutoria+"&lider=0",
				data:"action=create&anoEstudo="+anoEstudo+"&periodo="+periodo+"&tutoria="+tutoria+"&lider=0",			
				success: function(data) {					
					//aqui pego todos os elementos por classe
					var elementos = $('.S_Aluno');					
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
							console.log("ok, passou");
							$("#loader").remove();
							alert("Grupo cadastrado com sucesso!");
							mensagem("Grupo cadastrado com sucesso!","OK","bt_ok","sucesso");
							dataTutoria 				=	getData("Tutoria", null);
							dataAlunoVariavel 			=	getData("AlunoVariavel", null);
							dataPeriodo 				=	getData("Periodo", null);
							dataAnoEstudo 				=	getData("AnoEstudo", null);	
							
							
							
							//$("#loader").remove();
							
							/*Limpa as combobox*/							
							var opcaoLimpar = $('.S_Aluno');
							opcaoLimpar.val(opcaoLimpar.find('option[value="-1"]').val());
							
							var opcaoTutoria = $('.tutoria');
							opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());
							
							  
						},error: function(d) {
							console.log("Erro update dos alunos");
							$("#loader").remove();
						}
					});							
				},error: function(d) {
					console.log("Erro update no nome do grupo");
					$("#loader").remove();
				}
			});		
		/*},error: function(d) {
			//console.log("Erro cadastro de grupo");
			$("#loader").remove();
		}
	});*/
	$("#loader").remove();
}

var alunos = new Array();

function montagemEdicao(id)
{
	$("#bt_Pesquisar").removeClass("bt_Pesquisar_Ativo");	
	$("#container_Pesquisa").css("display","none");
	$("#bt_Inserir").addClass("bt_Inserir_Ativo_Grupo");	
	$("#container_Inserir").css("display","block");	
	$("#S_AnoEstudo").attr('disabled', true);
	$("#S_Periodo").attr('disabled', true);
	
	$("#action").val("update");
	$("#grupo").val(id);	
	var cont = 0;
	var tutoria;
	
	var dataAlunoVariavel =	getData("AlunoVariavel", null);	

	for(i=0;i<dataAlunoVariavel.length;i++)
	{
		if(dataAlunoVariavel[i].grupo!=null)
		{
			if(dataAlunoVariavel[i].grupo.idgrupo == id)
			{
				alunos[cont] = dataAlunoVariavel[i].idalunoVariavel; 
				cont++;
				tutoria = dataAlunoVariavel[i].grupo.tutoria.idtutoria;
				$("#nomeGrupo").val(dataAlunoVariavel[i].grupo.nomeGrupo);
			}
			var opcaoAno = $('#S_AnoEstudo');
			opcaoAno.val(opcaoAno.find('option[value="'+dataAlunoVariavel[i].anoEstudo.idanoEstudo+'"]').val());
			
			var opcaoPeriodo = $('#S_Periodo');
			opcaoPeriodo.val(opcaoPeriodo.find('option[value="'+dataAlunoVariavel[i].periodo.idperiodo+'"]').val());
		}
	}
	
	$("#editarGrupo").css("display","block");
	$("#cadastrarGrupo").css("display","none");	


	  	var LengthLinha = $('#marginAlunos .linha').length;

	  	for(var c=2; c<= LengthLinha-1; c++)
	  	{
	  		$('#marginAlunos .linha:nth-child(2)').remove();
	  	}

	SetValoresAlunoVariavel(alunos);
	SetValoresProfessorFuncionario(tutoria);
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

	$("#S_AnoEstudo").attr('disabled', false);
	$("#S_Periodo").attr('disabled', false);
	
	for(n=0;n<dataAlunoVariavel.length;n++){
		if(dataAlunoVariavel[n].grupo!=null){
			if(dataAlunoVariavel[n].grupo.idgrupo == grupoId){
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
	var tutoria = $("#tutoria").val();
	var lider="";
	if(dataGrupo.lider != null){
		lider = dataGrupo.lider.idAluno;
	}else{
		lider = 0;
	}
	
	$.ajax({
		url: path+"Grupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,	
		data:"action=update&id="+grupoId+"&nomeGrupo="+dataGrupo.nomeGrupo+"&tutoria="+tutoria+"&lider="+lider,			
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