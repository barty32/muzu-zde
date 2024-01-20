import { Link } from "react-router-dom";
import { DetailType } from "../types";

export interface BigButtonProps {
	text: string;
	action: DetailType;
}

const BigButton: React.FC<BigButtonProps> = ({text, action}) => {
	return <div className="big_button"><Link to={`/detail?type=${action}`}>{text}</Link></div>;
}

export default BigButton;