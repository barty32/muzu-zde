import { Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import { MAPYCZ_API_URL, MAX_MAP_ZOOM, MIN_MAP_ZOOM, PRAGUE_CENTER, STARTING_MAP_ZOOM } from "../constants";
import { PRAHA_BORDER } from "../praha_border";
import { Icon, LatLng, LatLngTuple } from "leaflet";
import { useState } from "react";
import Modal from 'react-modal';

export interface MapPickerProps {
	newCoords: LatLng;
	setNewCoords: (value: LatLng) => void;
	opened: boolean;
	closeModal: () => void;
	setHasRealPosition: (value: boolean) => void;
}

export interface SetViewProps {
	setNewCoords: (value: LatLng) => void;
	setHasRealPosition: (value: boolean) => void;
}
const SetView: React.FC<SetViewProps> = ({ setNewCoords, setHasRealPosition }) => {
	const map = useMap();

	map.on('click', (e) => {
		const coord = e.latlng;
		const lat = coord.lat;
		const lng = coord.lng;
		setNewCoords(new LatLng(lat, lng));
		setHasRealPosition(false);
		console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
	});

	return null;
};

const MapPicker: React.FC<MapPickerProps> = ({ newCoords, setNewCoords, opened, closeModal, setHasRealPosition }) => {
	const current_marker_icon = new Icon({ iconUrl: "./icons/current_icon.png", iconSize: [32, 45], iconAnchor: [16, 45] });

	return (

		<Modal
			isOpen={opened}
			//onAfterOpen={afterOpenModal}
			onRequestClose={() => closeModal()}
			style={{ content: { display: 'flex', flexDirection: 'column', gap: '10px' }, overlay: { zIndex: 1200 } }}
			contentLabel="Example Modal"
		>
			<div className="modal_header">
				<h2>Mapa</h2>
				<button className="modal_close" onClick={() => closeModal()}>&times;</button>
			</div>
			<div className="modal_map_wrapper">
				<MapContainer className="map" center={PRAGUE_CENTER} zoom={STARTING_MAP_ZOOM} maxZoom={MAX_MAP_ZOOM} minZoom={MIN_MAP_ZOOM}>
					<TileLayer
						// url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
						url={MAPYCZ_API_URL}
					/>
					<Polyline positions={PRAHA_BORDER} color="black" />
					<Marker position={newCoords} icon={current_marker_icon}>
					</Marker>
					{/* <CircleMarker center={userCoords} radius={2} /> */}
					<SetView setNewCoords={setNewCoords} setHasRealPosition={setHasRealPosition} />
				</MapContainer>
			</div>
		</Modal>
	);
}

export default MapPicker;