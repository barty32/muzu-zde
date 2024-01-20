import { BallTriangle } from "react-loader-spinner";
interface LoadingScreenProps {
	enabled: boolean;
}
const LoadingScreen: React.FC<LoadingScreenProps>= ({enabled}) => {
	if(!enabled) return null;
	return (<div className="loading_screen">
		<BallTriangle
			height={100}
			width={100}
			radius={5}
			color="#4fa94d"
			ariaLabel="ball-triangle-loading"
			visible={true}
		/>
	</div>);
}

export default LoadingScreen;