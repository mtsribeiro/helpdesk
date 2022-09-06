const e = require("express");

carregamentoStatico('/appGeneral.html', '#AppGeneral')
carregamentoStatico('/appChamados.html', '#AppChamados')

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
  $('#AppGeneral').css('display', 'block')
})

/*CHAMADOS*/
$("#btn-openChamados").click(function(){
  $('#AppGeneral').css('display', 'none')
  $('#AppChamados').css('display', 'block')
})

$(document).on('dblclick', '#table-Chamado tr', function(){
  var id = $(this).attr('id')
  $.ajax({
    url : "/sobeFormularioChamado",
    type : 'post',
    async: true,
    data : {id : id},
    success: function (data) {
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