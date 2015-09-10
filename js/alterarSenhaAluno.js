// JavaScript Document// JavaScript Document
$(document).ready(function(e) {
	//Lista os professores ativo=1	
	var userSelecao = '';
	$.ajax({
		type: "GET",
		crossDomain: true,
		url: path+"Usuario",           
		success:(function(data) {
			userSelecao=[[]];
			for(var i = 0; i < data.length;i++){	
				$('.presenca_opcao').append( '<div class="celulaGrande">'+
				'<div class="infoG alterar" id="'+data[i].idusuario+'">'+data[i].login+'</div>'+
				'<div class="infoValueM inputNovaSenha" id="_'+data[i].idusuario+'" ></div></div>');	

				userSelecao[i]=[];
				userSelecao[i][0]=data[i];
				userSelecao[i][1]=0;
			}
		})
	});
	
	
	
	
	//$('.alterar').click(function(){
	$('body').delegate('.alterar', 'click', function(){
		var id = $(this).attr('id');
		//console.log('.'+id+'.');
		//alert(id);
		$(".inputNovaSenha").html('');
		$("#_"+id).html('<input id="novaSenha" maxlength="6" type="text"/><input type="button" class="btnSubmit" id="btnSubmit" name="btnSubmit" idUsuario="'+id+'"/>');
		
		//$(this).parent().css('background', 'rgb(200, 200, 195)');
		
		return false;
	})
	
	$('body').delegate('.btnSubmit', 'click', function(){
		var id = $(this).attr('idUsuario');
		var novaSenha = $('#novaSenha').val();
	console.log('id:'+id);
	console.log('senha:'+novaSenha);

		if (novaSenha == ''){
			return mensagem("Senha inválida!!","OK","bt_ok","erro");
		}
		$.ajax({
			type: "POST",
			async:false,
			crossDomain: true,
			data: "id="+id+"&senha="+novaSenha,
			url: path+"Logar/AlterarSenhaFull/",
			success:function(){
				mensagem("Senha alterada com sucesso!","OK","bt_ok","sucesso");
				$(".inputNovaSenha").html('');
			},
			error:function(){
				mensagem("Erro ao alterar Senha!","OK","bt_ok","erro");
			}
		});
		
		return false;
	});
	
	$("#pesquisaUsuario" ).keyup(function(){
		
		texto = $( "#pesquisaUsuario" ).val();
		var conf = false;
		$('.presenca_opcao').html('');
		
		for(var i = 0; i < userSelecao.length;i++){
			if( ( (userSelecao[i][0].login).toLowerCase() ).search( (texto.toLowerCase() ) )  == 0) {
				conf = true;
				$('.presenca_opcao').append( '<div class="celulaGrande">'+
												'<div class="infoG alterar" id="'+userSelecao[i][0].idusuario+'">'+userSelecao[i][0].login+'</div>'+
												'<div class="infoValueM inputNovaSenha" id="_'+userSelecao[i][0].idusuario+'"></div></div>');	
			}
		}
		
		if (conf == false){
			$('.presenca_opcao').append('Nenhum Usuário encontrado!!');
		}
		
	});
	
});
