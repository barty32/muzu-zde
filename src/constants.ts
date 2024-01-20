import { LatLngExpression } from "leaflet";

export const MAPYCZ_API_KEY = "-8wUGJ0s3vIknPaeQsGo717QZZLNcx4DDPJqaAB75Kw";
export const MAPYCZ_API_URL = `https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${MAPYCZ_API_KEY}`;
export const PRAGUE_CENTER: LatLngExpression = [50.0825822, 14.4388334];
export const STARTING_MAP_ZOOM = 12;
export const MAX_MAP_ZOOM = 18;
export const MIN_MAP_ZOOM = 9;
export const HAS_COORDS_MAP_ZOOM = 16;