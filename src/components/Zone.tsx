import { LatLng } from "leaflet";
import { ZoneType } from "../types";
import { getAlcoholAllowed, getFullNameOfZoneType, getSmokingAllowed } from "../data";
import { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";


export interface ZoneProps {
	type: ZoneType;
	coords: LatLng;
}

const Zone: React.FC<ZoneProps> = ({ type, coords }) => {

	const [status, setStatus] = useState('unknown');
	const [distanceFromBan, setDistanceFromBan] = useState<number | null>(null);
	const [fullNameOfBan, setFullNameOfBan] = useState<string | null>(null);

	useEffect(() => {
		//ckeck location
		switch (type) {
			case 'alkohol':
				getAlcoholAllowed(coords).then((val) => {
					if (!val) {
						setStatus('allowed');
					}
					else {
						setDistanceFromBan(parseInt(val["distance"]));
						setFullNameOfBan(getFullNameOfZoneType(val["type"], true));
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
						setDistanceFromBan(parseInt(val["distance"]));
						setFullNameOfBan(getFullNameOfZoneType(val["type"], true));
						setStatus('prohibited');
					}
				});
				break;
		}

	}, [coords]);

	return (
		<div className={`zone_wrapper ${status}`}>
			{/* <Link to={`/detail?type=${action}`}>{text}</Link> */}
			{status == "allowed" ? (
				<div>
					<FaThumbsUp fontSize={200} />
					<h2>Povoleno!</h2>
					<p>Na tomto místě není zakázáno {type == "alkohol" ? "pít alkohol" : type == "koureni" ? "kouřit" : ""} podle {type == "alkohol" ?`§ 44 odst. 3
						písm. a) zákona č. 131/2000 Sb.` : "zákona č. 65/2017 Sb."}</p>
						<i>(mohou platit lokální zákazy)</i>
				</div>
			) : status == "prohibited" ? (
				<div>
					<FaThumbsDown fontSize={200} />
					<h2>Zákaz</h2>
					<p>Na tomto místě je zakázáno {type == "alkohol" ? "pít alkohol" : type == "koureni" ? "kouřit" : ""}.</p>
					<b>Nacházíte se v okruhu {distanceFromBan} metrů od {fullNameOfBan}.</b>
				</div>
			) : <div><FaQuestion fontSize={200} /></div>
			}
		</div>
	);
}

export default Zone;