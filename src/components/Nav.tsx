import { Link } from "react-router-dom";
import { Coords } from "../types";
import { LatLng } from "leaflet";
import { MdEditLocationAlt } from "react-icons/md";
import { MdOutlineEditLocation } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";

export interface NavProps {
	coords: LatLng | null;
	address: string | null;
	openPicker: () => void;
	hasRealPosition: boolean;
	setHasRealPosition: (value: boolean) => void;
}

const Nav: React.FC<NavProps> = ({ coords, address, openPicker, hasRealPosition, setHasRealPosition}) => {
	return (
		<nav>
			<div className="menu_itemp">
				<Link to="/" style={{ fontWeight: "bold" }} >Můžu zde...?</Link> | <Link to="/map">Mapa</Link>
			</div>
			<div className="nav_row">
				<div className="location_display">
					<div>{address || "načítání..."}</div>
					<div>{coords?.lat} {coords?.lng}</div>
				</div>
				{hasRealPosition ? <MdEditLocationAlt onClick={openPicker} style={{ cursor: "pointer" }} size={35} /> : <MdMyLocation onClick={() => setHasRealPosition(true)} style={{ cursor: "pointer" }} size={35} />}
			</div>


		</nav>
	);
}

export default Nav;