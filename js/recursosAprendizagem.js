//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var aluno=1;
    var alunoID = 2;
    var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

var dataMateria 				=	getData("Materia", null);
var dataRoteiro 				=	getData("Roteiro", null);
var dataRecursoAprendizagem = getData("RecursoAprendizagem", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){	
	/*Executa a função listagem para que os recursos de aprendizagem sejam carregados assim que tiver load da página*/
	$(function() {
		listagem();
	});
	
	var perfil = getUrlVars();
	
	if(perfil['id']=="aluno"){
		$("#bt_Inserir").hide();
		$("#Cabecalho_Perfil_Area_Descricao").html("Gustavo Santos | 6º ano");
		$("#aluno").html("Área do Aluno");
		$(".mudar").removeAttr("id");
		$(".mudar").attr("id","Cabecalho_Perfil_Area_Foto_aluno");
	}
	
	/*Abre a aba de pesquisar para o perfil que tem acesso*/
	$("#bt_Pesquisar").click(function(){
		if($("#bt_Pesquisar").hasClass("bt_Pesquisar_Inserir") == false)
		{
			$("#bt_Pesquisar").addClass("bt_Pesquisar_Ativo");
			$("#bt_Inserir").removeClass("bt_Inserir_Ativo");
			$("#container_Pesquisa").css("display", "block");
			$("#container_Inserir").css("display", "none");
		}
	});
	
	/*Abre a aba de inserir para o perfil que tem acesso*/
	$("#bt_Inserir").click(function(){
		if($("#bt_Inserir").hasClass("bt_Pesquisar_Inserir") == false)
		{
			$("#bt_Inserir").addClass("bt_Inserir_Ativo");
			$("#bt_Pesquisar").removeClass("bt_Pesquisar_Ativo");
			$("#container_Inserir").css("display", "block");
			$("#container_Pesquisa").css("display", "none");
		}
	});
	
	/*Efeito do checkbox com imagem*/
	$("div.inputImg").click(function(){
		if($(this).hasClass("clicado") == false){
			$(this).css("background-position","-39px 0px").addClass("clicado");
		}else{ 
			$(this).css("background-position","0px 0px").removeClass("clicado"); 
		}
	});
	
	/*Recursos de Aprendizagem Pesquisar*/
	/*Listagem de roteiros no select para escolha de um Roteiro*/
	

		HtmlContent = "";
		HtmlContent += '<option value="todos">Todos</option>';		 
		for(var a = 0; a < dataRoteiro.length; a++){
			HtmlContent += '<option value='+dataRoteiro[a].idroteiro+'>'+dataRoteiro[a].nome+'</option>';			
		}
		$('#roteiro').html(HtmlContent);

	
	
	/*Listagem de materias no select para escolha de uma Matéria*/
	

		HtmlContent = "";		
		HtmlContent += '<option value="todos">Todos</option>';		 
		for(var a = 0; a < dataMateria.length; a++){
			HtmlContent += '<option value='+dataMateria[a].idmateria+'>'+dataMateria[a].nomeMateria+'</option>';			
		}
		$('#materia').html(HtmlContent);

	
	
	/*Listagem de recursos de aprendizagem*/
	function listagem(roteiro,materia,tipo)
	{
		var dataRecursoAprendizagem = getData("RecursoAprendizagem", null);
		var limite = dataRecursoAprendizagem.length;			
		HtmlContent = "";		
		var imagem = "";
		for(var a = 0; a < limite; a++){
			//aqui pego todos os elementos por classe
			var elementos = $('.selecionado');					
			//você tera que percorer a lista para poder pegar o id de todos.
			var tipo = false;				
			for (var i = 0; i < elementos.length; i++) {
				if(elementos[i].id == dataRecursoAprendizagem[a].tipoRecursoAprendizagem.idtipoRecursoAprendizagem){
					tipo = true;
				}
			}			
			//console.log(tipo);
			if((roteiro == dataRecursoAprendizagem[a].roteiro.idroteiro || (roteiro == "" || roteiro == "todos" || typeof roteiro == 'undefined'))&&(materia == dataRecursoAprendizagem[a].materia.idmateria || (materia == "" || materia == "todos" || typeof materia == 'undefined')) && (tipo || typeof elementos[0] == 'undefined')){					
				switch (dataRecursoAprendizagem[a].tipoRecursoAprendizagem.idtipoRecursoAprendizagem){
					case 1:imagem ="item_Pesquisa_Livro";break;
					case 2:imagem ="item_Pesquisa_Video";break;
					case 3:imagem ="item_Pesquisa_Audio";break;
					case 4:imagem ="item_Pesquisa_Link";break;
					case 5:imagem ="item_Pesquisa_Jogo";break;
					case 6:imagem ="item_Pesquisa_Foto";break;
				}						
				var margin = ((limite-1)==a) ? "style='margin-bottom:0'" : "";						
				HtmlContent += "<div class='itemResultado' "+margin+" id='"+dataRecursoAprendizagem[a].idrecursoAprendizagem+"'>";
				HtmlContent += "<div idRA='"+dataRecursoAprendizagem[a].idrecursoAprendizagem+"' class='Espaco_Curtir ocultar'></div>";
				HtmlContent += "<div idRAE='"+dataRecursoAprendizagem[a].idrecursoAprendizagem+"' class='Espaco_Excluir ocultar' onclick='excluirRecurso("+dataRecursoAprendizagem[a].idrecursoAprendizagem+")'></div>";
				
				if(dataRecursoAprendizagem[a].arquivo != null){
					HtmlContent += "<div class='itemTitulo "+imagem+"'><a href="+dataRecursoAprendizagem[a].arquivo+" target='_blank'>"+dataRecursoAprendizagem[a].nomeRecurso+"</a></div>";
				}else if(dataRecursoAprendizagem[a].imagem != null){
					HtmlContent += "<div class='itemTitulo "+imagem+"'><a href="+dataRecursoAprendizagem[a].imagem+" target='_blank'>"+dataRecursoAprendizagem[a].nomeRecurso+"</a></div>";
				}else if(dataRecursoAprendizagem[a].link != null){
					HtmlContent += "<div class='itemTitulo "+imagem+"'><a href="+dataRecursoAprendizagem[a].link+" target='_blank'>"+dataRecursoAprendizagem[a].nomeRecurso+"</a></div>";
				}else{
					HtmlContent += "<div class='itemTitulo "+imagem+" '>"+dataRecursoAprendizagem[a].nomeRecurso+"</div>";	
				}
									
				/*HtmlContent += "<div class='edit'></div> ";*/
				HtmlContent += "<div class='itemSubtitulo'>"+dataRecursoAprendizagem[a].descricaoRecurso+"</div>";
				HtmlContent += "<div class='itemDescricao'></div>";
				HtmlContent += "</div>";
			}
		}
		window.setTimeout(function(){ocultaBtn();}, 100);		
		$('#resultado').html(HtmlContent);

		$('.Espaco_Curtir').click(function(){
			$(this).toggleClass('Curtir_Ativo');
			if($(this).attr("class") == "Espaco_Curtir")
			{
				change_Curtir("Ativo", $(this).attr("idRA"));
			} else {
				change_Curtir("Inativo", $(this).attr("idRA"));
			}
		});	
	}
		
	$("#bt_Buscar").click(function(){
		var roteiro = $("#roteiro option:selected").val();
		var materia = $("#materia option:selected").val();
		var tipo = $("tipo").val();
		
		listagem(roteiro,materia,tipo);
	});
	
	$(".tipoP").click(function(){
		$(this).toggleClass("selecionado");
	});	
	/*Fim Pesquisar*/
	
	/*Recursos de Aprendizagem inserir*/
	/*Listagem de roteiros no select para escolha de um Roteiro*/
	var limite = dataRoteiro.length;
	HtmlContent = "";	 
	HtmlContent += "<option value='-1'>Escolha</option>"; 
	for(var a = 0; a < limite; a++){
		HtmlContent += '<option value='+dataRoteiro[a].idroteiro+'>'+dataRoteiro[a].nome+'</option>';			
	}
	$('#roteiroIn').html(HtmlContent);

	
	
	/*Listagem de materias no select para escolha de uma Matéria*/
	var limite = dataMateria.length;
	HtmlContent = "";
	HtmlContent += "<option value='-1'>Escolha</option>"; 
	for(var a = 0; a < limite; a++){
		HtmlContent += '<option value='+dataMateria[a].idmateria+'>'+dataMateria[a].nomeMateria+'</option>';			
	}
	$('#materiaIn').html(HtmlContent);
	
	$(".tipoIn").click(function(){
		var idTipo = $(this).attr("id");
		tipo = idTipo.split('-');
		$("#inputLink").css("display","none");
		$("#inputArquivo").css("display","none");
		$("#inputEscolha").css("display","none");
		
		switch(tipo[1]){
			case '2':
				$("#inputLink").css("display","block");
			break;			
			case '4':
				$("#inputLink").css("display","block");
			break;
			case '5':
				$("#inputEscolha").css("display","block");
			break;
		}
		for(var a=1; a< 7; a++){			
			if(a== 2 || a== 6 || a==3){
				$('#inserir-'+a).attr("class", "inputImg tipoIn BorderBottom");
				$('#inserir-'+a).css("background-position","0px 0px");
			}else{
				$('#inserir-'+a).attr("class", "inputImg tipoIn");
				$('#inserir-'+a).css("background-position","0px 0px");
			}				
		}
		$(this).addClass('clicado');
		$(this).css("background-position","-39px 0px");			
	});	
	
	$(".tipoRec").click(function(){
		$('#inserir-7').attr("class", "inputImg tipoIn");
		$('#inserir-7').css("background-position","0px 0px");
		$('#inserir-8').attr("class", "inputImg tipoIn");
		$('#inserir-8').css("background-position","0px 0px");		
		var clicado = $(this).attr("id");
		if(clicado == "inserir-7"){
			$("#inputLink").css("display","block");
		}else{
			$("#inputLink").css("display","none");
		}
		//$(this).addClass('clicado');
		$(this).css("background-position","-39px 0px");			
	});	
	
	//Function que inseri um novo recurso, faz a verificação dos campos se todos estão preenchidos
	//Exibe os campos para fazer upload para cada tipo específico
	$(".submitInserir").click(function(){
		var nomeIn = $("#nomeIn").val();
		var roteiroIn = $("#roteiroIn").val();
		var materiaIn = $("#materiaIn").val();
		var descricao = $("#descricao").val();
		var url = $("#url").val();	
		var idTipo = $(".clicado").attr("id");
				
		if((nomeIn=="")||(roteiroIn==-1)||(materiaIn==-1)||(descricao=="")||(typeof idTipo == 'undefined')){
			mensagem("Todos os campos são obrigatórios!","OK","bt_ok","erro"); 
		}else{
			var tipo = idTipo.split('-');	
			if(url==""){
				url=1;
			}
			
			$.ajax({
                url: path+"RecursoAprendizagem",
                type: "POST",
				async:false,
				crossDomain: true,
				dataType: 'json',
				contentType: false,
    			data:"action=create&id=2&nomeRecurso="+nomeIn+"&descricaoRecurso="+descricao+"&tipoRecursoAprendizagem="+tipo[1]+"&materia="+materiaIn+"&roteiro="+roteiroIn+"&link="+url+"&curtir=1&imagem=1&arquivo=1",               
    			success: function(d) {
					mensagem("Dados cadastrados com sucesso!","OK","bt_ok","sucesso");
					$("#idrecursoAprendizagem").val(d);
					$('#resultado').load();
					var clicado = $(this).attr("id");
					if(clicado == "inserir-8"){
						$(".submitInserir").css("display","none");
						$("#inputArquivo").css("display","block");
						$(".submitUpload").css("display","block");
					}
					switch(tipo[1]){
						case '1':
							$(".submitInserir").css("display","none");
							$("#inputArquivo").css("display","block");
							$(".submitUpload").css("display","block");							
						break;						
						case '3':
							$(".submitInserir").css("display","none");
							$("#inputArquivo").css("display","block");
							$(".submitUpload").css("display","block");
						break;						
						case '5':							
							$(".submitInserir").css("display","none");
							$("#inputArquivo").css("display","block");
							$(".submitUpload").css("display","block");
						break;
						case '6':							
							$(".submitInserir").css("display","none");
							$("#inputArquivo").css("display","block");
							$(".submitUpload").css("display","block");
						break;
						default:
							//console.log(tipo[1]);
						break;
					}
					
					$("#nomeIn").val("");
					var opcaoRoteiro = $('#roteiroIn');
					opcaoRoteiro.val(opcaoRoteiro.find('option[value="-1"]').val());
					var opcaoMateria = $('#materiaIn');
					opcaoMateria.val(opcaoMateria.find('option[value="-1"]').val());				
					$("#descricao").val("");
					$("#url").val("");	
					$("#inputLink").css("display","none");					
					var dataRecursoAprendizagem = getData("RecursoAprendizagem", null);
					var clicado = $(".clicado").attr("id");
					$("#"+clicado).css("background-position","0px 0px");					
    			},error: function() {
    				alert("Não cadastrado, verifique os campos.");
    			}
    		});	 

		}	
	});	
	
	//Function que sobe os arquivos e imagens dos recursos
	//Verifica qual a extensão do arquivo que o usuário está fazendo upload
	//Se for imagem o tipo de upload será imagem("png,jpeg,jpg") 
	//Se for arquivo o tipo de upload será arquivo("pdf,mp3")
	$(".submitUpload").click(function(){
		var idRecurso = $("#idrecursoAprendizagem").val();
		var tipoArquivo = $("#tipo").val();
		var tipoUpload="";
		var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase(); 
        var tipo = extensao.split('.');	 
		if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
			tipoUpload = "imagem";
		}else{
			$("#tipo").attr("name","arquivo");
			tipoUpload = "arquivo";
		}				
		var formData = new FormData($("#inserirArquivo")[0]);
		$.ajax({
			url: path+"RecursoAprendizagem/upload/recursoAprendizagem/"+tipoUpload+"/"+idRecurso,
			type: "POST",
			mimeType:"multipart/form-data",
			contentType: false,
			cache: false,
			processData:false,
			data: formData,
			success: function(d) {
				mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
			}
		});
	});
	
	/*Listagem de recursos de aprendizagem, para cada tipo de recurso add uma class expecífica*/	
	HtmlContent = "";
	var limite = dataRecursoAprendizagem.length;
	if(limite>4){
		limite = 5;	
	}else{
		limite = limite;	
	}			
	for(var i = 0; i <limite; i++){
		switch (dataRecursoAprendizagem[i].tipoRecursoAprendizagem.idtipoRecursoAprendizagem){
			case 1:imagem ="item_Livro";break;
			case 2:imagem ="item_Video";break;
			case 3:imagem ="item_Audio";break;
			case 4:imagem ="item_Link";break;
			case 5:imagem ="item_Jogo";break;
			case 6:imagem ="item_Foto";break;
		}
		HtmlContent += "<li> <div class='"+imagem+"'>"+dataRecursoAprendizagem[i].nomeRecurso+"</div> </li>";
	}
	
	if(limite < 5){
		limite2 = 5 - limite;
		for(var a = 0; a <limite2; a++){
			HtmlContent += "<li><div class='item_vazio'>&nbsp;</li>";
		}
	}
	$('#Curtidos ul').html(HtmlContent);
});

//Adiciona ou Retira um curtir no recurso
function change_Curtir(QAtivo,idRecurso){
	var dataRecursoAprendizagemCurtir=getData("RecursoAprendizagem", idRecurso);	
	var curtidos = dataRecursoAprendizagemCurtir.curtir;	
	
	var IO = 0;
	if(QAtivo == "Ativo"){
		curtidos-=1;
	}else{
		curtidos+=1;
	}
	
	$.ajax({
		url: path+"RecursoAprendizagem/update/curtir/"+idRecurso+"/"+curtidos,
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		data: "action=update",
		success: function(d) {
			dataMensagens 	=	getData("Mensagens", null);
		},error: function() {
			
		}
   	}); 
}

function ocultaBtn(){
	if (dadosUsuario.perfil.perfil == "Coordenacao"){
		$('.Espaco_Excluir').css("display","block");
	}else if((dadosUsuario.perfil.perfil == "Aluno")||(dadosUsuario.perfil.perfil == "Professor")){
		$('.Espaco_Curtir').css("display","block");
	}
}

function excluirRecurso(idRecurso){
	mensagem("Deseja realmente excluir?","Cancelar","bt_cancelar","confirm","RecursoAprendizagem",idRecurso,"excluirDefinitivoRecurso");
}

function excluirDefinitivoRecurso(servico,idRecurso){
	$.ajax({
		type: "GET",
		crossDomain: true,
		async: false,
		url: path+"RecursoAprendizagem/delete/"+idRecurso,
		success: function(d) {
				
		}
	});	
	$("#boxMensagemGeral" ).hide();
	$("#"+idRecurso).remove();	
}

function carrega(div_id,page){
	$('#'+div_id).load(page);
}
