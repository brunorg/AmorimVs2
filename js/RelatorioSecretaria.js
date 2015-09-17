//Murano Design

//Carrega os valores utilizados do BD
	var d = new Date();
    var dataPeriodo     =   getData("Periodo", null);
    var dataAnoEstudo   =   getData("AnoEstudo", null);
    var dataTutoria     =   getData("Tutoria/htmlTutoria/" + d.getFullYear(), null);

//------------------------------------------------------------------------------------------------------------------------
function chooseFile(name) {
	var chooser = $(name);
	chooser.change(function(evt) {
	  console.log($(this).val());
	  // Reset the selected value to empty ('')
	  $(this).val('');
	});
	
	chooser.trigger('click');  
}
chooseFile('#fileDialog');
	
	
//Carrega a funçao de Load do JQuery

    $(document).ready(function () {
			
		/*Efeito do checkbox com imagem*/
    	$("div.inputImgRel").click(function(){
			var objeto = this;
			
			window.setTimeout(function(){
				if($(objeto).hasClass("clicado") == false)
				{
					$(objeto).css("background-position","-38px 0px").addClass("clicado");
				}
				else{ 
					$(objeto).css("background-position","0px 0px").removeClass("clicado"); 
				}
			},10);	
			
			$(this).parent().find('input[type=radio]').removeAttr('checked', false);
			
			$(this).next('input[type=radio]').attr('checked', true);
			
    	});
        
        /* Ano estudo*/
        HtmlContent = ""; 
        for(var b=0;b<dataAnoEstudo.length; b++)
        {
            HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"'>"+(dataAnoEstudo[b].ano)+"º</option>";
        }
        $('#Ano').html("<option></option>"+HtmlContent);

        /*Turno [Manhã/Tarde]*/
        HtmlContent = ""; 
        for(var b=0;b<dataPeriodo.length; b++)
        {
            HtmlContent += "<option value='"+dataPeriodo[b].idperiodo+"'>"+(dataPeriodo[b].periodo)+"</option>";
        }
        $('#Periodo').html("<option></option>"+HtmlContent);
		
		//carrega tutoria na combo 
        $('#Tutoria').html("<option></option>"+dataTutoria);
		
	});
	
//-----------------------------------------------------------------------------------------------------------------------

function AA(Palavra, Ativo)
{
    $('#'+Palavra).css("display",(Ativo == true ? "block":"none"));
}


function gerarRelatorio(){	
	$(".boxGeralRelatorio").html("");
	$(".dadosBusca").css("display","none").html("");
	
	var Tutoria = ($("#Tutoria").val()=="") ? 0 :$("#Tutoria").val();
	var Ano = ($("#Ano").val()=="")?0:$("#Ano").val();
	var Periodo = ($("#Periodo").val()=="")?0:$("#Periodo").val();
	var existe = false;	
	var dados = "";
	var valores="Tutoria="+Tutoria+"&Ano="+Ano+"&Periodo="+Periodo;
	
	var campos = new Array();
	var j=0;
	var campoId="";
	
	$(".btnImprimir").css("display","block");
	
	$(".clicado").each(function(){	 
		valores += "&"+$(this).next().attr("id")+"="+$(this).next().attr("id");		
		existe = true;
		campoId = $(this).prev().attr("id");
		campos[j] = $("#"+campoId).text();
		j++;
	});

	console.log(valores);
	
	if(existe == true){		
		var html="",count=0,k=0;
		var tot;
		$.ajax({
			url: path+"AlunoVariavel/Relatorio",
			type: "POST",
			async: false,
			crossDomain: true,
			dataType: 'json',
			data:valores,		
			beforeSend: function(){
				//loading("inicial");
			},				
			success: function(d) {



				if(d[0] == "não há valores"){
					$(".dadosBusca").css("display","block").html("NÃO HÁ VALORES");
				}
				else{
					$('.linkRel').css('display','block');					
					var total = $(".clicado").length;					
					var aux = [];
					var cont = 1;
					for(var p = 0;p*total < d.length -1; p++)
					{						
						tot = cont*total;
						if(tot==(d.length-1)){
							$("#link_excel").attr("href",d[tot]);
						}						
						aux[aux.length] = [d[p*total], p*total];
						
						cont++;
					}

					aux.sort();

					for(var i = 0; i < aux.length; i++)
					{
						html+= '<div class="dadosAluno">';						
						for(var j = 0; j < total; j++)
						{
							if (d[aux[i][1]+j] == "-")
							{
								d[aux[i][1]+j] = "não informado";
							}

							html+= '<div class="celulaGrande">'+
										'<div class="infoM">'+campos[j]+'</div>'+
										'<div class="infoValueM">'+
											'<input value="'+d[aux[i][1]+j]+'" maxlength="200" title="Quantidade de caracteres permitidos: 200" disabled></input>'+
										'</div>'+
									'</div>';
									console.log(campos[j]);
						}

						html += 	'<div style="clear:both"></div>'+    
								'</div>';
					}
				}

				dados = (Tutoria!=0) ? $("#Tutoria option:selected").text() : "";
				dados += (Ano!=0) ? " | "+$("#Ano option:selected").text()+" ano" : "";
				dados += (Periodo!=0) ? " | "+$("#Periodo option:selected").text() : "";
				
				$(".dadosBusca").css("display","block").html(dados);
				$(".boxGeralRelatorio").html(html);
			}
		});
	}else{
		mensagem("Deve-se escolher ao menos um campo para aparecer no relatório!","OK","bt_ok","erro");
	}
}
