const inputTypes = {
    "String": () => "text",
    "Number": () => "number",
    "Integer": () => "number",
    "Date": () => "date",
    "Email": () => "email",
}
const credentials = Object.entries({
    name: {
        nom: "Votre nom",
        description: "Dupont",
        type: "String",
        required: true
    },
    surname: {
        nom: "Votre prénom",
        description: "Jean",
        type: "String",
        required: true
    },
    email: {
        nom: "Votre email",
        description: "jean.dupont@gmail.com",
        type: "Email",
        required: true
    }
});

async function render(typeFormulaire) {
    const response = await fetch(document.API_ROOT + "/formulaire", {
        method: "GET"
    });
    if (response.status === 200) {
        const properties = await response.json();
        const [required, optional] = document.partition(Object.entries(properties.schema), ([, { required }]) => required);
        ;[
            { id: "credential", legend: "Vos coordonnées", data: credentials },
            { id: "required", legend: "Champs obligatoires", data: required },
            { id: "optional", legend: "Champs optionnels", data: optional }
        ].map(({ id, legend, data }) => {
            const elements = data.map(([column, element]) => {
                const div = document.createElement('div');
                div.className = "input";
                const label = document.createElement('label');
                label.htmlFor = column;
                label.innerHTML = element.nom + (element.required ? `<strong class="obli">*</strong>` : "");
                const input = document.createElement('input');
                input.id = column;
                input.type = inputTypes[element.type]();
                input.placeholder = element["description_" + typeFormulaire] || element.description;
                input.required = element.required;
                div.appendChild(label);
                div.appendChild(input);
                return div;
            });
            const element = document.querySelector(`#${id}Inputs`);
            const leg = document.createElement('legend');
            leg.innerHTML = legend;
            element.replaceChildren(leg, ...elements, ...Array.from(element.children));
        });
    } else {
        console.log("Erreur : " + response.status + " / " + response.statusText);
    }
}