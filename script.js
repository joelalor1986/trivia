const urlAPI = "https://opentdb.com/api.php?amount=10"

const $ = selector => document.querySelector(selector);
let trivias = null;
let contadores = {
    indicePregunta: 0,
    contadorAciertos: 0
}
$("#btnIniciar").addEventListener("click", function (e) {
    const categoria = $("#selectCategoria").value;
    const dificultad = $("#selectDificultad").value;
    const tipo = $("#selectTipo").value;

    const fullURL = `${urlAPI}${categoria != "any" ? "&category=" + categoria : ""}${dificultad != "any" ? "&difficulty=" + dificultad : ""}${tipo != "any" ? "&type=" + tipo : ""}`
    console.log(fullURL)
    fetch(fullURL).then(response => response.json()).then(data => {

        let modal = new bootstrap.Modal($("#contenedorTrivia"), {
            keyboard: false
        })
        modal.show();
        trivias = data.results;
        contadores.contadorAciertos = 0;
        contadores.indicePregunta = 0;
        crearCustionario();
        // }
    })
})

function crearCustionario() {
    $("#footerModal").innerHTML = ""
    if (contadores.indicePregunta < 10) {
        const div = document.createElement("div");
        $("#modalLabel").innerHTML = trivias[contadores.indicePregunta].question

        let html = ``
        div.classList.add(["row", "mt-2"])

        html += `<div class="btn-group-vertical w-100" id="repuestas">`
        trivias[contadores.indicePregunta].incorrect_answers.push(trivias[contadores.indicePregunta].correct_answer)
        trivias[contadores.indicePregunta].incorrect_answers.sort(() => Math.random() - 0.5);
        trivias[contadores.indicePregunta].incorrect_answers.forEach((respuesta, j) => {
            html += `
                    <button type="button" class="btn btn-outline-primary" data-answer="${respuesta}">${respuesta}</button>
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
            <h4>Puntajae: ${contadores.contadorAciertos}</h4>
            <a class="btn btn-primary btn-lg" href="index.html">Volver a iniciar</a>
        `;
    }


}

$("#triviaPreguntas").addEventListener("click", e => {
    if (e.target.classList.contains("btn")) {
        if (contadores.indicePregunta < 10) {
            const respuesta = e.target.dataset.answer;
            console.log(trivias[contadores.indicePregunta].correct_answer + "  " + respuesta)
            if (trivias[contadores.indicePregunta].correct_answer == respuesta) {
                contadores.contadorAciertos++;
                $("#footerModal").innerHTML = `
                    <p class="text-bg-success p-3">Respuesta correcta: ${trivias[contadores.indicePregunta].correct_answer}</p>
                `
            } else {
                $("#footerModal").innerHTML = `
                    <p class="text-bg-danger p-3">Error respuesta correcta: ${trivias[contadores.indicePregunta].correct_answer}</p>
                `
            }
            contadores.indicePregunta++;
            setTimeout(crearCustionario, 1500)
            //crearCustionario();
        }

    }
})
