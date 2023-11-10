async function get_description() {
    const response = await fetch(document.API_ROOT + "/edition_accueil", {
        method: "GET"
    });
    const json = await response.json();
    if (response.status === 200) {
        document.querySelector('#text_infos').textContent = json.text;
    } else {
        //document.querySelector('#erreur').innerHTML = `<p>${json.error || "Une erreur est survenue. Veuillez réessayer."}</p>`;
    }
}


function edit() {
    const monText = document.querySelector('#text_infos').textContent;
    //console.log(monText);
    document.querySelector('#cadre_infos').innerHTML = edit_text(monText);
}

async function validate() {
    const text = document.querySelector('#text_edit').value;
    const response = await fetch(document.API_ROOT + "/edition_accueil", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });
    if (response.status === 200) {
        window.location.href = "../html/index.html";
    } else {
        //document.querySelector('#erreur').innerHTML = `<p>${json.error || "Une erreur est survenue. Veuillez réessayer."}</p>`;
    }
}

function edit_text (leText) {
    let codeHTML = "";
    codeHTML += "<textarea id=\"text_edit\" cols=\"120\" rows=\"20\">" + leText + "</textarea>";
    codeHTML += "<button onclick=\"validate();\">Valider</button>";
    return codeHTML;
}

function add_text(leText) {
    let codeHTML = "";
    codeHTML += "<p id=\"text_infos\">" + leText + "</p>";
    return codeHTML;
}