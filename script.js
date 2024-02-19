import APIKEY from "./apikey.js";
const urlAPI = "https://opentdb.com/api.php?amount=10"

const url = 'https://translate.googleapis.com/v3beta1/';

const $ = selector => document.querySelector(selector);
let trivias = null;
let contadores = {
    indicePregunta: 0,
    contadorAciertos: 0,
    contadorErrores: 0
}
$("#btnIniciar").addEventListener("click", function (e) {
    const categoria = $("#selectCategoria").value;
    const dificultad = $("#selectDificultad").value;
    const tipo = $("#selectTipo").value;

    const fullURL = `${urlAPI}${categoria != "any" ? "&category=" + categoria : ""}${dificultad != "any" ? "&difficulty=" + dificultad : ""}${tipo != "any" ? "&type=" + tipo : ""}`
    console.log(fullURL)
    fetch(fullURL).then(response => response.json()).then(data => {
        if (data.results.length > 0) {
            let modal = new bootstrap.Modal($("#contenedorTrivia"), {
                keyboard: false
            })

            modal.show();
            trivias = data.results;
            contadores.contadorAciertos = 0;
            contadores.indicePregunta = 0;
            crearCustionario();
        }
        else {
            $("#contador").innerHTML = ""
            $("#triviaPreguntas").innerHTML = `
                <div class="alert alert-warning" role="alert">
                    No existen preguntas en estas categorias, selecciona otras opciones
                </div>
            `
            let modal = new bootstrap.Modal($("#contenedorTrivia"), {
                keyboard: false
            })
            modal.show()
            setTimeout(function () {
                modal.hide()
            }, 3000)
        }


    })
})

function crearCustionario() {
    $("#footerModal").innerHTML = ""
    $("#contador").innerHTML = ""
    if (contadores.indicePregunta < trivias.length) {
        $("#contador").innerHTML = `<span class="badge bg-success text-wrap">Aciertos: ${contadores.contadorAciertos}</span>
                                    <span class="badge bg-danger text-wrap">Errores: ${contadores.contadorErrores}</span>
                                    <span class="badge bg-primary text-wrap">Pregunta: ${contadores.indicePregunta + 1}/${trivias.length}</span>`
        const div = document.createElement("div");
        $("#modalLabel").innerHTML = trivias[contadores.indicePregunta].question
        //debugger;
        let html = ``
        div.classList.add("row", "mt-2")

        html += `<div class="btn-group-vertical w-100" id="repuestas">`
        trivias[contadores.indicePregunta].incorrect_answers.push(trivias[contadores.indicePregunta].correct_answer)
        trivias[contadores.indicePregunta].incorrect_answers.sort(() => Math.random() - 0.5);
        trivias[contadores.indicePregunta].incorrect_answers.forEach((respuesta, j) => {
            html += `
                    <button type="button" class="btn btn-outline-success" data-answer="${respuesta}">${respuesta}</button>
                    `
        })

        html += `</div>`

        div.innerHTML = html
        $("#triviaPreguntas").innerHTML = ""
        $("#triviaPreguntas").appendChild(div)


    }
    else {
        $("#modalLabel").textContent = "Trivia finalizada"
        $("#triviaPreguntas").innerHTML = `
            
            <a class="btn btn-primary btn-lg" href="index.html">Volver a jugar</a>
        `;
        $("#contador").innerHTML = `<span class="badge bg-success text-wrap">Aciertos: ${contadores.contadorAciertos}</span>
                                    <span class="badge bg-danger text-wrap">Errores: ${contadores.contadorErrores}</span>
                                    `
    }


}

$("#triviaPreguntas").addEventListener("click", e => {
    if (e.target.classList.contains("btn")) {
        if (contadores.indicePregunta < trivias.length) {
            document.querySelectorAll('.btn-group-vertical .btn').forEach(button => {
                button.disabled = true;

            });

            const respuesta = e.target.dataset.answer;
            const respuestaCorrecta = htmlDecode(trivias[contadores.indicePregunta].correct_answer);
            //console.log(respuestaCorrecta + "  " + respuesta + " " + trivias[contadores.indicePregunta].correct_answer);
            if (respuestaCorrecta == respuesta) {
                contadores.contadorAciertos++;
                $("#footerModal").innerHTML = `
                    <p class="text-bg-success  text-center mt-3 p-1 rounded">Respuesta correcta: ${trivias[contadores.indicePregunta].correct_answer}</p>
                `
            } else {
                $("#footerModal").innerHTML = `
                    <p class="text-bg-danger  text-center mt-3 p-1 rounded">Respuesta correcta: ${trivias[contadores.indicePregunta].correct_answer}</p>
                `
                contadores.contadorErrores++;
            }
            contadores.indicePregunta++;
            setTimeout(crearCustionario, 1500)
            //crearCustionario();
        }

    }
})
function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}
