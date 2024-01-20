import { LatLng } from "leaflet";
import { ZoneType } from "../types";
import { getAlcoholAllowed, getSmokingAllowed } from "../data";
import { useEffect, useState } from "react";

export interface ZoneProps {
	type: ZoneType;
	coords: LatLng;
}

const Zone: React.FC<ZoneProps> = ({ type, coords }) => {

	const [status, setStatus] = useState('unknown');

	useEffect(() => {
		//ckeck location
		switch (type) {
			case 'alkohol':
				getAlcoholAllowed(coords).then((val) => {
					if (!val) {
						setStatus('allowed');
					}
					else {
						setStatus('prohibited');
					}
				});
				break;
			case 'koureni':
				getSmokingAllowed(coords).then((val) => {
					if (!val) {
						setStatus('allowed');
					}
					else {
						setStatus('prohibited');
					}
				});
				break;
		}

	}, [coords]);

	return (
		<div className={`zone_wrapper ${status}`}>
			{/* <Link to={`/detail?type=${action}`}>{text}</Link> */}
			<p style={{textAlign: "center"}}>{ status }</p>
		</div>
	);
}

export default Zone;