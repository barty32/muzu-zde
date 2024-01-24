import { LatLng, LatLngTuple } from "leaflet";

export type POI = PointOfInterest;
export interface PointOfInterest {
  id: string;
  coords: LatLng;
  type: PointType;
  extraData?: any;
}

export type Zone = Coords[][];
export type ZOI = ZoneOfInterest;
export interface ZoneOfInterest {
  id: string;
  type: string;
  extraData?: any;
  area: Zone[];
}

export type ZoneType = 'alkohol' | 'koureni' | 'volny_pohyb_psu';
export type PointType = KontejnerType | 'verejne_wc' | 'park_automat' | 'nabijeci_stanice' | 'pitko' | 'park_ztp';

export type KontejnerType =
	'kontejner_papir' |
	'kontejner_plast' |
	'kontejner_tetrapak' |
	'kontejner_sklo_barevne' |
	'kontejner_sklo_cire' |
	'kontejner_elektro' |
	'kontejner_kov';

export type DetailType = ZoneType | PointType;


// [lat, lon]
export type Coords = LatLngTuple;

// export enum ContainerType {
// 	papir = 'papir',
// 	plast = 'plast',
// 	tetrapak = 'tetrapak',
// 	sklo_barevne = 'sklo_barevne',
// 	sklo_cire = 'sklo_cire',
// 	kov = 'kov',
// 	elektro = 'elektro',
// }

export const containerTypeMap: { [key: string]: string } = {
	'Papír': 'kontejner_papir',
	'Plast': 'kontejner_plast',
	'Nápojové kartóny': 'kontejner_tetrapak',
	'Barevné sklo': 'kontejner_sklo_barevne',
	'Čiré sklo': 'kontejner_sklo_cire',
	'Kovy': 'kontejner_kov',
	'Elektrozařízení': 'kontejner_elektro',
}

// export interface GeoJSON {
// 	"type": "FeatureCollection",
// 	"name": string,
// 	"crs": {
// 		"type": "name",
// 		"properties": {
// 			"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
// 		}
// 	},
// 	"features": {
// 		"type": "Feature",
// 		"properties": {},
// 		"geometry": {
// 			"type": "Point",
// 			"coordinates": [number, number]
// 		}
// 	}[]
// }