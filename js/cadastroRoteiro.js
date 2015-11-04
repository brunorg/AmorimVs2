// JavaScript Document
var ultimo_id;
var dataAnoEstudo = getData("AnoEstudo", null);
var dataRoteiro = getData("Roteiro", null);
var dataObjetivo = getData("Objetivo", null);
var dataAtividade = getData("Atividade", null);

$(document).ready(function(){
	
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
    $('.anoEstudoRoteiro').html("<option value=''></option>"+HtmlContent);
	$("#anoEObj").html("<option value=''></option>"+HtmlContent);
	$("#anoEAtv").html("<option value=''></option>"+HtmlContent);	
	
/* Mudando estado da aba (ativando a aba clicada e inativando a outra)*/
	var abasCabecalho = $("#roteiros_cabecalho .Cabecalho_Roteiro_Item");
	var conteudoAbas = $("#roteiros_content .Conteudo_Aba_Cabecalho");

	function mostrarConteudoAba(aba) {
		for (var i = 0; i < abasCabecalho.length; i++) {
			if(abasCabecalho[i] == aba) {
				$($(abasCabecalho).get(i)).addClass('Item_Ativo');
				$($(conteudoAbas).get(i)).show();
			} else {
				$($(abasCabecalho).get(i)).removeClass('Item_Ativo');
				$($(conteudoAbas).get(i)).hide();
			}
		}
	}

	mostrarConteudoAba(abasCabecalho[0]);

	for (var i = 0; i < abasCabecalho.length; i++) {
		$($(abasCabecalho).get(i)).click(function() {
			mostrarConteudoAba(this);
			return false;
		});
		$($(abasCabecalho).get(i)).focus(function() {
			mostrarConteudoAba(this);
			return false;
		});
	}
	
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

	//Lista os professores ativo=1	
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
	$('#Btn_Editar_Rot_1').click(function(){
		var idRoteiro = $('#id').val();
		var roteiroNome = $('#Input_Roteiro_Nome').val();
		var HtmlContent;
		HtmlContent = '<div class="box_mensagem_rotcad">'+
						'<div class="txt_mensagem">'+
							'<div class="Roteiro_Col_4" style="width: 53.33%;">'+
								'<div class="Roteiro_Linha No_Padding_Itens">'+
									'<div class="Roteiro_Col_6">'+
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
							'<div class="celulaGrande">'+
								'<input type="hidden" id="id"></input>'+
								'<input id="Input_Roteiro_Nome_edt" class="Input_Area" placeholder="Nome do roteiro" required> </input>'+
							'</div>'+
						'</div>'+
						'<div class="btn_mensagemCad">'+
							'<input type="button" class="bt_ok left" value="OK" onclick="EditarRoteiro('+idRoteiro+')"/>'+
							'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
						'</div>'+
					'</div>';
		
		$('#boxModal').html(HtmlContent).css('display','block');
		window.setTimeout(function(){
			$('#id').val(idRoteiro);
			$('#Input_Roteiro_Nome_edt').val(roteiroNome);
			$('#Input_Roteiro_Ano_edt').html(carregaAno());
		},10);
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

function listaRoteiroMultiplaEscolhas(anoEstudo,comboRoteiro,idAluno){
	
	//Retira ano_ da variavel 'anoEstudo' e coloca lista_combo_
	var idCombo =  "lista_combo_"+anoEstudo.substring(4);

	//Pega o valor do input com o ano do estudo
	var anoEstudo = $("#"+anoEstudo).val();
	
		//Busca os roteiros que podem ser atribuidos ao aluno (apenas os roteiros do ano seguinte)
	var dataRoteiroAno = getData("Roteiro/RoteiroAno", anoEstudo);
	//console.log(anoEstudo);
	//console.log(dataRoteiroAno);
	
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

/*Function para cadastrar atividade*/
function criarAtividade(nome,numero,descricao,objetivo,pagina,livro)
{
	var retorno;
	var valores = "nome="+nome+"&numero="+numero+"&descricao="+descricao+"&objetivo="+objetivo+"&paginaLivro="+pagina+"&livro="+livro+"&ativo=1";
	
	retorno = setCreateData("Atividade",valores);

	if(retorno != "erro"){
		mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		status = retorno;		
	}else{
		mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
		status = "erro";
	}
	return status;
}
/* ----------------------------------------------------------------------------------------------------------- */

var atvCount = 2;
var objCount = 1;

// Inserir Roteiro
function inserirRoteiro () {
	var anoRoteiro = $("#Input_Roteiro_Ano :selected").html();
	var anoEstudo = $("#Input_Roteiro_Ano").val();
	var nomeRoteiro = $("#Input_Roteiro_Nome").val();

	$("#Rot_Inserido_Info .Rot_Inserido_Ano").html(anoRoteiro+' ano | ');
	$("#Rot_Inserido_Info .Rot_Inserido_Nome").html(nomeRoteiro);
	$("#Inserir_roteiro").hide();
	$("#Roteiro_Inserido").show();
	$("#btnInserirRoteiro").hide();
	$("#btnSalvarObj").show();
	
	var idRoteiro = criarRoteiro(anoEstudo,nomeRoteiro,"");
	$('#id').val(idRoteiro);
}

/*Function para cadastrar roteiro*/
function criarRoteiro(anoEstudo,nome,descricao)
{
	var retorno;
	var status;
	var valores = "action=create&nome="+nome+"&descricao="+descricao+"&anoEstudo="+anoEstudo+"&ativo=1";
	
	retorno = setCreateDataRoteiro("Roteiro",valores);

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
function EditarRoteiro(idRoteiro){	
	var anoEstudo = $("#Input_Roteiro_Ano_edt").val();
	var anoEstudoTexto = $("#Input_Roteiro_Ano_edt :selected").html();
	var nome = $("#Input_Roteiro_Nome_edt").val();
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
			mensagem("Roteiro alterado com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		}
	});
}
function fecharBoxModal(){
	$('#boxModal').css('display','none');
}

function carregaAno(){
	HtmlContent = ""; 
	var selecionado = "";
	var anoParaEditar = $("#Input_Roteiro_Ano :selected").val();
    for(var b=0;b<dataAnoEstudo.length; b++)
    {
		if(anoParaEditar == dataAnoEstudo[b].idanoEstudo){	
			selecionado = 'selected';	
		}else{
			selecionado = '';
		}
        HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"' "+selecionado+" >"+(dataAnoEstudo[b].ano)+"º</option>";
    }
	
	return HtmlContent;
}

//Conferir num de linhas de objetivos inseridos
function confereLinhasObj() {
	if (numLinhas.length > 0) {
		$("#Objetivos_Inseridos").show();
	}
}

// Inserir Objetivo
function inserirObjetivoAtividade() {
	var objetivo = { 								//Objeto com as propriedades do objetivo a ser inserido
		nome: $(".Nome_Objetivo_Input").val(),
		numero: $(".Numero_Objetivo_Input").val()
	}; 
	
	var roteiro = $('#idRoteiro').val();
	var idObjetivo = criarObjetivo(objetivo.nome,objetivo.numero,"",roteiro);	

	if (idObjetivo) {
		$('#Objetivos_Inseridos_Container').css('height','33px');
	}	
	
	var atividadesCont = $('.Atividade_Linha');		//Contagem de quantos campos de atividade existem no formulário
	var atividadesLista = [];						//Matriz com todos os atributos referentes às atividades do objetivo

	for ( var i = 0; i < atividadesCont.length; i++ ) {
		atividadesLista[i] = {
			numero: $($(".numeroAtv").get(i)).val(),
			nome: $($(".nomeAtv").get(i)).val(),
			livro: $($(".livroAtv").get(i)).val(),
			pagLivro: $($(".paginaAtv").get(i)).val()
		}		
		var idAtividade = criarAtividade(atividadesLista[i].nome,atividadesLista[i].numero,"",idObjetivo,atividadesLista[i].pagLivro,atividadesLista[i].livro);	
		
		if(i+1 == atividadesCont.length){
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		}	
	}

	var linhaObjHtml = 
	'<div id="Obj_Inserido_'+objCount+'" class="Obj_Inserido">'+
	    '<div id="Obj_Inserido_Info_'+objCount+'" class="Obj_Inserido_Info" onclick="expandirObj('+objCount+')">'+
	        '<div id="Obj_Inserido_Num_'+objCount+'" class="Obj_Inserido_Num">'+objetivo.numero+'</div>'+
	        '<div id="Obj_Inserido_Nome_'+objCount+'" class="Obj_Inserido_Nome">'+objetivo.nome+'</div>'+
	        '<div id="Obj_Inserido_Btns_'+objCount+'" class="Obj_Inserido_Btns">'+
	            '<div id="Btn_Editar_Obj_'+objCount+'" class="Btn_Obj Btn_Editar_Obj"></div>'+
	            '<div id="Btn_Del_Obj_'+objCount+'" class="Btn_Obj Btn_Del_Obj"></div>'+
	        '</div>'+
	    '</div>';
	if ( atividadesCont.length > 0 ) {	        
		linhaObjHtml += 
		'<div id="Atvs_Obj_Inserido_'+objCount+'" class="Atvs_Obj_Inserido">';
		var alturaDiv=0;
		for(var i = 0; i < atividadesCont.length; i++) {
			linhaObjHtml +=
		    '<div id="Atv_Obj_Info_'+(i+1)+'" class="Atv_Obj_Info">'+
		        '<div id="Atv_Obj_Num_'+(i+1)+'" class="Atv_Obj_Num">'+atividadesLista[i].numero+'</div>'+
		        '<span id="Atv_Obj_Nome_'+(i+1)+'" class="Atv_Obj_Nome">'+atividadesLista[i].nome+'</span>'+
		        '<span id="Atv_Obj_Livro_'+(i+1)+'" class="Atv_Obj_Livro">'+atividadesLista[i].livro+'</span>'+
		        '<span id="Atv_Obj_Pag_'+(i+1)+'" class="Atv_Obj_Pag">p. '+atividadesLista[i].pagLivro+'</span>'+
		        '<div id="Atv_Inserida_Btns_'+(i+1)+'" class="Atv_Inserida_Btns">'+
		            '<div id="Btn_Editar_Atv_'+(i+1)+'" class="Btn_Atv Btn_Editar_Atv"></div>'+
		            '<div id="Btn_Del_Atv_'+(i+1)+'" class="Btn_Atv Btn_Del_Atv"></div>'+
		        '</div>'+
		    '</div>';	
		}
		linhaObjHtml +=
		'</div>';	        
	}
	linhaObjHtml +=
	'</div>';

	$("#Objetivos_Inseridos_Container").append(linhaObjHtml);
	objCount++
	atvCount = 2;

	var objLimpo = 
	'<div class="Roteiro_Linha">'+
        '<div class="Roteiro_Col_8">'+
            '<div class="Roteiro_Linha No_Padding_Itens">'+
                '<div class="Roteiro_Col_3">'+
                    '<input type="hidden" class="idObj"> </input>  '+
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
                    '<input type="text" class="Input_Area Numero_Objetivo_Input numeroObj" id="numeroObj'+objCount+'" value="'+objCount+'"></input>'+
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
                                '<div class="Atividade_Input valueNumero"><input class="Input_Area numeroAtv" id="numeroAtv1" value="1"></input></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="Roteiro_Col_4">'+
                        '<div class="Roteiro_Linha No_Padding_Itens">'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Info Input_Info"> Página Livro</div>'+
                            '</div>'+
                            '<div class="Roteiro_Col_6">'+
                                '<div class="Atividade_Input"><input class="Input_Area paginaAtv" id="paginaAtv1"></input></div>'+
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
        '</div>  '+
    '</div>';

    $("#Inserir_objetivo").html(objLimpo);
}

/*Function para cadastrar objetivo*/
function criarObjetivo(nome,numero,descricao,roteiro)
{	
	var retorno;
	var valores = "nome="+nome+"&numero="+numero+"&descricao="+descricao+"&roteiro="+roteiro+"&ativo=1";
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

// Expandir objetivo
function expandirObj(id) {
	var objetivoCont = $('.Obj_Inserido_Info');
	var atvsCont = $('#Atvs_Obj_Inserido_'+id+' .Atv_Obj_Info');
	var objsCount = $('.Obj_Inserido_Info');
	var alturaAtvContainer = atvsCont.length * 30;
	var alturaContainer = objsCount.length * 33;

	for (var i = 0; i < objetivoCont.length; i++) {
		if ( i+1 == id ) {
			if ( $('#Atvs_Obj_Inserido_'+id).hasClass('Atvs_Expandido') ) {
				$('#Atvs_Obj_Inserido_'+id).removeClass('Atvs_Expandido');
				$('#Objetivos_Inseridos_Container').css('height',alturaContainer+'px');
				$('#Atvs_Obj_Inserido_'+id).height('0px');
			} else {
				$('#Atvs_Obj_Inserido_'+id).addClass('Atvs_Expandido');
				$('#Objetivos_Inseridos_Container').css('height',alturaContainer+alturaAtvContainer+'px');
				$('#Atvs_Obj_Inserido_'+id).height(alturaAtvContainer);
			}
		} else {
			if ( $($('.Atvs_Obj_Inserido').get(i)).hasClass('Atvs_Expandido') ) {
				$($('.Atvs_Obj_Inserido').get(i)).removeClass('Atvs_Expandido');
			}
			$($('.Atvs_Obj_Inserido').get(i)).height('0px');
		}
	}
}

// Adicionar campos para nova atividade

function adicionarAtividade() {
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
	                    '<div class="Atividade_Input valueNumero"><input class="Input_Area numeroAtv" id="numeroAtv'+atvCount+'" value="'+atvCount+'"></input></div>'+
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
		alterar = "&nome="+nomeObj+"&numero="+numeroObj+"&descricao="+descricao+"&roteiro="+roteiroObj+"&ativo=1&id="+id;		
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
		alterar ="&nome="+nomeAtv+"&numero="+numeroAtv+"&descricao="+descricao+"&objetivo="+objetivoAtv+"&paginaLivro="+paginaAtv+"&livro="+livroAtv+"&ativo=1&id="+idAtv,				
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
		console.log('8');
		return false;
	}else{
		mensagem("Erro ao alterar!","OK","bt_ok","erro")
		loading('final');
		return false;
	}
}

function excluirROA(servico,id){
	mensagem("Deseja realmente excluir?","Cancelar","bt_cancelar","confirm",servico,id,"excluirRegistro");
}

function excluirRegistro(servico,id){
	var dataServico = getData(servico,id);
	

	if(servico == "Roteiro"){		
		alterar = "&nome="+dataServico.nome+"&descricao="+dataServico.descricao+"&anoEstudo="+dataServico.anoEstudo.idanoEstudo+"&ativo=0&id="+id;
		$("#rot_"+id).remove();
		msg = "Roteiro excluído com sucesso!";		
	}else if(servico == "Objetivo"){			
		alterar = "&nome="+dataServico.nome+"&numero="+dataServico.numero+"&descricao="+dataServico.descricao+"&roteiro="+dataServico.roteiro.idroteiro+"&ativo=0&id="+id;		
		$("#obj_"+id).remove();
		msg = "Objetivo excluído com sucesso!";	
	}else if(servico == "Atividade"){	
		alterar ="&nome="+dataServico.nome+"&numero="+dataServico.numero+"&descricao="+dataServico.descricao+"&objetivo="+dataServico.objetivo.idobjetivo+"&paginaLivro="+dataServico.paginaLivro+"&livro="+dataServico.livro+"&ativo=0&id="+id,				
		$("#atv_"+id).remove();	
		msg = "Atividade excluída com sucesso!";		
	}
	//console.log(alterar);
	
	var retorno = setUpdateData(servico,alterar,id);
	if(retorno != "erro"){
		$( "#boxMensagemGeral" ).hide();
		return mensagem(msg,"OK","bt_ok","sucesso");			
	}else{
		$( "#boxMensagemGeral" ).hide();
		return mensagem("Erro ao alterar!","OK","bt_ok","erro");
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

