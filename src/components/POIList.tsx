import { LatLng } from "leaflet";
import { POI, PointType, ZoneType } from "../types";
import { formatDistance, getAlcoholAllowed, getDistance, getPointData, getSmokingAllowed } from "../data";
import { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import POIRow from "./POIRow";
import { Link } from "react-router-dom";


export interface POIListProps {
	type: PointType;
	coords: LatLng;
}

const POIList: React.FC<POIListProps> = ({ type, coords }) => {

	const [status, setStatus] = useState<POI[]>([]);
	const [numElements, setNumElements] = useState(10);

	useEffect(() => {
		//ckeck location
		getPointData(type).then((val) => {
			if (val) {
				val.sort((a, b) => {
					return getDistance(coords, a.coords) - getDistance(coords, b.coords);
				});
				setStatus(val);
			}
		});

	}, [coords]);

	const showMore = (numOfElements = 10) => {
		setNumElements(numElements + numOfElements);
	}

	const fancyNameMap: { [key: string]: string } = {
		'kontejner_elektro': 'Místa zpětného odběru elektroodpadu',
		'kontejner_kov': 'Kontejnery na kovy',
		'verejne_wc': 'Veřejné toalety',
		'park_automat': 'Parkovací automaty',
		'nabijeci_stanice': 'Nabíjecí stanice pro elektromobily',
		'pitko': 'Pítka',
		'park_ztp': 'Parkovací místa pro držitele ZTP',
	}

	if (!status.length) return <div>Nebyly nalezeny žádné body zájmu.</div>

	return (
		<div className={`poi_list_wrapper`}>
			<h1>{fancyNameMap[type]}</h1>
			<button><Link to={`/map?map_layers=${type}`}>Zobrazit vše na mapě</Link></button>
			<table>
				<tr>
					<td>Vzdálenost</td>
					<td>Adresa</td>
					<td>Mapa</td>
				</tr>
				{status.slice(0, numElements).map((k, i) => (
					<POIRow key={k.id} coords={coords} poi={k}/>
				))}
			</table>
			{numElements < status.length && <button onClick={() => showMore()}>Zobrazit víc</button>}
			{/* {status == "allowed" ? (
				<div>
					<FaThumbsUp fontSize={200} />
					<h2>Povoleno!</h2>
					<p>Na tomto místě je povoleno {type == "alkohol" ? "pít alkohol" : type == "koureni" ? "kouřit" : ""}.</p>
				</div>
			) : status == "prohibited" ? (
				<div>
					<FaThumbsDown fontSize={200} />
					<h2>Zákaz</h2>
					<p>Na tomto místě je zakázáno {type == "alkohol" ? "pít alkohol" : type == "koureni" ? "kouřit" : ""}.</p>
				</div>
			) : <div><FaQuestion fontSize={200} /></div> */}
			
		</div>
	);
}

export default POIList;