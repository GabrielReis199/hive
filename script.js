var vetPecas = [
    { nPecas: 1, nome: "Abelha",    img: "https://cdn-icons-png.flaticon.com/128/1123/1123332.png" },
    { nPecas: 3, nome: "Formiga",   img: "https://cdn-icons-png.flaticon.com/128/9861/9861504.png" },
    { nPecas: 3, nome: "Gafanhoto", img: "https://cdn-icons-png.flaticon.com/128/4388/4388642.png" },
    { nPecas: 2, nome: "Aranha",    img: "https://cdn-icons-png.flaticon.com/128/5767/5767555.png" },
    { nPecas: 2, nome: "Besouro",   img: "https://cdn-icons-png.flaticon.com/128/1357/1357439.png" },
    { nPecas: 1, nome: "Mosquito",  img: "https://cdn-icons-png.flaticon.com/128/4295/4295661.png" },
    { nPecas: 1, nome: "Joaninha",  img: "https://cdn-icons-png.flaticon.com/128/120/120150.png" },
    { nPecas: 1, nome: "Tatu",      img: "https://cdn-icons-png.flaticon.com/128/1752/1752562.png" }
];

var pecasPlayer1 = structuredClone(vetPecas);
var pecasPlayer2 = structuredClone(vetPecas);

flagPlayer1 = true;
contadorRodadas = 0;

var pecaInsere = null;

// Gera as coordenadas das peças em campo.
var geraCoordenadas = function () {
    contadorAntes  = 50;
    contadorDepois = 50;
    $("tr[data-linha=50] td[data-coluna=50]").prevAll().each(function () {
        $(this).attr("data-coluna", --contadorAntes);
    });
    $("tr[data-linha=50] td[data-coluna=50]").nextAll().each(function () {
        $(this).attr("data-coluna", ++contadorDepois);
    });

    contadorInicio = $("tr[data-linha=50] td:first").attr("data-coluna");
    $("tr[data-linha=50]").prevAll().each(function () {
        $(this).find("td").each(function () {
            $(this).attr("data-coluna", contadorInicio++)
        })
        contadorInicio = $("tr[data-linha=50] td:first").attr("data-coluna");
    });
    $("tr[data-linha=50]").nextAll().each(function () {
        $(this).find("td").each(function () {
            $(this).attr("data-coluna", contadorInicio++)
        })
        contadorInicio = $("tr[data-linha=50] td:first").attr("data-coluna");
    });
};

// Diminui os espaços em cada linha para o tabuleiro ficar alinhado
var insereEspacosTr = function () {
    var top = -15
    $("tr").each(function (index) {
        if(index != 0) {
            $(this).css("top", ""+top+"px");
            top = top - 15;
        }
    });
}

// Gera os vizinhos de cada peça inserida no tabuleiro
var regulaTab = 1;
var geraTabuleiro = function (left, top, right, bottom) {
    if($("tbody tr").length == 0) {
        $("tbody").append("<tr data-linha='50'><td class='player1' onclick='insPecTabu(this)' data-coluna='50'>"
            +$(pecaInsere).html()+"</td></tr>");
    }

    if(left) {
        $("tbody tr").each(function () {
            $(this).prepend("<td class='undefined' onclick='insPecTabu(this)'></td>");
        })
        var vLeft = parseInt($("table").css("left"));
        var vTop  = parseInt($("table").css("top"));
        if($("tbody td[class=player1], tbody td[class=player2]").length > 1)
            $("table").css({"top": vTop+"px", "left": (vLeft-37)+"px"});
    }
    if(right) {
        $("tbody tr").each(function () {
            $(this).append("<td class='undefined' onclick='insPecTabu(this)'></td>");
        })
        var vLeft = parseInt($("table").css("left"));
        var vTop  = parseInt($("table").css("top"));
        if($("tbody td[class=player1], tbody td[class=player2]").length > 1)
            $("table").css({"top": vTop+"px", "left": (vLeft+37)+"px"});
    }
    if(top) {
        var numLinha = parseInt($("tr:first").attr("data-linha"));
        $("tbody tr:first").parent().prepend("<tr data-linha='"+(numLinha-1)+"'></tr>");
        for(var i=1; i<=$("tr[data-linha=50] td").length; i++) {
            $("tbody tr:first").append("<td class='undefined' onclick='insPecTabu(this)'></td>")
        }
        $("tbody tr:nth-child(2)").nextAll().each(function (index) {
            if(index % 2 == 0)
                $(this).prepend("<td class='undefined' onclick='insPecTabu(this)'></td>");
        });
        var vLeft = parseInt($("table").css("left"));
        var vTop = parseInt($("table").css("top"));
        var vMinus = $("tbody tr").length % 2 == regulaTab ? vLeft-37 : vLeft
        var vMais = $("tbody tr").length < 10 ? (vTop-20) : (vTop-40);
        if($("tbody td[class=player1], tbody td[class=player2]").length > 1)
            $("table").css({"top": vMais+"px", "left": vMinus+"px"});
    } 
    if(bottom) {
        var numLinha = parseInt($("tr:last").attr("data-linha"));
        $("tbody tr:last").parent().append("<tr data-linha='"+(numLinha+1)+"'></tr>");
        for(var i=1; i<=$("tr[data-linha=50] td").length; i++) {
            $("tbody tr:last").append("<td class='undefined' onclick='insPecTabu(this)'></td>")
        }
        var vLeft = parseInt($("table").css("left"));
        var vTop = parseInt($("table").css("top"));
        regulaTab = parseInt($("tr[data-linha=50] td[data-coluna=50]").parent().nextAll().length)%2 == 0 ? 0 : 1;
        if($("tbody td[class=player1], tbody td[class=player2]").length > 1)
            $("table").css({"top": (vTop+35)+"px", "left": vLeft+"px"});
    }
    geraCoordenadas();
    insereEspacosTr();
}

// Marca as tds disponíveis no tabuleiro
var mapeamentoEspacosDisponiveis = function () {
    var classeOponente = !flagPlayer1 ? ".player1" : ".player2";
    var classeAliado = flagPlayer1 ? ".player1" : ".player2";

    if($("tbody tr").length == 0)
        return;

    $("td").removeClass("opcao");
    if($("td[class='player1'], td[class='player2']").length == 1) {
        $("tr[data-linha='49'] td[data-coluna='50'], tr[data-linha='49'] td[data-coluna='51'],"
            +"tr[data-linha='50'] td[data-coluna='49'], tr[data-linha='50'] td[data-coluna='51'],"
            +"tr[data-linha='51'] td[data-coluna='50'], tr[data-linha='51'] td[data-coluna='51']").addClass("opcao");
        return;
    }

    $("tbody tr td").not("[class='player1'], [class='player2']").each(function () {
        var col = parseInt($(this).attr("data-coluna"));
        col = $(this).parent().prevAll().length % 2 == 0 ? col - 1 : col;

        if(
            !$(this).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") &&
            !$(this).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") &&
            !$(this).prev().is(".player1, .player2") &&
            !$(this).next().is(".player1, .player2") &&
            !$(this).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") &&
            !$(this).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2")
        )
            return;
        
        if(
            $(this).parent().prev().find("[data-coluna='"+(col  )+"']").is(classeOponente) ||
            $(this).parent().prev().find("[data-coluna='"+(col+1)+"']").is(classeOponente) ||
            $(this).prev().is(classeOponente) ||
            $(this).next().is(classeOponente) ||
            $(this).parent().next().find("[data-coluna='"+(col  )+"']").is(classeOponente) ||
            $(this).parent().next().find("[data-coluna='"+(col+1)+"']").is(classeOponente)
        )
            return;

        var cont = 0;
        if($(this).parent().prev().find("[data-coluna='"+(col  )+"']").is(classeAliado))
            cont++;
        if($(this).parent().prev().find("[data-coluna='"+(col+1)+"']").is(classeAliado))
            cont++;
        if($(this).prev().is(classeAliado))
            cont++;
        if($(this).next().is(classeAliado))
            cont++;
        if($(this).parent().next().find("[data-coluna='"+(col  )+"']").is(classeAliado))
            cont++;
        if($(this).parent().next().find("[data-coluna='"+(col+1)+"']").is(classeAliado))
            cont++;
        if(cont >= 5)
            return;
        
        $(this).addClass("opcao");
    });
}

// Atualiza as peças disponíveis para jogo a cada rodada passada
var getPecasDisponiveis = function () {
    if(flagPlayer1)
        $("#contador").text(++contadorRodadas);

    var pecas = !flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
    var textClasse = !flagPlayer1 ? "player1" : "player2";
    var divLado = !flagPlayer1 ? "#direita" : "#esquerda";

    $(divLado).toggleClass("vez-" + textClasse);

    $(divLado).prop("disabled", false).css('pointer-events', 'none');

    var sum = pecas.reduce((cont,item) => cont + item.nPecas, 0);
    if(sum != 0) {
        if(contadorRodadas == 4 && pecas[0].nPecas == 1) {
            $(divLado).css({"width": "60px", "height": "60px"});
        } else if(sum > 12){ // 13 14
            $(divLado).css({"width": "120px", "height": "400px"});
        } else if(sum > 10) { // 11 12
            $(divLado).css({"width": "120px", "height": "340px"});
        } else if(sum > 8) { // 9 10
            $(divLado).css({"width": "120px", "height": "280px"});
        } else if(sum > 7) { // 8
            $(divLado).css({"width": "120px", "height": "220px"});
        } else if(sum > 6) { // 7
            $(divLado).css({"width": "60px", "height": "400px"});
        } else if(sum > 5) { // 6
            $(divLado).css({"width": "60px", "height": "360px"});
        } else if(sum > 4) { // 5
            $(divLado).css({"width": "60px", "height": "300px"});
        } else if(sum > 3) { // 4
            $(divLado).css({"width": "60px", "height": "240px"});
        } else if(sum > 2) { // 3
            $(divLado).css({"width": "60px", "height": "180px"});
        } else if(sum > 1) { // 2
            $(divLado).css({"width": "60px", "height": "120px"});
        } else {
            $(divLado).css({"width": "60px", "height": "60px"});
        }
    } else {
        $(divLado).hide();
    }

    if(contadorRodadas == 4 && pecas[0].nPecas == 1) {
        $(divLado).find("ul").append("<li class='"+ textClasse +"'><img src='"+
            pecas[0].img +"' alt='"+ pecas[0].nome +"'/></li>");
    } else {
        var aux = 0;
        while (aux < pecas.length) {
            if(pecas[aux].nPecas!=0)
                for(var i = 1; i <= pecas[aux].nPecas; i++)
                    $(divLado).find("ul").append("<li class='"+ textClasse +"'><img src='"
                        +pecas[aux].img +"' alt='"+ pecas[aux].nome +"'/></li>");
            aux++;
        }
    }
    
    ////////////////////////////////////////////////////////////

    pecas = flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
    textClasseAliado = flagPlayer1 ? "player1" : "player2";
    textClasseInimigo = !flagPlayer1 ? "player1" : "player2";
    divLado = flagPlayer1 ? "#direita" : "#esquerda";

    $(divLado).toggleClass("vez-" + textClasseAliado);

    $(divLado).prop("disabled", true).css('pointer-events', 'auto');

    var sum = pecas.reduce((cont,item) => cont + item.nPecas, 0);
    if(sum != 0) {
        if(contadorRodadas == 4 && pecas[0].nPecas == 1) {
            $(divLado).css({"width": "60px", "height": "60px"});
        } else if(sum > 12){ // 13 14
            $(divLado).css({"width": "120px", "height": "400px"});
        } else if(sum > 10) { // 11 12
            $(divLado).css({"width": "120px", "height": "340px"});
        } else if(sum > 8) { // 9 10
            $(divLado).css({"width": "120px", "height": "280px"});
        } else if(sum > 7) { // 8
            $(divLado).css({"width": "120px", "height": "220px"});
        } else if(sum > 6) { // 7
            $(divLado).css({"width": "60px", "height": "400px"});
        } else if(sum > 5) { // 6
            $(divLado).css({"width": "60px", "height": "360px"});
        } else if(sum > 4) { // 5
            $(divLado).css({"width": "60px", "height": "300px"});
        } else if(sum > 3) { // 4
            $(divLado).css({"width": "60px", "height": "240px"});
        } else if(sum > 2) { // 3
            $(divLado).css({"width": "60px", "height": "180px"});
        } else if(sum > 1) { // 2
            $(divLado).css({"width": "60px", "height": "120px"});
        } else {
            $(divLado).css({"width": "60px", "height": "60px"});
        }
    } else {
        $(divLado).hide();
        $("#esquerda ul").append("<li></li>");
    }

    // Gera as peças disponíveis no ul atual
    if(contadorRodadas == 4 && pecas[0].nPecas == 1) {
        $(divLado).find("ul").append("<li class='"+ textClasseAliado +"'><img src='"+
            pecas[0].img +"' alt='"+ pecas[0].nome +"'/></li>");
    } else {
        var aux = 0;
        while (aux < pecas.length) {
            if(pecas[aux].nPecas!=0)
                for(var i = 1; i <= pecas[aux].nPecas; i++)
                    $(divLado).find("ul").append("<li class='"+ textClasseAliado +"'><img src='"
                        +pecas[aux].img +"' alt='"+ pecas[aux].nome +"'/></li>");
            aux++;
        }
    }

    $("ul li").click(function () {
        $("ul li").removeClass(textClasseAliado + "-select");
        $("td").removeClass(textClasseAliado + "-select")
        $(this).addClass(textClasseAliado + "-select");
        $("main").css('pointer-events', 'auto');
        pecaInsere = $(this);
        mapeamentoEspacosDisponiveis();
    });
    $("ul li:first").trigger("click");
    $("ul li").removeClass(textClasseAliado + "-select");
    $("td").removeClass("opcao");
}
getPecasDisponiveis();
$("#esquerda").removeClass("vez-player2");

// Inicia o tabuleiro e chama as função para criar os visinhos das peças.
var inserePecaTabuleiro = function (that) {
    $("main").css('pointer-events', 'none');
    if($("tbody tr").length == 0) {
        $("main").one("click", function () {
            geraTabuleiro(true, true, true, true);
            var pecas = flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
            for(var i=0; i<pecas.length; i++) 
                if(pecas[i].nome == $(pecaInsere).find("img").attr("alt"))
                    pecas[i].nPecas = pecas[i].nPecas - 1;
            $("li").remove();
            $("table").css({"top": "0px", "left": "-19.5px"});
            flagPlayer1 = !flagPlayer1;
            getPecasDisponiveis();
            pecaInsere = null;
        })
    } else {
        if($(that).next().length == 0)
            geraTabuleiro(false, false, true, false);
        if($(that).prev().length == 0)
            geraTabuleiro(true, false, false, false);
        if($(that).parent().next().length == 0)
            geraTabuleiro(false, false, false, true);
        if($(that).parent().prev().length == 0)
            geraTabuleiro(false, true, false, false);
        pecaInsere = null;
    }
}
inserePecaTabuleiro();

// Verifica se a peça selecionada quebra a colmeia
var verificaQuebraColmeia = function (that) {
    //true = quebra colmeia, false = não quebra
    /*
    $(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2")
    $(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2")
    $(that).prev().is(".player1, .player2")
    $(that).next().is(".player1, .player2")
    $(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2")
    $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2")
    */

    
    var col = parseInt($(that).attr("data-coluna"));
    col = $(that).parent().prevAll().length % 2 == 0 ? col - 1 : col;

    if(!$(that).next().is(".player1, .player2") && 
       !$(that).parent().next().find("[data-coluna='"+(col)+"']").is(".player1, .player2") &&
       $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") &&
       ($(that).parent().prev().find("[data-coluna='"+(col )+"']").is(".player1, .player2") ||
       $(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") ||
       $(that).prev().is(".player1, .player2"))) {
        return true;
    }
    
    if(!$(that).prev().is(".player1, .player2") && 
       !$(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") &&
       $(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") &&
       ($(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
       $(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") ||
       $(that).next().is(".player1, .player2"))) {
        return true;
    }
    
    if(!$(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") && 
        !$(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") &&
        $(that).prev().is(".player1, .player2") &&
        ($(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") ||
        $(that).next().is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2"))) {
            return true;
    }

    if(!$(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") && 
        !$(that).next().is(".player1, .player2") &&
        $(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") &&
        ($(that).next().is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2"))) {
            return true;
    }

    if(!$(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") && 
        !$(that).next().is(".player1, .player2") &&
        $(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") &&
        ($(that).prev().is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2"))) {
            return true;
    }

    if(!$(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") && 
        !$(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") &&
        $(that).next().is(".player1, .player2") &&
        ($(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
        $(that).prev().is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2"))) {
            return true;
    }
    
    if(!$(that).prev().is(".player1, .player2") && 
        !$(that).next().is(".player1, .player2") &&
        ($(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
        $(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2")) &&
        ($(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2"))) {
            return true;
    }

    if(!$(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") && 
        !$(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") &&
        ($(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") ||
        $(that).prev().is(".player1, .player2")) &&
        ($(that).next().is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2"))) {
            return true;
    }

    if(!$(that).parent().prev().find("[data-coluna='"+(col  )+"']").is(".player1, .player2") && 
        !$(that).parent().next().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") &&
        ($(that).parent().prev().find("[data-coluna='"+(col+1)+"']").is(".player1, .player2") ||
        $(that).next().is(".player1, .player2")) &&
        ($(that).prev().is(".player1, .player2") ||
        $(that).parent().next().find("[data-coluna='"+(col  )+"']").is(".player1, .player2"))) {
            return true;
    }

    return false;
};

// Insere uma peça em um espaço vazio disponivel no tabuleiro
var insPecTabu = function (that) {
    var textClassAliado = flagPlayer1 ? "player1" : "player2";
    if($(pecaInsere).length == 1 && $(that).hasClass("opcao")) {
        $(that).append($(pecaInsere).html()).attr("class", flagPlayer1 ? "player1" : "player2");
        $("li").remove();
        var pecas = flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
        for(var i=0; i<pecas.length; i++) 
            if(pecas[i].nome == $(pecaInsere).find("img").attr("alt"))
                pecas[i].nPecas = pecas[i].nPecas - 1 ;
        flagPlayer1 = !flagPlayer1;
        $("td").removeClass("opcao");
        inserePecaTabuleiro(that);
        getPecasDisponiveis();
    } else if($(that).hasClass(textClassAliado)){
        var textClassePeca = $(that).is(".player1") ? "player1" : "player2";
        if(textClassAliado == textClassePeca) {
            $("ul li").removeClass(textClassAliado + "-select");
            $("td").removeClass("opcao");
            $("td").removeClass(textClassePeca + "-select");
            if(!verificaQuebraColmeia(that)) // true = quebra colmeia, false = não quebra
                $(that).addClass(textClassePeca + "-select");
            pecaInsere = null;
        }
    }
}

// Header esconder e aparecer
$("header").click(function () {
    $(this).slideUp();
    $(this).parent().prepend("<div class='mostra-header'>"
        +"<img src='https://cdn-icons-png.flaticon.com/128/32/32195.png' alt='Mostra header'/></div>")
    $(".mostra-header").click(function () {
        $(this).remove();
        $("header").slideDown();
    })
});

// Movimentação do tabuleiro (left, top, right, bottom, fixed)
var iniciaInterval;
var movimentacaoTabuleiro = function () {
    $("#btnTop")
        .on("click", () => $("table").css("top", (parseInt($("table").css("top"))-20)+"px"))
        .on("mousedown", function () {
            clearInterval(iniciaInterval);
            iniciaInterval = setInterval(() => $("table").css("top", (parseInt($("table").css("top"))-20)+"px"), 200);})
        .on("mouseup", () => clearInterval(iniciaInterval));

    $("#btnBottom")
        .on("click", () => $("table").css("top", (parseInt($("table").css("top"))+20)+"px"))
        .on("mousedown", function () {
            clearInterval(iniciaInterval);
            iniciaInterval = setInterval(() => $("table").css("top", (parseInt($("table").css("top"))+20)+"px"), 200);})
        .on("mouseup", () => clearInterval(iniciaInterval));

    $("#btnLeft")
        .on("click", () => $("table").css("left", (parseInt($("table").css("left"))-20)+"px"))
        .on("mousedown", function () {
            clearInterval(iniciaInterval);
            iniciaInterval = setInterval(() => $("table").css("left", (parseInt($("table").css("left"))-20)+"px"), 200);})
        .on("mouseup", () => clearInterval(iniciaInterval));

    $("#btnRight")
        .on("click", () => $("table").css("left", (parseInt($("table").css("left"))+20)+"px"))
        .on("mousedown", function(){
            clearInterval(iniciaInterval);
            iniciaInterval = setInterval(() => $("table").css("left", (parseInt($("table").css("left"))+20)+"px"), 200);})
        .on("mouseup", () => clearInterval(iniciaInterval));

    $("#btnFixed").click(function () {
        $("table").css({"top": "0px", "left": "-19.5px"});
        clearInterval(iniciaInterval);
    });
};
movimentacaoTabuleiro();

