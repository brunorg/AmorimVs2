/*global $:false */
'use strict';

function criarPainelDoGrupo(idDivPrincipal, idDivGrupo, dados) {

	$('#' + idDivPrincipal).append('<div class="grupoBox" id="' + idDivGrupo + '"></div>');
	$('#' + idDivGrupo).append('<div class="grupoBlocoNomes"></div>')
	$('#' + idDivGrupo + " .grupoBlocoNomes").append('<div class="grupoNome">' + 'Grupo 6M1' + '</div>') //Nome do grupo
	$('#' + idDivGrupo + " .grupoBlocoNomes").append('<div class="caixaGL"></div>')
	$('#' + idDivGrupo + " .grupoBlocoNomes").append('<div class="grupoBlocoGraficoObj"></div>')
	$('#' + idDivGrupo + " .grupoBlocoNomes .grupoBlocoGraficoObj").append('<div class="grupoGraficoTitulo grupoTituloBottom">OBJETIVOS</div>')

	//criarPaineisDosAlunos(idDivGrupo) ;
}

function criarPaineisDosAlunos(idDivGrupo) {
	for (var i = 5; i > 0; i--) {

		criarBarrinhas(idDivGrupo + 'aluno' + i, dadosAluno);
	}

}

function adicionarBarrinhasNoHtml(id) {

	// Adiciona as divs de barrinha de progressão do aluno
	$('#' + id + ' td:first-child').html('<div class="barrinhaPorcentagem atual"></div>'+
	                                     '<div class="barrinhaPorcentagem atualCorrigido"></div>'+
	                                     '<div class="barrinhaPorcentagem anterior"></div>'+
	                                     '<div class="barrinhaPorcentagem anteriorCorrigido"></div>'+
	                                     '<div class="barrinhaPorcentagem proxima"></div>'+
	                                     '<div class="barrinhaPorcentagem proximaCorrigido"></div>');

	// Adiciona as divs de barrinha de faltas do mesmo aluno
	$('#' + id + 'freq' + ' td:first-child').html('<div class="barrinhaPorcentagem diasLetivos"></div>'+
                                    			  '<div class="barrinhaPorcentagem diasLetivosFaltas"></div>');
}

function criarBarrinhas(id, dados) {

	//Adiciona as divs das barrinhas, todas tem 0 de largura por padrão
	adicionarBarrinhasNoHtml(id);

	// Pega o tamanho da div que irá conter as barrinhas e define tamanho fixo de um ponto percentual dentro dela
	var primeiraTabela = document.getElementById(id);
	var primeiraTabelaRect = primeiraTabela.getBoundingClientRect();
	var primeiraTabelaLargura = primeiraTabelaRect.width - 18;
	var tamanhoPontoPercentual = primeiraTabelaLargura / 100;

	var segundaTabela = document.getElementById(id + 'freq');
	var segundaTabelaRect = segundaTabela.getBoundingClientRect();
	var segundaTabelaLargura = segundaTabelaRect.width - 18;
	var tamanhoPontoPercentual2 = segundaTabelaLargura / 100;

	// Define tamanho de cada barrinha de acordo com os dados
	$('#' + id + 		  ' .atual'				).css('width', dados.atual 				* tamanhoPontoPercentual);
	$('#' + id + 		  ' .atualCorrigido'	).css('width', dados.atualCorrigido 	* tamanhoPontoPercentual);
	$('#' + id + 		  ' .anterior'			).css('width', dados.anterior 			* tamanhoPontoPercentual);
	$('#' + id + 		  ' .anteriorCorrigido'	).css('width', dados.anteriorCorrigido 	* tamanhoPontoPercentual);
	$('#' + id + 		  ' .proxima'			).css('width', dados.proxima 			* tamanhoPontoPercentual);
	$('#' + id + 		  ' .proximaCorrigido'	).css('width', dados.proximaCorrigido 	* tamanhoPontoPercentual);
	$('#' + id + 'freq' + ' .diasLetivos'		).css('width', dados.diasLetivos 		* tamanhoPontoPercentual2);
	$('#' + id + 'freq' + ' .diasLetivosFaltas'	).css('width', dados.diasLetivosFaltas 	* tamanhoPontoPercentual2);
}

// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv Debug vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

var aluno1dados = {
	'atual' 			: 75,
	'atualCorrigido' 	: 25,
	'anterior'			: 100,
	'anteriorCorrigido' : 100,
	'proxima'			: 10,
	'proximaCorrigido'	: 5,
	'diasLetivos'		: 100,
	'diasLetivosFaltas'	: 10
};

var aluno2dados = {
	'atual' 			: 50,
	'atualCorrigido' 	: 10,
	'anterior'			: 0,
	'anteriorCorrigido' : 0,
	'proxima'			: 0,
	'proximaCorrigido'	: 0,
	'diasLetivos'		: 25,
	'diasLetivosFaltas'	: 10
};

var dados = {
	"grupo1"
}


window.onload = function() {

	criarPainelDoGrupo('divPrincipalGrupos', 'grupo1', dados);

	//criarBarrinhas('aluno1', aluno1dados);
	//criarBarrinhas('aluno2', aluno2dados);

};

