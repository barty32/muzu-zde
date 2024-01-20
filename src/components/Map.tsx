import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, Polygon, CircleMarker } from "react-leaflet";
import { HAS_COORDS_MAP_ZOOM, MAPYCZ_API_KEY, MAPYCZ_API_URL, MAX_MAP_ZOOM, MIN_MAP_ZOOM, PRAGUE_CENTER, STARTING_MAP_ZOOM } from "../constants";
import { PRAHA_BORDER } from "../praha_border";
import { Coords, KontejnerType, POI, Zone } from "../types";
import { useEffect, useState } from "react";
import { Icon, LatLng, LatLngExpression } from "leaflet";
import { TEST_POLYGON } from "../test_data";
import { getFullNameOfZoneType, getGEOJSONZoneData, getPointData } from "../data";
import { containerTypeMap } from "../types";


export interface SetViewProps {
	coords: LatLngExpression;
	zoom: number;
	shouldMove: boolean;
	setShouldMove: (value: boolean) => void;
}
const SetView: React.FC<SetViewProps> = ({ coords, zoom, setShouldMove, shouldMove }) => {
	const map = useMap();
	if (shouldMove === false) return null;
	map.setView(coords, zoom);
	map.addEventListener("drag", () => {
		setShouldMove(false);
	});

	return null;
};
export interface MapProps {
	coords: LatLng | null;
	address: string | null;
}
const Map: React.FC<MapProps> = ({ coords, address }) => {

	const [userCoords, setUserCoords] = useState<LatLngExpression>(PRAGUE_CENTER);
	const [mapZoom, setMapZoom] = useState<number>(STARTING_MAP_ZOOM);
	const [shouldMove, setShouldMove] = useState(true);

	const [kontejnerySelected, setKontejnerySelected] = useState(false);
	const [selectedKontejner, setSelectedKontejner] = useState<KontejnerType | null>(null);

	const [kontejnerList, setKontejnerList] = useState<POI[]>([]);

	const [alkoholZones, setAlkoholZones] = useState<Zone[]>([]);
	const [koureniZones, setKoureniZones] = useState<Zone[]>([]);

	const [alkoholProperties, setAlkoholProperties] = useState<any[]>([]);
	const [koureniProperties, setKoureniProperties] = useState<any[]>([]);

	const [showZakazAlkoholu, setShowZakazAlkoholu] = useState(false);
	const [showZakazKoureni, setShowZakazKoureni] = useState(false);

	// useEffect(() => {

	// 	console.log(TEST_POLYGON)
	// 	for (const y of TEST_POLYGON) {
	// 		let out = "";
	// 		for (const x of y) {
	// 			// @ts-ignore
	// 			out += `[${x[1]},${x[0]}],\n`;
	// 		}
	// 		console.log(out);
	// 	}
	// }, []);
	useEffect(() => {
		if (!coords) return;
		if (shouldMove === false) return;
		setUserCoords(coords);
		setMapZoom(HAS_COORDS_MAP_ZOOM);
	}, [coords, shouldMove]);

	useEffect(() => {
		if (selectedKontejner) {
			console.log(selectedKontejner);
			getPointData(selectedKontejner).then(x => {
				if (x) setKontejnerList(x);
			});
		}
	}, [selectedKontejner]);
	// useEffect(() => {
	// 	if(showZakazAlkoholu) {

	// 	}
	// }, [showZakazAlkoholu, showZakazKoureni]);

	useEffect(() => {
		getGEOJSONZoneData("./data/alkohol.geojson").then(d => {
			const [zones, properties] = d;
			setAlkoholZones(zones);
			setAlkoholProperties(properties);
		});
		getGEOJSONZoneData("./data/koureni.geojson").then(d => {
			const [zones, properties] = d;
			setKoureniZones(zones);
			setKoureniProperties(properties);
		});
		// getGEOJSONZoneData("./data/alkohol.geojson").then(d => {
		// 	setAlkoholZones(d);
		// });
		// setAlkoholZones([[[
		// 	[50.108265753172475, 14.4431083249722],
		// 	[50.10693276544606, 14.438492054065222],
		// 	[50.10341069324241, 14.439126517882158],
		// 	[50.104435067643465, 14.453303502487017],
		// 	[50.10867265780263, 14.449693621833262],
		// 	[50.108265753172475, 14.4431083249722]
		// ],
		// [
		// 	[50.10714191408849, 14.444035383990638],
		// 	[50.10614566133478, 14.442985236982736],
		// 	[50.10535986989717, 14.44523867743672],
		// 	[50.10585099105617, 14.44698892244935],
		// 	[50.10712788250348, 14.447360849515036],
		// 	[50.10714191408849, 14.444035383990638]
		// ]]]);
	}, []);
	const current_marker_icon = new Icon({ iconUrl: "./icons/current_icon.png", iconSize: [32, 45], iconAnchor: [16, 45] });

	return (
		<div>
			{/* TODO: pridat barevne oznaceni jednotlivych vrstev  */}
			<div className="filter_bar">
				<div>
					<input type="checkbox" id="kontejnery_enabled" onChange={(e) => setKontejnerySelected(e.target.checked)} /> <label htmlFor="kontejnery_enabled">Kontejnery</label>
					<select className={!kontejnerySelected ? "disabled" : ""} onChange={(e) => setSelectedKontejner(e.target.value as KontejnerType)} value={selectedKontejner || "none"}>
						<option disabled selected value="none">--vyberte--</option>
						{Object.entries(containerTypeMap).map(([k, v]) => <option value={v} selected key={v}>{k}</option>)}
					</select>
				</div>
				<div>
					<input type="checkbox" id="zakaz_alkoholu" checked={showZakazAlkoholu} onChange={(e) => setShowZakazAlkoholu(e.target.checked)} /> <label htmlFor="zakaz_alkoholu">Zobrazit zóny se zákazem alkoholu</label>
				</div>
				<div>
					<input type="checkbox" id="zakaz_koureni" checked={showZakazKoureni} onChange={(e) => setShowZakazKoureni(e.target.checked)} /> <label htmlFor="zakaz_koureni">Zobrazit zóny se zákazem kouření</label>
				</div>
			</div>
			<MapContainer className="map" center={PRAGUE_CENTER} zoom={STARTING_MAP_ZOOM} maxZoom={MAX_MAP_ZOOM} minZoom={MIN_MAP_ZOOM} style={{ height: "600px" }}>
				<TileLayer
					// url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
					url={MAPYCZ_API_URL}
				/>
				<Polyline positions={PRAHA_BORDER} color="black" />
				<Marker position={userCoords} icon={current_marker_icon}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
				{/* <CircleMarker center={userCoords} radius={2} /> */}
				<SetView coords={userCoords} zoom={mapZoom} shouldMove={shouldMove} setShouldMove={setShouldMove} />
				{/* <Polygon pathOptions={{ color: "gray" }} positions={TEST_POLYGON} /> */}

				{kontejnerySelected && kontejnerList.map((k, i) => <CircleMarker center={k.coords} radius={2} color="blue" key={i} />)}

				{showZakazAlkoholu && alkoholZones.map((z, i) => (
					<Polygon pathOptions={{ color: "green" }} positions={z} key={i} >
						<Popup>
							{`Zákaz požívání alkoholu - ${getFullNameOfZoneType(alkoholProperties[i]["type"])} v okruhu ${alkoholProperties[i]["distance"]}m`}
						</Popup>
					</Polygon>
				))}
				{showZakazKoureni && koureniZones.map((z, i) => (
				<Polygon pathOptions={{ color: "red" }} positions={z} key={i}>
					<Popup>
						{`Zákaz kouření - ${getFullNameOfZoneType(koureniProperties[i]["type"])} v okruhu ${koureniProperties[i]["distance"]}m`}
					</Popup>
				</Polygon>))}

				<div className="follow_user_button"><button onClick={() => setShouldMove(true)}><img src="./icons/current_icon.png" width={32} height={45} /></button></div>

			</MapContainer>
		</div >
	);
}

export default Map;

