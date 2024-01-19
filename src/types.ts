import { LatLng, LatLngExpression, LatLngTuple } from "leaflet";

export type POI = PointOfInterest;
export interface PointOfInterest {
  id: string;
  coords: LatLng;
  type: string;
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


// [lat, lon]
export type Coords = LatLngTuple;

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