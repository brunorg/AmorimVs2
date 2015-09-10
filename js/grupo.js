$(document).ready(function(){	
	/*Abre a aba de pesquisar para o perfil que tem acesso*/
	$("#bt_Pesquisar").click(function(){
		if($("#bt_Pesquisar").hasClass("bt_Pesquisar_Inserir") == false)
		{
			$("#bt_Pesquisar").addClass("bt_Pesquisar_Ativo");
			$("#bt_Inserir").removeClass("bt_Inserir_Ativo_Grupo");
			$("#container_Pesquisa").css("display", "block");
			$("#container_Inserir").css("display", "none");
		}
	});
	
	/*Abre a aba de inserir para o perfil que tem acesso*/
	$("#bt_Inserir").click(function(){
		if($("#bt_Inserir").hasClass("bt_Pesquisar_Inserir") == false)
		{
			$("#bt_Inserir").addClass("bt_Inserir_Ativo_Grupo");
			$("#bt_Pesquisar").removeClass("bt_Pesquisar_Ativo");
			$("#container_Inserir").css("display", "block");
			$("#container_Pesquisa").css("display", "none");
		}
	});
	
	/*Efeito do checkbox com imagem*/
	$("div.inputImg").click(function(){
		if($(this).hasClass("clicado") == false){
			$(this).css("background-position","-39px 0px").addClass("clicado");
		}
		else{ $(this).css("background-position","0px 0px").removeClass("clicado"); }
	});
	
	/*Recursos de Aprendizagem Pesquisar*/
	/*Listagem de roteiros no select para escolha de um Roteiro*/
	$.ajax({
		type: "GET",
		crossDomain: true,
		url: path+"Roteiro"			
	}).then(function(data) {
		var limite = data.length;
		HtmlContent = "";
		HtmlContent += '<option value="todos">Todos</option>';		 
		for(var a = 0; a < limite; a++){
			HtmlContent += '<option value='+data[a].idroteiro+'>'+data[a].nome+'</option>';			
		}
		$('#roteiro').html(HtmlContent);
	});
});