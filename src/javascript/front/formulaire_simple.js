let map, vectorLayer, selectMarkerControl, selectedFeature;
let lat = 43.6;
let lon = 1.44;
let zoom = 9;
let curpos = new Array();
let position;
let markers = new OpenLayers.Layer.Markers("Markers");

let fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
let toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

let cntrposition = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);

const categories = {

    "religion": ["Cimetère", "Edifice culturel", "Presbytère", "Établissement religieux (couvent, abbaye, prieuré, commanderie)"],

    "educ_cult_science": ["Établissement d'enseignement (école primaire, maternelle ou salle d’asile, école congréganiste, lycée, collège, cours secondaire)",
        "Établissement lié à la science, art, culture et sports (bibliothèque, musée, observatoire, salle de concert, cinéma, théâtres, équipement sportif…)",
        "Monuments et statues (monuments commémoratifs, statues, croix…)"],

    "infra_militaire": ["Château-fort, maison-forte", "Motte castrale", "Élément de fortification (tour, rempart, fossés, barbacane..)",
        "Habitat fortifié"],

    "agri_com_indus": ["Bâtiment et exploitation agricole (métairie, grange, cabane pastorale, pigeonnier…)", "Bâtiment lié à l’artisanat, commerce et industrie"],

    "administration": ["Mairie", "Bureau de poste", "Administration fiscale, comptabilité publique", "Administration pénitentiaire", "Police, gendarmerie"],

    "sante": ["Établissement médico-social, assistance et prévoyance", "Établissement thermal"],

    "habitat_notable": ["Château de plaisance, maisons de caractère, maison de maître", "Habitat aggloméré"],

    "eau": ["Puits ou fontaine", "Lavoir ou abreuvoir", "Château d'eau", "Cours d'eau", "Source", "Nappe d'eau"],

    "voirie": ["Place publique, promenade, jardin public, espace vert, square", "Pont", "Rue, route et chemin"],

    "lieu-dit_elem_geog": ["Lieu-dit", "Élément géographique"]
}

function ajouter_formulaire(value) {
    let code_HTML = "";
    for (let val of categories[value]) {
        code_HTML += "<input class = \"box\" type=\"checkbox\">";
        code_HTML += "<label for=\"\">" + val + "</label></br>";
    }
    return code_HTML;
}

function setValue() {
    const valeur = document.querySelector("#domaine").value;
    if (valeur == "")
        document.querySelector("#caracteristiques_lieu").innerHTML = "";
    else
        document.querySelector("#caracteristiques_lieu").innerHTML = ajouter_formulaire(valeur);
}

async function formulaire_simple() {
    const [inputs,credentials] = document.getInputsValues();
    const response = await fetch(document.API_ROOT + '/formulaire_simple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs, credentials })
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

function init() {
    map = new OpenLayers.Map("map", {
        view: {
            projection: "EPSG:900913",
            center: [lat, lon],
            zoom: zoom
        }
    });

    let mapnik = new OpenLayers.Layer.OSM("MAP");

    map.addLayers([mapnik, markers]);
    map.addLayer(mapnik);
    map.setCenter(cntrposition, zoom);

    let click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

};

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function (options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, {
            'click': this.trigger
        }, this.handlerOptions
        );
    },

    trigger: function (e) {
        const requiredInputsElements = document.querySelectorAll("#requiredInputs input");
        const [latitudeElement, longitudeElement] = [...requiredInputsElements.values()].slice(-2);
        let lonlat = map.getLonLatFromPixel(e.xy);
        let parsedLonlat = new OpenLayers.LonLat(lonlat.lon, lonlat.lat).transform(toProjection, fromProjection);
        latitudeElement.value = parsedLonlat.lat;
        longitudeElement.value = parsedLonlat.lon;
        markers.clearMarkers();
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(parsedLonlat.lon, parsedLonlat.lat).transform(fromProjection, toProjection)));
    }

});