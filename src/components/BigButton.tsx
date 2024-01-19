export interface BigButtonProps {
	text: string;
}

const BigButton: React.FC<BigButtonProps> = ({text}) => {
	return <div className="big_button"><button>{text}</button></div>;
}

export default BigButton;