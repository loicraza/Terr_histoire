// https://stackoverflow.com/questions/50800404/exclude-specific-element-by-id-on-queryselectorall

async function formulaire_bdd() {
    const formData = new FormData();
    const [relations,credentials] = document.getInputsValues();
    formData.append("relations", JSON.stringify(relations));
    formData.append("credentials", JSON.stringify(credentials));
    const columnDelimiter = document.querySelector("#column_delimiter").value || ";";
    formData.append("columnDelimiter", columnDelimiter);
    const file = document.querySelector("#fichier").files[0];
    formData.append("fichier", file);
    const response = await fetch(document.API_ROOT + "/formulaire_bdd", {
        method: "POST",
        body: formData
    });
    if (response.status === 200) {
        window.location.href = "../html/index.html";
    } else {
        if (response.status === 400) {
            const res = await response.json();
            alert(typeof res === "object" && "error" in res ? res.error : res);
        }
    }
}

function changeInputs() {
    document.querySelectorAll("input").forEach((input) => {
        if (input.type !== "button" && input.type !== "file") input.type = "text";
        return input;
    });
}