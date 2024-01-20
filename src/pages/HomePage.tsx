import { LatLng } from "leaflet";
import BigButton from "../components/BigButton";
import { Coords, DetailType } from "../types";

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
					<BigButton text="pít alkohol?" action={'alkohol'}/>
					<BigButton text="kouřit?" action={'koureni'}/>
					{/* <BigButton text="vyvěsit reklamu?" action={'re'}/> */}
					<BigButton text="pustit psa na volno?" action={'volny_pohyb_psu'}/>
				</div>
				<div>
					<h1>Kde je nejbližší... </h1>
				</div>
				<div className="button_grid">
					<BigButton text="veřejné WC?" action={'verejne_wc'}/>
					<BigButton text="popelnice na elektro?" action={'kontejner_elektro'}/>
					<BigButton text="popelnice na kov?" action={'kontejner_kov'}/>
					<BigButton text="parkovací automat?" action={'park_automat'}/>
					<BigButton text="nabíjecí stanice pro elektromobily?" action={'nabijeci_stanice'} />
					<BigButton text="pítko?" action={'pitko'} />
					<BigButton text="parkovací místo pro držitele průkazu ZTP?" action={'park_ztp'} />
				</div>
			</div>
		</div>);
}

export default HomePage;