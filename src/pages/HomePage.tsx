import BigButton from "../components/BigButton";
import { IoIosBeer } from "react-icons/io";
import { FaSmoking } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaToiletPaper } from "react-icons/fa";
import { FaCarBattery } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChargingStation } from "react-icons/fa";
import { FaHandHoldingWater } from "react-icons/fa";
import { TbDisabled } from "react-icons/tb";
import { GiMetalBar } from "react-icons/gi";

export interface HomePageProps {
	//coords: LatLng | null;
	//address: string | null;
}

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<>
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
						<BigButton text="popelnice na elektro?" action={'kontejner_elektro'} accentColor="#d91a3a" icon={<FaCarBattery />} />
						<BigButton text="popelnice na kov?" action={'kontejner_kov'} accentColor="#bf702a" icon={<GiMetalBar />} />
						<BigButton text="nabíjecí stanice pro elektromobily?" action={'nabijeci_stanice'} accentColor="#548c31" icon={<FaChargingStation />} />
						<BigButton text="parkovací automat?" action={'park_automat'} accentColor="#17161c" icon={<FaParking />} />
						<BigButton text="parkovací místo pro ZTP?" action={'park_ztp'} accentColor="#bf702a" icon={<TbDisabled />} />
						<BigButton text="veřejné WC?" action={'verejne_wc'} accentColor="#888" icon={<FaToiletPaper />} />
						<BigButton text="pítko?" action={'pitko'} accentColor="#2f92cc" icon={<FaHandHoldingWater />} />
					</div>
				</div>
			</div>
			<footer><div>Made by Hackneme.to (<a href="https://janstaffa.cz">janstaffa.cz</a> + <a href="https://barty.cz">barty.cz</a>).</div><div><Link to="/about">O aplikaci</Link></div></footer>
		</>
	);
}

export default HomePage;