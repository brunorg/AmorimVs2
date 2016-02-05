//Carrega a funçao de Load do JQuery

(function ( $ ) {

	function createDivHeader(thisNode) {
		var headerDiv = document.createElement("div");
		var arrowLeftDiv = document.createElement("div");
		var centerLargeDiv = document.createElement("div");
		var arrowRightDiv = document.createElement("div");

		headerDiv.style.width = "245px";
		headerDiv.style.height = "35px";

		arrowLeftDiv.style.width = "35px"
		arrowLeftDiv.style.height = "35px"
		arrowLeftDiv.style.display = "inline-block"
		arrowLeftDiv.style.backgroundColor = "purple"
		arrowLeftDiv.id = "calendarLeftArrow"

		centerLargeDiv.style.width = "175px"
		centerLargeDiv.style.height = "35px"
		centerLargeDiv.style.display = "inline-block"
		centerLargeDiv.id = "calendarMonthName"

		arrowRightDiv.style.width = "35px"
		arrowRightDiv.style.height = "35px"
		arrowRightDiv.style.display = "inline-block"
		arrowRightDiv.style.backgroundColor = "black"
		arrowRightDiv.id = "calendarRightArrow"

		headerDiv.appendChild(arrowLeftDiv)
		headerDiv.appendChild(centerLargeDiv)
		headerDiv.appendChild(arrowRightDiv)

		thisNode.appendChild(headerDiv);
	}

	function createDivDays(thisNode, divId, days) {

		var daysDiv = document.createElement("div");

		daysDiv.style.width = "245px";
		daysDiv.style.height = "35px";
		daysDiv.id = divId;

		var i = 0
		days.forEach(function(displayDay) {
			var dayDiv = document.createElement("div");
			dayDiv.style.width = "35px"
			dayDiv.style.height = "35px"
			dayDiv.style.display = "inline-block"

			var displayDaySpan = document.createElement("span");
			displayDaySpan.id = "weekCalendarDay" + i;

			displayDaySpan.innerHTML = displayDay
			dayDiv.appendChild(displayDaySpan)
			daysDiv.appendChild(dayDiv)
			i++
		})

		thisNode.appendChild(daysDiv);
	}

	function getAtualWeek(todayNumber, todayName) {

		var thisWeekNumbers = [todayNumber]

		for (var i = todayNumber-1; i >= todayNumber - todayName; i--) {
			var day = new Date()
			day.setDate(i)
			thisWeekNumbers.unshift(day.getDate())
		};

		for (var i = todayNumber+1; i <= todayNumber + (6 - todayName); i++) {
			var day = new Date()
			day.setDate(i)
			thisWeekNumbers.push(day.getDate())
		};

		return thisWeekNumbers
	}

	function updateMonth(date, months) {

		$("#calendarMonthName").empty()
		$("#calendarMonthName").html('<span id="calendarMonthYear">' + months[date.getMonth()] + " " + date.getFullYear() + '</span>')

	}

	$.fn.weekdisplay = function( offset ) {

		var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

		var thisNode = this[0];

		var date = new Date()

		if (offset === undefined) {

			$(this).empty()

			this.css("width", "245px");
			this.css("height", "105px");

			var todayName = date.getDay()
			var todayNumber = date.getDate()

			createDivHeader(thisNode)
			createDivDays(thisNode, "daysName", ["D", "S", "T", "Q", "Q", "S", "S"])
			createDivDays(thisNode, "daysNumber", getAtualWeek(todayNumber, todayName))

		} else {

			date.setDate(date.getDate() + offset)

			$('#daysNumber').empty()
			$('#daysNumber').remove()

			var todayName = date.getDay()
			var todayNumber = date.getDate()

			createDivDays(thisNode, "daysNumber", getAtualWeek(todayNumber, todayName))

		}

		updateMonth(date, months)

		return this;
	}

}( jQuery ));

function adicionarClickCasas() {
	for (var k = 1; k <= 5; k++) {
		for (var i = 0; i <= 6; i++) {
			var casa = document.getElementById('Aluno' + k + 'Dia' + i)
			casa.onclick = toggleDia
		};
	};
}

function toggleDia() {
	if (this.innerHTML == "O") {
		this.innerHTML = "X"
	} else {
		this.innerHTML = "O"
	}
}

$(document).ready(function(){

	$( "#weekdisplay" ).weekdisplay()

	window.dayOffsetWeekCalendar = 0

	$('#calendarRightArrow').click(function(){
		window.dayOffsetWeekCalendar += 7
		$( "#weekdisplay" ).weekdisplay(window.dayOffsetWeekCalendar)
	})

	$('#calendarLeftArrow').click(function(){
		window.dayOffsetWeekCalendar -= 7
		$( "#weekdisplay" ).weekdisplay(window.dayOffsetWeekCalendar)
	})

	adicionarClickCasas()

    // $( "#datepickerFaltas" ).datepicker({
    //     showOn: "button",
    //     buttonImage: "img/calendario.png",
    //     buttonImageOnly: true,
    //     buttonText: "Select date",
    //     dateFormat: 'dd/mm/yy',
    //     showOtherMonths:true,
    //     dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
    //     monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
    //                  'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']    
    // });

    // var linhasCalendario = $('#calendarioFaltas tbody')[0].childNodes
    // var linhaHoje = undefined



    // for (var i = 0; i < linhasCalendario.length; i++) {
    // 	for (var k = 0; k < linhasCalendario[i].childNodes.length; k++) {
    // 		if ($(linhasCalendario[i].childNodes[k]).hasClass('ui-datepicker-current-day')) {
    // 			linhaHoje = linhasCalendario[i]
    // 		}
    // 	};
    // };

    // for (var i = 0; i < linhasCalendario.length; i++) {
    // 	if (linhasCalendario[i] !== linhaHoje) {
    // 		$(linhasCalendario[i]).hide()
    // 	}
    // };

});