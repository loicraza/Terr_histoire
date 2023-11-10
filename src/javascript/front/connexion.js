async function submit() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const response = await fetch(document.API_ROOT + "/connexion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    if (response.status === 200) {
        window.location.href = "../html/index.html";
    } else {
        const json = await response.json();
        document.querySelector('#erreur').innerHTML = `<p>${json.error || "Une erreur est survenue. Veuillez réessayer."}</p>`;
    }
}