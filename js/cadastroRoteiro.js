
// JavaScript Document
var ultimo_id;
var dataAnoEstudo = getData("AnoEstudo", null);
var dataRoteiro = getData("Roteiro", null);
var dataObjetivo = getData("Objetivo", null);
var dataAtividade = getData("Atividade", null);

var atvCount = 2;
var objCount = 1;

$(document).ready(function(){
	
	$('#cabecalho_roteiro').addClass('Item_Ativo');
	
	/*Function do accordion*/
	$('a.accordion').click(function(){
		$(this).parent().find('div.secao_cadastro').slideToggle("slow");
		$(this).closest('div.secao_bloco').attr('id') ;
	});
	
	/*lista anoEstudo e cadastra roteiros*/
    HtmlContent = ""; 
    for(var b=0;b<dataAnoEstudo.length; b++)
    {
        HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"'>"+(dataAnoEstudo[b].ano)+"º</option>";
    }

    //Carrega os selects com os anos!!!
    $('.anoEstudoRoteiro').html(HtmlContent);
    $("#anoEObj").html("<option value=''></option>"+HtmlContent);
	$("#anoEAtv").html("<option value=''></option>"+HtmlContent);	
	
	//Evento ao clicar no menu principal ('Inserir Roteiro', 'Pesquisa' e 'Atribuir Roteiro Extra')
	$('.Cabecalho_Roteiro_Item').click(function(){

		//Se o menu ativo já tiver a classe item_ativo não irá fazer nada
		if ($(this).hasClass('Item_Ativo')){
			return false;
		}
		
		aba = $(this).attr('aba');		//Pega o valor do atributo aba para utilizar posteriormente
		$('.Conteudo_Aba_Cabecalho').hide();	//Esconde a div visivel
		$('.Cabecalho_Roteiro_Item').removeClass('Item_Ativo'); //Remove todas as classes item Ativo do menu
		
		//Verifica o valor da variavel aba.
		
		if (aba == 'inserirRoteiro'){ //Se for inserirRoteiro limpa os campos, adiciona a classe item_ativo e manda exibir a div correspondente
			limparCamposRoteiro();
			$('#cabecalho_roteiro').addClass('Item_Ativo');
			$('#Roteiro').show();
			$('#Inserir_roteiroExtra').hide();
			return false;
			
		}else if (aba == 'pesquisa'){	//Se for pesquisa limpa os campo de pesquisa, adiciona a classe item_ativo e manda exibir a div correspondente
										//E carrega os roteiros de acordo com o ano selecionado no inbox.
			$('#cabecalho_pesquisa').addClass('Item_Ativo');
			$('#Pesquisar_Roteiro').val('');
			
			$('#Pesquisa').show();
			carregarPesquisaByAno($('#Input_Roteiro_Ano_Pesquisa').val());
			$('#Inserir_roteiroExtra').hide();
			return false;
			
		}else if (aba == 'atribuirRoteiro'){	//Se for para atrbuir roteiro extra, apenas adiciona a classe e exibe a div. 
			$('#cabecalho_roteiroExtra').addClass('Item_Ativo');
			$('#RoteiroExtra').show();
			$('#Inserir_roteiroExtra').show();
			return false;
		}
	})
	
	//Evento ao digitar algo no campo de pesquisa de roteiros
	$('#Pesquisar_Roteiro').keyup(function(){
		
		texto = $(this).val().toUpperCase();	//Tranforma tudo em maiusculo.
		$('.roteiro_nenhum').css('display','none');
		contRoteiros = 0;	//variavel contadora
		
		//Se houver um texto digitado
		if (texto != ''){
			
			//Percorre todas as linhas dos roteiros
			$('.roteiro_listado').each(function(){

				id = $(this).attr('idRoteiro');//Pega o id atual
				//Verifica se o texto da div com o nome do roteiro é diferente do texto digitado
				if($('#nome_roteiro_listado_'+id).text().toUpperCase().indexOf(texto)==-1) {
					$('#roteiro'+id).css('display','none');	//Se diferente, esconde a linha
				} else {
					$('#roteiro'+id).css('display','block'); //Se encontrado, exibe a linha e acresenta 1 na var contadora
					contRoteiros++;
				}
			});//Fim do laço
			
		}else{
			//Se não tiver texto para pesquisar lista todos e deixa a variavel contadora diferente de 0
			$('.roteiro_listado').css('display','block');
			contRoteiros++;
		}
		
		//Se a variavel contadora for igual a 0 exibe uma div com a mensagem dizendo não ter nenhum resultado
		if (contRoteiros == 0) $('.roteiro_nenhum').css('display','block');
		return false;
	})
	
	//Evento ao mudar select da pesquisa dos roteiros
	$('#Input_Roteiro_Ano_Pesquisa').change(function(){
		$('#Pesquisar_Roteiro').val('');	//Zera o input text e chama a função para listar os roteiros referentes ao ano
		carregarPesquisaByAno($('#Input_Roteiro_Ano_Pesquisa').val());	
		return false;
	})

	//Lista os objetivos de um roteiro ao clicar na linha correspondente
	$('body').delegate('.roteiro_listado', 'click', function(){
		
		idRoteiro = $(this).attr('idRoteiro');	//Pega o idRoteiro
		$('.Roteiro_Listado_Btns').show();		//Lista todos os botões
		
		$('.spanObjetivo').css('display','none');	//Esconde as divs das atividades que não devem aparecer 
	
		//Verifica se a div clicada está visivel, se sim apenas esconde todas as divs
		
		if ($('#objetivosRoteiro'+idRoteiro).hasClass('Atvs_Expandido')) {
			$('.Objetivos_Lista').removeClass('Atvs_Expandido').css('height','0px');
			return false;
		}
		
		$('#Roteiro_Listado_Btns'+idRoteiro).hide();
		
		//Esconde todas as divs para mostrar a div com os objetivos corretos
		$('.Objetivos_Lista').removeClass('Atvs_Expandido').css('height','0px');
		
		//Depois...
		//Verifica se a a linha já foi clicada alguma vez, se sim, faz apenas os procedimentos para mostrar a div no tamanho certo  
		if ($('#objetivosRoteiro'+idRoteiro).hasClass('clicado')) {			
			tamanhoDiv = $('.objetivoRoteiro'+idRoteiro).length * 33;
			$('#objetivosRoteiro'+idRoteiro).addClass('Atvs_Expandido').css('height',tamanhoDiv+'px');
			return false;
		}
		
		
		
		//Lista os objetivos do roteiro.
		listarObjetivos(idRoteiro);
		
		return false;
		
	});	
		
	
	$('body').delegate('.Btn_AddAtv_Obj'	, 'click', function(){
		
		idObjetivo = $(this).attr('idObjetivo');
		idRoteiro = $(this).attr('idRoteiro');
		
		//Verifica se a classe existe para o objetivo que deverá ser adicionado a atividade
		if (!$('#spanObjetivo'+idObjetivo).hasClass('clicado')){
			//Se não existir. ele chama a função para listar as atividades para saber quantas atividades já existem...
			listarAtividades(idObjetivo, idRoteiro);
		}
		//...Esconde todas as atividades
		esconderAtividades(idObjetivo);
		
		num = $('#spanObjetivo'+idObjetivo+' .Atv_Obj_Info:not(.Vazio)').length + 1;

		//Monta Html para exibir o modal.
		var trechoFormAtv = 
			'<div class="box_mensagem_atividades">'+
				'<div class="txt_mensagem">'+
					'<div class="Item_Roteiro_Linha No_Padding_Itens">'+
						'<div class="Roteiro_Col_2">'+
							'<div id="Atividade_Nome_Info_" class="Input_Info Atividade_Nome_Info">Atividade</div>'+
						'</div>'+
						'<div class="Roteiro_Col_10">'+
							'<input type="hidden" class="idAtv"></input>'+
							'<input class="Input_Area nomeAtv_edt" id="nomeAtv_edt" placeholder="Título da atividade" required value=""></input>'+
						'</div>'+
					'</div>'+
					'<div class="Item_Roteiro_Linha">'+
						'<div class="Roteiro_Col_4">'+
							'<div class="Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_6">'+
									'<div class="Atividade_Info Input_Info numeroAtvInfo">Número</div>'+
								'</div>'+
								'<div class="Roteiro_Col_6">'+
									'<div class="Atividade_Input valueNumero"><input class="Input_Area numeroAtv" readonly id="numeroAtv_edt" value="'+num+'" readonly></input></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="Roteiro_Col_4">'+
							'<div class="Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_6">'+
									'<div class="Atividade_Info Input_Info"> Página Livro</div>'+
								'</div>'+
								'<div class="Roteiro_Col_6">'+
									'<div class="Atividade_Input"><input class="Input_Area paginaAtv" id="paginaAtv_edt" value=""></input></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="Roteiro_Col_4">'+
							'<div class="Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_6">'+
									'<div class="Atividade_Info Input_Info"> Livro </div>'+
								'</div>'+
								'<div class="Roteiro_Col_6">'+
									'<div class="Atividade_Input"><input class="Input_Area livroAtv" id="livroAtv_edt" value=""></input></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="btn_mensagemEditAtividades" style="margin:25px 188px">'+
						'<input type="hidden" id="objetivoAtv_edt" name="objetivoAtv_edt" value="'+idObjetivo+'"/>'+
						'<input type="hidden" id="roteiro_hide" name="roteiro_hide" value="'+idRoteiro+'"/>'+
						'<input type="button" class="bt_ok left" value="OK" onclick="cadastrarAtividade()"/>'+
						'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
					'</div>'+
				'</div>'+
			'</div>';
		
		//Coloca o html no modal e manda exibi-lo
		$('#boxModal').html(trechoFormAtv).css('display','block');
		return false;
	})
	
	
	
	
	//Procedimentos para listar as atividades de cada objetivo.
	$('body').delegate('.Obj_Inserido_Nome', 'click', function(){

		//Salva os ids em variaveis
		idObjetivo = $(this).parent().parent().attr('idObjetivo');
		idRoteiro = $(this).parent().parent().attr('idRoteiro');
		
		//Chama a função para listar as atividades
		listarAtividades(idObjetivo, idRoteiro);
	})
	
	//Monta o modal para adicionar um objetivo a um roteiro já existente
	$('body').delegate('.Roteiro_Listado_Add', 'click', function(){
		idRoteiro = $(this).attr('idRoteiro');
		
		//Verifica se os dados do roteiro ja foram carregados
		console.log('c');
		if (!$('#objetivosRoteiro'+idRoteiro).hasClass('clicado')) {
			//Se não, lista os objetivos para conseguir 
			listarObjetivos(idRoteiro);
			$('#objetivosRoteiro'+idRoteiro).removeClass('Atvs_Expandido').css('height','0px');
		}
		//Pega o proximo numero a ser exibido
		num = $('.objetivoRoteiro'+idRoteiro).length + 1;
		
		//Monta o hrtml do modal.
		HtmlContent = 
			'<div class="box_mensagem_rotcad">'+
				'<div class="txt_mensagem">'+
					'<div class="Roteiro_Col_4" style="width: 53.33%;">'+
						'<div class="Roteiro_Linha No_Padding_Itens">'+
							'<div class="Roteiro_Col_4">'+
								'<div class="Input_Info">Objetivo</div>'+
							'</div>'+
							'<div class="Roteiro_Col_6">'+
								'<input id="Input_Objetivo_Nome" class="Input_Area" placeholder="Nome do objetivo" required="" value="">'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<br>'+
					'<br>'+
					'<div class="Item_Roteiro_Linha No_Padding_Itens">'+
						'<div class="Roteiro_Col_2">'+
							'<div class="Input_Info">Número</div>'+
						'</div>'+
						'<div class="Roteiro_Col_10">'+                     
							'<input type="hidden" id="idRoteiro" value="'+idRoteiro+'">'+
							'<input id="Input_Numero_Obj" class="Input_Area" required="" value="'+num+'" readonly>'+
						'</div>'+
					'</div>'+												
				'</div>'+
				'<div class="btn_mensagemCad" style="margin: 66px 199px">'+
					'<input type="button" class="bt_ok left" value="OK" onclick="criarObjetivoExtra()"/>'+
					'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
				'</div>'+
			'</div>';
		
		//Coloca o html no modal e deixa visivel.
		$('#boxModal').html(HtmlContent).css('display','block');
		return false;
	})	

	//Evento quando clicar no botão para editar um roteiro
	$('body').delegate('.Roteiro_Listado_Edit', 'click', function(){
		
		//Pega o id do roteiro
		idRoteiro = $(this).attr('idRoteiro');

		//Ajax para buscar os dados do roteiro.
		$.ajax({
			url: path+"Roteiro/"+idRoteiro,
			type: "GET",
			success: function(d) {
				//monta o html
				HtmlContent = 
					'<div class="box_mensagem_rotcad">'+
						'<div class="txt_mensagem">'+
							'<div class="Roteiro_Col_4" style="width: 53.33%;">'+
								'<div class="Roteiro_Linha No_Padding_Itens">'+
									'<div class="Roteiro_Col_4">'+
										'<div class="Ano_Inserir_Info Input_Info">Ano estudo</div>'+
									'</div>'+
									'<div class="Roteiro_Col_6">'+
										'<div class="Ano_Inserir_Select" id="valueAnoE">'+
											'<select id="Input_Roteiro_Ano_edt" class="anoEstudoRoteiro Input_Area"></select>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<br>'+
							'<br>'+
							'<div class="Item_Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_2">'+
									'<div class="Input_Info">Roteiro</div>'+
								'</div>'+
								'<div class="Roteiro_Col_10">'+                     
									'<input type="hidden" id="id">'+
									'<input id="Input_Roteiro_Nome_edt" class="Input_Area" placeholder="Nome do roteiro" required="" value="'+d.nome+'">'+
								'</div>'+
							'</div>'+												
						'</div>'+
						'<div class="btn_mensagemCad" style="margin: 66px 199px">'+
							'<input type="button" class="bt_ok left" value="OK" onclick="EditarRoteiroLista('+idRoteiro+')"/>'+
							'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
						'</div>'+
					'</div>';
				
				//Habiliita o modal com o html criado
				$('#boxModal').html(HtmlContent).css('display','block');
				
				//Seta o valor do select e esconde o campo em branco que é criado na função.
				$('#Input_Roteiro_Ano_edt').html(carregaAno(d.anoEstudo.idanoEstudo));
				$('#Input_Roteiro_Ano_edt option').eq(0).hide();
				
			}
		});
		
				
	return false
	})
		
	//Evento para excluir um roteiro
	$('body').delegate('.Roteiro_Listado_Del', 'click', function(){
		
		//Pega o id do roteiro
		idRoteiro = $(this).attr('idRoteiro');

		//Ajax para excluir
		$.ajax({
			url: path+'Roteiro/InativarRoteiro/'+idRoteiro,
			type: "GET",
			async:false,
			crossDomain: true,
			beforeSend: function(){		
				loading("inicial");
			},success: function(d) {
				//Esconde a div do roteiro e a div com seus objetivos
				$('#objetivosRoteiro'+idRoteiro).hide();
				$('#roteiro'+idRoteiro).hide();
			},complete: function(){
				loading("final");	
			},error: function() {
				retorno = "erro";
			}
		});
		return false
	})
	
	//Montao html da edição do objetivo na página de pesquisa
    $('body').delegate('.Btn_Editar_Obj_Pesq', 'click', function(){

    	//Pega o id do roteiro e do objetivo
		idRoteiro = $(this).attr('idRoteiro');
		idObjetivo = $(this).attr('idObjetivo');
		
		var HtmlContent;
	  	var objetivoNome = $('#Obj_Inserido_Nome_'+idObjetivo).text();
	  	var objetivoNumero = $('#Obj_Inserido_Num_'+idObjetivo).text();
	  	
	  	//Objeto com as propriedades do objetivo a ser inserido	
	  	HtmlContent = '<div class="box_mensagem_rotcad">'+
  					'<div class="txt_mensagem">'+
  						'<div class="Roteiro_Linha">'+
  							'<div class="Roteiro_Col_8" style="width:100%;">'+
  								'<div class="Roteiro_Linha No_Padding_Itens">'+
  									'<div class="Roteiro_Col_3">'+
  										'<input type="hidden" class="idObj"> </input>'+
  										'<div id="Nome_Objetivo1" class="Nome_Objetivo_Info Input_Info">Objetivo</div>'+
  									'</div>'+
  									'<div class="Roteiro_Col_9">'+
  										'<input id="nomeObj_edt" name="nomeObj" class="Input_Area nomeObj Nome_Objetivo_Input" value="'+objetivoNome+'" required > </input>'+
  									'</div>'+
  								'</div>'+
  							'</div>'+
  							'<div class="celulaGrande" style="width: 49.3%;">'+
  								'<div class="Roteiro_Linha No_Padding_Itens">'+
  									'<div class="Roteiro_Col_6">'+
  										'<div class="Input_Info Numero_Objetivo_Info">Número</div>'+
  									'</div>'+
  									'<div class="Roteiro_Col_6">'+
  										'<input type="text" class="Input_Area Numero_Objetivo_Input numeroObj" readonly id="numeroObj_edt" value="'+objetivoNumero+'"></input>'+
  									'</div>'+
  								'</div>'+
  							'</div>'+
  						'</div>'+
  						'<div class="btn_mensagemCad" style="margin: 25px 199px">'+
  							'<input type="button" class="bt_ok left" value="OK" onclick="editarObjetivo('+idObjetivo+','+idRoteiro+','+objetivoNumero+')"/>'+
  							'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
  						'</div>'+
  					'</div>'+
  				'</div>';		

	  	$('#boxModal').html(HtmlContent).css('display','block');
	  	return false;
  	})
  
	/* Selecionando item dos menus */
	$("body").on("click", ".item", function(){
		$(".item").removeClass("selecionado");
		$(this).addClass("selecionado");
	});
	
	/* Hover do botão inserir atividade */
	$("#inserir_atividade").hover(function(){
		$("#over_inserir").css("opacity", "1");
	}, function(){
		$("#over_inserir").css("opacity", "0")
	});
		
	$("#inserir_atividade").click(function(){
		$("#separador").append(
		"<input id='nomeAtv' name='novaAtividade' placeholder='Atividade'> </div>")
	});

	$.ajax({
	   type: "GET",
	   crossDomain: true,
	   url: path+"AlunoVariavel/listar/1"           
	}).then(function(data) {
		var aluSelecao=[[]];
		$("#alunos_listados").empty();	
		//lista todos os alunos
		for(var i = 0; i < data.length;i++){
			if(data[i].aluno != null){
								
				$('#alunos_listados').append('<div class="box_item_aluno">'+
					'<div class="item" onclick="abreCombo(\'lista_combo_'+data[i].idalunoVariavel+'\',\''+data[i].anoEstudo.idanoEstudo+'\');">'+
						'<div class="titulo_objetivo">'+data[i].aluno.nome+'</div>'+
					'</div>'+                                            
					'<div class="lista_combo" id="lista_combo_'+data[i].idalunoVariavel+'">'+
						'<div class="celulaPequena rightMargin">'+
							'<div class="infoP"> Ano estudo </div>'+
							'<div class="infoValueP">'+
								'<div class="anoEstudoValor styled-select" >'+
									//'<input value="'+ano+'" type="text" class="anoEstudo" readonly id="ano_'+data[i].idalunoVariavel+'" value="" >'+
									'<select class="anoEstudo" name="ano_'+data[i].idalunoVariavel+'" id="ano_'+data[i].idalunoVariavel+'" onchange="listaRoteiroMultiplaEscolhas(\'ano_'+data[i].idalunoVariavel+'\',\'roteiro_'+data[i].idalunoVariavel+'\',\''+data[i].aluno.idAluno+'\')"></select>'+
								'</div>'+
							'</div>'+
						'</div>'+                   
						'<div class="celulaMedia">'+
							'<div class="infoM"> Motivo </div>'+
							'<div class="infoValueM">'+
								'<input type="text" class="" name="motivo'+data[i].idalunoVariavel+'" id="motivo'+data[i].idalunoVariavel+'" >'+
							'</div>'+
						'</div>'+
						'<div class="celulaGrande">'+
							'<div class="infoP" style="width: 14.5%"> Roteiro </div>'+
							'<div class="infoValueG">'+
								'<div id="roteiro_'+data[i].idalunoVariavel+'">'+
							'</div>'+
						'</div>'+
					'</div>'+
						//Botão enviar carrega o id do aluno variavel, id do aluno e o id do ano letivo
						'<div class="btnAtribuirRoteiro" idVar="'+data[i].idalunoVariavel+'" id="'+data[i].aluno.idAluno+'" anoLetivo="'+data[i].anoLetivo.idanoLetivo+'"> Salvar </div>'+
					'</div>'+
				'</div>');
			}	
			
			aluSelecao[i]=[];
			aluSelecao[i][0]=data[i];
			aluSelecao[i][1]=0;
		}
		
		var texto;
		
		//Mesmo procedimento anterior ocorre ao pesquisar um aluno, Deve ser alterado de forma semelhante mudando apenas o nome das variaveis
		$("#pesquisaAluno").keyup(function(){

			aux = [];
			texto = $( "#pesquisaAluno" ).val();
			//Seleciona alunos e coloca no aux e depois no aluSelecao
			for(var i = 0; i < aluSelecao.length;i++){
				if( ( (aluSelecao[i][0].aluno.nome).toLowerCase() ).search( (texto.toLowerCase() ) )  == 0) {
					aux[aux.length]=[];
					aux[aux.length-1][0]=aluSelecao[i][0];
					aux[aux.length-1][1]=aluSelecao[i][1];
				}
			}

			$("#alunos_listados").empty();
			for(var i = 0; i < aux.length;i++){

				$('#alunos_listados').append('<div class="box_item_aluno">'+ 
						'<div class="item" onclick="abreCombo(\'lista_combo_'+aux[i][0].idalunoVariavel+'\',\''+aux[i][0].anoEstudo.idanoEstudo+'\');">'+
							'<div class="titulo_objetivo">'+aux[i][0].aluno.nome+'</div>'+
						'</div>'+                                            
						'<div class="lista_combo" id="lista_combo_'+aux[i][0].idalunoVariavel+'">'+
							'<div class="celulaPequena rightMargin">'+
								'<div class="infoP"> Ano estudo </div>'+
								'<div class="infoValueP">'+
									'<div class="anoEstudoValor styled-select" >'+
										'<select class="anoEstudo" name="ano_'+aux[i][0].idalunoVariavel+'" id="ano_'+aux[i][0].idalunoVariavel+'" onchange="listaRoteiroMultiplaEscolhas(\'ano_'+aux[i][0].idalunoVariavel+'\',\'roteiro_'+aux[i][0].idalunoVariavel+'\',\''+aux[i][0].aluno.idAluno+'\')"></select>'+
									'</div>'+
								'</div>'+
							'</div>'+                   
							'<div class="celulaMedia">'+
								'<div class="infoM"> Motivo </div>'+
								'<div class="infoValueM">'+
									'<input type="text" class="" name="motivo'+aux[i][0].idalunoVariavel+'" id="motivo'+aux[i][0].idalunoVariavel+'" >'+
								'</div>'+
							'</div>'+
							'<div class="celulaGrande">'+
								'<div class="infoP" style="width: 14.5%"> Roteiro </div>'+
								'<div class="infoValueG">'+
									'<div id="roteiro_'+aux[i][0].idalunoVariavel+'">'+
								'</div>'+
							'</div>'+
						'</div>'+
							'<div class="btnAtribuirRoteiro" idVar="'+aux[i][0].idalunoVariavel+'" id="'+aux[i][0].aluno.idAluno+'" anoLetivo="'+data[i].anoLetivo.idanoLetivo+'"> Salvar </div>'+
						'</div>'+
					'</div>');
					
				}
		});
	});
	
	//Salvar roteiro extra
	$("body").delegate(".btnAtribuirRoteiro", "click", function() {

		//Cria as variaveis
		var id = $(this).attr('id');
		var ano = $(this).attr('anoLetivo');
		var idVar = $(this).attr('idVar');
		var motivo = $('#motivo'+idVar).val();
		var data = new Date();
		var conf = false;
		//Salva os valores fixos a serem enviados
		var valores = 'idaluno='+id+'&motivo='+motivo+'&idano_letivo='+ano;

		var valoresEnviar = '';
		var action = 'AtribuicaoRoteiroExtra';
		
		//Percorre apenas as opções do roteiro referentes
		$('.op_roteiro_'+idVar).each(function(){
			
			//Se tiver a classe checado....
			if($(this).hasClass('checado') == true){
				//Concatena os valores fixo com o valor do roteiro
				valoresEnviar = valores+'&idroteiro='+$(this).attr('name');
				//E salva no banco
				if (setCreateData('AtribuicaoRoteiroExtra/',valoresEnviar) != 'erro'){
					//Muda o valor da var conf
					conf = true;
					//remove a linha adicionada 
					var i = $(this).attr('id');
					$('.'+i).remove();
				}
			}

		});

		//Verifica através da var conf se houve sucesso nos cadastros e exibe uma mensagem!!
		if (conf == false) {
			mensagem("Por favor, selecione um roteiro!","OK","bt_ok","erro");
		}else{
			mensagem("Roteiros adicionados com sucesso!","OK","bt_ok","sucesso");
		}

		
		return false;
	});
	
	
	/*Cadastro Roteiro*/
	botaoEditarRoteiro();	
	$('#Btn_Del_Rot_1').click(function(){
		var idRoteiro = $('#id').val();
		mensagem("Deseja realmente excluir?","Cancelar","bt_cancelar","confirm","Roteiro",idRoteiro,"excluirRoteiro");
	});	
	
});

function abreCombo(item_linha, ano){
	
	$("#"+item_linha).toggle();
	
	//Se a div estiver visivel, as opções no select e esconde o ano do aluno
	if ($('#'+item_linha).css('display') == 'block'){
		var id = item_linha.replace(/[^0-9]+/g,'');
		$('#ano_'+id).html("<option value=''></option>"+HtmlContent);
		$('#ano_'+id+' option[value='+ano+']').hide();
	}
	
	return false;
}

/*-------------------------------------------ROTEIROS-------------------------------------------------------*/
function botaoEditarRoteiro(){
	var contador=1;
	$('#Btn_Editar_Rot_1').click(function(){	//Função para editar roteiro recém criado
		var idRoteiro = $('#id').val();
		var HtmlContent;
		HtmlContent = '<div class="box_mensagem_rotcad">'+
						'<div class="txt_mensagem">'+
							'<div class="Roteiro_Col_4" style="width: 53.33%;">'+
								'<div class="Roteiro_Linha No_Padding_Itens">'+
									'<div class="Roteiro_Col_4">'+
										'<div class="Ano_Inserir_Info Input_Info">Ano estudo</div>'+
									'</div>'+
									'<div class="Roteiro_Col_6">'+
										'<div class="Ano_Inserir_Select" id="valueAnoE">'+
											'<select id="Input_Roteiro_Ano_edt" class="anoEstudoRoteiro Input_Area"></select>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<br>'+
							'<br>'+
							'<div class="Item_Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_2">'+
									'<div class="Input_Info">Roteiro</div>'+
								'</div>'+
								'<div class="Roteiro_Col_10">'+                     
									'<input type="hidden" id="id">'+
									'<input id="Input_Roteiro_Nome_edt" class="Input_Area" placeholder="Nome do roteiro" required="">'+
								'</div>'+
							'</div>'+												
						'</div>'+
						'<div class="btn_mensagemCad" style="margin: 66px 199px">'+
							'<input type="button" class="bt_ok left" value="OK" onclick="EditarRoteiro('+idRoteiro+')"/>'+
							'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
						'</div>'+
					'</div>';
		
		$('#boxModal').html(HtmlContent).css('display','block');
		window.setTimeout(function(){
			$('#id').val(idRoteiro);			
			var anoEditar,roteiroNome;
			
			if(contador==1){
				roteiroNome = $('#Input_Roteiro_Nome').val();
				anoEditar = $("#Input_Roteiro_Ano :selected").val();				
				$('#Input_Roteiro_Nome_edt').val(roteiroNome);
				$('#Input_Roteiro_Ano_edt').html(carregaAno(anoEditar));				
				contador++;	
			}else{
				roteiroNome = $('#roteiroNomeEditado').val();
				anoEditar = $("#anoEditado").val();				
				$('#Input_Roteiro_Nome_edt').val(roteiroNome);
				$('#Input_Roteiro_Ano_edt').html(carregaAno(anoEditar));
			}
		},10);
	});
}

function listaRoteiroMultiplaEscolhas(anoEstudo,comboRoteiro,idAluno){
	
	//Retira ano_ da variavel 'anoEstudo' e coloca lista_combo_
	var idCombo =  "lista_combo_"+anoEstudo.substring(4);

	//Pega o valor do input com o ano do estudo
	var anoEstudo = $("#"+anoEstudo).val();
	
	//Busca os roteiros que podem ser atribuidos ao aluno (apenas os roteiros do ano seguinte)
	var dataRoteiroAno = getData("Roteiro/RoteiroAno", anoEstudo);
	
	//Cria o Html com os selects
	HtmlContentR = '<div class="multiselect">';
	HtmlContentR += '<div class="selectBox  styled-select" onclick="showCheckboxes(\'check_'+comboRoteiro+'\')" name="ok">';
	HtmlContentR += '<select>'
	HtmlContentR += '<option>Selecione um roteiro</option>';
	HtmlContentR += '</select>';
	HtmlContentR += '<div class="overSelect"></div>';
	HtmlContentR += '</div>';
	HtmlContentR += '<div class="checkboxes check_'+comboRoteiro+'">';

	//variavel para contar quantos roteiros estão disponiveis
	var cont = 0;

	//Passa por todos os roteiros...
	for(var a=0;a<dataRoteiroAno.length; a++){
		//e verifica se não está atribuido ao aluno
		if(VerificaAtribuicaoRoteiroExtra(idAluno, dataRoteiroAno[a].idroteiro)==0){
			//Se não tiver, adiciona ele no html!!
			HtmlContentR += '<label class="'+comboRoteiro+'_'+dataRoteiroAno[a].idroteiro+'" for="'+comboRoteiro+'_'+dataRoteiroAno[a].idroteiro+'"><input type="checkbox" id="'+comboRoteiro+'_'+dataRoteiroAno[a].idroteiro+'" name="'+dataRoteiroAno[a].idroteiro+'" class="op op_'+comboRoteiro+'"/>'+dataRoteiroAno[a].nome+'</label>';
			cont++;
		}
	}
	
	HtmlContentR += '</div>';
	HtmlContentR += '</div>';
	if (cont > 0){
		$('#'+comboRoteiro).html(HtmlContentR);
	}else $('#'+comboRoteiro).html('<div class="celulaGrande"><div class="infoTotal"> Nenhum roteiro disponível!!</div></div>');
	
	return false;
}

// Inserir Roteiro
function inserirRoteiro () {
	var anoRoteiro = $("#Input_Roteiro_Ano :selected").html();
	var anoEstudo = $("#Input_Roteiro_Ano").val();
	var nomeRoteiro = $("#Input_Roteiro_Nome").val();
	
	if (anoEstudo == '' || nomeRoteiro == '')
		return mensagem("Todos os campos são obrigatórios!","OK","bt_ok","erro");
		
	$("#Roteiro_Inserido_Container").show();
	$("#Rot_Inserido_Info .Rot_Inserido_Ano").html(anoRoteiro+' ano | ');
	$("#Rot_Inserido_Info .Rot_Inserido_Nome").html(nomeRoteiro);
	$("#Inserir_roteiro").hide();
	$("#Roteiro_Inserido").show();
	$("#btnInserirRoteiro").hide();
	$("#btnSalvarObj").show();
	botaoEditarRoteiro();
	var idRoteiro = criarRoteiro(anoEstudo,nomeRoteiro,"");
	$('#id').val(idRoteiro);
}

/*Function para cadastrar roteiro*/
function criarRoteiro(anoEstudo,nome,descricao){
	var retorno;
	var status;
	var valores = "action=create&nome="+nome+"&descricao="+descricao+"&anoEstudo="+anoEstudo+"&ativo=1";
	
	retorno = setCreateDataRoteiro("Roteiro",valores);
	$('#idRoteiro').val(retorno);
	if(retorno != "erro"){
		mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		status = retorno;		
	}else{
		mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
		status = "erro";
	}
	return status;
}

/*Function base para criar registro*/
function setCreateDataRoteiro(Tabela,Valores){	
	var retorno;
	$.ajax({
		url: path+Tabela,
		type: "POST",
		async:false,
		crossDomain: true,
		data: Valores,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			retorno = d;
		},complete: function(){
			loading("final");	
		},error: function() {
			retorno = "erro";
		}
	});
	return retorno;
}

//Edita o roteiro que acabou de ser cadastrado
function EditarRoteiro(idRoteiro){	
	var anoEstudo = $("#Input_Roteiro_Ano_edt").val();
	var anoEstudoTexto = $("#Input_Roteiro_Ano_edt :selected").html();
	var nome = $("#Input_Roteiro_Nome_edt").val();

	if (nome == ''){
		mensagem("Todos os campos são obrigatórios!","OK","bt_ok","erro");
		return false;
	}
	
	$('#Input_Roteiro_Ano_edt').html(carregaAno(anoEstudo));
	$("#Input_Roteiro_Nome_edt").val(nome);
	
	$('#boxModal').css('display','none');
	$.ajax({
		url: path+"Roteiro",
		type: "POST",
		data: "action=update&nome="+nome+"&descricao=&anoEstudo="+anoEstudo+"&ativo=1&id="+idRoteiro,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			$("#Rot_Inserido_Info .Rot_Inserido_Ano").html(anoEstudoTexto+' ano | ');
			$("#Rot_Inserido_Info .Rot_Inserido_Nome").html(nome);
			$("#Input_Roteiro_Nome_edt").val(nome);	
			$("#anoEditado").val(anoEstudo);	
			$('#roteiroNomeEditado').val(nome);				
			mensagem("Roteiro alterado com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		}
	});
}



//Edita oroteiro que está na lista das pesquisas....
//Diferente os campos que serão editados automaticamente
function EditarRoteiroLista(idRoteiro){	
	var anoEstudo = $("#Input_Roteiro_Ano_edt").val();
	var anoEstudoTexto = $("#Input_Roteiro_Ano_edt :selected").html();
	var nome = $("#Input_Roteiro_Nome_edt").val();
		
	if (nome == ''){
		mensagem("Todos os campos são obrigatórios!","OK","bt_ok","erro");
		return false;
	}
	
	//Verifica se realmente foi mudado alguma coisa para não chamar serviços atoa
	if (($('#Input_Roteiro_Ano_Pesquisa').val() == anoEstudo) && $('#nome_roteiro_listado_'+idRoteiro).text() == nome){
		mensagem("Roteiro alterado com sucesso!","OK","bt_ok","sucesso");
		fecharBoxModal();
		return false;
	}
	
	$('#boxModal').css('display','none');
	$.ajax({
		url: path+"Roteiro",
		type: "POST",
		data: "action=update&nome="+nome+"&descricao=&anoEstudo="+anoEstudo+"&ativo=1&id="+idRoteiro,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {

			//Se mudar de classe esconde
			if ($('#Input_Roteiro_Ano_Pesquisa').val() != anoEstudo){
				
				$('#roteiro'+idRoteiro).hide();
				$('#objetivosRoteiro'+idRoteiro).hide();
				//tamanhoDiv = $('.objetivoRoteiro'+idRoteiro).length * 33;
				//$('#objetivosRoteiro'+idRoteiro).removeClass('Atvs_Expandido').css('height',tamanhoDiv+'px');
			}else{
				$('#nome_roteiro_listado_'+idRoteiro).html(nome);
			}
			mensagem("Roteiro alterado com sucesso!","OK","bt_ok","sucesso");
			fecharBoxModal();
		},complete: function(){
			loading("final");	
		}
	});
}


  
function fecharBoxModal(){
	$('#boxModal').css('display','none');
}

function carregaAno(anoParaEditar){
	Html = "<option value=''></option>"; 
	var selecionado = "";

    for(var b=0;b<dataAnoEstudo.length; b++)
    {
		if(anoParaEditar == dataAnoEstudo[b].idanoEstudo){	
			selecionado = 'selected';	
		}else{
			selecionado = '';
		}
        Html += "<option value='"+dataAnoEstudo[b].idanoEstudo+"' "+selecionado+" >"+(dataAnoEstudo[b].ano)+"º</option>";
    }	
    
	return Html
}

function confereLinhasObj() {
	if (numLinhas.length > 0) {
		$("#Objetivos_Inseridos").show();
	}
}

// Inserir Objetivo
function inserirObjetivoAtividade() {
	
	var atividadesCont = $('.Atividade_Linha');		//Contagem de quantos campos de atividade existem no formulário
	var atividadesLista = [];						//Matriz com todos os atributos referentes às atividades do objetivo
	
	if ($(".Nome_Objetivo_Input").val() == ''){
		$(".Nome_Objetivo_Input").focus();
		return mensagem("O campo objetivo é obrigatório!","OK","bt_ok","erro");
	}
	
	cont = 1;
	var erroAtv = false;
	
	for ( var i = 0; i < atividadesCont.length; i++ ) { //Verificação para ver se as atividades estão salvas de maneira correta.

		//Primeiro verifica se todos os campos estão vazios, se estiver, não precisa salvar
		if($(".nomeAtv").eq(i).val() == "" && $(".livroAtv").eq(i).val() == "" && $(".paginaAtv").eq(i).val() == ""){
		
			$('.Atividade_Linha').eq(i).hide();//apenas escondo a div para depois excluir. Excluir agora atrapalha o resultado do for  
		
		}else{	//Veriica se um cmapo esta em vazio de forma incorreta. 
			if($(".nomeAtv").eq(i).val() == "" || $(".livroAtv").eq(i).val() == "" || $(".paginaAtv").eq(i).val() == ""){
				erroAtv = true;
			}
		}
	}
	
	//Remove as divs com campos que não precisarão ser salvos
	$('.Atividade_Linha').each(function(){
		if (!($(this).is(':visible'))) {
			$(this).remove();
		}
	})
	
	//Enumera corretamente as atividades restantes
	$('.numeroAtv').each(function(){
		$(this).val(cont);
		cont++;
	})
	
	atvCount = cont; //seta o valor da atvCount de acordo com a quantidade de atividades.
	
	if (erroAtv == true){
		return mensagem("Os campos título da atividade, e informações do livro são obrigatórios! Se não tiver o interesse de cadastrar, deixar todos os campos vazios de uma atividade.","OK","bt_ok","alerta");
	}
	//Seta um novo valor na variavel para verificar se estão corretos.
	var atividadesCont = $('.Atividade_Linha');		//Contagem de quantos campos de atividade existem no formulário após excluir os inválidos
	
	var objetivo = { 								//Objeto com as propriedades do objetivo a ser inserido
		nome: $(".Nome_Objetivo_Input").val(),
		numero: $(".Numero_Objetivo_Input").val()
	}; 
	
	var roteiro = $('#id').val();
	var idObjetivo = criarObjetivo(objetivo.nome,objetivo.numero,"",roteiro);	
	
	if (atividadesCont.length > 0){
		for ( var i = 0; i < atividadesCont.length; i++ ) {		
				var idAtividade = criarAtividade($($(".nomeAtv").get(i)).val(),$($(".numeroAtv").get(i)).val(),"",idObjetivo,$($(".paginaAtv").get(i)).val(),$($(".livroAtv").get(i)).val());	
				atividadesLista[i] = {
					numero: $($(".numeroAtv").get(i)).val(),
					nome: $($(".nomeAtv").get(i)).val(),
					livro: $($(".livroAtv").get(i)).val(),
					pagLivro: $($(".paginaAtv").get(i)).val(),
					atividadeId: idAtividade
				}
		}
	}

	if(idObjetivo){
		var linhaObjHtml = 
		'<div id="Obj_Inserido_'+objCount+'" class="Obj_Inserido objetivo'+idObjetivo+'">'+
			'<div id="Obj_Inserido_Info_'+objCount+'" class="Obj_Inserido_Info">'+
				'<div id="Obj_Inserido_Num_'+objCount+'" class="Obj_Inserido_Num">'+objetivo.numero+'</div>'+
				'<div id="Obj_Inserido_Nome_'+objCount+'" class="Obj_Inserido_Nome" onclick="expandirObj('+idObjetivo+')">'+objetivo.nome+'</div>'+
				'<div id="Obj_Inserido_Btns_'+objCount+'" class="Obj_Inserido_Btns">'+
					'<div id="Btn_AddAtv_Obj_'+objCount+'" class="Btn_Obj Btn_AddAtv_Obj" idObjetivo="'+idObjetivo+'"></div>'+
					'<div id="Btn_Editar_Obj_'+objCount+'" class="Btn_Obj Btn_Editar_Obj"></div>'+
					'<div id="Btn_Del_Obj_'+objCount+'" class="Btn_Obj Btn_Del_Obj" onclick=excluirObj('+idObjetivo+')></div>'+
				'</div>'+
			'</div>';
	}
	
	if (idAtividade) {        
		linhaObjHtml += 
		'<div id="Atvs_Obj_Inserido_'+idObjetivo+'" class="Atvs_Obj_Inserido">';
		var alturaDiv=0;
		for(var i = 0; i < atividadesCont.length; i++) {
			id = atividadesLista[i].atividadeId;
			linhaObjHtml +=
		    '<div id="Atv_Obj_Info_'+id+'" class="Atv_Obj_Info">'+
		        '<div id="Atv_Obj_Num_'+id+'" class="Atv_Obj_Num Atv_Obj'+idObjetivo+'">'+atividadesLista[i].numero+'</div>'+
		        '<span id="Atv_Obj_Nome_'+id+'" class="Atv_Obj_Nome">'+atividadesLista[i].nome+'</span>'+
		        '<span id="Atv_Obj_Livro_'+id+'" class="Atv_Obj_Livro">'+atividadesLista[i].livro+'</span>'+
		        '<span id="Atv_Obj_Pag_'+id+'" class="Atv_Obj_Pag">p. <span class="Atv_Obj_Pag_OK">'+atividadesLista[i].pagLivro+'</span></span>'+
		        '<div id="Atv_Inserida_Btns_'+id+'" class="Atv_Inserida_Btns">'+
		            '<div id="Btn_Editar_Atv_'+id+'" class="Btn_Atv Btn_Editar_Atv" onclick=editarAtividade('+id+','+idObjetivo+')></div>'+
		            '<div id="Btn_Del_Atv_'+id+'" class="Btn_Atv Btn_Del_Atv" onclick=excluirAtividade('+id+')></div>'+
		        '</div>'+
		    '</div>';
		}
		linhaObjHtml +=
		'</div>';	        
	}else{
		linhaObjHtml +=
			'<div id="Atvs_Obj_Inserido_" class="Atvs_Obj_Inserido">'+
			    '<div class="Atv_Obj_Info">'+
			        '<strong>Nenhuma atividade cadastrada.<strong>'+
		        '</div>'+
			'</div>';
	}
	linhaObjHtml +=
	'</div>';

	//Procedimento para deixar a div do tamanho certo
	$("#Objetivos_Inseridos_Container").append(linhaObjHtml);
	$("#Objetivos_Inseridos_Container").addClass("rotExpandido");
	num = $(".Obj_Inserido").length * 33;
	$("#Objetivos_Inseridos_Container").css('height',num+'px');
	$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
	
	objCount++;
	atvCount = 2;

	var objLimpo = 
	'<div class="Roteiro_Linha">'+
        '<div class="Roteiro_Col_8">'+
            '<div class="Roteiro_Linha No_Padding_Itens">'+
                '<div class="Roteiro_Col_3">'+
                    '<input type="hidden" id="idObj"> </input>  '+
                    '<div id="Nome_Objetivo1" class="Nome_Objetivo_Info Input_Info">Objetivo</div>'+
                '</div>'+
                '<div class="Roteiro_Col_9">'+
                    '<input id="nomeObj'+objCount+'" name="nomeObj" class="Input_Area nomeObj Nome_Objetivo_Input" placeholder="Objetivo do roteiro" required> </input>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="Roteiro_Col_4">'+
            '<div class="Roteiro_Linha No_Padding_Itens">'+
                '<div class="Roteiro_Col_6">'+
                    '<div class="Input_Info Numero_Objetivo_Info">Número</div>'+
                '</div>'+
                '<div class="Roteiro_Col_6">'+
                    '<input type="text" class="Input_Area Numero_Objetivo_Input numeroObj" id="numeroObj'+objCount+'" value="'+objCount+'" readonly></input>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div id="Inserir_Atividade" class="Roteiro_Linha">'+
        '<div id="Inserir_Atividades_Container">'+
            '<div class="Atividade_Linha" id="atv1">'+
                '<div class="Item_Roteiro_Linha No_Padding_Itens">'+
                    '<div class="Roteiro_Col_2">'+
                        '<div id="Atividade_Nome_Info_1" class="Input_Info Atividade_Nome_Info">Atividade</div>'+
                    '</div>'+
                    '<div class="Roteiro_Col_10">'+
                        '<input type="hidden" class="idAtv"></input>                   '+
                        '<input class="Input_Area nomeAtv" id="nomeAtv1" placeholder="Título da atividade" required> </input>'+
                    '</div>'+
                '</div>'+
                '<div class="Item_Roteiro_Linha">'+
                    '<div class="Roteiro_Col_4">'+
                        '<div class="Roteiro_Linha No_Padding_Itens">'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Info Input_Info numeroAtvInfo">Número</div>'+
                            '</div>'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Input valueNumero"><input class="Input_Area numeroAtv" readonly id="numeroAtv1" value="1" readonly></input></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="Roteiro_Col_4">'+
                        '<div class="Roteiro_Linha No_Padding_Itens">'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Info Input_Info"> Página Livro</div>'+
                            '</div>'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Input"><input class="Input_Area paginaAtv" id="paginaAtv"></input></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="Roteiro_Col_4">'+
                        '<div class="Roteiro_Linha No_Padding_Itens">'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Info Input_Info"> Livro </div>'+
                            '</div>'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Input"><input class="Input_Area livroAtv" id="livroAtv1"></input></div>    '+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="Roteiro_Linha">'+
            '<div class="Roteiro_Col_12">'+
                '<div id="Bt_Add_Atividade" onClick="adicionarAtividade()"></div>'+
            '</div>'+
        '</div>'+
    '</div>';

    $("#Inserir_objetivo").html(objLimpo);

    //Montao html da edição do objetivo na página de cadastros
	$('#Btn_Editar_Obj_'+objetivo.numero).click(function(){
		var idRoteiro = $('#id').val();
		var HtmlContent;
		var objetivoLinha = $('#Obj_Inserido_Nome_'+objetivo.numero).text();
		var objetivoLinhaN = $('#Obj_Inserido_Num_'+objetivo.numero).text();
		//Objeto com as propriedades do objetivo a ser inserido	
		HtmlContent = '<div class="box_mensagem_rotcad">'+
						'<div class="txt_mensagem">'+
							'<div class="Roteiro_Linha">'+
								'<div class="Roteiro_Col_8" style="width:100%;">'+
									'<div class="Roteiro_Linha No_Padding_Itens">'+
										'<div class="Roteiro_Col_3">'+
											'<input type="hidden" class="idObj"> </input>'+
											'<div id="Nome_Objetivo1" class="Nome_Objetivo_Info Input_Info">Objetivo</div>'+
										'</div>'+
										'<div class="Roteiro_Col_9">'+
											'<input id="nomeObj_edt" name="nomeObj" class="Input_Area nomeObj Nome_Objetivo_Input" value="'+objetivoLinha+'" required > </input>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="celulaGrande" style="width: 49.3%;">'+
									'<div class="Roteiro_Linha No_Padding_Itens">'+
										'<div class="Roteiro_Col_6">'+
											'<div class="Input_Info Numero_Objetivo_Info">Número</div>'+
										'</div>'+
										'<div class="Roteiro_Col_6">'+
											'<input type="text" class="Input_Area Numero_Objetivo_Input numeroObj" readonly id="numeroObj_edt" value="'+objetivoLinhaN+'"></input>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="btn_mensagemCad" style="margin: 25px 199px">'+
								'<input type="button" class="bt_ok left" value="OK" onclick="editarObjetivo('+idObjetivo+','+roteiro+','+objetivo.numero+')"/>'+
								'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
							'</div>'+
						'</div>'+
					'</div>';		
		$('#boxModal').html(HtmlContent).css('display','block');
	});	
		
}

/*Function para cadastrar objetivo*/
function criarObjetivo(nome,numero,descricao,roteiro){
	console.log('nome'+nome);
	console.log('numero'+numero);
	console.log('roteiro'+roteiro);
	var retorno;
	var valores = "nome="+nome+"&numero=&descricao="+descricao+"&roteiro="+roteiro+"&ativo=1";
	$.ajax({
		url: path+"Objetivo",
		type: "POST",
		async:false,
		crossDomain: true,
		data: "action=create&"+valores,
		success: function(d) {
			retorno = d;
		}
	});
	return retorno;
}

function editarObjetivo(idObjetivo,roteiro,numero){//var numero nao esra sendo utilizado???
	var nome = $("#nomeObj_edt").val();
	var retorno;
	var valores = "nome="+nome+"&numero=&descricao=&roteiro="+roteiro+"&ativo=1&id="+idObjetivo;
	
	if ($('.Item_Ativo').text() == 'Pesquisa') {
		numero = idObjetivo;
	}
	
	else numero = $("#numeroObj_edt").val();
	
	$('#boxModal').css('display','none');
	$.ajax({
		url: path+"Objetivo",
		type: "POST",
		crossDomain: true,
		data: "action=update&"+valores,
		beforeSend: function(){		
			loading("inicial");
		},
		success: function(d) {
			$("#Obj_Inserido_Nome_"+numero).html(nome);			
			mensagem("Objetivo alterado com sucesso!","OK","bt_ok","sucesso");	
		},complete: function(){
			loading("final");	
		}
	});
}

/*Function para cadastrar atividade*/
function criarAtividade(nome,numero,descricao,objetivo,pagina,livro)
{
	var retorno;
	var valores = "nome="+nome+"&numero=&descricao="+descricao+"&objetivo="+objetivo+"&paginaLivro="+pagina+"&livro="+livro+"&ativo=1";
	
	$.ajax({
		url: path+"Atividade",
		type: "POST",
		async:false,
		crossDomain: true,
		data: "action=create&"+valores,
		success: function(d) {
			retorno = d;
		}
	});
	return retorno;
}

function editarAtividade(idAtividade,idObjetivo){	//idAtividade será vazio quando for adicionar uma atividade em um roteiro já cadastrado 

	if (idAtividade != ''){
		var atividadeNome = $('#Atv_Obj_Nome_'+idAtividade).text();
		var atividadeLivro = $('#Atv_Obj_Livro_'+idAtividade).text();
		var atividadePagina = $('#Atv_Obj_Pag_'+idAtividade+' span').text();
		var atividadeNumero = $('#Atv_Obj_Num_'+idAtividade).text();
		var botao = '<input type="button" class="bt_ok left" value="OK" onclick="alterarAtividade(\''+idAtividade+'\')"/>';
	}else{
		var atividadeNome = '';
		var atividadeLivro = '';
		var atividadePagina = '';
		var botao = '<input type="button" class="bt_ok left" value="OK" onclick="cadastrarAtividade()"/>';
		
		//Verifica qual o número deverá aparecer e
		qtdAtv = $("#Atvs_Obj_Inserido_"+idObjetivo+" .Atv_Obj_Num").length;
		
		if (qtdAtv > 1){
			var atividadeNumero = qtdAtv+1;
		}else if (qtdAtv==0){
			var atividadeNumero = 1;
		}else if ($('#Atvs_Obj_Inserido_'+idObjetivo).text() == 'Nenhuma atividade cadastrada.'){
			var atividadeNumero = 1;
		}else{
			var atividadeNumero = 2;
		}
	}
		
	var trechoFormAtv = 
		'<div class="box_mensagem_atividades">'+
			'<div class="txt_mensagem">'+
				'<div class="Item_Roteiro_Linha No_Padding_Itens">'+
					'<div class="Roteiro_Col_2">'+
						'<div id="Atividade_Nome_Info_" class="Input_Info Atividade_Nome_Info">Atividade</div>'+
					'</div>'+
					'<div class="Roteiro_Col_10">'+
						'<input type="hidden" class="idAtv"></input>'+
						'<input class="Input_Area nomeAtv_edt" id="nomeAtv_edt" placeholder="Título da atividade" required value="'+atividadeNome+'"></input>'+
					'</div>'+
				'</div>'+
				'<div class="Item_Roteiro_Linha">'+
					'<div class="Roteiro_Col_4">'+
						'<div class="Roteiro_Linha No_Padding_Itens">'+
							'<div class="Roteiro_Col_6">'+
								'<div class="Atividade_Info Input_Info numeroAtvInfo">Número</div>'+
							'</div>'+
							'<div class="Roteiro_Col_6">'+
								'<div class="Atividade_Input valueNumero"><input class="Input_Area numeroAtv" readonly id="numeroAtv_edt" value="'+atividadeNumero+'" readonly></input></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="Roteiro_Col_4">'+
						'<div class="Roteiro_Linha No_Padding_Itens">'+
							'<div class="Roteiro_Col_6">'+
								'<div class="Atividade_Info Input_Info"> Página Livro</div>'+
							'</div>'+
							'<div class="Roteiro_Col_6">'+
								'<div class="Atividade_Input"><input class="Input_Area paginaAtv" id="paginaAtv_edt" value="'+atividadePagina+'"></input></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="Roteiro_Col_4">'+
						'<div class="Roteiro_Linha No_Padding_Itens">'+
							'<div class="Roteiro_Col_6">'+
								'<div class="Atividade_Info Input_Info"> Livro </div>'+
							'</div>'+
							'<div class="Roteiro_Col_6">'+
								'<div class="Atividade_Input"><input class="Input_Area livroAtv" id="livroAtv_edt" value="'+atividadeLivro+'"></input></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="btn_mensagemEditAtividades" style="margin:25px 188px">'+
					'<input type="hidden" id="objetivoAtv_edt" name="objetivoAtv_edt" value="'+idObjetivo+'"/>'+
					botao +
					'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
				'</div>'+
			'</div>'+
		'</div>';
	
	$('#boxModal').html(trechoFormAtv).css('display','block');
	//return false;
}

function alterarAtividade(idAtividade){				
	var nomeAtv = $("#nomeAtv_edt").val();
	var numeroAtv = $("#numeroAtv_edt").val();		
	var livroAtv = $("#livroAtv_edt").val();
	var paginaAtv = $("#paginaAtv_edt").val();
	var objetivo = $("#objetivoAtv_edt").val();
	
	if(nomeAtv == "" || livroAtv=="" || paginaAtv == ""){
		mensagem("Todos os campos são obrigatórios!","OK","bt_ok","alerta");
		return false;
	}else{	
		
		var valores = "action=update&id="+idAtividade+"&nome="+nomeAtv+"&numero=&descricao=&objetivo="+objetivo+"&paginaLivro="+paginaAtv+"&livro="+livroAtv+"&ativo=1";
		
		$.ajax({
			url: path+"Atividade",
			type: "POST",
			crossDomain: true,
			data: valores,
			beforeSend: function(){		
				loading("inicial");
			},
			success: function(d) {
				$("#Atv_Obj_Nome_"+idAtividade).html(nomeAtv);
				$("#Atv_Obj_Livro_"+idAtividade).html(livroAtv);
				$("#Atv_Obj_Pag_"+idAtividade+" .Atv_Obj_Pag_OK").html(paginaAtv);
				$('#boxModal').css('display','none');
				return mensagem("Atividade alterada com sucesso!","OK","bt_ok","sucesso");
			},complete: function(){
				loading("final");	
			}
		});	
	}
}
// Expandir roteiro inserido
function expandirRot() {

	var atvsCont = $('.Atvs_Obj_Inserido');
	var objsCount = $('.Obj_Inserido_Info');
	var alturaContainer = objsCount.length*33;

	
	if ( $('#Objetivos_Inseridos_Container').hasClass('rotExpandido') ) {
		$('#Objetivos_Inseridos_Container').css('height','0');
		for (var i = 0; i < atvsCont.length; i++) {
			if ( $($(atvsCont).get(i)).hasClass('Atvs_Expandido') ) {
				$($(atvsCont).get(i)).removeClass('Atvs_Expandido');
				$($(atvsCont).get(i)).css('height','0');
			}
		}
		$('#Objetivos_Inseridos_Container').toggleClass('rotExpandido');
	} else {
		$('#Objetivos_Inseridos_Container').css('height',alturaContainer+'px');
		$('#Objetivos_Inseridos_Container').toggleClass('rotExpandido');
	}
	
}

// Expandir objetivo  (VERIFICAR SE VAI USAR)
function expandirObjPesquisa(id) {

	var atvsCont = $('#Atvs_Obj_Inserido_'+id+' .Atv_Obj_Info');
	var objsCount = $('.Obj_Inserido_Info');
	var alturaAtvContainer = atvsCont.length * 30;
	var alturaContainer = objsCount.length * 33;

	if (!( $('#Atvs_Obj_Inserido_'+id).hasClass('Atvs_Expandido') )) {
		
		if ($('#Atvs_Obj_Inserido_'+id).text() == ''){
			$('#Atvs_Obj_Inserido_'+id).html(
			    	'<div class="Atv_Obj_Info">'+
				        	'<strong>Nenhuma atividade cadastrada.<strong>'+
				    '</div>'
			);
			var alturaAtvContainer = 30; //Como foi adicionado uma linha, o altura recebe o valor do tamanho
		}
		
		$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
		$('#Atvs_Obj_Inserido_'+id).addClass('Atvs_Expandido');
		$('#Atvs_Obj_Inserido_'+id).height(alturaAtvContainer);
		$('#Objetivos_Inseridos_Container').css('height',alturaContainer+alturaAtvContainer+'px');
	}else {
		$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
		$('#Objetivos_Inseridos_Container').css('height',alturaContainer+'px');
	}
}

//Expandir objetivo
function expandirObjPesquisa(id) {

	//Pega a quantidade das divs e os tamanhos que serão necessários.
	var objsCont = $('.atividadeObjetivo'+id).lenght;
	var atvsCount = $('.Atv_Obj'+id).lenght;
	var alturaAtvContainer = atvsCont.length * 30;
	var alturaContainer = objsCount.length * 33;

	//Verifica se a div não está aberta
	if (!( $('#Atvs_Obj_Inserido_'+id).hasClass('Atvs_Expandido') )) {
		
		//Se realmente não tiver, verifica se a div está vazia.
		if ($('#Atvs_Obj_Inserido_'+id).text() == ''){
			//Se vazia adiciona o conteúdo com mensagem para o usuário
			$('#Atvs_Obj_Inserido_'+id).html(
			    	'<div class="Atv_Obj_Info">'+
				        	'<strong>Nenhuma atividade cadastrada.<strong>'+
				    '</div>'
			);
			var alturaAtvContainer = 30; //Como foi adicionado uma linha, o altura recebe o valor do tamanho
		}
		
		//Adiciona as classes e coloca o tamanho certo nas divs
		$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
		$('#Atvs_Obj_Inserido_'+id).addClass('Atvs_Expandido');
		$('#Atvs_Obj_Inserido_'+id).height(alturaAtvContainer);
		$('#Objetivos_Inseridos_Container').css('height',alturaContainer+alturaAtvContainer+'px');
	}else {
		//Se a classe estiver visivel, apenas esconde a div.
		$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
		$('#Obj_Inserido_'+id).parent().css('height',alturaContainer+'px');
	}
}

// Adicionar campos para nova atividade
function adicionarAtividade() {
	
	//Cria o html com os campos necessários.
	var trechoFormAtv = 
	'<div class="Atividade_Linha" id="atv'+atvCount+'">'+
	    '<div class="Item_Roteiro_Linha No_Padding_Itens">'+
	        '<div class="Roteiro_Col_2">'+
	            '<div id="Atividade_Nome_Info_'+atvCount+'" class="Input_Info Atividade_Nome_Info">Atividade</div>'+
	        '</div>'+
	        '<div class="Roteiro_Col_10">'+
	            '<input type="hidden" class="idAtv"></input>'+
	            '<input class="Input_Area nomeAtv" id="nomeAtv'+atvCount+'" placeholder="Título da atividade" required> </input>'+
	        '</div>'+
	    '</div>'+
	    '<div class="Item_Roteiro_Linha">'+
	        '<div class="Roteiro_Col_4">'+
	            '<div class="Roteiro_Linha No_Padding_Itens">'+
	                '<div class="Roteiro_Col_6">'+
	                    '<div class="Atividade_Info Input_Info numeroAtvInfo">Número</div>'+
	                '</div>'+
	                '<div class="Roteiro_Col_6">'+
	                    '<div class="Atividade_Input valueNumero"><input class="Input_Area numeroAtv" readonly id="numeroAtv'+atvCount+'" value="'+atvCount+'"></input></div>'+
	                '</div>'+
	            '</div>'+
	        '</div>'+
	        '<div class="Roteiro_Col_4">'+
	            '<div class="Roteiro_Linha No_Padding_Itens">'+
	                '<div class="Roteiro_Col_6">'+
	                    '<div class="Atividade_Info Input_Info"> Página Livro</div>'+
	                '</div>'+
	                '<div class="Roteiro_Col_6">'+
	                    '<div class="Atividade_Input"><input class="Input_Area paginaAtv" id="paginaAtv'+atvCount+'"></input></div>'+
	                '</div>'+
	            '</div>'+
	        '</div>'+
	        '<div class="Roteiro_Col_4">'+
	            '<div class="Roteiro_Linha No_Padding_Itens">'+
	                '<div class="Roteiro_Col_6">'+
	                    '<div class="Atividade_Info Input_Info"> Livro </div>'+
	                '</div>'+
	                '<div class="Roteiro_Col_6">'+
	                    '<div class="Atividade_Input"><input class="Input_Area livroAtv" id="livroAtv'+atvCount+'"></input></div>'+
	                '</div>'+
	            '</div>'+
	        '</div>'+
	    '</div>'+
	'</div>';

	//Insere o html criado no local correto. 
	$('#Inserir_Atividades_Container').append(trechoFormAtv);
	atvCount++;
}

/* ----------------------------------------------------------------------------------------------------------- */

function alterarROA(servico){
	loading('inicial');
	var retorno="";
	var alterar="";
	var linha="";
	var descricao="";
	var msg;
	HtmlContent="";
	
	if(servico == "Roteiro"){		
		var anoEstudo = $("#anoEstudo").val();
		var nome = $("#nome").val();
		var id = $("#id").val();
		linha = "rot_"+id;
		var descricao = "";
		alterar = "&nome="+nome+"&descricao="+descricao+"&anoEstudo="+anoEstudo+"&ativo=1&id="+id;
		HtmlContent = "<div class='item selecionado'><div class='titulo_roteiro'>"+nome+"</div> <span class='editar' onclick='editarROA(\"Roteiro\","+id+")'></span><span class='excluir' onclick='excluirROA(\"Roteiro\","+id+")'></div>";
		msg = "Roteiro alterado com sucesso!";
	
	}else if(servico == "Objetivo"){		
		var roteiroObj = $("#roteiroObj").val();
		var anoEObj = $("#anoEObj").val();
		var numeroObj = $("#numeroObj").val();		
		var nomeObj = $("#nomeObj").val();
		var idObj = $("#idObj").val();		
		linha = "obj_"+idObj;
		var descricao = "";			
		alterar = "&nome="+nomeObj+"&numero=&descricao="+descricao+"&roteiro="+roteiroObj+"&ativo=1&id="+id;		
		HtmlContent = "<div class='item selecionado'><div class='titulo_objetivo'>"+nomeObj+"</div> <span class='editar' onclick='editarROA(\"Objetivo\","+id+")'></span><span class='excluir' onclick='excluirROA(\"Objetivo\","+id+")'></div>";
		msg = "Objetivo alterado com sucesso!";
	
	}else if(servico == "Atividade"){
		var objetivoAtv = $("#objetivoAtv").val();			
		var idAtv = $("#idAtv").val();
		var descricao = $("#nomeAtv").val();
		var nomeAtv = '';
		var numeroAtv = $("#numeroAtv").val();		
		var livroAtv = $("#livroAtv").val();
		var paginaAtv = $("#paginaAtv").val();			
		linha = "atv_"+idAtv;
		alterar ="&nome="+nomeAtv+"&numero=&descricao="+descricao+"&objetivo="+objetivoAtv+"&paginaLivro="+paginaAtv+"&livro="+livroAtv+"&ativo=1&id="+idAtv,				
		HtmlContent = "<div class='item selecionado'><div class='titulo_objetivo'>"+descricao+"</div> <span class='editar' onclick='editarROA(\"Atividade\","+idAtv+")'></span><span class='excluir' onclick='excluirROA(\"Atividade\","+idAtv+")'></div>";
		msg = "Atividade alterada com sucesso!";
		
		if(descricao=="" || numeroAtv=="" || objetivoAtv=="" || livroAtv==""){
			mensagem("Os campos nome, número, objetivo e livro são obrigatórios!","OK","bt_ok","alerta");
			return false;
		}else{
			
			
			$("#idAtv").val('');
			$("#nomeAtv").val('');
			$("#numeroAtv").val('');
			$("#livroAtv").val('');
			$("#paginaAtv").val('');				
			$("#btnSalvarAtividade").css("display","block");
			$("#btnEditarAtividade").css("display","none");
		}
	}	
	var retorno = setUpdateData(servico,alterar,id);
	loading('inicial');
	if(retorno != "erro"){
		
		$('#'+linha).html(HtmlContent);
		mensagem(msg,"OK","bt_ok","sucesso")
		loading('final');
		return false;
	}else{
		mensagem("Erro ao alterar!","OK","bt_ok","erro")
		loading('final');
		return false;
	}
}

function VerificaAtribuicaoRoteiroExtra(idAluno, idRoteiro){
    var ValorRetorno;
 
    $.ajax({
        type: "GET",
        async:false,
        crossDomain: true,
        url: path+"AtribuicaoRoteiroExtra/RoteiroAluno/"+idAluno+"/"+idRoteiro
	}).then(function(data) {
		ValorRetorno = data;
	});
     return ValorRetorno;
}

function excluirObj(idObjetivo){

	//Verifica o local atual para definir se o roteiro será excluido ou inativado.
	if ($('.Item_Ativo').text() == 'Pesquisa'){
		url = path+"Objetivo/InativarObjetivo/"+idObjetivo;
	}else{
		url = path+"Atividade/DeletarAtividade/"+idObjetivo;
	}
	
	$.ajax({
		url: url,
		type: "GET",
		async:false,
		crossDomain: true,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			
			//Se tiver na página de cadastro
			if ($('.Item_Ativo').text() != 'Pesquisa'){
				$('.objetivo'+idObjetivo).remove();		//Remove a linha
				num = $(".Obj_Inserido").length * 33;	//Pega o tamanho que a div deve ficar
				$("#Objetivos_Inseridos_Container").css('height',num+'px');	//Insere o tamanho.
				enumerarObjetivos()	//Enumera os objetivos
				
			}else{	//Senão estará na página de pesquisas
				idRoteiro = $('#Obj_Inserido_'+idObjetivo).attr('idRoteiro');	//Pega o iidRoteiro
				$('#Obj_Inserido_'+idObjetivo).remove();	//Remove a linha
				esconderAtividades(idObjetivo);			//Esconde as atividades, se estiverem abertas,
				listarObjetivos(idRoteiro);				//Lista os objetivos novamente.
			}
			
			return mensagem("Objetivo excluido com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		},error: function() {
			return mensagem("Erro ao excluir objetivo!","OK","bt_ok","erro");
		}
	});
	
	
}

function excluirAtividade(idAtividade){
	
	//Verifica o local atual para definir se o roteiro será excluido ou inativado.
	if ($('.Item_Ativo').text() == 'Pesquisa'){
		excluir = 'Inativar';
	}else excluir = 'Delete';
		
	$.ajax({
		url: path+"Atividade/"+excluir+"/"+idAtividade,
		type: "GET",
		async:false,
		crossDomain: true,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			//Procedimentos para pegar o id e remover a div correta
			idParent = $('#Atv_Obj_Info_'+idAtividade).parent().attr('id');
			idObjetivo = idParent.replace(/[^0-9]+/g, '');
			$('#Atv_Obj_Info_'+idAtividade).remove();
			
			//Remove as classes e exibe da maneira correta as atividades.
			$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
			expandirObj(idObjetivo);
			enumerarAtividades(idObjetivo);
			return mensagem("Atividade excluida com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		},error: function() {
			return mensagem("Erro ao excluir atividade!","OK","bt_ok","erro");
		}
	});
}

function excluirRoteiro(){
	id = $('#id').val();

	$.ajax({
		url: path+"Atividade/DeletarRoteiroAtividade/"+id,
		type: "GET",
		async:false,
		crossDomain: true,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			limparCamposRoteiro();
			return mensagem("Roteiro excluido com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		},error: function() {
			return mensagem("Erro ao excluir roteiro!","OK","bt_ok","erro");
		}
	});
}

function cadastrarAtividade(){
	var nomeAtv = $("#nomeAtv_edt").val();
	var numeroAtv = $("#numeroAtv_edt").val();		
	var livroAtv = $("#livroAtv_edt").val();
	var paginaAtv = $("#paginaAtv_edt").val();
	var objetivo = $("#objetivoAtv_edt").val();
	var idRoteiro = $("#roteiro_hide").val();
	
	if ((nomeAtv == '') || (livroAtv = '') || (paginaAtv == '')){
		mensagem("Todos os campos são obrigatórios!","OK","bt_ok","alerta");
		return false;
	}
	if (id = criarAtividade(nomeAtv,numeroAtv,"",objetivo,paginaAtv,livroAtv)){
		//procedimentos para listar automaticamente!!
		var novaLinha = 
				'<div id="Atv_Obj_Info_'+id+'" class="Atv_Obj_Info atividadeObjetivo'+objetivo+'">'+
		        	'<div id="Atv_Obj_Num_'+id+'" class="Atv_Obj_Num Atv_Obj'+objetivo+'">'+numeroAtv+'</div>'+
		        	'<span id="Atv_Obj_Nome_'+id+'" class="Atv_Obj_Nome">'+nomeAtv+'</span>'+
		        	'<span id="Atv_Obj_Livro_'+id+'" class="Atv_Obj_Livro">'+livroAtv+'</span>'+
		        	'<span id="Atv_Obj_Pag_'+id+'" class="Atv_Obj_Pag">p. <span class="Atv_Obj_Pag_OK">'+paginaAtv+'</span></span>'+
		        	'<div id="Atv_Inserida_Btns_'+id+'" class="Atv_Inserida_Btns">'+
		        		'<div id="Btn_Editar_Atv_'+id+'" class="Btn_Atv Btn_Editar_Atv" onclick=editarAtividade('+id+','+objetivo+')></div>'+
		        		'<div id="Btn_Del_Atv_'+id+'" class="Btn_Atv Btn_Del_Atv" onclick=excluirAtividade('+id+')></div>'+
		        	'</div>'+
		        '</div>';
		
		//Verifica se existe alguma atividade adicionada e se está na página de pesquisa ou cadastros.
		if ($('.Item_Ativo').text() == 'Pesquisa'){
		
			if (($('#spanObjetivo'+objetivo).text() == 'Nenhuma atividade cadastrada.') || ($('#spanObjetivo'+objetivo).text() == '')){
				$('#spanObjetivo'+objetivo).html(novaLinha);
				
			}else{
				//Remove o conteudo da div e chama a função para listar as atividades...
				$('#spanObjetivo'+objetivo).html('');
				$('#spanObjetivo'+objetivo).removeClass('clicado');
								
			}
			listarAtividades(objetivo, idRoteiro);
			
		}else{
			if (($('#Atvs_Obj_Inserido_'+objetivo).text() == 'Nenhuma atividade cadastrada.') || ($('#Atvs_Obj_Inserido_'+objetivo).text() == '')){
				$('#Atvs_Obj_Inserido_'+objetivo).html(novaLinha);
			}else{
				$('#Atvs_Obj_Inserido_'+objetivo).append(novaLinha);
			}
			
			$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
			expandirObj(objetivo);
		}
		
		mensagem("Atividade criada  com sucesso!","OK","bt_ok","sucesso");
	}else mensagem("Erro ao criar atividade!","OK","bt_ok","erro");
	
	$('#boxModal').css('display','none');
	return false;
}

function enumerarAtividades(idObjetivo){
	i = 1;
	$('.Atv_Obj'+idObjetivo).each(function(){
		$(this).text(i);
		i++;
	})
}

function enumerarAtividadesPesquisa(idObjetivo){
	i = 1;
	$('.atividadeObjetivo'+idObjetivo).each(function(){
		$(this).text(i);
		i++;
	})
}

function enumerarObjetivos(){
	i = 1;
	$('.Obj_Inserido_Num').each(function(){
		$(this).text(i);
		i++;
	})
	$('.numeroObj').val(i)
	objCount = i;
}

function carregarPesquisaByAno(idAno){
	$.ajax({
		url: path+'Roteiro/ListarNomeIdAnoEstudo/'+idAno,
		type: "GET",
		async:false,
		crossDomain: true,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			htmlConteudo = '';
			 if (d.length == 0){
				 htmlConteudo += '<div id="oteiro_listado_1" class="roteiro_listado_">'+
		                     '<span id="nome_roteiro_listado_1" class="roteiro_nenhum">Nenhum Roteiro encontrado</span>'+
		                '</div>';
			 } else{
				 for(var i=0;i<d.length; i++){
					 id = d[i].idroteiro;
					 htmlConteudo += 
						 '<div id="roteiro'+id+'" idRoteiro="'+id+'" class="roteiro_listado" style="cursor:pointer">'+
						 	'<span id="nome_roteiro_listado_'+id+'" class="nome_roteiro_listado">'+d[i].nome+'</span>'+
						 	'<div class="Roteiro_Listado_Btns" id="Roteiro_Listado_Btns'+id+'">'+
						 		'<div class="Roteiro_Listado_Add" idRoteiro='+id+' style="width: 33%"></div>'+
						 		'<div class="Roteiro_Listado_Edit" idRoteiro='+id+' style="width: 33%"></div>'+
						 		'<div class="Roteiro_Listado_Del" idRoteiro='+id+' style="width: 33%"></div>'+
						 	'</div>'+
						 '</div>'+
						 '<div class="Objetivos_Lista" id="objetivosRoteiro'+id+'" style="display: block"></div>';
				 }
				 htmlConteudo += '<div class="roteiro_nenhum" style="display:none">'+
                 					'<span id="nome_roteiro_listado_" class="roteiro_nenhum">Nenhum Roteiro encontrado</span>'+
               					'</div>';
			 }
			 
			 $('#roteiros_listados_container').html(htmlConteudo);
			 
			//Editar e excluir!!
			return false;
		},complete: function(){
			loading("final");	
		},error: function() {
			retorno = "erro";
		}
	});	
}

function limparCamposRoteiro(){
	$('#boxMensagemGeral').css('display','none');
	$('#btnSalvarObj').css('display','none');
	$('#Roteiro_Inserido_Container').css('display','none'); 
	$('#Inserir_roteiro').css('display','block');
	$('#btnInserirRoteiro').css('display','block');	
	$('#Input_Roteiro_Nome').val('');
	
	$(".nomeObj, .paginaAtv, .nomeAtv, .livroAtv").val('');
	$('.Obj_Inserido').remove('');
	$('#Objetivos_Inseridos_Container').css('height','0px');
	$('.Atvs_Obj_Inserido').removeClass('Atvs_Expandido').css('height','0px');
	$('.Atividade_Linha:not(.Atividade_Linha:first)').remove();
	atvCount = 2;
	objCount = 1;
	$('.numeroObj').val('1');
}

function criarObjetivoExtra(){
	idRoteiro = $("#idRoteiro").val();
	numero = $('#Input_Numero_Obj').val();
	nome = $('#Input_Objetivo_Nome').val();
	
	if (nome == ''){
		return mensagem("Todos os campos são obrigatórios!","OK","bt_ok","erro");
	} 
	
	idObjetivo = criarObjetivo(nome,numero,'',idRoteiro);
	
	
	htmlContent +=
					'<div id="Obj_Inserido_'+idObjetivo+'" class="Obj_Inserido objetivo'+idObjetivo+' objetivoRoteiro'+idRoteiro+'" idRoteiro="'+idRoteiro+'" idObjetivo="'+idObjetivo+'">'+
					'<div id="Obj_Inserido_Info_'+idObjetivo+'" class="Obj_Inserido_Info">'+
						'<div id="Obj_Inserido_Num_'+idObjetivo+'" class="Obj_Inserido_Num">'+numero+'</div>'+
						//'<div id="Obj_Inserido_Nome_'+idObjetivo+'" class="Obj_Inserido_Nome" onclick="expandirObj('+idObjetivo+')">'+data[i].nome+'</div>'+
						'<div id="Obj_Inserido_Nome_'+idObjetivo+'" class="Obj_Inserido_Nome">'+nome+'</div>'+
						'<div id="Obj_Inserido_Btns_'+idObjetivo+'" class="Obj_Inserido_Btns">'+
							'<div id="Btn_AddAtv_Obj_'+idObjetivo+'" class="Btn_Obj Btn_AddAtv_Obj" onclick=editarAtividade("",'+idObjetivo+')></div>'+
							'<div class="Btn_Editar_Obj_Pesq Btn_Obj Btn_Editar_Obj" idRoteiro="'+idRoteiro+'" idObjetivo="'+idObjetivo+'"></div>'+
							'<div id="Btn_Del_Obj_'+idObjetivo+'" class="Btn_Obj Btn_Del_Obj" onclick=excluirObj('+idObjetivo+')></div>'+
						'</div>'+
					'</div>'+
					'<span id="spanObjetivo'+idObjetivo+'" class="spanObjetivo"></span>'+
					'</div>';
	
	
	
	$("#objetivosRoteiro"+idRoteiro).html(htmlContent);
	listarObjetivos(idRoteiro);
	fecharBoxModal();
	
	return false;
}

function listarAtividades(idObjetivo, idRoteiro){
	
	//Adiciona a classe clicado para verificar se já foi clicado
	$('#spanObjetivo'+idObjetivo).addClass('clicado')
	
	//Se a div estiver visivel, esconde todas e arruma o tamanho da div pai
	if($('#spanObjetivo'+idObjetivo).is(':visible')){
		$('#spanObjetivo'+idObjetivo).css('display','none');
		tamanhoDiv = ($('.objetivoRoteiro'+idRoteiro).length * 33);
		$('#spanObjetivo'+idObjetivo).parent().parent().css('height',tamanhoDiv+'px');
		return false;
	}
	
	//Esconde todas as divs que listam atividades
	$('.spanObjetivo').css('display','none');
	
	//Verifica se a div já tem conteudo. Se sim, apenas mostra a div e coloca o tamanho correto.
	if ($('#spanObjetivo'+idObjetivo).html() != ''){
		tamanhoDiv = ($('.atividadeObjetivo'+idObjetivo).length * 30) + ($('.objetivoRoteiro'+idRoteiro).length * 33);
		$('#spanObjetivo'+idObjetivo).css('display','block');
		$('#spanObjetivo'+idObjetivo).parent().parent().css('height',tamanhoDiv+'px');
		return false;
	}
	
	//Ajax para buscar as atividades do objetivo clicado
	$.ajax({
		url: path+'Atividade/atividadeObjetivo/'+idObjetivo,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(data) {
			cont=1;
			htmlContent = '';

			//Salva os resultados em uma string
			if (data.length>0){
				for(var i = 0; i < data.length;i++){
					console.log(data);
					idAtividade = data[i].idatividade;
					htmlContent += 
					'<div id="Atv_Obj_Info_'+idAtividade+'" class="Atv_Obj_Info atividadeObjetivo'+idObjetivo+'">'+
		        		'<div id="Atv_Obj_Num_'+idAtividade+'" class="Atv_Obj_Num Atv_Obj Atv_Obj'+idObjetivo+'">'+cont+'</div>'+
		        		'<span id="Atv_Obj_Nome_'+idAtividade+'" class="Atv_Obj_Nome">'+data[i].nome+'</span>'+
		        		'<span id="Atv_Obj_Livro_'+idAtividade+'" class="Atv_Obj_Livro"> '+data[i].livro+' </span>'+
		        		'<span id="Atv_Obj_Pag_'+idAtividade+'" class="Atv_Obj_Pag">p. <span class="Atv_Obj_Pag_OK">'+data[i].paginaLivro+'</span></span>'+
		        		'<div id="Atv_Inserida_Btns_'+idAtividade+'" class="Atv_Inserida_Btns">'+
		        			'<div id="Btn_Editar_Atv_'+idAtividade+'" class="Btn_Atv Btn_Editar_Atv" onclick=editarAtividade('+idAtividade+','+idObjetivo+')></div>'+
		        			'<div id="Btn_Del_Atv_'+idAtividade+'" class="Btn_Atv Btn_Del_Atv" onclick=excluirAtividade('+idAtividade+')></div>'+
		        		'</div>'+
		        	'</div>';
					
					cont++;
					
				}
			}else {
				htmlContent +=
				'<div id="Atv_Obj_Info_" class="Atv_Obj_Info Vazio atividadeObjetivo'+idObjetivo+'">'+
	        		'<span id="Atv_Obj_Nome_" class="Atv_Obj_Nome">Nenhuma atividade cadastrada.</span>'+
	        	'</div>';
				i = 1;
			}

			//Pega o tamanho correto de acordo com a quantidade de objetivos e atividades
			tamanhoDiv = (30 * i) + ($('.objetivoRoteiro'+idRoteiro).length * 33);
			//Coloca a string na div e deixa ela visivel.
			$('#spanObjetivo'+idObjetivo).html(htmlContent).css('display', 'block');
			//Altera o tamanho da div pai
			$('#spanObjetivo'+idObjetivo).parent().parent().css('height',tamanhoDiv+'px');
	
		}
	});
	return false;
}

function listarObjetivos(idRoteiro){
	
	htmlContent = '';
	//Ajax para buscar os objetivos referentes ao roteiro clicado
	$.ajax({
		url: path+'Objetivo/ObjetivoRoteiro/'+idRoteiro,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(data) {
			cont=1;
			//Faz as verificações e salva o resultado em uma string
			if (data.length>0){
	
				for(var i = 0; i < data.length;i++){

					idObjetivo = data[i].idobjetivo;
					htmlContent +=
					'<div id="Obj_Inserido_'+idObjetivo+'" class="Obj_Inserido objetivo'+idObjetivo+' objetivoRoteiro'+idRoteiro+'" idRoteiro="'+idRoteiro+'" idObjetivo="'+idObjetivo+'">'+
					'<div id="Obj_Inserido_Info_'+idObjetivo+'" class="Obj_Inserido_Info">'+
						'<div id="Obj_Inserido_Num_'+idObjetivo+'" class="Obj_Inserido_Num">'+(cont)+'</div>'+
						//'<div id="Obj_Inserido_Nome_'+idObjetivo+'" class="Obj_Inserido_Nome" onclick="expandirObj('+idObjetivo+')">'+data[i].nome+'</div>'+
						'<div id="Obj_Inserido_Nome_'+idObjetivo+'" class="Obj_Inserido_Nome">'+data[i].nome+'</div>'+
						'<div id="Obj_Inserido_Btns_'+idObjetivo+'" class="Obj_Inserido_Btns">'+
							'<div id="Btn_AddAtv_Obj_'+idObjetivo+'" class="Btn_Obj Btn_AddAtv_Obj" idRoteiro="'+idRoteiro+'" idObjetivo="'+idObjetivo+'"></div>'+
							'<div class="Btn_Editar_Obj_Pesq Btn_Obj Btn_Editar_Obj" idRoteiro="'+idRoteiro+'" idObjetivo="'+idObjetivo+'"></div>'+
							'<div id="Btn_Del_Obj_'+idObjetivo+'" class="Btn_Obj Btn_Del_Obj" onclick=excluirObj('+idObjetivo+')></div>'+
						'</div>'+
					'</div>'+
					'<span id="spanObjetivo'+idObjetivo+'" class="spanObjetivo"></span>'+
					'</div>'				;
					
					cont++;
				}
				
			}else{
				htmlContent +=
				'<div id="Obj_Inserido_" class="Obj_Inserido objetivo">'+
				'<div id="Obj_Inserido_Info_" class="Obj_Inserido_Info">'+
					'Nenhum Objetivo cadastrado'+
				'</div>'+
				'</div>';
				i = 1;
			}
			
			//Calcula o tamanho da div de acordo com a quantidade de objetivos
			tamanhoDiv = 33*i;
			
			//Coloca o conteudo da string na div adequada e coloca o tamanho correto
			console.log('a');
			$('#objetivosRoteiro'+idRoteiro).html(htmlContent).addClass('Atvs_Expandido clicado').css('height',tamanhoDiv+'px');;
				
	}
		})
		return false
	}

function esconderAtividades(idObjetivo){
	
	$('.spanObjetivo').css('display','none');
	tamanhoDiv = ($('.objetivoRoteiro'+idRoteiro).length * 33);
	$('#spanObjetivo'+idObjetivo).parent().parent().css('height',tamanhoDiv+'px');
	
	return false;
}
