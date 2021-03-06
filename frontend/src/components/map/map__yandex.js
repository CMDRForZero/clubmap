import React, {useEffect, useState} from 'react';

import { Map, YMaps, GeolocationControl, Placemark } from "react-yandex-maps";
import Form from "./form";
import BContentFooter from "./bcontentFooter";
import ActivePlacemark from "./active-placemark"
import usePostEvent from "../../hooks/usePostEvent";
import {usePlacemark} from "../../hooks/usePlacemark";
//import useFetch from "../../hooks/useFetch";

const Mapyandex = () => {
	const {placemarks, savePlacemark} = usePlacemark();
	//const [placemarks, savePlacemark] = useState([]);
	const [ymaps, setYmaps] = useState(null);
	const [cords, setCords] = useState(null);
	const [modalProps, setModalProps] = useState({});
	const [isModelShown, setIsModelShown] = useState(false);
	const {postEvent} = usePostEvent();

	useEffect(async () => {
		const response = fetch("/api/events/").then(response => response.json()).then(item => {
			item.forEach(element => {
				let myPlacemark = createPlacemark([element.cordX, element.cordY], element.name, element.desk, element.type, element.id);
				savePlacemark(placemarks => ([...placemarks, ...myPlacemark]));
			})
		});
	}, []);

	const onSubmit = () => {
		console.log('onSubmit true')
	}
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition((pos) => setCords([pos.coords.latitude, pos.coords.longitude]), (e) => console.log(e));
	} else {
		console.log("Not Available");
	}

	 const showModal = () => {
	setIsModelShown(true)

	};
	const closeModal = () => {
		setIsModelShown(false)
	};
	const onKeyDown = (event) => {
		if (event.keyCode === 27) {
			closeModal();
		}
	};
	const onClickOutside = (event) => {
		if (this.modal && this.modal.contains(event.target)) return;
	       closeModal();
	};

	const toggleScrollLock = () => {
		document.querySelector('html').classList.toggle('scroll-lock');
	};
	return (
		<div className="map__yandex" id="map">
			<YMaps>
				<Map
					width="100%" height="100%"
					defaultState={{ center: [55.753994, 37.622093], zoom: 9 }}
					onLoad={ymaps => setYmaps(ymaps)}
					onClick={click}
					modules={[
						'templateLayoutFactory',
						'geoObject.addon.balloon',
						'clusterer.addon.balloon',
					]}
				>
					{placemarks.map((pm) => {
						return <ActivePlacemark key={pm.properties.eventID} geometry={pm.geometry}
																		ymaps={ymaps}
																		balloonContent={<div><div>{pm.properties.iconCaption}</div> <div>{pm.properties.balloonContentBody}</div> <BContentFooter eventID={pm.properties.eventID} editPlacemark={editPlacemark} delitePlacemark={delitPlacemark}/></div>}
																		properties={pm.properties}
																		options={pm.options}
						/>
					})}
					<GeolocationControl options={{ float: 'left' }} />
					{cords && <Placemark geometry={cords} options={{preset: 'islands#blueCircleDotIcon'}}/>}
				</Map>
			</YMaps>
			{/*<Form/>*/}

			{isModelShown? (
				<Form props = {modalProps}/>
			) : null}
		</div>
	);

	async function click(e) {
		var cX = e.get('clientX')
		var cY = e.get('clientY')
		var coords = e.get('coords');
		var address = '';
		await fetch('https://geocode-maps.yandex.ru/1.x?'+ new URLSearchParams({geocode:coords.join(','),format:'json',sco: 'latlong', apikey:'e6e0ef67-816b-47fe-80db-17ec2ec7828e'}))
			.then(response => {
				const contentType = response.headers.get('content-type');
				if (!contentType || !contentType.includes('application/json')) {
					throw new TypeError("Oops, we haven't got JSON!");
				}
				return response.json();
			})
			.then(response => address = response.response.GeoObjectCollection.featureMember[0].GeoObject.name)
      console.log(address)
		setModalProps({
			clickX: cX,
			clickY: cY,
			cordX: coords[0],
			cordY: coords[1],
			address: address,
			type: "kokt",
			name: "",
			desk: "",
			closeModal: closeModal,
			createPlacemark: createPlacemarkFromModal
		})
		setIsModelShown(true)
	}
	function createPlacemarkFromModal(cordX, cordY, name, desk, type, eventID, categories) {
		//alert(name + desk)
		postEvent({cordX: cordX, cordY: cordY, name: name, desk: desk, type: type})
			.then(data => {
				eventID = data.id;
				let myPlacemark = createPlacemark([cordX, cordY], name, desk, type, eventID);
				savePlacemark(placemarks => ([...placemarks, ...myPlacemark]));
			});
	}




	function updatePlacemark(cordX, cordY, name, desk, type, eventID, categories) {
		const updateObject = placemarks.find(element => element.properties.eventID === eventID);
		updateObject.properties.name = name;
		updateObject.properties.desk = desk;
		updateObject.properties.type = type;
		fetch("/api/events/" + eventID, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({cordX: cordX, cordY: cordY, name: name, desk: desk, type: type})
		}).then(res => res.json())
			.then(() => {
				savePlacemark(placemarks.filter(element => element.properties.eventID !== i));
				savePlacemark(placemarks => ([...placemarks, ...updateObject]));
			})
	}

	function editPlacemark(e, i) {
		console.log("???????? ????????????????????????????");
		console.log(e);
		console.log(i);
		let frontEventID = i;
		let ID = placemarks.find(element => element.properties.eventID == frontEventID);
		var cX = e['clientX'];
		var cY = e['clientY'];
		setModalProps({
			clickX: cX,
			clickY: cY,
			cordX: ID['geometry'][0],
			cordY: ID['geometry'][1],
			type: ID['properties']['tapy'],
			name: ID['properties']['iconCaption'],
			desk: ID['properties']['balloonContentBody'],
			eventID: frontEventID,
			closeModal: closeModal,
			createPlacemark: updatePlacemark
		})
		setIsModelShown(true)
		//savePlacemark(placemarks.map(item => item.properties.eventID === frontEventID ? ID : item))

		// ?????? ???????????????????? ?????????????????? ????????
		// ???? ???????????? ???????????????? ?? ?????????????????? ????????, ?????? ???? ?????????????????????? ???????????????????????? ??????????????
	}
	function delitPlacemark (e, i){
		fetch("/api/events/" + i, {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json'
			},
			body: null
		})
			.then(response => response.json());

		// ?????? ???????????? ???????????????? index ?????????????? ???? ???????? ??????????????
		// ???????????????? ?????????????? ?????????????????? ??????????????
		savePlacemark(placemarks.filter(element => element.properties.eventID !== i));
		console.log(placemarks);
		setYmaps(ymaps);
	}

	function createPlacemark(coords, name, ballon, tapy, eventID) {   //onClick
		// ?????????? ???????????????? ?????????????????? ????????????, ???????? ???? ?????????????????????? ?????????????????????? ??????????, ???? ???? ???????????? ???? ????????????????????????
		// savePlacemark(placemarks=>({
		//    ...placemarks,
		//    [index]: ???????????????????? ??????????????
		// }))
	//	return new ymaps.Placemark(coords, {
		return {
			geometry: coords,
			properties: {
			//  balloonContentHeader:'<div class="place"><img src="place1.png" class="place1"></div>', name,
			balloonContentHeader:['<div class="place"><img src="/img/place1.png" class="place1" alt="??????????">' + name + '</div>'].join(''),
			iconCaption: name,
			balloonContentBody: ballon,
				tapy: tapy,
				eventID: eventID

		}, options: {
			iconLayout: 'default#image',
			iconImageHref: '/img/'+ tapy +'.png',
			iconImageSize: [55, 67],
			iconImageOffset: [-20, -48]
			// preset: 'islands#violetDotIconWithCaption',
			// draggable: false
		},
			modules:
				['geoObject.addon.balloon', 'geoObject.addon.hint', 'templateLayoutFactory',]

	};
	}

}


export default Mapyandex;
