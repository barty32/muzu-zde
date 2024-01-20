export interface GenericTableProps {
	data: object;
	included_keys?: string[];
}

const GenericTable: React.FC<GenericTableProps> = ({ data, included_keys = null }) => {
	const rows = [];
	for (const [key, value] of Object.entries(data)) {
		if (included_keys == null || included_keys.includes(key)) {
			rows.push(<tr key={key}><td>{key}</td><td>{value}</td></tr>);
		}
	}
	return <table className="generic_table">{rows.map(r => r)}</table>;
}

export default GenericTable;