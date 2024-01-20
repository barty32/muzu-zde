import React, { useEffect, useState } from 'react';
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
import { LatLng } from 'leaflet';
import DetailPage from './pages/DetailPage';

function App() {
	const [coords, setCoords] = useState<LatLng | null>(null)
	const [address, setAddress] = useState<string | null>(null)

	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.watchPosition((position) => {
				const coords = position.coords;
				// console.log(coords);
				// console.log(position.coords.latitude, position.coords.longitude);
				const url = `https://api.mapy.cz/v1/rgeocode?lon=${coords.longitude}&lat=${coords.latitude}&lang=cs&apikey=${MAPYCZ_API_KEY}`;
				fetch(url).then(d => d.json()).then((d) => {
					const crds = new LatLng(coords.latitude, coords.longitude );
					setCoords(crds);

					const addressObject = d["items"][0];
					const fullAddress = `${addressObject["name"]}, ${addressObject["location"]}`;
					setAddress(fullAddress);

					// getNoiseLevel(crds).then((a) => {
					// 	console.log(a);
					// })
				});
			});
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
	}, []);

	// getData().then((val) => {
	// 	console.log(val);
	// });

	return (
		// <div>
			<BrowserRouter>
				<Nav coords={coords} address={address} />
				<main>
					<Routes>
						<Route index element={<HomePage />} />
						<Route path="/map" element={<MapPage coords={coords} address={address} />} />
						<Route path="/detail" element={<DetailPage coords={coords}/>} />
					</Routes>
				</main>
			</BrowserRouter>

		// </div>
	);
}

export default App;
