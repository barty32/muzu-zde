import { LatLng } from "leaflet";
import { POI, PointType } from "../types";
import { getDistance, getPointData } from "../data";
import { useEffect, useState } from "react";
import POIRow from "./POIRow";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import Map from "./Map";


export interface POIListProps {
	type: PointType;
	coords: LatLng;
	updatePosition: () => void;
}

const POIList: React.FC<POIListProps> = ({ type, coords, updatePosition }) => {

	const [status, setStatus] = useState<POI[]>([]);
	const [numElements, setNumElements] = useState(10);

	const [mapModalOpen, setMapModalOpen] = useState(false);

	const [activeItem, setActiveItem] = useState<POI | null>(null);

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

	}, [coords, type]);

	const showMore = (numOfElements = 10) => {
		setNumElements(numElements + numOfElements);
	}

	const onMapOpened = (element: POI) => {
		setActiveItem(element);
		setMapModalOpen(true);
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

	const tableHeaders = ['Vzdálenost', 'Ulice'];

	if (type === 'park_automat') {
		tableHeaders.push('Kód', 'Zóna');
	}
	else if (type === 'park_ztp') {
		tableHeaders.push('Počet');
	}
	else if (type === 'nabijeci_stanice') {
		tableHeaders.push('Provozovatel');
	}
	else if (type.includes('kontejner')) {
		tableHeaders.push(/*'Typ kontejneru', */'Četnost vývozu');
	}

	if (!status.length) return <div>Nebyly nalezeny žádné body zájmu.</div>

	return (
		<div className={`poi_list_wrapper`}>
			<button className="poi_show_all"><Link to={`/map?map_layers=${type}`}>Zobrazit vše na mapě</Link></button>
			<h1>{fancyNameMap[type]}</h1>
			<table className="poi_table">
				<thead>
					<tr>
						{
							tableHeaders.map((k, i) => {
								return <th key={i}>{k}</th>
							})
						}
					</tr>
				</thead>
				{status.slice(0, numElements).map((k, i) => (
					<POIRow key={k.id} coords={coords} poi={k} onMapOpened={onMapOpened} fontSize={((40 - 1.5 * i) > 20 ? (40 - 1.5 * i) : 20)} />
				))}
			</table>
			{numElements < status.length && <button onClick={() => showMore()} className="more_button">Další</button>}


			<Modal
				isOpen={mapModalOpen}
				onRequestClose={() => setMapModalOpen(false)}
				style={{ content: { display: 'flex', flexDirection: 'column', gap: '10px' }, overlay: { zIndex: 1200 } }}
				contentLabel="Example Modal"
			>
				<div className="modal_header">
					<h2>Mapa</h2>
					<button className="modal_close" onClick={() => setMapModalOpen(false)}>&times;</button>
				</div>
				<div className="modal_map_wrapper">
					<Map coords={activeItem?.coords!} updatePosition={updatePosition} activeLayers={[activeItem?.type!]} updateLayers={() => { }} showLayerBox={false} markerTitle="" />
				</div>
			</Modal>

		</div>
	);
}

export default POIList;