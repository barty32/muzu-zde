import { parse } from "csv-parse";
import fs from "fs";
import { parseString } from "xml2js";

const getCircle = (center, radius) => {
	const polygon = [];
	const radiusLon = 1 / (111.319 * Math.cos(center[0] * (Math.PI / 180))) * radius;
	const radiusLat = 1 / 110.574 * radius;

	for (let i = 0; i <= 360; i += 30) {
		polygon.push([
			center[1] + radiusLon * Math.sin(i / (180 / Math.PI))
			, center[0] + radiusLat * Math.cos(i / (180 / Math.PI))]
		);
	}
	return polygon;
}

function convertCoords3857(input) {
	const e_value = 2.7182818284;
	const X = 20037508.34;

	const lat3857 = input[1];
	const long3857 = input[0];

	//converting the longitute from epsg 3857 to 4326
	const long4326 = (long3857 * 180) / X;

	//converting the latitude from epsg 3857 to 4326 split in multiple lines for readability        
	let lat4326 = lat3857 / (X / 180);
	const exponent = (Math.PI / 180) * lat4326;

	lat4326 = Math.atan(Math.pow(e_value, exponent));
	lat4326 = lat4326 / (Math.PI / 360); // Here is the fixed line
	lat4326 = lat4326 - 90;

	return [lat4326, long4326];
}

function chartZastavky() {
	const file_path = "./data/zastavky_PID.geojson";
	const file = fs.readFileSync(file_path);
	const json_file = JSON.parse(file);

	const features = json_file["features"];
	const new_features = [];

	let i = 1;
	for (const f of features) {
		if (f["properties"]["ZAST_OBEC"] !== "Praha") continue;
		const coords = f["geometry"]["coordinates"];
		const converted = convertCoords3857(coords);

		const polygon = getCircle(converted, 0.065);
		const new_feature = {
			"type": "Feature",
			"id": i++,
			"geometry": {
				"type": "Polygon",
				"coordinates": [polygon]
			},
			"properties": { "type": "zastavka_mhd", "distance": 65, "unit": "m" }
		};


		new_features.push(new_feature);
	}

	const new_structure = {
		"type": "FeatureCollection",
		"crs": {
			"type": "name",
			"properties": {
				"name": "EPSG:4326"
			}
		},
		"features": new_features
	};

	fs.writeFileSync("./zakaz_zastavky.geojson", JSON.stringify(new_structure));
}
// chartZastavky();

function extractSkoly() {
	const file_path = "./data/skoly.xml";
	const file = fs.readFileSync(file_path);
	parseString(file.toString(), async (err, res) => {
		if (err === null) {
			const skoly = res["ExportDat"]["PravniSubjekt"];

			const skola_array = [];
			for (const s of skoly) {
				const misto = s["SkolyZarizeni"][0]["SkolaZarizeni"][0]["SkolaMistaVykonuCinnosti"][0]["SkolaMistoVykonuCinnosti"][0];
				const adresa = `${misto["MistoAdresa1"]}, ${misto["MistoAdresa2"]}, ${misto["MistoAdresa3"]}`;
				skola_array.push(adresa);
			}
			const result = [];
			let i = 1;
			for (const s of skola_array) {
				const uri = encodeURI(s);
				console.log(`${i}/${skola_array.length}(${(i++ / skola_array.length * 100).toFixed(2)}%)- ${s}`);
				await fetch(`https://api.mapy.cz/v1/geocode?query=${uri}&lang=cs&limit=1&type=regional&type=poi&apikey=-8wUGJ0s3vIknPaeQsGo717QZZLNcx4DDPJqaAB75Kw`).then(d => d.json()).then(x => result.push((x)));
			}
			fs.writeFileSync("./skoly.json", JSON.stringify(result));
		}
		else {
			console.log(err);
		}
	});

}

function chartSkoly() {
	const file_path = "./data/skoly.json";
	const file = fs.readFileSync(file_path);
	const json_file = JSON.parse(file);

	const skoly = json_file["skoly"];
	const new_features = [];

	let i = 1;
	for (const s of skoly) {
		if (s["items"].length == 0) continue;
		const coords = s["items"][0]["position"];
		const converted = [coords["lat"], coords["lon"]];
		const polygon = getCircle(converted, 0.150);
		const new_feature = {
			"type": "Feature",
			"id": i++,
			"geometry": {
				"type": "Polygon",
				"coordinates": [polygon]
			},
			"properties": {
				"type": "skolske_zarizeni",
				"distance": 150,
				"unit": "m"
			}
		};


		new_features.push(new_feature);
	}

	const new_structure = {
		"type": "FeatureCollection",
		"crs": {
			"type": "name",
			"properties": {
				"name": "EPSG:4326"
			}
		},
		"features": new_features
	};

	fs.writeFileSync("./skoly.geojson", JSON.stringify(new_structure));
}
// chartSkoly();

function chartZdravotniZarizeni(path, outpath) {
	const new_features = [];

	let i = 1;
	fs.createReadStream(path)
		.pipe(parse({ delimiter: ",", from_line: 2 }))
		.on("data", (row) => {
			if (!row[31] || !row[32]) return;
			const polygon = getCircle([parseFloat(row[31]), parseFloat(row[32])], 0.050);
			const new_feature = {
				"type": "Feature",
				"id": i++,
				"geometry": {
					"type": "Polygon",
					"coordinates": [polygon]
				},
				"properties": {
					"type": "zdravotni_zarizeni",
					"detail": row[4],
					"distance": 50,
					"unit": "m"
				}
			};
			new_features.push(new_feature);

		}).on("finish", () => {
			console.log("done");
			const new_structure = {
				"type": "FeatureCollection",
				"crs": {
					"type": "name",
					"properties": {
						"name": "EPSG:4326"
					}
				},
				"features": new_features
			};

			fs.writeFileSync(outpath, JSON.stringify(new_structure));
		})

}
// chartZdravotniZarizeni("./data/zdravotni_zarizeni.csv", "./zdravotni_zarizeni.geojson");

function megrgeGeojsons(file1, file2, outfile) {
	const file1_raw = fs.readFileSync(file1);
	const file1_json = JSON.parse(file1_raw);

	const file2_raw = fs.readFileSync(file2);
	const file2_json = JSON.parse(file2_raw);

	const last_id = file1_json["features"][file1_json["features"].length - 1]["id"];
	const file2_renumbered = file2_json["features"].map(f => {
		const updated = { ...f };
		updated["id"] = f["id"] + last_id;
		return updated;
	});

	const all_features = [...file1_json["features"], ...file2_renumbered];
	const new_structure = {
		"type": "FeatureCollection",
		"crs": {
			"type": "name",
			"properties": {
				"name": "EPSG:4326"
			}
		},
		"features": all_features
	};
	fs.writeFileSync(outfile, JSON.stringify(new_structure));

}

// megrgeGeojsons("./koureni.geojson", "./zdravotni_zarizeni.geojson", "./alkohol.geojson");

function removeDuplicates(file, outfile) {
	const file_raw = fs.readFileSync(file);
	const file_json = JSON.parse(file_raw);

	const all_features = [...file_json["features"]];
	let x = 0;
	for (const [idx, feature] of all_features.entries()) {
		if (feature === null) continue;

		const myFeature = feature["geometry"]["coordinates"][0];
		for (let i = idx + 1; i < all_features.length; i++) {
			const tested_feature = all_features[i];
			let match = true;
			for (const [j, v] of tested_feature["geometry"]["coordinates"][0].entries()) {
				if (v[0] != myFeature[j][0] || v[1] != myFeature[j][1]) {
					match = false;
					break;
				}
			}
			if (match == true) {
				all_features[idx] = null;
				x++;
				break;
				// console.log("removed duplicate");
			}

		}


	}
	console.log("removed " + x);
	const new_features = all_features.filter(f => f !== null);
	const new_structure = {
		"type": "FeatureCollection",
		"crs": {
			"type": "name",
			"properties": {
				"name": "EPSG:4326"
			}
		},
		"features": new_features
	};
	fs.writeFileSync(outfile, JSON.stringify(new_structure));

}
// removeDuplicates("./alkohol.geojson", "./test.geojson");