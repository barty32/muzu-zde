
interface GeoJSON {
	"type": "FeatureCollection",
	"name": string,
	"crs": {
		"type": "name",
		"properties": {
			"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
		}
	},
	"features": {
		"type": "Feature",
		"properties": {},
		"geometry": {
			"type": "Point",
			"coordinates": [number, number]
		}
	}[]
}


interface jsonSkola {
	"OBJECTID": number; //1,
	"nazev": string; //"Střední škola technická a řemeslná, Nový Bydžov, Dr. M. Tyrše 112",
	"ico": string; //"87751",
	"zrizovatel": string; //"kraj",
	"redizo": string; //"600011763",
	"zarizeni_druh": string; //"Střední škola",
	"izo": string; //"877510000",
	"pravni_forma": string; //"příspěvková organizace",
	"nazev_vusc": string; //"Královehradecký kraj",
	"kod_vusc": string; //"CZ052",
	"nazev_okresu": string; //"Hradec Králové",
	"kod_okresu": string; //"CZ0521",
	"nazev_orp": string; //"Nový Bydžov",
	"kod_orp": string; //"5212",
	"nazev_obce": string; //"Nový Bydžov",
	"kod_obce": string; //"570508",
	"nazev_ulice": string; //"Dr. M. Tyrše",
	"cislo_domovni": string; //"112",
	"typ_cisla_domovniho": string; //"č.p.",
	"cislo_orientacni": string | null,
	"psc": string; //"50401",
	"www": string; //"http://www.sstrnb.cz/",
	"wkt": string; //"POINT(50.2399 15.486)",
	"x": number; //15.486,
	"y": number;// 50.2399,
	"dp_id": string; //"SSSZ1"
}

interface jsonPrijimacky {
	"OBJECTID": number; //1,
	"nazev": string; //"Střední škola technická a řemeslná, Nový Bydžov, Dr. M. Tyrše 112",
	"ico": string; //"87751",
	"zrizovatel": string; //"kraj",
	"pravni_forma": string;//"společnost s ručením omezeným",
	"redizo": string;//"600012271",
	"izo": string;//"108024148",
	"obor_nazev": string;//"Cestovní ruch",
	"obor_kod": string;//"65-42-M/02",
	"nazev_svp_zamereni_oboru": string | null,
	"vzdelavani_delka_roky": number;//4.0,
	"zpusob_ukonceni_vzdelavani": string;//"maturitní zkouška",
	"pocet_prihl_1_kolo_prij_riz": number;//61.0,
	"pocet_prij_1_kolo_prij_riz": number;//30.0,
	"pocet_nabizenych_mist": number;//30.0,
	"rocni_skolne": number;//18000.0,
	"prijimaci_zkouska": string;//"jednotná přijímací zkouška",
	"forma_vzdelavani": string;//"denní forma",
	"druh_vzdelavani": string;//"střední vzdělávání s maturitní zkouškou",
	"obor_urcen_pro_uchaz_s_uk_vzd": string;//"povinná školní docházka",
	"obor_vhodny_pro_ozp": string;//"ANO",
	"povinna_lekarska_prohlidka": string;//"NE",
	"poznamka": string | null,
	"nazev_vusc": string;//"Královehradecký kraj",
	"kod_vusc": string;//"CZ052",
	"nazev_okresu": string;//"Náchod",
	"kod_okresu": string;//"CZ0523",
	"nazev_orp": string;//"Náchod",
	"kod_orp": string;//"5209",
	"nazev_obce": string;//"Náchod",
	"kod_obce": string;//"573868",
	"nazev_ulice": string;//"Smiřických",
	"cislo_domovni": string;//"740",
	"typ_cisla_domovniho": string;//"č.p.",
	"cislo_orientacni": string | null,
	"psc": string;//"54701",
	"www": string;//"www.amnachod.cz",
	"wkt": string;//"POINT(50.420981 16.164733)",
	"x": number;//16.164733,
	"y": number;//50.420981,
	"dp_id": string;//"PRSS1"
}

interface jsonUbytovani {
	"nazev_organizace": string;
	"pocet_luzkove_kapacity": number;//154.0,
	"celkovy_pocet_pokoju": number;//62.0,
	"uhrnny_pocet_ubyt_studentu": number;//66.0,
}

interface Skola {
	id: number;
	nazev: string;
	typ: string;
	zrizovatel: string;
	obec: string;
	adresa: string;
	www: string;
	lon: number;
	lat: number;
	ubytovani: Ubytovani;

	obory: Obor[] | null;

	// obory pro filtrovani
	obory_nazev: string[];
	obory_kod: string[];
	obory_delka_vzdelavani: number[];
	obory_forma_vzdelani: string[]; //'denni' | 'dalkova' | 'kombinovana';
	obory_zpusob_ukonceni: string[]; //'maturita' | 'vyucni_list' | 'zaverecna_zkouska';
	obory_prijimaci_zkouska: string[];
	obory_skolne: number[];
	obory_uspesnosti_prihlaseni: number[];
	obory_uspesnosti_prijati: number[];
	obory_uspesnosti_mista: number[];
}

interface Obor {
	nazev: string;
	kod: string;
	delka_vzdelavani: number;
	forma_vzdelani: string; //'denni' | 'dalkova' | 'kombinovana';
	zpusob_ukonceni: string; //'maturita' | 'vyucni_list' | 'zaverecna_zkouska';
	prijimaci_zkouska: string;
	skolne: number;
	uspesnost: Uspesnost;
}
interface Uspesnost {
	prihlaseni: number;
	prijati: number;
	mista: number;
}

interface Ubytovani {
	luzkova_kapacita: number;
	pocet_pokoju: number;
	pocet_studentu: number;
}

var schools: Skola[] = [];
var currentSelection: Skola[] = [];
var obce: string[] = [];
var _obory: string[] = [];
var prijimacky: string[] = [];

const bounds = new L.LatLngBounds(new L.LatLng(50.8580089, 14.7970539), new L.LatLng(49.8999750, 16.7910717));
var map = L.map('map', {
	center: bounds.getCenter(),
	maxBounds: bounds,
	maxBoundsViscosity: 1.0
}).setView([50.3993594, 15.8160350], 9);

async function getSchools() {
	const json = await (await fetch('./data/skoly.geojson')).json() as GeoJSON;
	const jsonPrijimacky = await (await fetch('./data/prijimaci_rizeni.geojson')).json() as GeoJSON;
	const jsonUbytovani = await (await fetch('./data/ubytovani.geojson')).json() as GeoJSON;

	json.features = json.features.filter((val) => {
		switch ((val.properties as jsonSkola).zarizeni_druh) {
			// case 'Základní škola':
			case 'Střední škola':
			case 'Vyšší odborná škola':
				// case 'Základní umělecká škola':
				//case 'Jazyková škola s právem státní jazykové zkoušky': //?
				//case 'Fakulta vojenského zdravotnictví':
				//case 'Přírodovědecká fakulta UHK':
				//case 'Lékařská fakulta':
				//case 'Farmaceutická fakulta':
				return true;
			default:
				return false;
		}
	});


	for (const s of json.features) {
		const props = s.properties as jsonSkola;


		const prijimackyFiltered = jsonPrijimacky.features.filter((val) => {
			if ((val.properties as jsonPrijimacky).nazev.toLocaleLowerCase() == props.nazev.toLocaleLowerCase()) return true;
			return false;
		});

		let obory: Obor[] | null = [];

		for (const f of prijimackyFiltered) {
			const prij = f.properties as jsonPrijimacky;

			const obor: Obor = {
				nazev: prij.obor_nazev,
				kod: prij.obor_kod,
				delka_vzdelavani: prij.vzdelavani_delka_roky,
				forma_vzdelani: prij.forma_vzdelavani,
				zpusob_ukonceni: prij.zpusob_ukonceni_vzdelavani,
				prijimaci_zkouska: prij.prijimaci_zkouska,
				skolne: prij.rocni_skolne,
				uspesnost: {
					prihlaseni: prij.pocet_prihl_1_kolo_prij_riz,
					prijati: prij.pocet_prij_1_kolo_prij_riz,
					mista: prij.pocet_nabizenych_mist
				}
			}
			obory.push(obor);
		}

		if (obory.length === 0) { obory = null };


		const ubytovaniFiltered = jsonUbytovani.features.filter((val) => {
			if ((val.properties as jsonUbytovani).nazev_organizace.toLocaleLowerCase() == props.nazev.toLocaleLowerCase()) return true;
			return false;
		});

		let ubytovani: Ubytovani = {
			luzkova_kapacita: 0,
			pocet_pokoju: 0,
			pocet_studentu: 0,
		};

		for (const u of ubytovaniFiltered) {
			const ub = u.properties as jsonUbytovani;
			ubytovani.luzkova_kapacita += ub.pocet_luzkove_kapacity;
			ubytovani.pocet_pokoju += ub.celkovy_pocet_pokoju;
			ubytovani.pocet_studentu += ub.uhrnny_pocet_ubyt_studentu;
		}


		const skola: Skola = {
			id: props.OBJECTID,
			nazev: props.nazev,
			typ: props.zarizeni_druh,
			zrizovatel: props.zrizovatel,
			obec: props.nazev_obce,
			adresa: `${props.nazev_ulice} ${props.cislo_domovni}${props.cislo_orientacni ? ('/' + props.cislo_orientacni) : ''} ${props.nazev_obce} ${props.psc}`,
			www: props.www,
			lon: s.geometry.coordinates[0],
			lat: s.geometry.coordinates[1],
			ubytovani: ubytovani,

			obory: obory,

			obory_nazev: obory?.map((o) => o.nazev) || [],
			obory_kod: obory?.map((o) => o.kod) || [],
			obory_delka_vzdelavani: obory?.map((o) => o.delka_vzdelavani) || [],
			obory_forma_vzdelani: obory?.map((o) => o.forma_vzdelani) || [],
			obory_zpusob_ukonceni: obory?.map((o) => o.zpusob_ukonceni) || [],
			obory_prijimaci_zkouska: obory?.map((o) => o.prijimaci_zkouska) || [],
			obory_skolne: obory?.map((o) => o.skolne) || [],
			obory_uspesnosti_prihlaseni: obory?.map((o) => o.uspesnost.prihlaseni) || [],
			obory_uspesnosti_prijati: obory?.map((o) => o.uspesnost.prijati) || [],
			obory_uspesnosti_mista: obory?.map((o) => o.uspesnost.mista) || [],
		};



		// if (s.properties.zarizeni_druh == 'Střední škola') {
		// 	console.log(s.properties.nazev);

		// }

		// const type = s.properties.zarizeni_druh;
		// if (!schools.includes(type)) {
		// 	schools.push(type);
		// }

		if (!obce.includes(skola.obec)) obce.push(skola.obec);

		if (skola.obory) {
			for (const o of skola.obory)
				if (!_obory.includes(o.nazev)) _obory.push(o.nazev);


			for (const o of skola.obory)
				if (!prijimacky.includes(o.prijimaci_zkouska)) prijimacky.push(o.prijimaci_zkouska);
		}
		schools.push(skola);


	}
	//console.log(prijimacky)

	// console.log(schools)
}










function printSchools(arr: Skola[]) {
	const el = document.querySelector('#list') as HTMLDivElement;
	for (const s of schools) {
		const e = document.createElement('div');
		e.innerHTML = `
		<h3>${s.nazev}</h3>
		<p>${s.typ}</p>
		<p>${s.adresa}</p>
		<p><a href="${s.www}">${s.www}</a></p>
		`;
		if (s.obory) {
			for (const o of s.obory) {
				e.innerHTML += o.nazev + '<br>';
			}
		}
		else {
			e.innerHTML += 'Chybí data pro obory';
		}
		el.appendChild(e);
	}
}


const markers: L.Marker[] = [];
function show() {
	const results_page = document.querySelector("#results_page")!;

	// get filters
	const search_term = (document.querySelector("#search_box") as HTMLInputElement).value;

	const is_stredni_skola = (document.querySelector("#is_stredni_skola") as HTMLInputElement).checked;
	const is_vyssi_odborna_skola = (document.querySelector("#is_vyssi_odborna_skola") as HTMLInputElement).checked;

	const obce_select = (document.querySelector("#obce_select") as HTMLInputElement).value;

	const obor_select_checkboxes = document.querySelectorAll("#obor_select div input[type='checkbox']");
	const prijimacky_select_checkboxes = document.querySelectorAll("#prijimacky_select div input[type='checkbox']");


	const delka_od_inp = (document.querySelector("#delka_od_inp") as HTMLInputElement).value;
	const delka_do_inp = (document.querySelector("#delka_do_inp") as HTMLInputElement).value;

	const selected_obory = Array.from(obor_select_checkboxes).map(osch => {
		let inposch = (osch as HTMLInputElement);
		if (inposch.checked) return inposch.value;
	}).filter(v => !!v) as string[];
	const selected_prijimacky = Array.from(prijimacky_select_checkboxes).map(psch => {
		let inpsch = (psch as HTMLInputElement);
		if (inpsch.checked) return inpsch.value;
	}).filter(v => !!v) as string[];


	let results = schools;
	results = filterExactMatch(results, "nazev", search_term).newState;
	results = filterExactMatch(results, "typ", (is_stredni_skola && is_vyssi_odborna_skola ? "" : is_stredni_skola ? "Střední škola" : (is_vyssi_odborna_skola ? "Vyšší odborná škola" : "-_-_-magic_babel-_-_-"))).newState;
	results = filterExactMatch(results, "obec", obce_select).newState;
	results = filterExactMatch(results, "obory_nazev", selected_obory).newState;
	results = filterExactMatch(results, "obory_prijimaci_zkouska", selected_prijimacky).newState;
	//results = filterRangeMatch(results, "obory_skolne", parseInt(skolne_od_inp), parseInt(skolne_do_inp)).newState;

	results_page.innerHTML = `<b>Počet výsledků: ${results.length}</b>`;


	if (results.length > 0) {
		for (const s of results) {
			console.log(s.obory_skolne);
			const content = `<div class="result">
							<div class="result_check">
								<input type="checkbox" name="" id="${s.id}" onchange="checkSchool(event)">
							</div>
							<div class="result_info">
								<strong>${s.nazev}</strong>
								<hr>
								<div>
									<strong>Typ školy:</strong> ${s.typ}
								</div>
								<div>
									<strong>Obec:</strong> ${s.obec}
								</div>
							</div>
						</div>`;
			const div = document.createElement("div");
			div.innerHTML = content;
			results_page.appendChild(div);
		}
	} else {
		results_page.innerHTML = "<b>0 výsledků s aktuálními filtry</b>";
	}



	for (const m of markers)
		m.remove();

	L.tileLayer('https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=7XdrIcKaLnOOzcLyyJx8LxudxhpT-9WQQ66tqclZSjM', {
		maxZoom: 15,
		minZoom: 8
	}).addTo(map);
	fetch("./data/border.json").then(res => res.json()).then(res => {


		const latLngs = L.GeoJSON.coordsToLatLngs(res.coordinates, 2);
		L.polyline(latLngs, {
			color: "red",
			weight: 4,
			opacity: 1
		}).addTo(map);
	})

	for (const r of results) {
		const m = L.marker([r.lat, r.lon]);
		m.bindPopup(`<b>${r.nazev}</b><p><a href="${r.www}">${r.www}</a></p>`)
		markers.push(m.addTo(map));
	}
	/*
		const filtered = schools.filter((val, i) => {
			let result = true;
			// result = filterRange(val);
			// result = filterExactMatch(val);
			return result;
		});
	
		printSchools(filtered);*/
}



(async () => {

	await getSchools();

	const obce_select = document.querySelector("#obce_select")!;
	for (const obec of obce) {
		const opt = document.createElement("option");
		opt.innerText = obec;
		obce_select.appendChild(opt);
	}

	const obor_select = document.querySelector("#obor_select")!;
	for (const [idx, obor] of _obory.entries()) {
		const div = document.createElement("div");
		div.innerHTML = `<input type="checkbox" onchange="show()" value="${obor}" id="obor_${idx}" checked/> <label for="obor_${idx}">${obor}</label>`;
		obor_select.appendChild(div);
	}

	const prijimacky_select = document.querySelector("#prijimacky_select")!;
	for (const [idx, prijimacka] of prijimacky.entries()) {
		const div = document.createElement("div");
		div.innerHTML = `<input type="checkbox" onchange="show()" value="${prijimacka}" id="prijimacka_${idx}" checked/> <label for="prijimacka_${idx}">${prijimacka}</label>`;
		prijimacky_select.appendChild(div);
	}



	//currentSelection = schools.slice(0, 3);
	//printSchools(schools);
	show();

	setTimeout(() => {

		drawPrijimackyChart();
		drawTable();

	}, 2000);
})();








interface FilterOutput {
	newState: Skola[];
	accuracy: number[];
}

/*const skoly: Skola[] = [
	{ adresa: "AAAAAAAAAAAAAAAAAAAA", id: 100, nazev: "test", obec: "Praha", obory: [{ delka_vzdelavani: 10, forma_vzdelani: "denni", kod: "da", nazev: "it", prijimaci_zkouska: "test", skolne: 5000, uspesnost: { mista: 1, prihlaseni: 1, prijati: 1 }, zpusob_ukonceni: "test" }], typ: "Stredni", www: "janstaffa.cz", lat: 0, lon: 0, zrizovatel: "Josef Fiala", ubytovani: { luzkova_kapacita: 10, pocet_pokoju: 10, pocet_studentu: 1 } as Ubytovani },
	{ adresa: "BBBBBBBBBBBBBBBBBBBB", id: 100, nazev: "babel", obec: "Praha", obory: [{ delka_vzdelavani: 10, forma_vzdelani: "denni", kod: "da", nazev: "it", prijimaci_zkouska: "test", skolne: 5000, uspesnost: { mista: 1, prihlaseni: 1, prijati: 1 }, zpusob_ukonceni: "test" }], typ: "Stredni", www: "janstaffa.cz", lat: 0, lon: 0, zrizovatel: "Josef Fiala", ubytovani: { luzkova_kapacita: 11, pocet_pokoju: 10, pocet_studentu: 1 } as Ubytovani }
];*/


// filter fn example
function filterExactMatch(state: Skola[], key: string, equals: string | number | boolean | string[]): FilterOutput {
	const path = key.split(".");

	const newState: Skola[] = [];
	const accuracy: number[] = [];

	for (const skola of state) {
		let data = skola;
		for (const step of path)
			data = (data as any)[step];

		let new_data = data as any as (string | number | boolean | object);

		if (typeof new_data == "boolean" || typeof new_data == "number") {
			if (new_data === equals) {
				newState.push(skola);
				accuracy.push(1);
			}
		} else if (typeof new_data == "object") {
			const object_data = (new_data as any);
			let matches = 0;
			for (const d of object_data)
				for (const e of equals as string[])
					if (d === e)
						matches++;

			if (matches > 0) {
				newState.push(skola);
				accuracy.push(matches / object_data.length);
			}
		}
		// string
		else {
			const string_data = (new_data as string);

			if (string_data.includes(equals as string)) {
				const acc = (equals as string).length / string_data.length;
				newState.push(skola);
				accuracy.push(acc);
			}
		}
	}

	return { newState, accuracy };
}

// console.log(filterExactMatch(skoly, "obory.delka_vzdelani", 11));


function filterRangeMatch(state: Skola[], key: string, lowBound: number, highBound: number): FilterOutput {
	const path = key.split(".");

	const newState: Skola[] = [];
	const accuracy: number[] = [];

	for (const skola of state) {
		let data = skola;
		for (const step of path)
			data = (data as any)[step];

		const number_data = data as any as number;
		if (number_data >= lowBound && number_data <= highBound) {
			newState.push(skola);
			accuracy.push(1);
		}
	}


	return { newState, accuracy };
}

// console.log(filterRangeMatch(schools, "skolne", 6000, 10000));




function toggleAll(e: InputEvent, parent: string) {
	const obor_select_checkboxes = (Array.from(document.querySelectorAll(parent + " div input[type='checkbox']")) as HTMLInputElement[]).forEach((ch) => ch.checked = (e.target! as HTMLInputElement).checked);
}


function openCity(evt: Event, tabName: string) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		(tabcontent[i] as HTMLDivElement).style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName)!.style.display = "block";
	(evt.currentTarget as HTMLButtonElement).className += " active";
}



function checkSchool(event: InputEvent) {
	const newSelection = [];
	if ((event.target as HTMLInputElement).checked) {
		for (const s of schools) {
			if (s.id == parseInt((event.target as HTMLInputElement).getAttribute("id")!)) currentSelection.push(s);
		}

	} else {
		currentSelection = currentSelection.filter(s => !(s.id == parseInt((event.target as HTMLInputElement).getAttribute("id")!)));
	}
	//currentSelection = newSelection;
	drawPrijimackyChart();
	drawTable();
}
