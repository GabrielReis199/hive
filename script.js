var pecasPlayer1 = [],
    pecasPlayer2 = [];

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

pecasPlayer1 = [...totPecas];
pecasPlayer2 = [...totPecas];

flagPlayer1 = true;

var geraVisinhos = function () {
    $("tbody td").each(function () {
        var tdAtual = $(this);

        var dataTdAtualLinha = parseInt($(tdAtual).attr("data-linha"));
        var dataTdAtualColuna = parseInt($(tdAtual).attr("data-coluna"));

        $(tdAtual).parent()
            .prepend("<td data-linha='"+dataTdAtualLinha+"' data-coluna='"+(dataTdAtualColuna-1)+"' class='"+ "undefined" +"'></td>")
            .append(" <td data-linha='"+dataTdAtualLinha+"' data-coluna='"+(dataTdAtualColuna+1)+"' class='"+ "undefined" +"'></td>");
        
        if($(tdAtual).parent().prev().length == 0) {
            var tamanhoTdAtual = $(tdAtual).parent().find("td").length;
            var inicio = parseInt($(tdAtual).parent().find("td:first").attr("data-coluna"));

            $(tdAtual).parent().parent().prepend("<tr data-id></tr>");
            for(var i = 0; i < tamanhoTdAtual; i++) {
                if(inicio == dataTdAtualColuna || inicio == dataTdAtualColuna+1) {
                    $("tr[data-id]")
                        .append("<td data-linha='"
                            +(dataTdAtualLinha-1)+"' data-coluna='"
                            +(dataTdAtualColuna+i-1)+"' class='"+ "undefined" +"'></td>");
                } else {
                    $("tr[data-id]").append("<td></td>");
                }
                inicio++;
            }
            $("tr[data-id]").removeAttr("data-id");
        }

        if($(tdAtual).parent().next().length == 0) {
            var tamanhoTdAtual = $(tdAtual).parent().find("td").length;
            var inicio = parseInt($(tdAtual).parent().find("td:first").attr("data-coluna"));

            $(tdAtual).parent().parent().append("<tr data-id></tr>");
            for(var i = 0; i < tamanhoTdAtual; i++) {
                if(inicio == dataTdAtualColuna || inicio == dataTdAtualColuna+1) {
                    $("tr[data-id]")
                        .append("<td data-linha='"
                            +(dataTdAtualLinha+1)+"' data-coluna='"
                            +(dataTdAtualColuna+i-1)+"' class='"+ "undefined" +"'></td>");
                } else {
                    $("tr[data-id]").append("<td></td>");
                }
                inicio++;
            }
            $("tr[data-id]").removeAttr("data-id");
        }

        insereEspacosTr();
    });
};

var insereEspacosTr = function () {
    console.log("A")
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

    var aux = 0;
    while (aux < pecas.length) {
        if(pecas[aux]!=0)
            for(var i=1; i<=pecas[aux]; i++) {
                $("ul").append("<li class='"+ textClasse +"'><p>"+ imgPecas[aux] +"</p></li>");
            }

        aux++;
    }

    $("li").click(function () {
        var texto = $(this).find("p").text();

        if($("tbody tr").length == 0) {
            $("tbody").append("<tr><td data-linha='50' data-coluna='50' class='"+ "player1" +"'><p>"+ texto +"</p></td></tr>");
            geraVisinhos();
        }

        var diminuiPeca = function (pecas) {
            for(var i=0; i<pecas.length; i++) {
                if(imgPecas[i] == texto) { 
                    pecas[i] = pecas[i] - 1;
                    return;
                }
            }
        }
        diminuiPeca(flagPlayer1 ? pecasPlayer1 : pecasPlayer2); 

        $("li").remove();
        flagPlayer1 = !flagPlayer1;
        getPecasDisponiveis();
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