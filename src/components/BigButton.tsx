import { Link } from "react-router-dom";
import { DetailType } from "../types";
import { useState } from "react";

export interface BigButtonProps {
	text: string;
	icon?: JSX.Element;
	action: DetailType;
	accentColor: string;
	extraBig?: boolean;
}

// https://gist.github.com/danieliser/b4b24c9f772066bcf0a6
const convertHexToRGBA = (hexCode: string, opacity = 1) => {
	let hex = hexCode.replace('#', '');

	if (hex.length === 3) {
		hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	/* Backward compatibility for whole number based opacity values. */
	if (opacity > 1 && opacity <= 100) {
		opacity = opacity / 100;
	}

	return `rgba(${r},${g},${b},${opacity})`;
};

const BigButton: React.FC<BigButtonProps> = ({ text, icon, action, accentColor, extraBig = false }) => {
	const opaqueAccentColor = convertHexToRGBA(accentColor, 0.1);
	const targetColor = convertHexToRGBA(accentColor, 0.9);
	const [style, setStyle] = useState<React.CSSProperties>({ borderColor: accentColor, backgroundColor: opaqueAccentColor });

	return <div className="big_button" style={{ height: extraBig ? "350px" : "200px" }} onMouseEnter={() => setStyle({ ...style, backgroundColor: targetColor, color: "#eee" })} onMouseLeave={() => setStyle({ ...style, backgroundColor: opaqueAccentColor, color: "black" })}><Link to={`/detail?type=${action}`} style={style} >{icon != null && <div className="big_button_icon">{icon}</div>}{text}</Link></div>;
}

export default BigButton;