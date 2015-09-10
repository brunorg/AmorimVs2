//Murano Design


var userID = usuarioId;
//------------------------------------------------------------------------------------------------------------------------

var d = new Date();
var dataUsuario;
var dataTutoria;
var dataGrupos;

$.ajax({
    url: path + "Usuario/" + userID,
    type: "GET",
    async: false,
    crossDomain: true,
    success: function (data) {
        dataUsuario = data;
    } 
});

$.ajax({
    url: path + "Tutoria/Professor/" + dataUsuario.professor.idprofessorFuncionario + "/" + d.getFullYear(),
    type: "GET",
    async: false,
    crossDomain: true,
    success: function (data) {
        dataTutoria = data;
    },
});
$.ajax({
    url: path + "Grupo/GrupoTutoria/" + dataTutoria[0].idtutoria,
    type: "GET",
    async: false,
    crossDomain: true,
    success: function (data) {
        dataGrupos = data;
    } 
});

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
    
    for(var a = 0; a < dataGrupos.length; a++)
    {   
        var dataAlunosGrupo;
        $.ajax({
            url: path + "AlunoVariavel/grupo/" + dataGrupos[a].idgrupo,
            type: "GET",
            async: false,
            crossDomain: true,
            success: function (data) {
                dataAlunosGrupo = data;
            }
        });

        if (dataAlunosGrupo.length > 0)
        {
            HtmlContent = "";       
            HtmlContent += "<div class='grupo'>";   
                HtmlContent += "<div id='Grupo_Id_" + dataGrupos[a].idgrupo + "' class='grupo_nome'>"
                    HtmlContent += "<div class='grupo_nome_tabela_texto' onclick='ApareceAlunos("+dataGrupos[a].idgrupo+")'>";
                        HtmlContent += dataGrupos[a].nomeGrupo;
                    HtmlContent += "</div>";
                    HtmlContent += "<input type='text' class='dataPresenca' hidden>";
                HtmlContent += "</div>"
            HtmlContent += "</div>";

            $('.total').append(HtmlContent);
            HtmlContent = "";

            for (var b = 0; b < dataAlunosGrupo.length; b++)
            {

                var dataFaltas;
                var linhaPresenca;

                $.ajax({
                    url: path + "Chamada/faltas/" + dataAlunosGrupo[b].aluno.idAluno,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    success: function(data){
                        dataFaltas = data;
                    }
                });

                //console.log(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
                $.ajax({
                    url: path + "Chamada/dataChamada/" + dataAlunosGrupo[b].aluno.idAluno + "/" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(),
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    success: function(data){

                        //console.log(data);

                        if (data.length == 0){
                            linhaPresenca = '<div class="status_presenca_presenca">';
                        }

                        else if (data[0].presenca == 0){
                            linhaPresenca = '<div id="chamada_' + data[0].idchamada + '" class="status_presenca_falta">';
                        }

                        else if (data[0].presenca == 1){
                            linhaPresenca = '<div id="chamada_' + data[0].idchamada + '" class="status_presenca_presenca">';
                        }
                    }
                });



                HtmlContent +='<div class="AlunoLeft Aluno_Grupo' + dataGrupos[a].idgrupo + '" id="Aluno_' + dataAlunosGrupo[b].aluno.idAluno + '">'+
                                    '<div class="titulo_infos_aluno">'+
                                        '<div class="faltas_aluno">'+
                                            '<div class="presenca_botao">'+
                                                '<div class="indicar_presenca_aluno">'+
                                                    linhaPresenca+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="nome_aluno">'+
                                            dataAlunosGrupo[b].aluno.nome+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            }

            HtmlContent +='<div class="AlunoLeft Aluno_Grupo' + dataGrupos[a].idgrupo + ' ultimo">'+
                                '<div class="titulo_infos_aluno">'+
                                    '<div class="faltas_aluno">'+
                                    '</div>'+
                                    "<div class='grupo_indicar indicar_" + dataGrupos[a].idgrupo + "' onclick='IndicarPresenca(" + dataGrupos[a].idgrupo + ")'>Confirma</div>" +
                                '</div>'+
                            '</div>';

            HtmlContent += '<div style="clear: both;"></div>'

            $('.total').append(HtmlContent);

        }
    }

    $("[class^='status_presenca_']").click(function () {

        if ($(this).hasClass("status_presenca_presenca"))
        {
            $(this).removeClass("status_presenca_presenca");
            $(this).addClass("status_presenca_falta");
        }
    
        else
        {
            $(this).addClass("status_presenca_presenca");
            $(this).removeClass("status_presenca_falta");
        }
    
    });

    $( ".dataPresenca" ).datepicker({
        showOn: "button",
        beforeShow: function () {
            $("#box_novo").css("height", "285px");
        },
        /*onClose: function () {
            $("#box_novo").css("height", "130px");
            if(!($("#data_inicio").val() != "" && $("#data_fim").val() != ""))
            {
                $("#box_novo").css("height", "130px");
            }
            else
            {
                $("#box_novo").css("height", "130px");
                $("#botoes").show();
            }
        },*/
        buttonImage: "img/calendario.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        dateFormat: 'dd/mm/yy',
        showOtherMonths:true,
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
                     'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']    
    });


});

//-----------------------------------------------------------------------------------------------------------------------------------------------

function IndicarPresenca (idGrupo) {
    var alunos = $(".Aluno_Grupo"+idGrupo);

    if($("#Grupo_Id_"+idGrupo+" .dataPresenca").val() == '')
    {
        var diaCorrido = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    }
    else
    {
        diaCorrido = $("#Grupo_Id_"+idGrupo+" .dataPresenca").val().split("/")[2] + "-" + $("#Grupo_Id_"+idGrupo+" .dataPresenca").val().split("/")[1] + "-" + $("#Grupo_Id_"+idGrupo+" .dataPresenca").val().split("/")[0];
    }  

    for (var i = 0; i < alunos.length; i++) {
        if ($("#" + alunos[i].id + " [class^='status_presenca']")[0].id != "")
        {
            if ($("#" + alunos[i].id + " .status_presenca_falta").length != 0)
            {
                action = "update";
                valores = "&data="+diaCorrido+"&presenca=0&aluno="+ alunos[i].id.split("_")[1]+"&id="+$("#" + alunos[i].id + " .status_presenca_falta")[0].id.split("_")[1];
            }

            else
            {
                action = "update";
                valores = "&data="+diaCorrido+"&presenca=1&aluno="+alunos[i].id.split("_")[1]+"&id="+$("#" + alunos[i].id + " .status_presenca_presenca")[0].id.split("_")[1];
            } 
        }

        else
        {
            if ($("#" + alunos[i].id + " .status_presenca_falta").length != 0)
            {
                action = "create";
                valores = "&data="+diaCorrido+"&presenca=0&aluno="+alunos[i].id.split("_")[1]; 
            }
            

            else
            {
                action = "create";
                valores = "&data="+diaCorrido+"&presenca=1&aluno="+alunos[i].id.split("_")[1];
            }
        }

        $.ajax({
            type: "POST",
            async: false,
            crossDomain: true,
            url: path+"Chamada",
            data: "action="+action+valores,
            beforeSend: function(){
            loading("inicial"); 
            },
            success: function(retorno){
                $("#" + alunos[i].id + " [class^='status_presenca']")[0].id = "chamada_" + retorno;
                mensagem("Presença apontada com sucesso!","OK","bt_ok","sucesso");
                if (action == "create")
                {
                    $("#" + alunos[i].id + " [class^='status_presenca']").removeClass("status_presenca_naoIndicado");
                    $("#" + alunos[i].id + " [class^='status_presenca']").addClass("status_presenca_indicado")
                }             
            },
            error: function(){
                mensagem("Erro ao apontar presença!","OK","bt_ok","erro");
            },
            complete: function(){   
                loading('final');   
            }
        });

    }
}

function ApareceAlunos (idGrupo) {
    $('.Aluno_Grupo'+idGrupo).toggle();
    $('.indicar_' + idGrupo).toggle();
}