function GraficoAluno(id, atual, atualCorrigido, anterior, anteriorCorrigido, proxima, proximaCorrigido, diasLetivos, diasLetivosFaltas) {

	$("#" + id + " td:first-child").html('<div class="barrinhaPorcentagem atual"></div>'+
                                    '<div class="barrinhaPorcentagem atualCorrigido"></div>'+
                                    '<div class="barrinhaPorcentagem anterior"></div>'+
                                    '<div class="barrinhaPorcentagem anteriorCorrigido"></div>'+
                                    '<div class="barrinhaPorcentagem proxima"></div>'+
                                    '<div class="barrinhaPorcentagem proximaCorrigido"></div>')

	$("#" + id + "freq" + " td:first-child").html('<div class="barrinhaPorcentagem diasLetivos"></div>'+
                                    '<div class="barrinhaPorcentagem diasLetivosFaltas"></div>')

	this.element = document.getElementById(id);
	this.bounds = this.element.getBoundingClientRect();

	this.containterWidth = this.bounds.width - 15;

	this.percentageSize = this.containterWidth / 100;

	$("#" + id + " .atual").css("width", atual * this.percentageSize)
	$("#" + id + " .atualCorrigido").css("width", atualCorrigido * this.percentageSize)
	$("#" + id + " .anterior").css("width", anterior * this.percentageSize)
	$("#" + id + " .anteriorCorrigido").css("width", anteriorCorrigido * this.percentageSize)
	$("#" + id + " .proxima").css("width", proxima * this.percentageSize)
	$("#" + id + " .proximaCorrigido").css("width", proximaCorrigido * this.percentageSize)

	this.element2 = document.getElementById(id + "freq");
	this.bounds2 = this.element2.getBoundingClientRect();

	this.containterWidth2 = this.bounds2.width - 15;

	this.percentageSize2 = this.containterWidth2 / 100;

	$("#" + id + "freq" + " .diasLetivos").css("width", diasLetivos * this.percentageSize2)
	$("#" + id + "freq" + " .diasLetivosFaltas").css("width", diasLetivosFaltas * this.percentageSize2)
	

}

var aluno1dados = {
	"atual" 			: 75,
	"atualCorrigido" 	: 25,
	"anterior"			: 100,
	"anteriorCorrigido" : 100,
	"proxima"			: 10,
	"proximaCorrigido"	: 5,
	"diasLetivos"		: 100,
	"diasLetivosFaltas"	: 10
}

var aluno2dados = {
	"atual" 			: 50,
	"atualCorrigido" 	: 10,
	"anterior"			: 0,
	"anteriorCorrigido" : 0,
	"proxima"			: 0,
	"proximaCorrigido"	: 0,
	"diasLetivos"		: 25,
	"diasLetivosFaltas"	: 10
}


document.onready = function() {
	var gfxAluno1 = new GraficoAluno("aluno1", aluno1dados["atual"], aluno1dados["atualCorrigido"], aluno1dados["anterior"], aluno1dados["anteriorCorrigido"], aluno1dados["proxima"], aluno1dados["proximaCorrigido"], aluno1dados["diasLetivos"], aluno1dados["diasLetivosFaltas"]);
	var gfxAluno2 = new GraficoAluno("aluno2", aluno2dados["atual"], aluno2dados["atualCorrigido"], aluno2dados["anterior"], aluno2dados["anteriorCorrigido"], aluno2dados["proxima"], aluno2dados["proximaCorrigido"], aluno2dados["diasLetivos"], aluno2dados["diasLetivosFaltas"]);
}

