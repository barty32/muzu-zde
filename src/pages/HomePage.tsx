import { LatLng } from "leaflet";
import BigButton from "../components/BigButton";
import { Coords } from "../types";

export interface HomePageProps {
	coords: LatLng | null;
	address: string | null;
}

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<div className="home_wrap">
			<div className="home_column">
				<div>
					<h1>Můžu zde... </h1>
				</div>
				<div className="button_grid">
					<BigButton text="pít alkohol?" />
					<BigButton text="kouřit?" />
					<BigButton text="vyvěsit reklamu?" />
					<BigButton text="pustit psa na volno?" />
				</div>
				{/* <div>
					<h1>Kam můžu... </h1>
				</div> */}
			</div>
		</div>);
}

export default HomePage;