import { LatLng } from "leaflet";
import Map from "../components/Map";
import { DetailType } from "../types";
import { useSearchParams } from "react-router-dom";
export interface MapPageProps {
	coords: LatLng | null;
	address: string | null;
	updatePosition: () => void;
}

const MapPage: React.FC<MapPageProps> = ({ coords, address, updatePosition }) => {

	const [query, setQuery] = useSearchParams();

	const updateLayers = (layer: DetailType, val: boolean) => {
		let mapLayers = query.get('map_layers')?.split(',') || [];
		if (val) {
			//enable layer
			if (layer && !mapLayers.includes(layer)) mapLayers.push(layer);
		}
		else {
			//disable layer
			mapLayers = mapLayers.filter((name) => {
				return (name === layer) ? false : true;//mapLayers.splice(i, 1);
			})
		}
		query.set('map_layers', mapLayers.join(','));
		setQuery(query);
	}
	// const query = new URLSearchParams(document.location.search);
	const mapLayers = query.get('map_layers')?.split(',') || [];

	return (<div style={{ height: "100%", position: "relative", overflow: "hidden" }}><Map coords={coords} updatePosition={updatePosition} activeLayers={mapLayers} updateLayers={updateLayers} showLayerBox={ true } markerTitle="Vaše poloha" /></div>);
}

export default MapPage;