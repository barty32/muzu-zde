import { LatLng, map } from "leaflet";
import Map from "../components/Map";
import { Coords, DetailType } from "../types";
import { useSearchParams } from "react-router-dom";
export interface MapPageProps {
	coords: LatLng | null;
	address: string | null;
	updatePosition: () => void;
}

const MapPage: React.FC<MapPageProps> = ({ coords, address, updatePosition }) => {

	const [query, setQuery] = useSearchParams();

	const updateLayers = (layer: DetailType, val: boolean) => {
		const mapLayers = query.get('map_layers')?.split(',') || [];
		if (val) {
			if (layer && !mapLayers.includes(layer)) mapLayers.push(layer);
		}
		else {
			mapLayers.filter((name, i) => {
				if (name == layer) mapLayers.splice(i, 1);
			})
		}
		query.set('map_layers', mapLayers.join(','));
		setQuery(query);
	}
	// const query = new URLSearchParams(document.location.search);
	const mapLayers = query.get('map_layers')?.split(',') || [];

	return (<Map coords={coords} address={address} updatePosition={updatePosition} activeLayers={mapLayers} updateLayers={updateLayers} />);
}

export default MapPage;