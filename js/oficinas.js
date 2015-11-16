var htmlContent = '';
var alunoVarObj = localStorage.objetoAlunoVariavel;
var alunoVar = parseInt(alunoVarObj.substring(19).split(",",1));
var listaOficinasAluno = [];
var listaIdOficinas = [];
var listaRotOficina = [];

function retornarOficinasAluno() {
	var htmlListaOficinas = '';

	$.ajax({
		url: path + "Oficina/ListarPorAluno/" + 678, //alunoVar,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function(){
			loading("inicial");
		},
		success: function(data) {
			htmlListaOficinas +=
			'<table>'+
				'<tr>';

			for ( i in data ) {
				listaOficinasAluno[i] = data[i];
				var nomeOficina = data[i].Nome.split(" ",1).toString()

				htmlListaOficinas += 
	        		'<td>'+
	        			'<div class="aba_oficina" onclick="alterarAba('+i+', \'Mat\', '+(parseInt(i)+1)+')">'+
	        				'<p class="barra_cor_of" style="background:'+data[i].CorForte+'">&nbsp;</p>'+
	        				'<p class="titulo_of">'+nomeOficina+'</p>'+
	        			'</div>'+
	        		'</td>';
			}

			htmlListaOficinas +=
				'</tr>'+
			'</table>';
		},
		complete: function(){
			loading("final");
		}
	});
	$("#lista_oficinas").html(htmlListaOficinas);
}

function retornarBlogOficina(indexOficina) {
/*
<div class="of_Qdr cx_left">
    <section class="Postagens_Container">
	    <article class="cx_postagem">
            <h1 class="cx_titulo">Visita ao catavento</h1>
            <h2 class="cx_info">11/11/2015 às 14:32</h2>
            <img src="img/dia_da_consciencia_negra.jpg" class="img_postagem" />
            <p class="cx_texto"></p>
            <hr class="fim_postagem" />
        </article>
    </section>
</div>
*/
	var htmlBlog = '';
	$.ajax({
		url: path + "Blog/BlogOficina/" + 17, //listaOficinasAluno[i].idOficina
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function() {
			loading("inicial");
		},
		success: function(d) {
			if ( d.length != 0 ) {
				htmlBlog +=
				'<section class="Postagens_Container">';

				for (var i in d) {
					htmlBlog +=
					'<article class="cx_postagem">'+
		        	    '<h1 class="cx_titulo">'+d[i].titulo+'</h1>'+
		        	    '<h2 class="cx_info">11/11/2015 às 14:32</h2>';

			        if ( d[i].imagem != null) {
			        	htmlBlog +=
		        	    '<img src="img/dia_da_consciencia_negra.jpg" class="img_postagem" />';
	        	    }
	        	    
	        	    htmlBlog +=
		        	    '<p class="cx_texto">'+d[i].descricao+'</p>'+
		        	    '<hr class="fim_postagem" />'+
		        	'</article>';
				}

				htmlBlog +=
				'</section>';
			}
		},
		complete: function(){
			loading("final");
		}
	});
	$('.cx_left').html(htmlBlog);
}

function alterarAba(index, abbr, idCor) {
	for ( a in listaOficinasAluno ) {
		if ( a == index ) {
			$.ajax({
				url: path + "ObjetivoAula/ListarPorOficinaHash/" + 2, //listaOficinasAluno[a].idOficina,
				async: false,
				type: "GET",
				crossDomain: true,
				beforeSend: function(){
					loading("inicial");
				},
				success: function(data) {
					var numRot = 1;
					for (var b in data) {

						listaRotOficina[b] = data[b];

						htmlContent +=
							'<div id="Oficina_Plan_Linha_'+numRot+'" class="Oficina_Plan_Linha">'+
		        	    	    '<div id="Oficina_Plan_Info_'+numRot+'" class="Oficina_Planejamento_Info OF_'+abbr+'_C_bg" onclick="acordeon('+(numRot-1)+')">'+
		        	    	    	'<div class="Oficina_Id_Roteiro">'+data[b].idRoteiro_aula+'</div>'+
		        	    	        '<div class="Oficina_Plan_Num OF_'+abbr+'_E_bg">'+numRot+'</div>'+
		        	    	        '<div class="Oficina_Plan_Nome">'+data[b].roteiro+'</div>'+
		        	    	    '</div>'+
		        	    	    '<div id="Oficina_Plan_Itens_'+numRot+'" class="Oficina_Plan_Itens">'+
		        	    	        '<div class="Oficina_Plan_Desc Oficina_Plan_Item">Descrição: '+data[b].descricao+'</div>';

			    	        // Recursos de aprendizagem: 
			    	        /*'<div class="Oficina_Plan_Recursos Oficina_Plan_Item">'+
			    	            '<div class="Oficina_Recurso Rec_Livro">Lorem ipsum dolor sit amet</div>'+
			    	            '<div class="Oficina_Recurso Rec_Video">Consectetur adipiscing elit</div>'+
			    	        '</div>'+*/

			        	    htmlContent +=
			        	    	    '</div>'+
			        	    	'</div>';
		        	    	numRot++;
		        	}
				},
				complete: function(){
					loading("final");
				}
			});
		}
	}

	$('.Acordeon_Oficina').html(htmlContent);
	htmlContent = '';

	var abas = $('.aba_oficina');
	var roteiros = $('.Oficina_Planejamento_Info');
	var roteirosNums = $('.Oficina_Plan_Num');

	for ( var i = 0; i < abas.length; i++ ) {
		if ( i == index ) {
			if ( !$($(abas).get(i)).hasClass('aba_ativa') ) {
				$($(abas).get(i)).addClass('aba_ativa');
				$(roteiros).attr('class', 'Oficina_Planejamento_Info OF_'+abbr+'_C_bg');
				$(roteirosNums).attr('class', 'Oficina_Plan_Num OF_'+abbr+'_E_bg');
			}
		} else {
			$($(abas).get(i)).removeClass('aba_ativa');
		}
	}
}

function acordeon(index) {
	var roteirosLista = $('.Oficina_Planejamento_Info');
	var htmlObjContent = '';
	var numObj = 0;

	

	for ( var i = 0; i < roteirosLista.length; i++ ) {
		if ( i == index ) {
			if ( $($('.Oficina_Plan_Itens').get(i)).hasClass('expandido') ) {
				$($('.Oficina_Plan_Itens').get(i)).slideUp();
				$($('.Oficina_Plan_Itens').get(i)).removeClass('expandido');
			} else {
				if ( !$($('.Oficina_Plan_Itens').get(i)).hasClass('ObjsListados') ) {
					for ( c in listaRotOficina) {

						// Seleciona o que foi clicado
						if ( c == index ) {

							// Faz uma requisição para retornar os objetivos daquele roteiro
							$.ajax({
						    	url: path + 'ObjetivoAula/ListarPorRoteiro/' + listaRotOficina[c].idRoteiro_aula,
						    	async: false,
						    	type: "GET",
						    	crossDomain: true,
						   		beforeSend: function(){
						   			loading("inicial");
						   		},
						    	success: function(dataObj) {
						    		for ( a in dataObj ) {
						    			var classObj;

						    			// Verifica o status do objetivo
							    		switch (dataObj[a].status) {
											case 0:
												classObj = '';
											break;
											
											case 1: 
												classObj = ' Aberto';
											break;

											case 2: 
												classObj = ' Entregue';
											break;
										}

										// Gera o código html para os objetivos
										htmlObjContent +=
										'<div class="Oficina_Plan_Item Oficina_Plan_Obj">Objetivo: '+
											dataObj[a].objetivo+
											'<div class="Oficina_Plan_Quadrado'+classObj+'">&nbsp;</div>'+
										'</div>';
										numObj++;
						    		}
						    	},
								complete: function(){
									loading("final");
								}
							});
						}
					}
					$('#Oficina_Plan_Itens_'+(index+1)).append(htmlObjContent);
					$($('.Oficina_Plan_Itens').get(i)).addClass('ObjsListados');
				}
				$($('.Oficina_Plan_Itens').get(i)).slideDown();
				$($('.Oficina_Plan_Itens').get(i)).addClass('expandido');
			}
		} else {
			$($('.Oficina_Plan_Itens').get(i)).slideUp();
			$($('.Oficina_Plan_Itens').get(i)).removeClass('expandido');
		}
	}
}

$(document).ready(function(){
	retornarBlogOficina(37);
	retornarOficinasAluno();
	alterarAba(0, 'Mat', 1);
})