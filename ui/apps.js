const e = require("express");

carregamentoStatico('/appGeneral.html', '#AppGeneral')
carregamentoStatico('/appChamados.html', '#AppChamados')
carregamentoStatico('/appAbrirChamado.html', '#AppAbrirChamado')

function carregamentoStatico(arquivo, local){
    fetch(arquivo)
  .then(response => response.text())
  .then(text => {
    $(local).html(text)
})
}

document.addEventListener("DOMContentLoaded", function(event) {
   
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('click', ()=>{
    // show navbar
    nav.classList.toggle('show')
    // change icon
    toggle.classList.toggle('bx-x')
    // add padding to body
    bodypd.classList.toggle('body-pd')
    // add padding to header
    headerpd.classList.toggle('body-pd')
    })
    }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink(){
    if(linkColor){
    linkColor.forEach(l=> l.classList.remove('active'))
    this.classList.add('active')
    }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    });

/*=============================================
                    CHAMADOS
===============================================*/

/*FECHA APLICAÇÃO*/
$("#Close-app").click(function(){
  $.ajax({
    url : "/fechaAplicacao",
    type : 'post'
  })
})

/*TROCA DE JANELA*/
/*DASHBOARD*/
$("#btn-openDashboard").click(function(){
  $('#AppChamados').css('display', 'none')
  $('#AppAbrirChamado').css('display', 'none')
  $('#AppGeneral').css('display', 'block')
})

/*CHAMADOS*/
$("#btn-openChamados").click(function(){
  $('#AppGeneral').css('display', 'none')
  $('#AppAbrirChamado').css('display', 'none')
  $('#AppChamados').css('display', 'block')
})

/*ABRIR CHAMADOS*/
$("#btn-openAbrirChamado").click(function(){
  $('#AppGeneral').css('display', 'none')
  $('#AppChamados').css('display', 'none')
  $('#AppAbrirChamado').css('display', 'block')
})

/*EDITAR CLIQUE*/
$(document).on('dblclick', '#table-Chamado tr', function(){
  var id = $(this).attr('id')
  $.ajax({
    url : "/sobeFormularioChamado",
    type : 'post',
    async: true,
    data : {id : id},
    success: function (data) {
      $('#idChamado').val(data[0].idsias)
      $('#responsavelChamado').val(data[0].responsavel)
      $('#TiChamado').val(data[0].ti)

      $('#AssuntoChamado').val(data[0].assunto)
      $('#CategoriaChamado').val(data[0].categoria)

      $('#PrioridadeChamado').val(data[0].prioridade)
      $('#SprintChamado').val(data[0].sprint)
      $('#SituacaoChamado').val(data[0].situacao)

      $('#DescricaoChamado').val(data[0].descricao)
      $('#SolucacaoChamado').val(data[0].solucao)
    }
  })
})

/*SALVA SIA*/
$(document).on('click', '#salvaSia', function(){
  var idChamado = $('#idChamado').val()
  var responsavelChamado = $('#responsavelChamado').val()
  var tiChamado = $('#TiChamado').val()

  var AssuntoChamado = $('#AssuntoChamado').val()
  var CategoriaChamado = $('#CategoriaChamado').val()

  var PrioridadeChamado = $('#PrioridadeChamado').val()
  var SprintChamado = $('#SprintChamado').val()
  var SituacaoChamado = $('#SituacaoChamado').val()

  var DescricaoChamado = $('#DescricaoChamado').val()
  var SolucacaoChamado = $('#SolucacaoChamado').val()

  $.ajax({
    url : "/salvarFormularioChamado",
    type : 'post',
    async: true,
    data : {idsias : idChamado,
            responsavel : responsavelChamado,
            ti : tiChamado,
            assunto : AssuntoChamado,
            categoria : CategoriaChamado,
            prioridade : PrioridadeChamado,
            sprint : SprintChamado,
            situacao : SituacaoChamado,
            descricao : DescricaoChamado,
            solucao : SolucacaoChamado},
    beforeSend: function(data) {
      $('#FormularioAlteracaoSia').css('display', 'none');
      $('#loading-alteracao').css('display' ,'flex');
    },
    success: function (data) {
      tabela_Chamado.ajax.reload();

      $('#idChamado').val('')
      $('#responsavelChamado').val('')
      $('#TiChamado').val('')

      $('#AssuntoChamado').val('')
      $('#CategoriaChamado').val('')

      $('#PrioridadeChamado').val('')
      $('#SprintChamado').val('')
      $('#SituacaoChamado').val('')

      $('#DescricaoChamado').val('')
      $('#SolucacaoChamado').val('')

      $('#FormularioAlteracaoSia').css('display', 'block');
      $('#loading-alteracao').css('display' ,'none');
    }
  })
})

/*INSERE SIA*/
$(document).on('click', '#insereSia', function(){
  var idChamadoInsere = $('#idChamadoInsere').val()
  var responsavelChamadoInsere = $('#responsavelChamadoInsere').val()

  var AssuntoChamadoInsere = $('#AssuntoChamadoInsere').val()
  var CategoriaChamadoInsere = $('#CategoriaChamadoInsere').val()

  var PrioridadeChamadoInsere = $('#PrioridadeChamadoInsere').val()
  var SituacaoChamadoInsere = $('#SituacaoChamadoInsere').val()

  var DescricaoChamadoInsere = $('#DescricaoChamadoInsere').val()
  var SolucacaoChamadoInsere = $('#SolucacaoChamadoInsere').val()

  $.ajax({
    url : "/InsereFormularioChamado",
    type : 'post',
    async: true,
    data : {idsias : idChamadoInsere,
            responsavel : responsavelChamadoInsere,
            assunto : AssuntoChamadoInsere,
            categoria : CategoriaChamadoInsere,
            prioridade : PrioridadeChamadoInsere,
            descricao : DescricaoChamadoInsere,
            solucao : SolucacaoChamadoInsere},
    beforeSend: function(data) {
      $('#FormularioInsercaoSia').css('display', 'none');
      $('#loading-insercao').css('display' ,'flex');
    },
    success: function (data) {
      tabela_Chamado.ajax.reload();

      $('#idChamadoInsere').val('')
      $('#responsavelChamadoInsere').val('')
      $('#TiChamadoInsere').val('')

      $('#AssuntoChamadoInsere').val('')
      $('#CategoriaChamadoInsere').val('')

      $('#PrioridadeChamadoInsere').val('')
      $('#SprintChamadoInsere').val('')
      $('#SituacaoChamadoInsere').val('')

      $('#DescricaoChamadoInsere').val('')
      $('#SolucacaoChamadoInsere').val('')

      $('#FormularioInsercaoSia').css('display', 'block');
      $('#loading-insercao').css('display' ,'none');
    }
  })
})