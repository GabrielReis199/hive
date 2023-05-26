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

var insereEspacosTr = function () {
    var top = -15
    $("tr").each(function (index) {
        if(index != 0) {
            $(this).css("top", ""+top+"px");
            top = top - 15;
        }
    });
}

var regulaTab = 1;

var geraTabuleiro = function (left, top, right, bottom) {
    if($("tbody tr").length == 0) {
        $("tbody").append("<tr data-linha='50'><td data-coluna='50' class='player1'>"+$(pecaInsere).html()+"</td></tr>");
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
        //var somaVMais = 20+parseInt($("tbody tr").eq(8).nextAll().length)*20;
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
    textClasse = flagPlayer1 ? "player1" : "player2";
    divLado = flagPlayer1 ? "#direita" : "#esquerda";

    $(divLado).toggleClass("vez-" + textClasse);

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
    }

    // Gera as peças disponíveis no ul atual
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

    $("ul li").click(function () {
        $("ul li").removeClass(textClasse + "-select");
        $(this).addClass(textClasse + "-select");
        $("main").css('pointer-events', 'auto');
        pecaInsere = $(this);
    });
}
getPecasDisponiveis();
$("#esquerda").removeClass("vez-player2");

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

var insPecTabu = function (that) {
    if($(pecaInsere).length == 1 && !$(that).hasClass("player1") && !$(that).hasClass("player2")) {
        $(that).append($(pecaInsere).html()).attr("class", flagPlayer1 ? "player1" : "player2");
        $("li").remove();
        var pecas = flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
        for(var i=0; i<pecas.length; i++) 
            if(pecas[i].nome == $(pecaInsere).find("img").attr("alt"))
                pecas[i].nPecas = pecas[i].nPecas - 1 ;
        flagPlayer1 = !flagPlayer1;
        inserePecaTabuleiro(that);
        getPecasDisponiveis();
    }
}

$("header").click(function () {
    $(this).slideUp();
    $(this).parent().prepend("<div class='mostra-header'>"
        +"<img src='https://cdn-icons-png.flaticon.com/128/32/32195.png' alt='Mostra header'/></div>")
    $(".mostra-header").click(function () {
        $(this).remove();
        $("header").slideDown();
    })
});

var iniciaInterval;
$("#btnTop").on("click", function () {
    $("table").css("top", (parseInt($("table").css("top"))-20)+"px");
}).on("mousedown", function(){
    clearInterval(iniciaInterval);
    iniciaInterval = setInterval(function () {
        $("table").css("top", (parseInt($("table").css("top"))-20)+"px");
    }, 200);
}).on("mouseup", function () {
    clearInterval(iniciaInterval);
});

$("#btnBottom").on("click", function () {
    $("table").css("top", (parseInt($("table").css("top"))+20)+"px");
}).on("mousedown", function(){
    clearInterval(iniciaInterval);
    iniciaInterval = setInterval(function () {
        $("table").css("top", (parseInt($("table").css("top"))+20)+"px");
    }, 200);
}).on("mouseup", function () {
    clearInterval(iniciaInterval);
});

$("#btnLeft").on("click", function () {
    $("table").css("left", (parseInt($("table").css("left"))-20)+"px");
}).on("mousedown", function(){
    clearInterval(iniciaInterval);
    iniciaInterval = setInterval(function () {
        $("table").css("left", (parseInt($("table").css("left"))-20)+"px");
    }, 200);
}).on("mouseup", function () {
    clearInterval(iniciaInterval);
});

$("#btnRight").on("click", function () {
    $("table").css("left", (parseInt($("table").css("left"))+20)+"px");
}).on("mousedown", function(){
    clearInterval(iniciaInterval);
    iniciaInterval = setInterval(function () {
        $("table").css("left", (parseInt($("table").css("left"))+20)+"px");
    }, 200);
}).on("mouseup", function () {
    clearInterval(iniciaInterval);
});

$("#btnFixed").click(function () {
    $("table").css({"top": "0px", "left": "-19.5px"});
    clearInterval(iniciaInterval);
});
