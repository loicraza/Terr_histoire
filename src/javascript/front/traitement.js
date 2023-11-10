let processing, data;

function showEmpty() {
    document.querySelector("#credentialInputs").replaceChildren();
    document.querySelector("#requiredInputs").remove();
    document.querySelector("#optionalInputs").remove();
    document.querySelector(".buttons").remove();
    const p = document.createElement("p");
    p.textContent = "Aucune donnée à traiter (pour le moment...!)";
    p.style.textAlign = "center";
    document.querySelector("#credentialInputs").appendChild(p);
}

function freezeCredentials() {
    document.querySelector("#credentialInputs").querySelectorAll("input").forEach((input) => {
        input.setAttribute("readonly", true);
    });
}

async function getData() {
    const response = await fetch(document.API_ROOT + "/traitement", {
        method: "GET"
    });
    if (response.status === 200) {
        const properties = await response.json();
        processing = properties.processing;
        data = properties.data;
    } else {
        console.log("Erreur : " + response.status + " / " + response.statusText);
    }
}

function generateInputs() {
    document.querySelector("#name").value = processing.addedByName;
    document.querySelector("#surname").value = processing.addedBySurname;
    document.querySelector("#email").value = processing.addedByEmail;
    Object.entries(data).forEach(([column, value]) => {
        if (column === "_id" || column === "__v") return;
        const input = document.querySelector(`#${column}`);
        if (input) {
            input.value = value;
        }
    });
}

async function init() {
    await getData();
    if (!processing) return showEmpty();
    generateInputs();
    freezeCredentials();
}

async function publishData() {
    try {
        await saveData();
    } catch (err) {
        return;
    }
    const response = await fetch(`${document.API_ROOT}/traitement/${processing._id}`, {
        method: "PATCH"
    });
    if (response.status === 200) {
        window.location.href = "../html/traitement.html";
    } else {
        if (response.status === 400) {
            const res = await response.json();
            alert(typeof res === "object" && "error" in res ? res.error : res);
        }
    }
}

async function saveData() {
    const [inputs] = document.getInputsValues();
    const response = await fetch(`${document.API_ROOT}/formulaire_simple/${data._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
    });
    if (response.status === 200) {
        window.location.href = "../html/traitement.html";
    } else {
        if (response.status === 400) {
            const res = await response.json();
            alert(typeof res === "object" && "error" in res ? res.error : res);
        }
    }
}

async function deleteData() {
    const responseData = await fetch(`${document.API_ROOT}/formulaire_simple/${data._id}`, {
        method: "DELETE"
    });
    if (responseData.status === 200) {
        const responseProcessing = await fetch(`${document.API_ROOT}/traitement/${processing._id}`, {
            method: "DELETE"
        });
        if (responseProcessing.status === 200) {
            window.location.href = "../html/traitement.html";
        } else {
            if (responseProcessing.status === 400) {
                const res = await responseProcessing.json();
                alert(typeof res === "object" && "error" in res ? res.error : res);
            }
        }
    } else {
        if (responseData.status === 400) {
            const res = await responseData.json();
            alert(typeof res === "object" && "error" in res ? res.error : res);
        }
    }
}