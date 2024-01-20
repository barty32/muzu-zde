import { LatLng } from "leaflet";
import { POI, PointType, ZoneType } from "../types";
import { formatDistance, getAlcoholAllowed, getDistance, getPointData, getSmokingAllowed } from "../data";
import { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { MAPYCZ_API_KEY } from "../constants";


export interface POIRowProps {
	coords: LatLng;
	// distance: number;
	poi: POI;
	// showMore: (numOfElements: number) => void;
}

const POIRow: React.FC<POIRowProps> = ({ coords, poi }) => {

	const [address, setAddress] = useState('');

	// useEffect(() => {
	// 	//ckeck location
	// 	getPointData(type).then((val) => {
	// 		if (val) {
	// 			val.sort((a, b) => {
	// 				return getDistance(coords, a.coords) - getDistance(coords, b.coords);
	// 			});
	// 			setStatus(val);
	// 		}
	// 	});

	// }, [coords]);

	// if (!status.length) return <div>Nebyly nalezeny žádné body zájmu.</div>
	useEffect(() => {		
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
	}, [poi]);

	return (
		<tr>
			<td>{(formatDistance(getDistance(coords, poi.coords) * 1000))}</td>
			<td>{address}</td>
			<td><u>mapa</u></td>
		</tr>
	);
}

export default POIRow;