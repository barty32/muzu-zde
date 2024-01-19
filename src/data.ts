
//import { GeoJSON } from "react-leaflet";
import { LatLng } from "leaflet";
import { Coords, POI } from "./types";
import { Feature, FeatureCollection, GeoJSON, GeoJsonProperties, MultiPolygon, Point, Polygon, Position } from "geojson";

function convertCoords(input: Position): LatLng {
	return new LatLng(input[1], input[0]);
}

function convertCoords3857(input: Position): LatLng {
	//https://stackoverflow.com/questions/37523872/converting-coordinates-from-epsg-3857-to-4326
	
	const e_value = 2.7182818284;
    const X = 20037508.34;
    
	const lat3857 = input[1];
    const long3857 = input[0];
    
    //converting the longitute from epsg 3857 to 4326
    const long4326 = (long3857*180)/X;
    
    //converting the latitude from epsg 3857 to 4326 split in multiple lines for readability        
    let lat4326 = lat3857/(X / 180);
    const exponent = (Math.PI / 180) * lat4326;
    
    lat4326 = Math.atan(Math.pow(e_value, exponent));
    lat4326 = lat4326 / (Math.PI / 360); // Here is the fixed line
    lat4326 = lat4326 - 90;

	return new LatLng(lat4326, long4326);
}

async function getWcData(): Promise<POI[]> {
	const data = await (await fetch('./data/verejne_wc.geojson')).json() as FeatureCollection;
	let result: POI[] = [];
	for (const feature of data.features) {
		const id = feature.properties ? feature.properties["GLOBALID"] : "";
		const coords = convertCoords3857((feature.geometry as Point).coordinates);
		const point: POI = {
			id,
			coords,
			type: "wc"
		};
		result.push(point);
	}
	return result;
}

async function getParkAutomatData(): Promise<POI[]> {
	const data = await (await fetch('./data/park_automaty.geojson')).json() as FeatureCollection;
	let result: POI[] = [];
	for (const feature of data.features) {
		const id = feature.properties ? feature.properties["GLOBALID"] : "";
		const coords = convertCoords3857((feature.geometry as Point).coordinates);
		const point: POI = {
			id,
			coords,
			type: "park_automat",
			extraData: {
				"PA": feature.properties!["PA"],
				"PX": feature.properties!["PX"],
				"STREET": feature.properties!["STREET"],
				"CODE": feature.properties!["CODE"],
			}
		};
		result.push(point);
	}
	return result;
}

async function getChargeStationData(): Promise<POI[]> {
	const data = await (await fetch('./data/nabijeci_stanice.geojson')).json() as FeatureCollection;
	let result: POI[] = [];
	for (const feature of data.features) {
		const id = feature.properties ? feature.properties["GlobalID"] : "";
		const coords = convertCoords((feature.geometry as Point).coordinates);
		const point: POI = {
			id,
			coords,
			type: "nabijeci_stanice",
			extraData: feature.properties
		};
		result.push(point);
	}
	return result;
}

async function getZtpParkData(): Promise<POI[]> {
	const data = await (await fetch('./data/ztp_parkovaci_stani.geojson')).json() as FeatureCollection;
	let result: POI[] = [];
	for (const feature of data.features) {
		const id = feature.properties ? feature.properties["GLOBALID"] : "";
		const coords = convertCoords3857((feature.geometry as Point).coordinates);
		const point: POI = {
			id,
			coords,
			type: "park_ztp",
			extraData: feature.properties
		};
		result.push(point);
	}
	return result;
}


export enum ContainerType {
	papir = 'papir',
	plast = 'plast',
	tetrapak = 'tetrapak',
	sklo_barevne = 'sklo_barevne',
	sklo_cire = 'sklo_cire',
	kov = 'kov',
	elektro = 'elektro',
}

export const containerTypeMap: {[key: string]: string} = {
	'Papír': 'papir',
	'Plast': 'plast',
	'Nápojové kartóny': 'tetrapak',
	'Barevné sklo': 'sklo_barevne',
	'Čiré sklo': 'sklo_cire',
	'Kovy': 'kov',
	'Elektrozařízení': 'elektro',
}

async function getKontejnerData(type: ContainerType): Promise<POI[]> {
	const data = await (await fetch('./data/kontejnery.geojson')).json() as FeatureCollection;
	let result: POI[] = [];
	for (const feature of data.features) {
		if (containerTypeMap[feature.properties!['TRASHTYPENAME']] != type) continue;
		const id = feature.properties ? feature.properties["OBJECTID"] : "";
		const coords = convertCoords3857((feature.geometry as Point).coordinates);
		const point: POI = {
			id,
			coords,
			type: `kontejner_${type}`,
			extraData: { ...feature.properties, type}
		};
		result.push(point);
	}
	return result;
}

export async function getData(type: string)/*: Promise<POI[]>*/ {
	
	// const data = await (await fetch('./data/verejne_wc.geojson')).json() as FeatureCollection;
	// let result: POI[] = [];

	// for (const feature of data.features) {
	// 	const id = feature.properties ? feature.properties["GLOBALID"] : "";
	// 	const coords = convertCoords3857((feature.geometry as Point).coordinates);
	// 	const point: POI = {
	// 		id,
	// 		coords,
	// 		type: "wc"
	// 	};
	// 	result.push(point);
	// }
	console.log(type)
	switch (type) {
		case "kontejner_papir":
			return getKontejnerData(ContainerType.papir);
		case "kontejner_plast":
			return getKontejnerData(ContainerType.plast);
		case "kontejner_tetrapak":
			return getKontejnerData(ContainerType.tetrapak);
		case "kontejner_sklo_barevne":
			return getKontejnerData(ContainerType.sklo_barevne);
		case "kontejner_sklo_cire":
			return getKontejnerData(ContainerType.sklo_cire);
		case "kontejner_kov":
			return getKontejnerData(ContainerType.kov);
		case "kontejner_elektro":
			return getKontejnerData(ContainerType.elektro);
		
	}

	return null;
}

function isPointInPolygon(polygon: Position[], point: LatLng): boolean {
	//https://www.algorithms-and-technologies.com/point_in_polygon/javascript

	//A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
	let odd = false;
	//For each edge (In this case for each point of the polygon and the previous one)
	for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
		//If a line from the point into infinity crosses this edge
		if (((polygon[i][1] > point.lat) !== (polygon[j][1] > point.lat)) // One point needs to be above, one below our y coordinate
			// ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
			&& (point.lng < ((polygon[j][0] - polygon[i][0]) * (point.lat - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
			// Invert odd
			odd = !odd;
		}
		j = i;
	}
	//If the number of crossings was odd, the point is in the polygon
	return odd;
}

function detectPolygon(polygon: Position[][], point: LatLng): boolean {
	let pass = false;

	pass = isPointInPolygon(polygon[0], point);

	//polygon has holes
	for (let i = 1; i < polygon.length; i++){
		if (isPointInPolygon(polygon[i], point)) {
			return false;
		}
	}

	return pass;
}


export async function getNoiseLevel(coords: LatLng) {
	
	const data = await (await fetch('./data/hluk_den.geojson')).json() as FeatureCollection;
	for (const feature of data.features) {
		switch (feature.geometry.type) {
			case "Polygon":
				if (detectPolygon(feature.geometry.coordinates, coords)) {
					return feature.properties;
				}
				break;
			
			case "MultiPolygon":
				for (const polygon of feature.geometry.coordinates) {
					if (detectPolygon(polygon, coords)) {
						return feature.properties;
					}
				}
				break;
		}
	}
	return null;
}



async function getClosest(type: string, coords: Coords) {

	let json: GeoJSON;

	switch (type) {
		
		case "wc":
			json = await (await fetch('./data/.geojson')).json();
			break;



	}







}


export {}