import { Link } from "react-router-dom";
import { Coords } from "../types";
import { LatLng } from "leaflet";

export interface NavProps {
	coords: LatLng | null;
	address: string | null;
}

const Nav: React.FC<NavProps> = ({ coords, address }) => {
	return (
		<nav>
			<div className="menu_itemp">
				<Link to="/" style={{fontWeight: "bold"}} >Můžu zde?</Link> | <Link to="/map">Mapa</Link>
			</div>
			<div className="location_display">
				<div>{address || "načítání..."}</div>
				<div>{coords?.lat} {coords?.lng}</div>
			</div>
		</nav>
	);
}

export default Nav;