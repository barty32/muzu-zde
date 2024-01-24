import { LatLng } from "leaflet";
import { POI } from "../types";
import { formatDistance, getDistance } from "../data";
import { useEffect, useState } from "react";
import { MAPYCZ_API_KEY } from "../constants";
import { FaMapMarkedAlt } from "react-icons/fa";


export interface POIRowProps {
	coords: LatLng;
	// distance: number;
	poi: POI;
	// showMore: (numOfElements: number) => void;
	onMapOpened: (element: POI) => void;
	fontSize: number;
}

const POIRow: React.FC<POIRowProps> = ({ coords, poi, onMapOpened, fontSize }) => {

	const data: string[] = [];
	const [address, setAddress] = useState('');

	useEffect(() => {
		switch (poi.type) {
			case 'verejne_wc':
			case 'park_ztp':
			case 'kontejner_kov':
			case 'kontejner_elektro':
				const url = `https://api.mapy.cz/v1/rgeocode?lon=${poi.coords.lng}&lat=${poi.coords.lat}&lang=cs&apikey=${MAPYCZ_API_KEY}`;
				fetch(url).then(d => d.json()).then((d) => {
					if (d["items"].length < 1) {
						setAddress('-');
						return;
					};
					const addressObject = d["items"][0];
					const fullAddress = `${addressObject["name"]}, ${addressObject["location"]}`;
					setAddress(fullAddress);
				});
		}
	}, [poi]);

	data[0] = address;

	switch (poi.type) {
		case 'kontejner_kov':
		case 'kontejner_elektro':
			//data[1] = poi.extraData['CONTAINERTYPE'];
			data[1] = poi.extraData['CLEANINGFREQUENCYCODE'];
			break;

		case 'park_automat':
			data[0] = poi.extraData['STREET'];
			data[1] = poi.extraData['CODE'];
			data[2] = poi.extraData['PX'];
			break;

		case 'park_ztp':
			data[1] = poi.extraData['POCET_PS'];
			break;

		case 'nabijeci_stanice':
			data[0] = poi.extraData['AddressInfo'];
			data[1] = poi.extraData['OperatorInfo'];
			break;

		case 'pitko':
			data[0] = poi.extraData['TITLE'];
			break;
	}

	return (
		<tr style={{ fontSize }}>
			<td>{(formatDistance(getDistance(coords, poi.coords) * 1000))}</td>
			{data.map((k, i) => {
				return <td key={i}>{k}</td>
			})}
			<td><button onClick={() => onMapOpened(poi)} className="show_map_button"><FaMapMarkedAlt size={30} /></button></td>
		</tr>
	);
}

export default POIRow;