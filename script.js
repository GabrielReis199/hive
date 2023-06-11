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
var contadorRodadas = 0;
var pecaInsere = null;

// Gera as coordenadas das peças em campo - ok
var geraCoordenadas = function () {
    // Coloca as coordenadas na linha 50
    contadorAntes  = 50;
    contadorDepois = 50;
    $("tr[data-linha=50] td[data-coluna=50]").prevAll().each(function () {
        $(this).attr("data-coluna", --contadorAntes);
    });
    $("tr[data-linha=50] td[data-coluna=50]").nextAll().each(function () {
        $(this).attr("data-coluna", ++contadorDepois);
    });

    // Coloca o restante das coordenadas
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

// Gera os vizinhos de cada peça inserida no tabuleiro - ok
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
    
    var top = -15
    $("tr").each(function (index) {
        if(index != 0) {
            $(this).css("top", ""+top+"px");
            top = top - 15;
        }
    });
}

// Gera um vetor com os vezinhos cimaAnt, cimaDep, ant, dep, baixoAnt e baixoDep  - ok
var geraVizinhosPecaIndividual = function (that) {
    var col = parseInt($(that).attr("data-coluna"));
        col = $(that).parent().prevAll().length % 2 == 0 ? col - 1 : col;

    var vetPosicoes = [];

    vetPosicoes.push($(that).parent().prev().find("[data-coluna='"+(col  )+"']"));
    vetPosicoes.push($(that).parent().prev().find("[data-coluna='"+(col+1)+"']"));
    vetPosicoes.push($(that).prev());
    vetPosicoes.push($(that).next());
    vetPosicoes.push($(that).parent().next().find("[data-coluna='"+(col  )+"']"));
    vetPosicoes.push($(that).parent().next().find("[data-coluna='"+(col+1)+"']"));

    return vetPosicoes;
};

// Marca as tds disponíveis no tabuleiro ao inserir uma nova peça - ok
var mapeamentoEspacosDisponiveis = function () {
    var classeOponente = !flagPlayer1 ? ".player1" : ".player2";
    var classeAliado =    flagPlayer1 ? ".player1" : ".player2";

    // Se não tiver peças no tabuleiro não precisa conferir
    if($("tbody tr").length == 0) 
        return;

    // Se tiver apenas 1 peça, seleciona todos os vizinhos da primeira
    if($("td[class='player1'], td[class='player2']").length == 1) { 
        $("tr[data-linha='49'] td[data-coluna='50'],"
         +"tr[data-linha='49'] td[data-coluna='51'],"
         +"tr[data-linha='50'] td[data-coluna='49'],"
         +"tr[data-linha='50'] td[data-coluna='51'],"
         +"tr[data-linha='51'] td[data-coluna='50'],"
         +"tr[data-linha='51'] td[data-coluna='51']").addClass("opcao");
        return;
    }

    // Pra cada peça no tabuleiro, é verificado se tem algum vizinho para marcar como opcao
    $("tbody tr td").not("[class='player1'], [class='player2']").each(function () {
        var vetPosicoes = geraVizinhosPecaIndividual(this);

        if( !$(vetPosicoes[0]).is(".player1, .player2") && !$(vetPosicoes[1]).is(".player1, .player2") &&
            !$(vetPosicoes[2]).is(".player1, .player2") && !$(vetPosicoes[3]).is(".player1, .player2") &&
            !$(vetPosicoes[4]).is(".player1, .player2") && !$(vetPosicoes[5]).is(".player1, .player2"))
            return;

        if( $(vetPosicoes[0]).is(classeOponente) || $(vetPosicoes[1]).is(classeOponente) ||
            $(vetPosicoes[2]).is(classeOponente) || $(vetPosicoes[3]).is(classeOponente) ||
            $(vetPosicoes[4]).is(classeOponente) || $(vetPosicoes[5]).is(classeOponente))
            return;

        $(this).addClass("opcao");
    });
}

// Atualiza as peças disponíveis para jogo a cada rodada passada - ok
var getPecasDisponiveis = function () {
    if(flagPlayer1)
        $("#contador").text(++contadorRodadas);
    
    var reduzTamanhoMenuEInserePecasDisponiveis = function (divLadoOpc, pecasOpc, textClasseOpc) {
        $(divLadoOpc).toggleClass("vez-" + textClasseOpc);

        var sum = pecasOpc.reduce((cont,item) => cont + item.nPecas, 0);
        if(sum != 0) {
            if(contadorRodadas == 4 && pecasOpc[0].nPecas == 1)
                $(divLadoOpc).css({"width": "60px", "height": "60px"});
            else if(sum > 12) // 13 14
                $(divLadoOpc).css({"width": "120px", "height": "400px"});
            else if(sum > 10) // 11 12
                $(divLadoOpc).css({"width": "120px", "height": "340px"});
            else if(sum > 8) // 9 10
                $(divLadoOpc).css({"width": "120px", "height": "280px"});
            else if(sum > 7) // 8
                $(divLadoOpc).css({"width": "120px", "height": "220px"});
            else if(sum > 6) // 7
                $(divLadoOpc).css({"width": "60px", "height": "400px"});
            else if(sum > 5) // 6
                $(divLadoOpc).css({"width": "60px", "height": "360px"});
            else if(sum > 4) // 5
                $(divLadoOpc).css({"width": "60px", "height": "300px"});
            else if(sum > 3) // 4
                $(divLadoOpc).css({"width": "60px", "height": "240px"});
            else if(sum > 2) // 3
                $(divLadoOpc).css({"width": "60px", "height": "180px"});
            else if(sum > 1)  // 2
                $(divLadoOpc).css({"width": "60px", "height": "120px"});
            else 
                $(divLadoOpc).css({"width": "60px", "height": "60px"});
        } else {
            $(divLadoOpc).hide();
            if(divLadoOpc == "#esquerda")
                $("#esquerda ul").append("<li></li>");
        }

        if(contadorRodadas == 4 && pecasOpc[0].nPecas == 1) {
            $(divLadoOpc).find("ul").append("<li class='"+ textClasseOpc +"'><img src='"+
            pecasOpc[0].img +"' alt='"+ pecasOpc[0].nome +"'/></li>");
        } else {
            var aux = 0;
            while (aux < pecasOpc.length) {
                if(pecasOpc[aux].nPecas!=0)
                    for(var i = 1; i <= pecasOpc[aux].nPecas; i++)
                        $(divLadoOpc).find("ul").append("<li class='"+ textClasseOpc +"'><img src='"
                            +pecasOpc[aux].img +"' alt='"+ pecasOpc[aux].nome +"'/></li>");
                aux++;
            }
        }
    };
    
    // Reduz tamanho da aba de peças disponíveis e insere novas peças disponíveis para o adversário
    var pecas =      !flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
    var textClasse = !flagPlayer1 ? "player1"    : "player2";
    var divLado =    !flagPlayer1 ? "#direita"   : "#esquerda";

    $(divLado).prop("disabled", false).css('pointer-events', 'none');
    reduzTamanhoMenuEInserePecasDisponiveis(divLado, pecas, textClasse);

    // Reduz tamanho da aba de peças disponíveis e insere novas peças disponíveis para o jogador atual
    pecas =      flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
    textClasse = flagPlayer1 ? "player1"    : "player2";
    divLado =    flagPlayer1 ? "#direita"   : "#esquerda";

    $(divLado).prop("disabled", true).css('pointer-events', 'auto');
    reduzTamanhoMenuEInserePecasDisponiveis(divLado, pecas, textClasse);

    // Ativa clique de li dessa aba lateral
    $("ul li").click(function () {
        $("ul li").removeClass("player1-select player2-select");
        $("td").removeClass("opcao opcao-player1-select opcao-player2-select player1-select player2-select");
        $(this).addClass(textClasse + "-select");
        $("main").css('pointer-events', 'auto');
        pecaInsere = $(this);
        mapeamentoEspacosDisponiveis();
    });
    $("ul li:first").trigger("click");
    $("ul li").removeClass("player1-select player2-select");
    $("td").removeClass("opcao opcao-player1-select opcao-player2-select player1-select player2-select");
}
getPecasDisponiveis();
$("#esquerda").removeClass("vez-player2");

// Inicia o tabuleiro e chama as funções para criar os visinhos das peças - ok
var atualizaTabuleiro = function (that) {
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
    }
    pecaInsere = null;
}
atualizaTabuleiro();

// Verifica se a peça selecionada quebra a colmeia | true = quebra colmeia, false = não quebra - ok
var verificaQuebraColmeia = function (that) {
    if($(that).find("img").length > 1) // Se a peça estiver em cima de outra pode mover livremente
        return false;

    var pecasColmeia = [
        {   linha: parseInt($("td").not(".undefined").first().parent().attr("data-linha")), 
            coluna: parseInt($("td").not(".undefined").first().attr("data-coluna")) }
    ];
    var objThat = {linha: parseInt($(that).parent().attr("data-linha")), coluna: parseInt($(that).attr("data-coluna"))};

    for(var pecaColmeia of pecasColmeia) {
        var peca = $("tr[data-linha='"+pecaColmeia.linha+"'] td[data-coluna='"+pecaColmeia.coluna+"']");

        var vetPosicoes = geraVizinhosPecaIndividual(peca);

        var classeCimaAnt = $(vetPosicoes[0]).is(".player1, .player2"),
            classeCimaDep = $(vetPosicoes[1]).is(".player1, .player2"),
            classeAnt = $(vetPosicoes[2]).is(".player1, .player2"),
            classeDep = $(vetPosicoes[3]).is(".player1, .player2"),
            classeBaixoAnt = $(vetPosicoes[4]).is(".player1, .player2"),
            classeBaixoDep = $(vetPosicoes[5]).is(".player1, .player2");

        var coordCimaAnt = {linha: parseInt($(vetPosicoes[0]).parent().attr("data-linha")), 
                            coluna: parseInt($(vetPosicoes[0]).attr("data-coluna"))},
            coordCimaDep = {linha: parseInt($(vetPosicoes[1]).parent().attr("data-linha")), 
                            coluna: parseInt($(vetPosicoes[1]).attr("data-coluna"))},
            coordAnt =  {linha: parseInt($(vetPosicoes[2]).parent().attr("data-linha")), 
                        coluna: parseInt($(vetPosicoes[2]).attr("data-coluna"))},
            coordDep = {linha: parseInt($(vetPosicoes[3]).parent().attr("data-linha")), 
                        coluna: parseInt($(vetPosicoes[3]).attr("data-coluna"))},
            coordBaixoAnt = {linha: parseInt($(vetPosicoes[4]).parent().attr("data-linha")), 
                            coluna: parseInt($(vetPosicoes[4]).attr("data-coluna"))},
            coordBaixoDep = {linha: parseInt($(vetPosicoes[5]).parent().attr("data-linha")), 
                            coluna: parseInt($(vetPosicoes[5]).attr("data-coluna"))};

        if( classeCimaAnt && JSON.stringify(coordCimaAnt) !== JSON.stringify(objThat) &&
            !pecasColmeia.find(item => item.linha == coordCimaAnt.linha && item.coluna == coordCimaAnt.coluna)) {
            pecasColmeia.push(coordCimaAnt);
        }
        if( classeCimaDep && JSON.stringify(coordCimaDep) !== JSON.stringify(objThat) &&
            !pecasColmeia.find(item => item.linha == coordCimaDep.linha && item.coluna == coordCimaDep.coluna)) {
            pecasColmeia.push(coordCimaDep);
        }
        if( classeAnt && JSON.stringify(coordAnt) !== JSON.stringify(objThat) &&
            !pecasColmeia.find(item => item.linha == coordAnt.linha && item.coluna == coordAnt.coluna)) {
            pecasColmeia.push(coordAnt);
        }
        if( classeDep && JSON.stringify(coordDep) !== JSON.stringify(objThat) &&
            !pecasColmeia.find(item => item.linha == coordDep.linha && item.coluna == coordDep.coluna)) {
            pecasColmeia.push(coordDep);
        }
        if( classeBaixoAnt && JSON.stringify(coordBaixoAnt) !== JSON.stringify(objThat) &&
            !pecasColmeia.find(item => item.linha == coordBaixoAnt.linha && item.coluna == coordBaixoAnt.coluna)) {
            pecasColmeia.push(coordBaixoAnt);
        }
        if( classeBaixoDep && JSON.stringify(coordBaixoDep) !== JSON.stringify(objThat) &&
            !pecasColmeia.find(item => item.linha == coordBaixoDep.linha && item.coluna == coordBaixoDep.coluna)) {
            pecasColmeia.push(coordBaixoDep);
        }
    }

    var verifica = false;
    $("tr td[class*='player1'], tr td[class*='player2']").not(that).each(function () {
        var objAux = {linha: parseInt($(this).parent().attr("data-linha")), coluna: parseInt($(this).attr("data-coluna"))};
        if( !!pecasColmeia.find(item => item.linha == objAux.linha && item.coluna == objAux.coluna) )
            return;
        verifica = true; 
        return false;
    });

    return verifica;
};

// verifico se uma peça quebra a liberdade de movimento
var verificaLiberdadeDeMovimento = function (vizinhosItem, that) {
    var localThat = vizinhosItem.findIndex(item => item[0] == that);
    
    if(localThat == 0 && ((!$(vizinhosItem[1]).is(".player1, .player2") || $(vizinhosItem[1]).is(".player1-select, .player2-select")) 
        || (!$(vizinhosItem[2]).is(".player1, .player2") || $(vizinhosItem[2]).is(".player1-select, .player2-select")))) {
            return true;
    } else if(localThat == 1 && ((!$(vizinhosItem[0]).is(".player1, .player2") || $(vizinhosItem[0]).is(".player1-select, .player2-select")) 
        || (!$(vizinhosItem[3]).is(".player1, .player2") || $(vizinhosItem[3]).is(".player1-select, .player2-select")))) {
            return true;
    } else if(localThat == 2 && ((!$(vizinhosItem[0]).is(".player1, .player2") || $(vizinhosItem[0]).is(".player1-select, .player2-select")) 
        || (!$(vizinhosItem[4]).is(".player1, .player2") || $(vizinhosItem[4]).is(".player1-select, .player2-select")))) {
            return true;
    } else if(localThat == 3 && ((!$(vizinhosItem[1]).is(".player1, .player2") || $(vizinhosItem[1]).is(".player1-select, .player2-select")) 
        || (!$(vizinhosItem[5]).is(".player1, .player2") || $(vizinhosItem[5]).is(".player1-select, .player2-select")))) {
            return true;
    } else if(localThat == 4 && ((!$(vizinhosItem[2]).is(".player1, .player2") || $(vizinhosItem[2]).is(".player1-select, .player2-select")) 
        || (!$(vizinhosItem[5]).is(".player1, .player2") || $(vizinhosItem[5]).is(".player1-select, .player2-select")))) {
            return true;
    } else if(localThat == 5 && ((!$(vizinhosItem[3]).is(".player1, .player2") || $(vizinhosItem[3]).is(".player1-select, .player2-select")) 
        || (!$(vizinhosItem[4]).is(".player1, .player2") || $(vizinhosItem[4]).is(".player1-select, .player2-select")))) {
            return true;
    }
    
    return false;
};

// Gera os movimentos dos animais
var geraOpcoesAnimais = function (that) {
    nomeAnimal = $(that).find("img:last").attr("alt");

    if(nomeAnimal == "Abelha") {
        var vizinhosAbelha = geraVizinhosPecaIndividual(that);
        var opcoesAbelha = [];

        vizinhosAbelha.forEach(function (itemUndefined) {
            if(!$(itemUndefined).is(".player1, .player2")) {
                var vizinhosItem = geraVizinhosPecaIndividual(itemUndefined);
                
                vizinhosItem.some(function (item) {
                    var verifica = $(item)[0] == that ? false 
                        : $(item).is(".player1, .player2");
                    if(verifica && verificaLiberdadeDeMovimento(vizinhosItem, that)) {
                        opcoesAbelha.push(itemUndefined);
                        return true;
                    }
                });
            }
        });

        if(opcoesAbelha.length > 0) {
            opcoesAbelha.forEach((item) => $(item).addClass("opcao"));
            pecaInsere = $(that);
        } else {
            $(that).removeClass("player1-select player2-select");
        }
    }

    if(nomeAnimal == "Aranha") {
        var vizinhosAranha = geraVizinhosPecaIndividual(that);
        var opcoesAranha = [];

        var caminhoPrimeiro = [];
        vizinhosAranha.forEach(function (itemUndefined) {
            if(!$(itemUndefined).is(".player1, .player2")) {
                var vizinhosItem = geraVizinhosPecaIndividual(itemUndefined);
                
                vizinhosItem.some(function (item) {
                    var verifica = $(item)[0] == that ? false 
                        : $(item).is(".player1, .player2");
                    if(verifica && verificaLiberdadeDeMovimento(vizinhosItem, that)) {
                        caminhoPrimeiro.push(itemUndefined);
                        return true;
                    }
                });
            }
        });

        var caminhoSegundo = [];
        for(primeiro of caminhoPrimeiro) {
            var vizinhosPrimeiro = geraVizinhosPecaIndividual(primeiro);
            vizinhosPrimeiro.forEach(function (itemOpcSeg) {
                if(!$(itemOpcSeg).is(".player1, .player2")) {
                    var vizinhosOpcaoSegundo = geraVizinhosPecaIndividual(itemOpcSeg);

                    vizinhosOpcaoSegundo.some(function (item) {
                        var verifica = $(item)[0] == that || $(item)[0] == primeiro[0] ? false 
                            : $(item).is(".player1, .player2");
                        if(verifica && verificaLiberdadeDeMovimento(vizinhosOpcaoSegundo, primeiro[0])) {
                            caminhoSegundo.push([primeiro[0], itemOpcSeg[0]]);
                            return true;
                        }
                    });
                }
            });
        }

        for(caminho of caminhoSegundo) {
            var primeiro = caminho[0];
            var segundo = caminho[1];

            var vizinhosSegundo = geraVizinhosPecaIndividual(segundo);
            vizinhosSegundo.forEach(function (itemOpcTer) {
                if(!$(itemOpcTer).is(".player1, .player2") && $(itemOpcTer)[0] != primeiro && $(itemOpcTer)[0] != segundo) {
                    var vizinhosOpcaoTerceito = geraVizinhosPecaIndividual(itemOpcTer);

                    vizinhosOpcaoTerceito.some(function (item) {
                        var verifica = $(item)[0] == that || $(item)[0] == primeiro || $(item)[0] == segundo
                            ? false : $(item).is(".player1, .player2");
                        if(verifica && verificaLiberdadeDeMovimento(vizinhosOpcaoTerceito, segundo)) {
                            opcoesAranha.push(itemOpcTer);
                            return true;
                        }
                    });
                }
            });
        }

        if(opcoesAranha.length > 0) {
            opcoesAranha.forEach((item) => $(item).addClass("opcao"));
            pecaInsere = $(that);
        } else {
            $(that).removeClass("player1-select player2-select");
        }
    }

    if(nomeAnimal == "Formiga") {
        // Verifica se a formiga pode ser mover sem quebrar a liberdade de movimento
        var vizinhosFormiga = geraVizinhosPecaIndividual(that);

        var vetVizinhosDisponiveis = [];
        vizinhosFormiga.forEach(function (itemFormiga) {
            if(!$(itemFormiga).is(".player1, .player2")) {
                var vizinhosItem = geraVizinhosPecaIndividual(itemFormiga);
                
                vizinhosItem.some(function (item) {
                    var verifica = $(item)[0] == that ? false 
                        : $(item).is(".player1, .player2");
                    if(verifica && verificaLiberdadeDeMovimento(vizinhosItem, that)) {
                        vetVizinhosDisponiveis.push(itemFormiga);
                        return true;
                    }
                });
            }
        });

        if(vetVizinhosDisponiveis.length > 0) {
            opcoesFormiga = [];
            for(item of vetVizinhosDisponiveis) {
                if(opcoesFormiga.some(v => v[0] == item[0]))
                    break;
                
                opcoesFormiga.push(item);
                
                for(opcao of opcoesFormiga) {
                    var vizinhosOpcao = geraVizinhosPecaIndividual(opcao);
    
                    vizinhosOpcao.forEach(function (itemOpcao) {
                        if($(itemOpcao).is(".undefined")) {
                            var vizinhosItemOpcao = geraVizinhosPecaIndividual(itemOpcao);
    
                            vizinhosItemOpcao.some(function (itemOpc) {
                                var verifica = $(itemOpc)[0] == that ? false 
                                    : $(itemOpc).is(".player1, .player2");
                                if(verifica && verificaLiberdadeDeMovimento(vizinhosItemOpcao, opcao[0])) {
                                    if(opcoesFormiga.every((v => v[0] != itemOpcao[0])))
                                        opcoesFormiga.push(itemOpcao);
                                    return true;
                                }
                            });
                        }
                    });
                }
            }
            opcoesFormiga.forEach((item) => $(item).addClass("opcao"));

            pecaInsere = $(that);
        } else {
            $(that).removeClass("player1-select player2-select");
        }
    }

    if(nomeAnimal == "Gafanhoto") {
        var vizinhosGafanhoto = geraVizinhosPecaIndividual(that);
        
        if($(vizinhosGafanhoto[0]).is(".player1, .player2")) {
            while($(vizinhosGafanhoto[0]).is(".player1, .player2")) {
                col = parseInt($(vizinhosGafanhoto[0]).attr("data-coluna"));
                col = $(vizinhosGafanhoto[0]).parent().prevAll().length % 2 == 0 ? col - 1 : col;
                vizinhosGafanhoto[0] = $(vizinhosGafanhoto[0]).parent().prev().find("[data-coluna='"+(col)+"']");
            }
            if($(vizinhosGafanhoto[0]).is(".undefined"))
                $(vizinhosGafanhoto[0]).addClass("opcao");
        }
        if($(vizinhosGafanhoto[1]).is(".player1, .player2")) {
            while($(vizinhosGafanhoto[1]).is(".player1, .player2")) {
                col = parseInt($(vizinhosGafanhoto[1]).attr("data-coluna"));
                col = $(vizinhosGafanhoto[1]).parent().prevAll().length % 2 == 0 ? col : col + 1;
                vizinhosGafanhoto[1] = $(vizinhosGafanhoto[1]).parent().prev().find("[data-coluna='"+(col)+"']");
            }
            if($(vizinhosGafanhoto[1]).is(".undefined"))
                $(vizinhosGafanhoto[1]).addClass("opcao");
        }
        if($(vizinhosGafanhoto[2]).is(".player1, .player2")) {
            while($(vizinhosGafanhoto[2]).is(".player1, .player2")) 
                vizinhosGafanhoto[2] = $(vizinhosGafanhoto[2]).prev();
            if($(vizinhosGafanhoto[2]).is(".undefined"))
                $(vizinhosGafanhoto[2]).addClass("opcao");
        }
        if($(vizinhosGafanhoto[3]).is(".player1, .player2")) {
            while($(vizinhosGafanhoto[3]).is(".player1, .player2")) 
                vizinhosGafanhoto[3] = $(vizinhosGafanhoto[3]).next();
            if($(vizinhosGafanhoto[3]).is(".undefined"))
                $(vizinhosGafanhoto[3]).addClass("opcao");
        }
        if($(vizinhosGafanhoto[4]).is(".player1, .player2")) {
            while($(vizinhosGafanhoto[4]).is(".player1, .player2")) {
                col = parseInt($(vizinhosGafanhoto[4]).attr("data-coluna"));
                col = $(vizinhosGafanhoto[4]).parent().prevAll().length % 2 == 0 ? col - 1 : col;
                vizinhosGafanhoto[4] = $(vizinhosGafanhoto[4]).parent().next().find("[data-coluna='"+(col)+"']");
            }
            if($(vizinhosGafanhoto[4]).is(".undefined"))
                $(vizinhosGafanhoto[4]).addClass("opcao");
        }
        if($(vizinhosGafanhoto[5]).is(".player1, .player2")) {
            while($(vizinhosGafanhoto[5]).is(".player1, .player2")) {
                col = parseInt($(vizinhosGafanhoto[5]).attr("data-coluna"));
                col = $(vizinhosGafanhoto[5]).parent().prevAll().length % 2 == 0 ? col : col + 1;
                vizinhosGafanhoto[5] = $(vizinhosGafanhoto[5]).parent().next().find("[data-coluna='"+(col)+"']");
            }
            if($(vizinhosGafanhoto[5]).is(".undefined"))
                $(vizinhosGafanhoto[5]).addClass("opcao");
        }

        pecaInsere = $(that);
    }

    if(nomeAnimal == "Besouro") {
        var vizinhosBesouro = geraVizinhosPecaIndividual(that);

        vizinhosBesouro.forEach(function (item) {
            if($(item).is(".player1, .player2")) {
                $(item).addClass($(item).is(".player1") ? "opcao-player1-select": "opcao-player2-select");
            } else {
                var vizinhosItem = geraVizinhosPecaIndividual(item);
                
                var pecaDisp = false;
                vizinhosItem.forEach(function (item) {
                    var verifica = $(item)[0] == that ? false 
                        : $(item).is(".player1, .player2");
                    if(verifica)
                        pecaDisp = true;
                });

                var verificaLiberdade = verificaLiberdadeDeMovimento(vizinhosItem, that);
                if($(that).find("img").length > 1 || (pecaDisp && verificaLiberdade))
                    $(item).addClass("opcao");
            }
        });
        
        pecaInsere = $(that);
    }

    if(nomeAnimal == "Joaninha") {
        var vizinhosJoaninha = geraVizinhosPecaIndividual(that);

        var caminhoPrimeiro = [];
        vizinhosJoaninha.forEach(function (item) {
            if($(item).is(".player1, .player2"))
                caminhoPrimeiro.push(item);
        });

        var caminhoSegundo = [];
        for(var peca of caminhoPrimeiro) {
            var vizinhosPeca = geraVizinhosPecaIndividual(peca);

            vizinhosPeca.forEach(function (item) {
                var verifica = $(item)[0] == that || $(item)[0] == peca[0] ? false 
                    : $(item).is(".player1, .player2");
                if(verifica)
                    caminhoSegundo.push([peca, item]);
            });
        }

        for(var caminho of caminhoSegundo) {
            var primeiro = caminho[0];
            var segundo = caminho[1];
            
            var vizinhosSegundo = geraVizinhosPecaIndividual(segundo);

            vizinhosSegundo.forEach(function (item) {
                var verifica = $(item)[0] == primeiro[0] || $(item)[0] == that || $(item)[0] == segundo[0] ? false 
                    : $(item).is(".undefined");
                if(verifica)
                    $(item).addClass("opcao");
            });
        }

        pecaInsere = $(that);
    }

    if(nomeAnimal == "Tatu") {
        var vizinhosTatu = geraVizinhosPecaIndividual(that);

        if($("tr td[class*='player1-tatu'], tr td[class*='player2-tatu']").length > 0) {
            vizinhosTatu.forEach(function (item) {
                if(!$(item).is(".player1, .player2"))
                    $(item).addClass("opcao");
            });

            var novoThat = $("tr td[class*='player1-tatu'], tr td[class*='player2-tatu']");
            pecaInsere = $(novoThat);
        } else {
            vizinhosTatu.forEach(function (item) {
                if($(item).is(".player1, .player2")) {
                    if(!verificaQuebraColmeia(item[0]) && $(item).find("img").length == 1 && $(item).attr("data-ultima-jogada") == undefined)
                        $(item).addClass($(item).is(".player1") ? "opcao-player1-select": "opcao-player2-select");
                } else {
                    var vizinhosItem = geraVizinhosPecaIndividual(item);
                    
                    vizinhosItem.some(function (itemAux) {
                        var verifica = $(itemAux)[0] == that ? false 
                            : $(itemAux).is(".player1, .player2");
                        if(verifica && verificaLiberdadeDeMovimento(vizinhosItem, that)) {
                            $(item).addClass("opcao");
                            return true;
                        }
                    });
                }
            });
            
            pecaInsere = $(that);
        }
    }
};

// gera um modal se a peça clicada tem uma pilha de insetos - ok
var geraModalPilhaInsetos = function (that) {
    $("#modalPilha").empty().show();
    qtdInsetos = parseInt($(that).find("img").length);

    $(that).find("img").not($(that).find("img:last")).each(function () {
        $("#modalPilha").append("<div class='pecaPilha "+$(this).attr("data-cor")+"'>"
            +"<img src='"+$(this).attr("src")+"' alt='"+$(this).attr("alt")+"'></div>");
    });
    var textClassAliado = $(that).is(".player1") ? "player1" : "player2";
    $("#modalPilha").append("<div class='pecaPilha "+textClassAliado+"'>"
        +"<img src='"+$(that).find("img:last").attr("src")+"' alt='"+$(that).find("img:last").attr("alt")+"'></div>");
}
$("#modalPilha").hide();

// Insere uma peça no tabuleiro - ok
var insPecTabu = function (that) {
    var textClassAliado = flagPlayer1 ? "player1" : "player2";
    var pecas = flagPlayer1 ? pecasPlayer1 : pecasPlayer2;

    var atualizaPilhaPeca = function (peca) {
        $(peca).removeAttr("id");
        $(peca).find("style").remove();
        if($(peca).find("img").length > 1) {
            var qtdPecas = $(peca).find("img").length;
            var nomQtdPecas = $(peca).parent().attr("data-linha") + $(peca).attr("data-coluna");
            $("<style>#qtd-pecas-"+nomQtdPecas+":after { content: '"+qtdPecas+"'; text-align: center; position: absolute;"+
            "width: 12px; height: 12px; bottom: 10px; right: 15px; : white; border: 1px solid #000;"+
            "border-radius: 50%; background-color: rgb(168, 33, 33); }</style>").appendTo(peca);
            $(peca).attr("id", "qtd-pecas-"+nomQtdPecas);
        }
    };

    // Se tem pecaInsere marcada e cliquei em opcao
    if(pecaInsere != null && $(that).hasClass("opcao")) {
        $("tr td[data-ultima-jogada]").removeAttr("data-ultima-jogada")
        $(that).append($(pecaInsere).html()).attr("class", textClassAliado).attr("data-ultima-jogada", "");
        if($(pecaInsere).prop("nodeName") == "LI") { //Se estou inserindo peça nova no tabuleiro
            for(var i=0; i<pecas.length; i++) 
                if(pecas[i].nome == $(pecaInsere).find("img").attr("alt"))
                    pecas[i].nPecas = pecas[i].nPecas - 1 ;
        } else { //Se estou movendo uma peça que já está no tabuleiro
            if($(pecaInsere).find("img").length == 1) { //Se é um não-besouro
                $(pecaInsere).find("img").remove();
                $(pecaInsere).removeClass("player1-select player2-select player1 player2").addClass("undefined");
            } else { //Se é um besouro que está em cima de outra peça
                $(pecaInsere).removeClass("player1-select player2-select player1 player2");
                //Coloquei peçaInsere e pode ser que já tenha uma pilha, retiro o restante pra ter só a primeira
                $(that).find("img:last").prevAll().remove();
                //Tira a ultima peça, adiciona a classe da peça de baixo e mostra ela
                $(pecaInsere).find("img:last").remove();
                $(pecaInsere).addClass($(pecaInsere).find("img:last").attr("data-cor"))
                $(pecaInsere).find("img:last").show().removeAttr("data-cor");
                //Pega as coordenadas e tira a classe do contador, para resetar logo a baixo
                atualizaPilhaPeca(pecaInsere);
            }
        }
        $("#modalPilha").empty().hide();
        $("li").remove();
        flagPlayer1 = !flagPlayer1;
        $("td").removeClass("opcao opcao-player1-select opcao-player2-select player1-tatu player2-tatu");
        atualizaTabuleiro(that);
        getPecasDisponiveis();
    // Se tem pecaInsere marcada e cliquei em opcao para besouro
    } else if(pecaInsere != null && $(that).is(".opcao-player1-select, .opcao-player2-select")) {
        if($(pecaInsere).find("img").attr("alt") == "Tatu") {
            console.log("Tatu foi!");
            $(that).addClass(textClassAliado + "-tatu");
            $("td").removeClass("opcao opcao-player1-select opcao-player2-select");
            geraOpcoesAnimais(pecaInsere);
        } else {
            var corPecaDeBaixo = $(that).is(".player1") ? "player1" : "player2";
            var qtdEmpilhadas = parseInt($(that).find("img").length)-1;
            //Coloco pecaInsere, retiro as que vieram da pecaInsere a mais e escondo a penúltima (antiga topo)
            $("tr td[data-ultima-jogada]").removeAttr("data-ultima-jogada")
            $(that).append($(pecaInsere).html()).attr("class", textClassAliado).attr("data-ultima-jogada", "");
            $(that).find("img").eq(qtdEmpilhadas).nextAll().not("img:last").remove();
            $(that).find("img:last").prev().attr("data-cor", corPecaDeBaixo).hide();
            //Retiro a ultima img e vejo nos ifs o que fazer
            $(pecaInsere).find("img:last").remove();
            $(pecaInsere).removeClass("player1-select player2-select player1 player2");
            if($(pecaInsere).find("img").length == 0) {//Se após remover ficou 0
                //var nomQtdPecas = $(pecaInsere).parent().attr("data-linha") + $(pecaInsere).attr("data-coluna");
                $(pecaInsere).removeAttr("id");
                $(pecaInsere).find("style").remove();
                $(pecaInsere).addClass("undefined");
            } else { //Se após remover ficou mais de 0
                //Mostra a peça do topo
                $(pecaInsere).addClass($(pecaInsere).find("img:last").attr("data-cor"));
                $(pecaInsere).find("img:last").removeAttr("data-cor").show();
                //Pega as coordenadas e tira a classe do contador, para resetar logo a baixo
                atualizaPilhaPeca(pecaInsere);
            }
            $("#modalPilha").empty().hide();
            $("li").remove();
            flagPlayer1 = !flagPlayer1;
            $("td").removeClass("opcao opcao-player1-select opcao-player2-select");
            atualizaTabuleiro(that);
            getPecasDisponiveis();
        }
    // Se cliquei em alguma peça de aliado (para ver os movimentos)
    } else if($(that).hasClass(textClassAliado)){
        var textClassePeca = $(that).is(".player1") ? "player1" : "player2";
        if(textClassAliado == textClassePeca) {
            $("ul li").removeClass("player1-select player2-select");
            $("td").removeClass("opcao opcao-player1-select opcao-player2-select player1-select player2-select "+
                "player1-tatu player2-tatu");
            pecaInsere = null;
            if(!verificaQuebraColmeia(that) && pecas[0].nPecas == 0) {// true = quebra colmeia, false = não quebra
                $(that).addClass(textClassePeca + "-select");
                geraOpcoesAnimais(that);
            }
            if($(that).find("img").length > 1)
                geraModalPilhaInsetos(that);
        }
    // Se cliquei em alguma peça do inimigo ou fora do tabuleiro
    } else{
        $("ul li").removeClass("player1-select player2-select");
        $("td").removeClass("opcao opcao-player1-select opcao-player2-select player1-select player2-select "+
            "player1-tatu player2-tatu");
        $("#modalPilha").empty().hide();
        if($(that).find("img").length > 1)
            geraModalPilhaInsetos(that);
    }

    

    atualizaPilhaPeca(that);
}

// Header esconder e aparecer - ok
$("header").click(function () {
    $(this).slideUp();
    $(this).parent().prepend("<div class='mostra-header'>"
        +"<img src='https://cdn-icons-png.flaticon.com/128/32/32195.png' alt='Mostra header'/></div>")
    $(".mostra-header").click(function () {
        $(this).remove();
        $("header").slideDown();
    })
});

// Movimentação do tabuleiro (left, top, right, bottom, fixed) - ok
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

    $("#btnTiraSelecao").click(function () {
        $("ul li").removeClass("player1-select player2-select");
        $("td").removeClass("opcao opcao-player1-select opcao-player2-select player1-select player2-select "+
            "player1-tatu player2-tatu");
        $("#modalPilha").empty().hide();
    });
};
movimentacaoTabuleiro();
