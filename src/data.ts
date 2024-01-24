import { FeatureCollection, GeoJsonProperties, Point, Polygon, Position } from 'geojson';
import { LatLng, LatLngTuple } from 'leaflet';
import { containerTypeMap, KontejnerType, POI, PointType } from './types';

async function getWcData(): Promise<POI[]> {
  const data = await (await fetch('./data/verejne_wc.geojson')).json() as
      FeatureCollection;
  let result: POI[] = [];
  for (const feature of data.features) {
    const id = feature.properties ? feature.properties['GLOBALID'] : '';
    const coords = convertCoords3857((feature.geometry as Point).coordinates);
    const point: POI = {id, coords, type: 'verejne_wc'};
    result.push(point);
  }
  return result;
}

async function getParkAutomatData(): Promise<POI[]> {
  const data = await (await fetch('./data/park_automaty.geojson')).json() as
      FeatureCollection;
  let result: POI[] = [];
  for (const feature of data.features) {
    const id = feature.properties ? feature.properties['GLOBALID'] : '';
    const coords = convertCoords3857((feature.geometry as Point).coordinates);
    const point: POI = {
      id,
      coords,
      type: 'park_automat',
      extraData: {
        'PA': feature.properties!['PA'],
        'PX': feature.properties!['PX'],
        'STREET': feature.properties!['STREET'],
        'CODE': feature.properties!['CODE'],
      }
    };
    result.push(point);
  }
  return result;
}

async function getChargeStationData(): Promise<POI[]> {
  const data = await (await fetch('./data/nabijeci_stanice.geojson')).json() as
      FeatureCollection;
  let result: POI[] = [];
  for (const feature of data.features) {
    const id = feature.properties ? feature.properties['GlobalID'] : '';
    const coords = convertCoords3857((feature.geometry as Point).coordinates);
    const point: POI =
        {id, coords, type: 'nabijeci_stanice', extraData: feature.properties};
    result.push(point);
  }
  return result;
}

async function getFountainData(): Promise<POI[]> {
  const data =
      await (await fetch('./data/pitka.geojson')).json() as FeatureCollection;
  let result: POI[] = [];
  for (const feature of data.features) {
    const id = feature.properties ? feature.properties['GlobalID'] : '';
    const coords = convertCoords((feature.geometry as Point).coordinates);
    const point:
        POI = {id, coords, type: 'pitko', extraData: feature.properties};
    result.push(point);
  }
  return result;
}

async function getZtpParkData(): Promise<POI[]> {
  const data =
      await (await fetch('./data/ztp_parkovaci_stani.geojson')).json() as
      FeatureCollection;
  let result: POI[] = [];
  for (const feature of data.features) {
    const id = feature.properties ? feature.properties['GLOBALID'] : '';
    const coords = convertCoords3857((feature.geometry as Point).coordinates);
    const point:
        POI = {id, coords, type: 'park_ztp', extraData: feature.properties};
    result.push(point);
  }
  return result;
}



async function getKontejnerData(type: KontejnerType): Promise<POI[]> {
  const data = await (await fetch('./data/kontejnery.geojson')).json() as
      FeatureCollection;
  let result: POI[] = [];
  for (const feature of data.features) {
    if (containerTypeMap[feature.properties!['TRASHTYPENAME']] !== type)
      continue;
    const id = feature.properties ? feature.properties['OBJECTID'] : '';
    const coords = convertCoords3857((feature.geometry as Point).coordinates);
    const point:
        POI = {id, coords, type, extraData: {...feature.properties, type}};
    result.push(point);
  }
  return result;
}

export async function getPointData(type: PointType) /*: Promise<POI[]>*/ {
  switch (type) {
    case 'kontejner_papir':
    case 'kontejner_plast':
    case 'kontejner_tetrapak':
    case 'kontejner_sklo_barevne':
    case 'kontejner_sklo_cire':
    case 'kontejner_kov':
    case 'kontejner_elektro':
      return getKontejnerData(type);

    case 'verejne_wc':
      return getWcData();
    case 'pitko':
      return getFountainData();
    case 'park_automat':
      return getParkAutomatData();
    case 'park_ztp':
      return getZtpParkData();
    case 'nabijeci_stanice':
      return getChargeStationData();

    default:
      return null;
  }
}



export async function getAlcoholAllowed(coords: LatLng):
    Promise<GeoJsonProperties|null> {
  const data =
      await (await fetch('./data/alkohol.geojson')).json() as FeatureCollection;
  for (const feature of data.features) {
    if (detectPolygon((feature.geometry as Polygon).coordinates, coords)) {
      return feature.properties;
    }
  }
  return null;
}

export async function getSmokingAllowed(coords: LatLng):
    Promise<GeoJsonProperties|null> {
  const data =
      await (await fetch('./data/koureni.geojson')).json() as FeatureCollection;
  for (const feature of data.features) {
    if (detectPolygon((feature.geometry as Polygon).coordinates, coords)) {
      return feature.properties;
    }
  }
  return null;
}


// export async function getNoiseLevel(coords: LatLng) {

// 	const data = await (await fetch('./data/hluk_den.geojson')).json() as
// FeatureCollection; 	for (const feature of data.features) { 		switch
// (feature.geometry.type) { 			case "Polygon":
// if (detectPolygon(feature.geometry.coordinates, coords)) {
// return feature.properties;
// 				}
// 				break;

// 			case "MultiPolygon":
// 				for (const polygon of
// feature.geometry.coordinates) { 					if
// (detectPolygon(polygon, coords)) { return feature.properties;
// 					}
// 				}
// 				break;
// 		}
// 	}
// 	return null;
// }


function convertCoords(input: Position): LatLng {
  return new LatLng(input[1], input[0]);
}

// https://stackoverflow.com/questions/37523872/converting-coordinates-from-epsg-3857-to-4326
function convertCoords3857(input: Position): LatLng {
  const e_value = 2.7182818284;
  const X = 20037508.34;

  const lat3857 = input[1];
  const long3857 = input[0];

  // converting the longitute from epsg 3857 to 4326
  const long4326 = (long3857 * 180) / X;

  // converting the latitude from epsg 3857 to 4326 split in multiple lines for
  // readability
  let lat4326 = lat3857 / (X / 180);
  const exponent = (Math.PI / 180) * lat4326;

  lat4326 = Math.atan(Math.pow(e_value, exponent));
  lat4326 = lat4326 / (Math.PI / 360);  // Here is the fixed line
  lat4326 = lat4326 - 90;

  return new LatLng(lat4326, long4326);
}

// https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
export function getDistance(pt1: LatLng, pt2: LatLng) {
  var R = 6378.137;  // radius of earth in KM
  var dLat = pt2.lat * Math.PI / 180 - pt1.lat * Math.PI / 180;
  var dLon = pt2.lng * Math.PI / 180 - pt1.lng * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pt1.lat * Math.PI / 180) * Math.cos(pt2.lat * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// https://www.algorithms-and-technologies.com/point_in_polygon/javascript
function isPointInPolygon(polygon: Position[], point: LatLng): boolean {
  // A point is in a polygon if a line from the point to infinity crosses the
  // polygon an odd number of times
  let odd = false;
  // For each edge (In this case for each point of the polygon and the previous
  // one)
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
    // If a line from the point into infinity crosses this edge
    if (((polygon[i][1] > point.lat) !==
         (polygon[j][1] > point.lat))  // One point needs to be above, one below
                                       // our y coordinate
        // ...and the edge doesn't cross our Y corrdinate before
        // our x coordinate (but between our x coordinate and
        // infinity)
        && (point.lng <
            ((polygon[j][0] - polygon[i][0]) * (point.lat - polygon[i][1]) /
                 (polygon[j][1] - polygon[i][1]) +
             polygon[i][0]))) {
      // Invert odd
      odd = !odd;
    }
    j = i;
  }
  // If the number of crossings was odd, the point is in the polygon
  return odd;
}

function detectPolygon(polygon: Position[][], point: LatLng): boolean {
  let pass = false;

  pass = isPointInPolygon(polygon[0], point);

  // polygon has holes
  for (let i = 1; i < polygon.length; i++) {
    if (isPointInPolygon(polygon[i], point)) {
      return false;
    }
  }

  return pass;
}



export async function getGEOJSONZoneData(file: string):
    Promise<[LatLngTuple[][][], any[]]> {
  const data = await (await fetch(file)).json() as FeatureCollection;
  const result: LatLngTuple[][][] = [];
  const result_properties = [];
  for (const feature of data.features) {
    const intermediate1 = [];
    if (feature.geometry.type === 'Polygon') {
      for (const polygon of feature.geometry.coordinates) {
        const intermediate2: LatLngTuple[] = [];
        for (const point of polygon) {
          intermediate2.push([point[1], point[0]]);
        }
        intermediate1.push(intermediate2);
      }
      result.push(intermediate1);
      result_properties.push(feature.properties);
    }
  }
  return [result, result_properties];
}


export function getFullNameOfZoneType(
    zone_type: string, sklonovat = false): string {
  switch (zone_type) {
    case 'skolske_zarizeni':
      return sklonovat ? 'školského zařízení' : 'Školské zařízení';
    case 'zastavka_mhd':
      return sklonovat ? 'zastávky MHD' : 'Zastávka MHD';
    case 'zdravotni_zarizeni':
      return sklonovat ? 'zdravotního zařízení' : 'Zdravotní zařízení';
  }
	//throw new Error('Invalid input');
	return '';
}

export function formatDistance(dist: number) {
	if (dist < 1000) {
		return dist.toPrecision(3) + ' m';
	}
	else if(dist < 1000000){
		return (dist / 1000).toPrecision(3) + ' km';
	}
	return (dist / 1000).toFixed(0) + ' km';
}