$(document).ready(function(){
	/*Sistema de abas*/
	$(".btn_abas").click(function(){ 
		$(".btn_abas").removeClass("bt_Ativo");
		$(this).addClass("bt_Ativo"); 
		$('#cx_conteudo div').removeClass('selecionado');
		containerAtivo = $(this).attr('id');
		$('#container_'+containerAtivo).addClass('selecionado');
		limparCriarTutoria();
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

function limparCriarTutoria(){
	if($(".btn_abas").hasClass("bt_Ativo")){
		console.log("Entrou no if!");
		$("#cicloTutoria").val("0");
		$("#periodoTutoria").val("0");
		$("#tutorTutoria").val("0");
		$("#Area_Nome_Tutoria").empty();
		$("#Area_Nome_Tutoria").hide();
		$("#cicloAluno").val("0");
		$("#periodoIdAluno").val("0");
		$("#boxAluno").empty();
		$("#Container_Cadastro_Aluno").hide();
		$(".btn_Salvar_Aluno").hide();
		$("#Container_Cadastro_Tutoria").show();
		$("#btn_Salvar_Tutoria").show();
	}
}