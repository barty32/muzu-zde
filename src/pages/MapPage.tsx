import { LatLng } from "leaflet";
import Map from "../components/Map";
import { Coords } from "../types";
export interface MapPageProps {
	coords: LatLng | null;
	address: string | null;
}

const MapPage: React.FC<MapPageProps> = ({coords, address}) => {
	return (<Map coords={coords} address={address}/>);
}

export default MapPage;