import { LatLng } from "leaflet";
import Zone from "../components/Zone";
import { DetailType, ZoneType } from "../types";
import POIList from "../components/POIList";

export interface DetailPageProps {
	coords: LatLng | null;
}

const DetailPage: React.FC<DetailPageProps> = ({coords}) => {

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
			return <POIList coords={coords} type={type} />
			
		default:
			return <div>Nerozpoznaný typ (chyba v aplikaci).</div>
	}
}

export default DetailPage;