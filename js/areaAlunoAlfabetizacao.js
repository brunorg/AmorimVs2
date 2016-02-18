//---------------------------------------------------------

	var d = new Date
	var diaHoje = d.getDay() != (0 || 6) ? d.getDay():1;
	var horarios = [7, 8, 9, 10, 11]

	var diasSemana = {
		"1" : "Segunda",
		"2" : "Terça",
		"3" : "Quarta",
		"4" : "Quinta",
		"5" : "Sexta"
	}

	//Blog Oficina

	var categorias = {
		"aba_roteiros" : 102,
		"aba_tutoria" : 102,
		"aba_leitura_escrita" : 102,
		"aba_educacao_fisica" : 104,
		"aba_artes" : 102,
		"aba_matematica" : 102,
		"aba_ingles" : 102,
		"aba_arte_ciencia" : 102

	}

//---------------------------------------------------------
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}


$(document).ready(function() {
	
	loadBlogCategorias();

	$(".aba_oficina").click(function(){
		toggleTabOficina(this);
	});

	$(".oficina_planejamento").click(function(){
		triggerAccordion(this);
	});

	$(".aba_box_lateral").click(function() {
		toggleTabLateral(this);
	});

	$("#abas_mensagens").children("span").click(function() {
		toggleTabMensagens(this);
	});
	$(".mensagem_post").click(function() {
		toggleMensagem(this);
	});


	$('.tabela_rotina .seta_proximo').click(function(){
		mudarDataRotinaProxima();
	});

	$('.tabela_rotina .seta_anterior').click(function(){
		mudarDataRotinaAnterior();
	});

	$(".aba_mural").click(function(){
		toggleTabMural();
	});

	$(".aba_rotina").click(function(){
		toggleTabRotina();
	});

	$(".aba_box_lateral").filter(":first").trigger("click");
	$("#abas_mensagens").children("span").filter(":first").trigger("click");

	$("#blog_oficina_container").mCustomScrollbar({axis: "y"});
	$("#mural_container").mCustomScrollbar({axis: "y"});

	var urlParams = getQueryParams(document.location.search)

	if (urlParams["aba"]) {
		$('#parteDoC2').hide()

		$('.aba_'+urlParams["aba"]).trigger("click");
	} else {
		$('#Conteudo_Area').hide()
		//$(".aba_oficina").filter(":first").trigger("click");
	}

});

window.onload = function() {
	
}

function toggleTabOficina(tab) {
	$(".aba_oficina").removeClass("aba_ativa");
	$(tab).addClass("aba_ativa");

	var classAbaAtiva = $(tab).attr("class").split(/\s+/)[1];
	toggleBarOficina(classAbaAtiva);

	carregaServicoBlog(classAbaAtiva);
}

function toggleBarOficina(classOficina) {
	var oficina = classOficina.slice(4);
	$("#faixa_oficina").css("background-image","url(img/alfabetizacao/faixa_"+oficina+".png)");
}

//----------

function loadBlogCategorias(){

	$.ajax({
		url: path + "Oficina/ListarPorAluno/" + getAVariavelByAluno(alunoID),
		async: false,
		type: "GET",
		crossDomain: true,
		//beforeSend:	function()		{ loading("inicial"); },
		success:	function(data)	{ 
			
			for(var valor of data)
			{
				switch(valor.tipoOficina.idTipoOficina)
				{
					case 1:
					break;
					case 2:
						categorias.aba_educacao_fisica = valor.idoficina;
					break;
					case 3:
						categorias.aba_matematica = valor.idoficina;
					break;
					case 4:
						categorias.aba_artes = valor.idoficina;
					break;
					case 5:
						categorias.aba_leitura_escrita = valor.idoficina;
					break;
					case 6:
					break;
					case 7:
					break;
					case 8:
						categorias.aba_ingles = valor.idoficina;
					break;
						//categorias.aba_roteiros = valor.idoficina;
						//categorias.aba_tutoria = valor.idoficina;
						//categorias.aba_arte_ciencia = valor.idoficina;
				}
			}

		},
		//complete:	function()		{ loading("final"); }
	});

}

function getImagemPorPostagem(idpostagem) {
	var retorno;

	$.ajax({
		url: path + "Blog/ImagemMed/" + idpostagem,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dImagem) { retorno = dImagem; }
	});

	return retorno;
}

function carregaServicoBlog(classe) {

	var campo = classe;

	$.ajax({
		url: path + "Blog/BlogOficina/" + categorias[campo],
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function() 			{ loading("inicial"); },
		success: function(result) {

			var html = "";

			for(var valor of result)
			{


				html+= '<div class="cx_postagem">';
				html+= '	<h1 class="cx_titulo">'+valor.titulo+'</h1>';
				html+= '	<h2 class="cx_info">11/11/2015 por Hellen Ribeiro</h2>';
				if(valor.imagem){
					html+= '	<img class="img_postagem" src="'+getImagemPorPostagem(valor.idblog)+'" alt="Espaço Catavento" />';
				}
				html+= '	<p class="cx_texto">'+valor.descricao+'</p>';
				html+= '	<p class="cx_texto">'+valor.descricao+'</p>';
				html+= '	<p class="cx_texto">'+valor.descricao+'</p>';
				html+= '	<hr class="fim_postagem" />';
				html+= '</div>';

			}

			$("#blog_postagens_container").html(html);

		},
		complete: 	function() 			{ loading("final"); }
	});

}


//----------


function mudarDataRotinaProxima () {
	diaHoje = diaHoje != 5 ? (diaHoje+1):1;
	console.log(diaHoje);
	carregaValoresRotina();
}


function mudarDataRotinaAnterior () {
	diaHoje = diaHoje != 1 ? (diaHoje-1):5;
	carregaValoresRotina();
}




function toggleTabRotina() {
	carregaValoresRotina();
}

function carregaValoresRotina(){

	$('.tabela_rotina thead tr th.rotina_dia').html(diasSemana[diaHoje]);

	var periodoNumero = JSON.parse(localStorage.getItem('objetoAlunoVariavel')).periodo.idperiodo;
	//var periodoNumero = 9;

	var horariosManha = {
		"07:00":null,
		"08:00":null,
		"09:00":null,
		"10:00":null,
		"10:30":null,
		"11:00":null
	};

	var horariosTarde = {
		"13:00":null,
		"14:00":null,
		"15:00":null,
		"15:30":null,
		"16:00":null,
		"17:00":null
	};

	$.ajax({
		url: path+"Rotina/RotinaDiariaAluno/"+getAVariavelByAluno(alunoID)+"/"+diaHoje,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(result) {

			//result.forEach(function(value, i){
			for(var i=0; i<6;i++)
			{

				var html = '';

				if((periodoNumero == 8 && i == 3) || (periodoNumero == 9 && i == 2))
				{
					html+=  '<td style="background-color:#FBB040">';
					html+= 	'	<img src="img/alfabetizacao/horario_'+(periodoNumero == 8 ? 10:15)+'h00.png" alt="'+(periodoNumero == 8 ? 10:15)+'h00">';
					html+= 	'</td>';
					html+= 	'<td class="recreio" colspan="2">';
					html+= 	'</td>';

				} else {
					if(result[i])
					{
						html+= '<td>';
						html+= '	<img src="img/alfabetizacao/horario_0'+result[i].hora+'h00.png" alt="0'+result[i].hora+'h00">';
						html+= '</td>';
						html+= '<td style="background-color: '+result[i].sala[0].rotina.oficina.tipoOficina.cor.forte+'">';
						html+= '	<div>'+result[i].oficina.tipoOficina.nome+'</div>';
						html+= '	<div>'+result[i].professor+'</div>';
						html+= '</td>';
						html+= '<td title="SALA DE INFORMÁTICA">'+result[i].sala[0].sala.sala+'</td>';
					} else {
						html+= '<td>';
						html+= '</td>';
						html+= '<td style="background-color:#ebeae5;">';
						html+= '</td>';
						html+= '<td></td>';
					}
				}




				$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').html(html);

			}
			//});

			/*if(periodoNumero == 8){
				for(var i=0; i<6;i++){
					$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').html(horariosManha[i]);
				}
			} else if(periodoNumero == 9){
				for(var i=0; i<6;i++){
					$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').html(horariosTarde[i]);
				}

			}*/

		}
	});	
}


function toggleTabMural() {

	$('#mural_posts_container').html("");

	$.ajax({
		url: path + "MuralAluno/ListarAluno/" + getAVariavelByAluno(alunoID),
		async: false,
		crossDomain: true,
		type: "GET",
		success: function (data){

			for(var valor of data)
			{
				var html = "";

				html += '<div class="mural_post">'
				html += '	<h1>'
				html += '		<span>'+valor.mural.professor.nome+'</span>'
				html += '		<span>'+(valor.mural.data).replace(/-/g,"/")+'</span>'
				html += '	</h1>'
				html += '	<p>'+valor.mural.mensagem+'</p>'
				html += '</div>	'
				
				$('#mural_posts_container').append(html);

			}
		
		}
	});
}

//----------

function triggerAccordion(accordionItem) {
	$(".oficina_planejamento").not(accordionItem).each(function(){
		$(this).removeClass("planejamento_aberto");
		$(this).find(".roteiro_conteudo").slideUp();
	});

	if ( $(accordionItem).hasClass("planejamento_aberto") ) {
		$(accordionItem).removeClass("planejamento_aberto");
		$(accordionItem).find(".roteiro_conteudo").slideUp();
	} else {
		$(accordionItem).addClass("planejamento_aberto");
		$(accordionItem).find(".roteiro_conteudo").slideDown();
	}
}

function toggleTabLateral(tab) {
	var classeBox = $(tab).attr("class").split(/\s+/)[1];
	var box = classeBox.slice(4);

	$(".aba_box_lateral").removeClass("aba_ativa");
	$(".box_lateral").hide();

	$(tab).addClass("aba_ativa");
	$(".box_"+box).show();
}

function toggleTabMensagens(tab) {
	$("#abas_mensagens").find("span").removeClass("aba_mensagem_ativa");
	$(tab).addClass("aba_mensagem_ativa");
}
function toggleMensagem(item) {
	if ($(item).hasClass("post_ativo")) {
		$(item).removeClass("post_ativo");
		$(".mensagem_post").show();
		$(".mensagem_post_conteudo").hide();
	} else {
		$(".mensagem_post").not(item).hide();
		$(item).addClass("post_ativo");
		$(item).next(".mensagem_post_conteudo").show();
	}

	if ($(item).hasClass("mensagem_nao_lida")) {
		$(item).removeClass("mensagem_nao_lida");
	}
}