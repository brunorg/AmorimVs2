/*global $:false */
'use strict';

function criarPainelDoGrupo(idDivPrincipal, idDivGrupo, retornoAjax, professorId, tutoriaId) {

	$('#' + idDivPrincipal).append('<div class="grupoBox" id="' + idDivGrupo + '"></div>');

	$('#' + idDivGrupo).append('<div class="grupoBlocoNomes"></div>')
	$('#' + idDivGrupo + " .grupoBlocoNomes").append('<div class="grupoNome">Professores</div>') //Nome do grupo
	$('#' + idDivGrupo + " .grupoBlocoNomes").append('<div class="caixaGL"></div>')

	$('#' + idDivGrupo).append('<div class="grupoBlocoGraficoObj"></div>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj").append('<div class="grupoGraficoTitulo grupoTituloBottom">OBJETIVOS</div>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj").append('<table class="grupoTabela"></table>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela").append('<thead></thead>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela").append('<tbody></tbody>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela thead").append('<th>5</th><th>10</th><th>15</th><th>20</th><th>25</th><th>30</th><th>35</th><th>40</th><th>45</th><th>50</th><th>55</th><th>60</th><th>65</th><th>70</th><th>75</th><th>80</th><th>85</th><th>90</th><th>95</th><th>100</th><th>%</th>')
	$('#' + idDivGrupo).append('<div class="grupoBlocoGraficoFreq"></div>')

	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq").append('<div class="grupoGraficoTituloLeft">FREQUÊNCIA</div>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq").append('<table class="grupoTabela grupoTabelaFreq"></table>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq").append('<div class="caixaGR"></div>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela").append('<thead></thead>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela").append('<tbody></tbody>')
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela thead").append('<th>10</th><th>20</th><th>30</th><th>40</th><th>50</th><th>60</th><th>70</th><th>80</th><th>90</th><th>100</th><th>%</th>')

	criarPaineisDosAlunos(idDivGrupo, retornoAjax);

}

function criarPaineisDosAlunos(idDivGrupo, retornoAjax) {

	for (var i = retornoAjax.length - 1; i >= 0; i--) {

		$('#' + idDivGrupo + " .grupoBlocoNomes .caixaGL").append('<div class="grupoLinhaAluno borderLeft" id="aluno' + i + '"></div>')

		$('#' + idDivGrupo + " .grupoBlocoNomes .caixaGL .grupoLinhaAluno#aluno" + i).append('<div class="grupoFotoAluno"></div>')
		$('#' + idDivGrupo + " .grupoBlocoNomes .caixaGL .grupoLinhaAluno#aluno" + i + " .grupoFotoAluno").append('<img src="' + retornoAjax[i].foto + '"></img>' + '</a	>')

		$('#' + idDivGrupo + " .grupoBlocoNomes .caixaGL .grupoLinhaAluno#aluno" + i).append('<div class="grupoNomeAluno"></div>')
		$('#' + idDivGrupo + " .grupoBlocoNomes .caixaGL .grupoLinhaAluno#aluno" + i + " .grupoNomeAluno").append('<span>' + abreviaNome(retornoAjax[i].nome) + '</span>' + '</a>')



		$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela tbody").append('<tr id="aluno' + i + '"></tr>')
		$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela tbody tr#aluno" + i).append('<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class="ultimaColunaBBranca"></td>')
		if (i != 0) {
			$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela tbody").append('<tr class="tableSeparacao"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
		}

		$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela tbody").append('<tr id="aluno' + i + 'freq"></tr>')
		$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela tbody tr#aluno" + i + "freq").append('<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class="ultimaColunaBBranca"></td>')
		if (i != 0) {
			$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela tbody").append('<tr class="tableSeparacao"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
		}
		$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .caixaGR").append('<div class="grupoLinhaAluno grupoLinhaAlunoTop borderRight"><div class="grupoGraficoFreqTitulo"><h1 class="freqTitulo">Dias letivos</h1><h2 class="anoLetivo" id="anoLetivo">' + 0 +'</h2><h1 class="freqTitulo">Faltas</h1><h2 class="faltas" id="faltas">' + 0 + '</h2></div></div>')

		criarBarrinhas(idDivGrupo, 'aluno' + i, retornoAjax[i]);
	};

}

function adicionarBarrinhasNoHtml(idDivGrupo, id) {

	// Adiciona as divs de barrinha de progressão do aluno
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela tbody" + ' #' + id + ' td:first-child').html('<div class="barrinhaPorcentagem atual"></div>'+
	                                     '<div class="barrinhaPorcentagem atualCorrigido"></div>');

	// Adiciona as divs de barrinha de faltas do mesmo aluno
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela tbody" + ' #' + id + 'freq' + ' td:first-child').html('<div class="barrinhaPorcentagem diasLetivos"></div>'+
                                    			  '<div class="barrinhaPorcentagem diasLetivosFaltas"></div>');
}

function criarBarrinhas(idDivGrupo, id, dadosAluno) {

	//Adiciona as divs das barrinhas, todas tem 0 de largura por padrão
	adicionarBarrinhasNoHtml(idDivGrupo, id);

	// Pega o tamanho da div que irá conter as barrinhas e define tamanho fixo de um ponto percentual dentro dela

	var tamanhoPontoPercentual = 317 / 100;

	var tamanhoPontoPercentual2 = 157 / 100;

	var dadosAluno2 = {
		'atual' 			: dadosAluno.objetivos.completos * 100,
		'atualCorrigido' 	: dadosAluno.objetivos.corrigidos * 100,
		'diasLetivos'		: 0 * 100,
		'diasLetivosFaltas'	: 0 * 100,
	};

	// Define tamanho de cada barrinha de acordo com os dadosAluno
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela tbody"  + ' #' + id + 		  ' .atual'				).css('width', dadosAluno2.atual 				* tamanhoPontoPercentual);
	$('#' + idDivGrupo + " .grupoBlocoGraficoObj .grupoTabela tbody"  + ' #' + id + 		  ' .atualCorrigido'	).css('width', dadosAluno2.atualCorrigido		* tamanhoPontoPercentual);
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela tbody" + ' #' + id + 'freq' + ' .diasLetivos'		).css('width', dadosAluno2.diasLetivos 			* tamanhoPontoPercentual2);
	$('#' + idDivGrupo + " .grupoBlocoGraficoFreq .grupoTabela tbody" + ' #' + id + 'freq' + ' .diasLetivosFaltas'	).css('width', dadosAluno2.diasLetivosFaltas 	* tamanhoPontoPercentual2);
}


var totalDiasLetivos = diasLetivos();

window.onload = function() {

	$.ajax({
        url: path + "ProfessorFuncionario/DadosTutoriaProfessores/",
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(retornoAjax){
        	if (retornoAjax.length === 0) {
        		$("#divPrincipalGrupos").append('<p>Não há grupos para serem exibidos.</p>')
        	}

                criarPainelDoGrupo('divPrincipalGrupos', 'grupo1', retornoAjax);


        },
        error: function(a, status, error) {
            console.log(status + " /// " + error);
        }//,
        //beforeSend: function(){
        //	loading("inicial");
        //}
    });

	//criarBarrinhas('aluno1', aluno1dados);
	//criarBarrinhas('aluno2', aluno2dados);

};

