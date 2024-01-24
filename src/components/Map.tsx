import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, Polygon, CircleMarker } from "react-leaflet";
import { HAS_COORDS_MAP_ZOOM, LAYER_COLORS, LAYER_ICON_SIZE, MAPYCZ_API_URL, MARKER_CLUSTERING_DISABLE_AT_ZOOM, MAX_MAP_ZOOM, MIN_MAP_ZOOM, PRAGUE_CENTER, STARTING_MAP_ZOOM, MARKER_CLUSTERING_MAX_RADIUS } from "../constants";
import { PRAHA_BORDER } from "../praha_border";
import { DetailType, KontejnerType, POI, Zone } from "../types";
import { useEffect, useState } from "react";
import L, { Icon, LatLng, LatLngExpression, MarkerCluster } from "leaflet";
import { getFullNameOfZoneType, getGEOJSONZoneData, getPointData } from "../data";
import { containerTypeMap } from "../types";
import GenericTable from "./GenericTable";
import Control from 'react-leaflet-custom-control'
import { IoIosArrowBack } from "react-icons/io";
import { GrStatusGoodSmall } from "react-icons/gr";
import MarkerClusterGroup from 'react-leaflet-cluster'
import LoadingScreen from "./LoadingScreen";




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
	updatePosition: () => void;
	activeLayers: string[];
	updateLayers: (layer: DetailType, val: boolean) => void;
	showLayerBox: boolean;
	markerTitle: string;
}

const Map: React.FC<MapProps> = ({ coords, updatePosition, activeLayers, updateLayers, showLayerBox, markerTitle }) => {

	const [userCoords, setUserCoords] = useState<LatLngExpression>(PRAGUE_CENTER);
	const [mapZoom, setMapZoom] = useState<number>(STARTING_MAP_ZOOM);
	const [shouldMove, setShouldMove] = useState(true);

	const [kontejnerySelected, setKontejnerySelected] = useState<boolean>(activeLayers.find((val) => val.includes('kontejner_')) !== undefined);
	const [selectedKontejner, setSelectedKontejner] = useState<KontejnerType | null>(activeLayers.find((val) => val.includes('kontejner_')) as (KontejnerType | null) || null);

	const [kontejnerList, setKontejnerList] = useState<POI[]>([]);
	const [toaletyList, setToaletyList] = useState<POI[]>([]);
	const [nabijeckyList, setNabijeckyList] = useState<POI[]>([]);
	const [parkAutomatyList, setParkAutomatyList] = useState<POI[]>([]);
	const [parkZtpList, setParkZtpList] = useState<POI[]>([]);
	const [pitkaList, setPitkaList] = useState<POI[]>([]);

	const [alkoholZones, setAlkoholZones] = useState<Zone[]>([]);
	const [koureniZones, setKoureniZones] = useState<Zone[]>([]);

	const [alkoholProperties, setAlkoholProperties] = useState<any[]>([]);
	const [koureniProperties, setKoureniProperties] = useState<any[]>([]);

	const [showZakazAlkoholu, setShowZakazAlkoholu] = useState(activeLayers.includes('alkohol'));
	const [showZakazKoureni, setShowZakazKoureni] = useState(activeLayers.includes('koureni'));
	const [showVerejneWc, setShowVerejneWc] = useState(activeLayers.includes('verejne_wc'));
	const [showNabijecky, setShowNabijecky] = useState(activeLayers.includes('nabijeci_stanice'));
	const [showParkAutomaty, setShowParkAutomaty] = useState(activeLayers.includes('park_automat'));
	const [showParkZtp, setShowParkZtp] = useState(activeLayers.includes('park_ztp'));
	const [showPitka, setShowPitka] = useState(activeLayers.includes('pitko'));


	const [showLayerMenu, setShowLayerMenu] = useState<boolean>(true);
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


	const [loadingEnabled, setLoadingEnabled] = useState(true);
	useEffect(() => {
		if (selectedKontejner) {
			getPointData(selectedKontejner).then(x => {
				if (x) setKontejnerList(x);
			});
		}
	}, [selectedKontejner]);
	useEffect(() => {

	}, [showZakazAlkoholu, showZakazKoureni]);

	useEffect(() => {
		setLoadingEnabled(true);

		setTimeout(() => {
			setLoadingEnabled(false);
		}, 1000);
	}, [showZakazAlkoholu, showZakazKoureni, showVerejneWc, showNabijecky, showParkAutomaty, showParkZtp, showPitka, kontejnerList, kontejnerySelected]);

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

		getPointData("verejne_wc").then(d => {
			if (d) setToaletyList(d);
		});
		getPointData("nabijeci_stanice").then(d => {
			if (d) setNabijeckyList(d);
		});
		getPointData("park_automat").then(d => {
			if (d) setParkAutomatyList(d);
		});
		getPointData("park_ztp").then(d => {
			if (d) setParkZtpList(d);
		});
		getPointData("pitko").then(d => {
			if (d) setPitkaList(d);
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


	const createClusterCustomIcon = function (cluster: MarkerCluster, color: string) {
		const marker = document.createElement("div");
		marker.style.backgroundColor = color;
		marker.innerText = cluster.getChildCount().toString();
		marker.classList.add("custom_cluster_marker");

		return L.divIcon({
			html: marker,
			// className: "",
			iconSize: L.point(33, 33, true),
		})
	}

	return (
		<>
			<MapContainer className="map" center={PRAGUE_CENTER} zoom={STARTING_MAP_ZOOM} maxZoom={MAX_MAP_ZOOM} minZoom={MIN_MAP_ZOOM}>
				<TileLayer
					// url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
					url={MAPYCZ_API_URL}
				/>
				<Polyline positions={PRAHA_BORDER} color="black" />
				<Marker position={userCoords} icon={current_marker_icon}>
					<Popup>
						<h3>{ markerTitle }</h3>
					</Popup>
				</Marker>
				{/* <CircleMarker center={userCoords} radius={2} /> */}
				<SetView coords={userCoords} zoom={mapZoom} shouldMove={shouldMove} setShouldMove={setShouldMove} />
				{/* <Polygon pathOptions={{ color: "gray" }} positions={TEST_POLYGON} /> */}
				<MarkerClusterGroup maxClusterRadius={MARKER_CLUSTERING_MAX_RADIUS} disableClusteringAtZoom={MARKER_CLUSTERING_DISABLE_AT_ZOOM} spiderfyOnMaxZoom={true} showCoverageOnHover={false} iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, LAYER_COLORS["trash"])}>
					{kontejnerySelected && kontejnerList.map((k, i) => (
						<CircleMarker center={k.coords} radius={6} pathOptions={{ fillColor: LAYER_COLORS["trash"], fillOpacity: 1, stroke: false }} key={i}>
							<Popup>
								<h3>{`Sběrné místo odpadu - ${k.extraData['TRASHTYPENAME']}`}</h3>
							</Popup>
						</CircleMarker>
					))}
				</MarkerClusterGroup>

				<MarkerClusterGroup maxClusterRadius={MARKER_CLUSTERING_MAX_RADIUS} disableClusteringAtZoom={MARKER_CLUSTERING_DISABLE_AT_ZOOM} spiderfyOnMaxZoom={true} showCoverageOnHover={false} iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, LAYER_COLORS["zachody"])}>
					{showVerejneWc && toaletyList.map((k, i) => (
						<CircleMarker center={k.coords} radius={6} pathOptions={{ fillColor: LAYER_COLORS["zachody"], fillOpacity: 1, stroke: false }} key={i}>
							<Popup>
								<h3>{`Veřejné toalety`}</h3>
							</Popup>
						</CircleMarker>
					))}
				</MarkerClusterGroup>

				<MarkerClusterGroup maxClusterRadius={MARKER_CLUSTERING_MAX_RADIUS} disableClusteringAtZoom={MARKER_CLUSTERING_DISABLE_AT_ZOOM} spiderfyOnMaxZoom={true} showCoverageOnHover={false} iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, LAYER_COLORS["nabijecky"])}>
					{showNabijecky && nabijeckyList.map((k, i) => (
						<CircleMarker center={k.coords} radius={6} pathOptions={{ fillColor: LAYER_COLORS["nabijecky"], fillOpacity: 1, stroke: false }} key={i}>
							<Popup>
								<h3>{`Nabíječka pro elektromobily`}</h3>
								<GenericTable data={k.extraData} included_keys={['OperatorInfo', 'OperatorInfoWebsite', 'UsageType', 'MembershipRequired', 'PayAtLocation', 'KeyRequired', 'StatusType', 'Connections', 'NumberOfPoints']} />
							</Popup>
						</CircleMarker>
					))}
				</MarkerClusterGroup>

				<MarkerClusterGroup maxClusterRadius={MARKER_CLUSTERING_MAX_RADIUS} disableClusteringAtZoom={MARKER_CLUSTERING_DISABLE_AT_ZOOM} spiderfyOnMaxZoom={true} showCoverageOnHover={false} iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, LAYER_COLORS["parkomat"])}>
					{showParkAutomaty && parkAutomatyList.map((k, i) => (
						<CircleMarker center={k.coords} radius={6} pathOptions={{ fillColor: LAYER_COLORS["parkomat"], fillOpacity: 1, stroke: false }} key={i}>
							<Popup>
								<h3>{`Parkovací automat`}</h3>
								<GenericTable data={k.extraData} included_keys={['PA', 'PX', 'CODE', 'STREET']} />
							</Popup>
						</CircleMarker>
					))}
				</MarkerClusterGroup>

				<MarkerClusterGroup maxClusterRadius={MARKER_CLUSTERING_MAX_RADIUS} disableClusteringAtZoom={MARKER_CLUSTERING_DISABLE_AT_ZOOM} spiderfyOnMaxZoom={true} showCoverageOnHover={false} iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, LAYER_COLORS["parkztp"])}>
					{showParkZtp && parkZtpList.map((k, i) => (
						<CircleMarker center={k.coords} radius={6} pathOptions={{ fillColor: LAYER_COLORS["parkztp"], fillOpacity: 1, stroke: false }} key={i}>
							<Popup>
								<h3>{`Parkovací místo pro držitele ZTP`}</h3>
								<GenericTable data={k.extraData} />
							</Popup>
						</CircleMarker>
					))}
				</MarkerClusterGroup>

				<MarkerClusterGroup maxClusterRadius={MARKER_CLUSTERING_MAX_RADIUS} disableClusteringAtZoom={MARKER_CLUSTERING_DISABLE_AT_ZOOM} spiderfyOnMaxZoom={true} showCoverageOnHover={false} iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, LAYER_COLORS["pitka"])}>
					{showPitka && pitkaList.map((k, i) => (
						<CircleMarker center={k.coords} radius={6} pathOptions={{ fillColor: LAYER_COLORS["pitka"], fillOpacity: 1, stroke: false }} key={i}>
							<Popup>
								<h3>{`Pítko`}</h3>
								<GenericTable data={k.extraData} />
								PAROnyma
							</Popup>
						</CircleMarker>
					))}
				</MarkerClusterGroup>





				{showZakazAlkoholu && alkoholZones.map((z, i) => (
					<Polygon pathOptions={{ color: LAYER_COLORS["zonaalko"], stroke: false }} positions={z} key={i} >
						<Popup>
							<h3>{`Zákaz požívání alkoholu - ${getFullNameOfZoneType(alkoholProperties[i]["type"])} v okruhu ${alkoholProperties[i]["distance"]}m`}</h3>
						</Popup>
					</Polygon>
				))}
				{showZakazKoureni && koureniZones.map((z, i) => (
					<Polygon pathOptions={{ color: LAYER_COLORS["zonakouro"], stroke: false }} positions={z} key={i}>
						<Popup >
							<h3>{`Zákaz kouření - ${getFullNameOfZoneType(koureniProperties[i]["type"])} v okruhu ${koureniProperties[i]["distance"]}m`}</h3>
						</Popup>
					</Polygon>))}

				{showLayerBox && <Control prepend position='topright'>
					<div className={"filter_menu_collapse" + (!showLayerMenu ? " collapsed" : "")} onClick={(e) => { setShowLayerMenu(!showLayerMenu) }}>
						<IoIosArrowBack />
					</div>
					<div className="filter_bar" style={{ display: (!showLayerMenu ? "none" : "block") }}>
						<div className="filter_bar_menu"><div>Vrstvy</div></div>
						<div className="filter_items">
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["trash"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="kontejnery_enabled" onChange={(e) => { setKontejnerySelected(e.target.checked); if (selectedKontejner) updateLayers(selectedKontejner, e.target.checked) }} checked={kontejnerySelected} /> <label htmlFor="kontejnery_enabled">Kontejnery</label> &nbsp;
								<select className={!kontejnerySelected ? "disabled" : ""} onChange={(e) => { if (selectedKontejner) updateLayers(selectedKontejner, false); setSelectedKontejner(e.target.value as KontejnerType); updateLayers(e.target.value as KontejnerType, true) }} value={selectedKontejner || "none"}>
									<option disabled selected value="none">--vyberte--</option>
									{Object.entries(containerTypeMap).map(([k, v]) => <option value={v} selected key={v}>{k}</option>)}
								</select>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["zachody"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="verejne_wc" checked={showVerejneWc} onChange={(e) => { setShowVerejneWc(e.target.checked); updateLayers('verejne_wc', e.target.checked); }} /> <label htmlFor="verejne_wc">Zobrazit veřejné toalety</label>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["nabijecky"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="nabijecky" checked={showNabijecky} onChange={(e) => { setShowNabijecky(e.target.checked); updateLayers('nabijeci_stanice', e.target.checked) }} /> <label htmlFor="nabijecky">Zobrazit nabíjecí stanice pro elektromobily</label>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["parkomat"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="park_automaty" checked={showParkAutomaty} onChange={(e) => { setShowParkAutomaty(e.target.checked); updateLayers('park_automat', e.target.checked) }} /> <label htmlFor="park_automaty">Zobrazit parkovací automaty</label>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["parkztp"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="park_ztp" checked={showParkZtp} onChange={(e) => { setShowParkZtp(e.target.checked); updateLayers('park_ztp', e.target.checked) }} /> <label htmlFor="park_ztp">Zobrazit parkovací místa pro držitele ZTP</label>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["pitka"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="pitka" checked={showPitka} onChange={(e) => { setShowPitka(e.target.checked); updateLayers('pitko', e.target.checked) }} /> <label htmlFor="pitka">Zobrazit pítka</label>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["zonaalko"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="zakaz_alkoholu" checked={showZakazAlkoholu} onChange={(e) => {
									setLoadingEnabled(true); setShowZakazAlkoholu(e.target.checked); updateLayers('alkohol', e.target.checked);
								}} /> <label htmlFor="zakaz_alkoholu">Zobrazit zóny se zákazem alkoholu</label>
							</div>
							<div>
								<GrStatusGoodSmall color={LAYER_COLORS["zonakouro"]} size={LAYER_ICON_SIZE} />
								<input type="checkbox" id="zakaz_koureni" checked={showZakazKoureni} onChange={(e) => { setShowZakazKoureni(e.target.checked); updateLayers('verejne_wc', e.target.checked) }} /> <label htmlFor="zakaz_koureni">Zobrazit zóny se zákazem kouření</label>
							</div>
						</div>
					</div>
				</Control>}
				<Control prepend position='bottomright'>
					<button className="follow_user_button" onClick={() => { setShouldMove(true); updatePosition(); }}><img src="./icons/current_icon.png" width={32} height={45} alt="vycentrovat"/></button>
				</Control>
			</MapContainer>
			<LoadingScreen enabled={loadingEnabled} />
		</>
	);
}

export default Map;

