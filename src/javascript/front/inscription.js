async function submit() {
    document.querySelector('#erreur').innerHTML = "";
    const mail       = document.querySelector('#email').value;
    const mdp_choisi = document.querySelector('#password').value;
    const mdp_verif  = document.querySelector('#confirmPassword').value;
    if (mdp_choisi !== mdp_verif) {
        document.querySelector('#erreur').innerHTML = "<p>Ces mots de passe ne correspondent pas. Veuillez réessayer.</p>";
        return;
    }
    const response = await fetch(document.API_ROOT + "/inscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: mail,
            password: mdp_choisi
        })
    });
    if (response.status === 201) {
        window.location.href = "../html/connexion.html";
    } else {
        const json = await response.json();
        document.querySelector('#erreur').innerHTML = `<p>${json.error || "Une erreur est survenue. Veuillez réessayer."}</p>`;
    }
}