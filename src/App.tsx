import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import Map from './components/Map';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { getPointData } from './data';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import Nav from './components/Nav';
import { MAPYCZ_API_KEY } from './constants';
import { Coords } from './types';
import { LatLng, LatLngTuple } from 'leaflet';
import DetailPage from './pages/DetailPage';
import LoadingScreen from './components/LoadingScreen';
import AboutPage from './pages/AboutPage';
import MapPicker from './components/MapPicker';

function App() {
	const [coords, setCoords] = useState<LatLng | null>(null);
	const [address, setAddress] = useState<string | null>(null);
	const [hasRealPosition, setHasRealPosition] = useState<boolean>(true);
	const hasRealPositionRef = useRef(hasRealPosition);
	hasRealPositionRef.current = hasRealPosition;

	const [watchIds, setWatchIds] = useState<number[]>([]);
	const watchIdRef = useRef(watchIds);
	watchIdRef.current = watchIds;

	const setPosition = (crd: LatLng) => {
		const url = `https://api.mapy.cz/v1/rgeocode?lon=${crd.lng}&lat=${crd.lat}&lang=cs&apikey=${MAPYCZ_API_KEY}`;
		fetch(url).then(d => d.json()).then((d) => {
			const crds = new LatLng(crd.lat, crd.lng);
			setCoords(crds);

			const addressObject = d["items"][0];
			const fullAddress = `${addressObject["name"]}, ${addressObject["location"]}`;
			setAddress(fullAddress);
			console.log("setting position");
			// getNoiseLevel(crds).then((a) => {
			// 	console.log(a);
			// })
		});
	}
	const positionCallback: PositionCallback = (position) => {
		if(!hasRealPositionRef.current) return;
		const coords = position.coords;
		setPosition(new LatLng(coords.latitude, coords.longitude));
		// console.log(coords);
		// console.log(position.coords.latitude, position.coords.longitude);
	};
	const updatePosition = () => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((pos) => {
				positionCallback(pos);
			}, (err) => { console.warn(err) });
		} else {
			console.warn("Geolocation API not available");
		}
	}
	useEffect(() => {
		// console.log(hasRealPosition);
		if ("geolocation" in navigator) {
			if (hasRealPosition) {
				console.log(watchIdRef.current.length);
				if (watchIdRef.current.length > 0) return;
				updatePosition();
				const wchId = navigator.geolocation.watchPosition(positionCallback);
				console.log(wchId);
				setWatchIds([...watchIdRef.current, wchId]);
			} else {
				console.log(watchIdRef.current)
				if (watchIdRef.current.length == 0) return;
				for (const id of watchIdRef.current) {
					navigator.geolocation.clearWatch(id);
				}
				setWatchIds([]);
			}
		} else {
			console.warn("Geolocation API not available");
		}
		// getNoiseLevel({
		// 	lat: 50.1134656,
		// 	lon: 14.4434947,
		// })

		// getNoiseLevel({
		// 	lat: 50.0996278,
		// 	lon: 14.4460964,
		// })
	}, [hasRealPosition]);

	// getData().then((val) => {
	// 	console.log(val);
	// });

	const [pickerOpened, setPickerOpened] = useState<boolean>(false);

	const openPicker = () => setPickerOpened(true);
	const closePicker = () => setPickerOpened(false);
	return (
		// <div>
		<>
			<BrowserRouter>
				<Nav coords={coords} address={address} openPicker={openPicker} hasRealPosition={hasRealPosition} setHasRealPosition={setHasRealPosition} />
				<main>
					<Routes>
						<Route index element={<HomePage />} />
						<Route path="/map" element={<MapPage coords={coords} address={address} updatePosition={updatePosition} />} />
						<Route path="/detail" element={<DetailPage coords={coords} updatePosition={updatePosition} />} />
						<Route path="/about" element={<AboutPage />} />
					</Routes>
				</main>
			</BrowserRouter>

			<MapPicker closeModal={closePicker} newCoords={coords!} setNewCoords={setPosition} opened={pickerOpened} setHasRealPosition={setHasRealPosition} />
		</>

	);
}

export default App;
