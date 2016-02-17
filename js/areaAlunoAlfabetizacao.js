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

	$(".aba_oficina").filter(":first").trigger("click");
	$(".aba_box_lateral").filter(":first").trigger("click");
	$("#abas_mensagens").children("span").filter(":first").trigger("click");

	$("#blog_oficina_container").mCustomScrollbar({axis: "y"});
	$("#mural_container").mCustomScrollbar({axis: "y"});

	var urlParams = getQueryParams(document.location.search)

	if (urlParams["aba"]) {
		$('#parteDoC2').hide()
	} else {
		$('#Conteudo_Area').hide()
	}

});

window.onload = function() {
	
}

function toggleTabOficina(tab) {
	$(".aba_oficina").removeClass("aba_ativa");
	$(tab).addClass("aba_ativa");

	var classAbaAtiva = $(tab).attr("class").split(/\s+/)[1];
	toggleBarOficina(classAbaAtiva);
}

function toggleBarOficina(classOficina) {
	var oficina = classOficina.slice(4);
	$("#faixa_oficina").css("background-image","url(img/alfabetizacao/faixa_"+oficina+".png)");
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

	$.ajax({
		url: path+"Rotina/RotinaDiariaAluno/"+getAVariavelByAluno(alunoID)+"/"+diaHoje,
		//url: path+"Rotina/RotinaDiariaAluno/"+getAVariavelByAluno(alunoID)+"/"+2,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(result) {

			result.forEach(function(value, i){

				var html = '';


				if((periodoNumero == 8 && i == 3) || (periodoNumero == 9 && i == 2))
				{
					html+=  '<td>';
					html+= 	'	<img src="img/alfabetizacao/horario_10h00.png" alt="10h00">';
					html+= 	'</td>';
					html+= 	'<td class="recreio" colspan="2">';
					html+= 	'</td>';

				} else {
					html+= '<td>';
					html+= '	<img src="img/alfabetizacao/horario_0'+value.hora+'h00.png" alt="0'+value.hora+'h00">';
					html+= '</td>';
					html+= '<td style="background-color: '+value.sala[0].rotina.oficina.tipoOficina.cor.forte+'">';
					html+= '	<div>'+value.oficina.tipoOficina.nome+'</div>';
					html+= '	<div>'+value.professor+'</div>';
					html+= '</td>';
					html+= '<td title="SALA DE INFORMÁTICA">'+value.sala[0].sala.sala+'</td>';
				}

				$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').html(html);

				//$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').find('td:nth-child(1)').html('<img src="img/alfabetizacao/horario_0'+value.hora+'h00.png" alt="0'+value.hora+'h00">');
				//$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').find('td:nth-child(2)').find('div:nth-child(1)').html(''+value.oficina.tipoOficina.nome);
				//$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').find('td:nth-child(2)').find('div:nth-child(2)').html(''+value.professor);
				//$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').find('td:nth-child(3)').html(''+value.sala[0].sala.sala);
			});

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