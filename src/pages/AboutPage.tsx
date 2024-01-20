import MapPicker from "../components/MapPicker";

export interface AboutPageProps { }

const AboutPage: React.FC<AboutPageProps> = () => {
	return (<div className="blog_wrap">
		<div className="blog">
			<h1>O aplikaci</h1>
			<h2>Použité datové sady</h2>

			<ol>
				<li>Zastávky PID</li>
				<li>Školská zařízení v Praze</li>
				<li>Zdravotní zařízení v Praze</li>
				<li>Veřejné toalety</li>
				<li>Stanoviště tříděného odpadu - položky</li>
				<li>Parkovací automaty</li>
				<li>Elektrické nabíjecí stanice pro auta</li>
				<li>Vyhrazená parkovací stání pro držitele průkazu ZTP</li>
			</ol>
		</div>
	</div>);
}

export default AboutPage;