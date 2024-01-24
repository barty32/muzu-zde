import { LatLng } from "leaflet";
import Zone from "../components/Zone";
import { DetailType } from "../types";
import POIList from "../components/POIList";

export interface DetailPageProps {
	coords: LatLng | null;
	updatePosition: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({coords, updatePosition}) => {

	if (!coords) {
		return <div>Poloha není k dispozici.</div>
	}

	const query = new URLSearchParams(document.location.search);

	const type = query.get('type') as DetailType;

	switch (type) {
		case 'alkohol':
		case 'koureni':
		case 'volny_pohyb_psu':
			return <Zone coords={coords} type={type} />
		
		case 'verejne_wc':
		case 'pitko':
		case 'park_automat':
		case 'park_ztp':
		case 'nabijeci_stanice':
		case 'kontejner_elektro':
		case 'kontejner_kov':
			return <POIList coords={coords} type={type} updatePosition={updatePosition}/>
			
		default:
			return <div>Nerozpoznaný typ.</div>
	}
}

export default DetailPage;