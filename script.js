var totPecas = [1, 3, 3, 2, 2, 0, 0, 0];
// 1 abelha; 3 formigas; 3 gafanhotos; 2 aranhas; 2 besouros; 1 mosquito; 1 joaninha; 1 tatu
var imgPecas = {0: "Abelha",
                1: "Formiga",
                2: "Gafanhoto",
                3: "Aranha",
                4: "Besouro",
                5: "Mosquito",
                6: "Joaninha",
                7: "Tatu"};

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

var geraVisinhos = function () {
    $("td").removeClass("undefined");
    $("tbody td[class='player1'], tbody td[class='player2']").each(function () {
        var tdAtual = $(this);
        var dataTdAtualLinha = parseInt($(tdAtual).attr("data-linha"));
        var dataTdAtualColuna = parseInt($(tdAtual).attr("data-coluna"));

        // INÍCIO PEÇAS ESQUERDA E DIREITA
        if($(tdAtual).prev().length == 0) {
            $(tdAtual).parent().prepend("<td data-linha='"+dataTdAtualLinha+"' data-coluna='"
                +(dataTdAtualColuna-1)+"' class='undefined'></td>");
            $("tr").not($(tdAtual).parent()).each(function () {
                var linha =  $(this).find("td:first").attr("data-linha");
                var coluna = $(this).find("td:first").attr("data-coluna");
                $(this).prepend("<td data-linha='"+linha+"' data-coluna='"+(coluna-1)+"'></td>");
            });
        } else if(!$(tdAtual).prev().hasClass("player1") && !$(tdAtual).prev().hasClass("player2") ) {
            $(tdAtual).prev().addClass("undefined");
        }

        if($(tdAtual).next().length == 0) {
            $(tdAtual).parent().append("<td data-linha='"+dataTdAtualLinha+"' data-coluna='"
                +(dataTdAtualColuna+1)+"' class='undefined'></td>");
        } else if(!$(tdAtual).next().hasClass("player1") && !$(tdAtual).next().hasClass("player2") ) {
            console.log(!$(tdAtual).next().hasClass("player1"), !$(tdAtual).next().hasClass("player2"), $(tdAtual).next(), $(tdAtual) )
            $(tdAtual).next().addClass("undefined");
        }
        // FIM PEÇAS ESQUERDA E DIREITA

        // INÍCIO PEÇAS EM CIMA
        if($(tdAtual).parent().prev().length == 0) {
            var tamanhoTdAtual = $(tdAtual).parent().find("td").length;
            var inicio = parseInt($(tdAtual).parent().find("td:first").attr("data-coluna"));

            $(tdAtual).parent().parent().prepend("<tr data-id></tr>");
            for(var i = 0; i < tamanhoTdAtual; i++) {
                $("tr[data-id]")
                    .append("<td data-linha='"
                        +(dataTdAtualLinha-1)+"' data-coluna='" +(dataTdAtualColuna+i-1)+"' class='"
                        +((inicio == dataTdAtualColuna || inicio == dataTdAtualColuna+1) ? "undefined" : "")+ "'></td>");
                inicio++;
            }
            $("tr[data-id]").removeAttr("data-id");
        } /*else if (
            !$("td[data-linha='"+(dataTdAtualLinha-1)+"'][data-coluna='"+(dataTdAtualColuna)  +"']").hasClass("player1") &&
            !$("td[data-linha='"+(dataTdAtualLinha-1)+"'][data-coluna='"+(dataTdAtualColuna+1)+"']").hasClass("player2")
        ) {
            //$(tdAtual).addClass("undefined");
        }*/
        // FIM PEÇAS EM CIMA
/*
        // INÍCIO PEÇAS EM BAIXO
        if($(tdAtual).parent().next().length == 0) {
            var tamanhoTdAtual = $(tdAtual).parent().find("td").length;
            var inicio = parseInt($(tdAtual).parent().find("td:first").attr("data-coluna"));

            $(tdAtual).parent().parent().append("<tr data-id></tr>");
            for(var i = 0; i < tamanhoTdAtual; i++) {
                $("tr[data-id]")
                    .append("<td data-linha='"
                        +(dataTdAtualLinha+1)+"' data-coluna='" +(dataTdAtualColuna+i-1)+ "' class='"
                        +((inicio == dataTdAtualColuna || inicio == dataTdAtualColuna+1) ? "undefined" : "")+ "'></td>");
                inicio++;
            }
            $("tr[data-id]").removeAttr("data-id");
        } else if (
            !$("td[data-linha='"+(dataTdAtualLinha+1)+"'][data-coluna='"+(dataTdAtualColuna)  +"']").hasClass("player1") ||
            !$("td[data-linha='"+(dataTdAtualLinha+1)+"'][data-coluna='"+(dataTdAtualColuna+1)+"']").hasClass("player2")
        ) {
            $(tdAtual).addClass("undefined");
        }
        // FIM PEÇAS EM BAIXO
*/
        insereEspacosTr();
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

var getPecasDisponiveis = function () {
    var pecas = flagPlayer1 ? pecasPlayer1 : pecasPlayer2;
    var textClasse = flagPlayer1 ? "player1" : "player2";

    if($("td." + textClasse).length != 4) {
        var aux = 0;
        while (aux < pecas.length) {
            if(pecas[aux].nPecas!=0)
                for(var i = 1; i <= pecas[aux].nPecas; i++) {
                    $("ul").append("<li class='"+ textClasse +"'><img src='"+
                        pecas[aux].img +"' alt='"+ pecas[aux].nome +"'/></li>");
                }
    
            aux++;
        }
    } else {
        $("ul").append("<li class='"+ textClasse +"'><img src='"+
            pecas[0].img +"' alt='"+ pecas[0].nome +"'/></li>");
    }

    $("li").click(function () {
        var img = $(this).find("img").attr("alt");
        var infoImg = pecas.find(item => item.nome == img);

        if($("tbody tr").length == 0) {
            $("tbody").append("<tr><td data-linha='50' data-coluna='50' class='"+ textClasse +"'><img src='"+
                infoImg.img +"' alt='"+ infoImg.nome +"'/></td></tr>");
            geraVisinhos();

            for(var i=0; i<pecas.length; i++) {
                if(pecas[i].nome == infoImg.nome) { 
                    pecas[i].nPecas = pecas[i].nPecas - 1;
                }
            }

            $("li").remove();
            flagPlayer1 = !flagPlayer1;
            getPecasDisponiveis();
        } else {
            $("li").removeClass(textClasse + "-select");
            $(this).addClass(textClasse + "-select");

            if(contadorRodadas == 1) {
                $("td.undefined").addClass("opcao");
            }

            $("td.opcao").click(function () {
                $(this).removeClass().addClass(textClasse).append("<img src='"+infoImg.img +"' alt='"
                    +infoImg.nome +"'/>");
                $(this).removeClass("player2-select");
                $("td").removeClass("undefined opcao");

                for(var i=0; i<pecas.length; i++) {
                    if(pecas[i].nome == infoImg.nome) { 
                        pecas[i].nPecas = pecas[i].nPecas - 1;
                    }
                }
                
                geraVisinhos();

                $("li").remove();
                flagPlayer1 = !flagPlayer1;
                getPecasDisponiveis();
            });
        }

        if(!flagPlayer1)
            $("#contador").text(++contadorRodadas);
    });
}

getPecasDisponiveis();

var Draggable = function (elemento) {
    var that = this;
    this.elemento = elemento;
    this.posX = 0;
    this.posY = 0;
    this.top = 0;
    this.left = 0;
    this.refMouseUp = function (event) {
      that.onMouseUp(event);
    }
  
    this.refMouseMove = function (event) {
      that.onMouseMove(event);
    }
  
    this.elemento.addEventListener("mousedown", function (event) {
      that.onMouseDown(event);
    });
}
  
Draggable.prototype.onMouseDown = function (event) {
    this.posX = event.x;
    this.posY = event.y;
  
    this.elemento.classList.add("dragging");
    window.addEventListener("mousemove", this.refMouseMove);  
    window.addEventListener("mouseup", this.refMouseUp);  
}
  
Draggable.prototype.onMouseMove = function (event) {
    var diffX = event.x - this.posX;
    var diffY = event.y - this.posY;
    this.elemento.style.top = (this.top + diffY) + "px";
    this.elemento.style.left = (this.left + diffX) + "px";
}
  
Draggable.prototype.onMouseUp = function (event) {
    this.top = parseInt(this.elemento.style.top.replace(/\D/g, '')) || 0;
    this.left = parseInt(this.elemento.style.left.replace(/\D/g, '')) || 0;
    this.elemento.classList.remove("dragging");
    window.removeEventListener("mousemove", this.refMouseMove); 
    window.removeEventListener("mouseup", this.refMouseUp);  
}
  
var draggables = document.querySelectorAll(".draggable");
[].forEach.call(draggables, function (draggable, indice) {
    new Draggable(draggable);
});