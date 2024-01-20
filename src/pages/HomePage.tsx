import { LatLng } from "leaflet";
import BigButton from "../components/BigButton";
import { Coords, DetailType } from "../types";
import { IoIosBeer } from "react-icons/io";
import { FaSmoking } from "react-icons/fa";

export interface HomePageProps {
	//coords: LatLng | null;
	//address: string | null;
}

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<div className="home_wrap">
			<div className="home_column">
				<div>
					<h1>Můžu zde... </h1>
				</div>
				<div className="button_grid">
					<BigButton text="pít alkohol?" icon={<IoIosBeer />} action={'alkohol'} accentColor="#3f67e0" extraBig={true} />
					<BigButton text="kouřit?" icon={<FaSmoking />} action={'koureni'} accentColor="#5b3fb5" extraBig={true} />
				</div>
				<div>
					<h1>Kde je nejbližší... </h1>
				</div>
				<div className="button_grid">
					<BigButton text="veřejné WC?" action={'verejne_wc'} accentColor="#bf702a" />
					<BigButton text="popelnice na elektro?" action={'kontejner_elektro'} accentColor="#bf702a" />
					<BigButton text="popelnice na kov?" action={'kontejner_kov'} accentColor="#bf702a" />
					<BigButton text="parkovací automat?" action={'park_automat'} accentColor="#bf702a" />
					<BigButton text="nabíjecí stanice pro elektromobily?" action={'nabijeci_stanice'} accentColor="#bf702a" />
					<BigButton text="pítko?" action={'pitko'} accentColor="#bf702a" />
					<BigButton text="parkovací místo pro držitele průkazu ZTP?" action={'park_ztp'} accentColor="#bf702a" />
				</div>
			</div>
		</div>);
}

export default HomePage;