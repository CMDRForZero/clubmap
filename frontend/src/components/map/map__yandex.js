import React, { useState } from 'react';

import { Map, YMaps } from "react-yandex-maps";
import Form from "./form";
import BContentFooter from "./bcontentFooter";
import ActivePlacemark from "./active-placemark";

const Mapyandex = () => {
	const [placemarks, setPlacemarks] = useState([]);
	const [ymaps, setYmaps] = useState(null);
	const [modalProps, setModalProps] = useState({});
	const [isModelShown, setIsModelShown] = useState(false);
	const onSubmit = () => {
		console.log('onSubmit true')
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
					{placemarks.map((pm, i) => {

						return <ActivePlacemark key={i} geometry={pm.geometry}
																		ymaps={ymaps}
																		balloonContent={<div><div>{pm.properties.iconCaption}</div> <div>{pm.properties.balloonContentBody}</div> <BContentFooter i={i} editPlacemark={editPlacemark} delitePlacemark={delitPlacemark}/></div>}
																		properties={pm.properties}
																		options={pm.options}
						/>
					})}
				</Map>
			</YMaps>
			{/*<Form/>*/}

			{isModelShown? (
				<Form props = {modalProps}/>
			) : null}
		</div>
	);

	function click(e) {
		var cX = e.get('clientX')
		var cY = e.get('clientY')
		var coords = e.get('coords');
		setModalProps({
			clickX: cX,
			clickY: cY,
			cordX: coords[0],
			cordY: coords[1],
			type: "kokt",
			name: "1231",
			desk: "123",
			closeModal: closeModal,
			createPlacemark: createPlacemarkFromModal
		})
		setIsModelShown(true)
	}
	function createPlacemarkFromModal(cordX, cordY, name, desk, type) {
		//alert(name + desk)
		let myPlacemark = createPlacemark([cordX, cordY], name, desk, type);
		setPlacemarks([...placemarks, myPlacemark]);
	}
	function editPlacemark(e, i) {
		console.log("идет редактирование")
		console.log(e)
		console.log(i)
		console.log(placemarks)
		var cX = e['clientX']
		var cY = e['clientY']
		setModalProps({
			clickX: cX,
			clickY: cY,
			cordX: placemarks[i]['geometry'][0]+0.001,
			cordY: placemarks[i]['geometry'][1]+0.001,
			type: placemarks[i]['properties']['tapy'],
			name: placemarks[i]['properties']['iconCaption'],
			desk: placemarks[i]['properties']['balloonContentBody'],
			closeModal: closeModal,
			createPlacemark: createPlacemarkFromModal
		})
		setIsModelShown(true)
		setPlacemarks(placemarks.splice(i, 1))

		// тут показываем модальной окно
		// мы должны передать в модальное окно, что мы редактируем существующий элемент
	}
	function delitPlacemark (e, i){
		//e.preventDefault()
		// тут должен приходит index который мы хоти удалить
		// удаление работае следующий образом
		console.log(i)
		 setPlacemarks(placemarks.splice(i, 1))
		console.log(placemarks)
		setYmaps(ymaps);
	}
	function createPlacemark(coords, name, ballon, tapy) {   //onClick
		// здесь приходит некоторый индекс, если мы редактируем существущую точку, то мы должны ее перезаписать
		// setPlacemarks(placemarks=>({
		//    ...placemarks,
		//    [index]: измененный элемент
		// }))
	//	return new ymaps.Placemark(coords, {
		return {
			geometry: coords,
			properties: {
			//  balloonContentHeader:'<div class="place"><img src="place1.png" class="place1"></div>', name,
			balloonContentHeader:['<div class="place"><img src="/img/place1.png" class="place1" alt="метка">' + name + '</div>'].join(''),
			iconCaption: name,
			balloonContentBody: ballon,
				tapy: tapy

		}, options: {
			iconLayout: 'default#image',
			iconImageHref: '/img/'+ tapy +'.png',
			iconImageSize: [35, 47],
			iconImageOffset: [-19, -44]
			// preset: 'islands#violetDotIconWithCaption',
			// draggable: false
		},
			modules:
				['geoObject.addon.balloon', 'geoObject.addon.hint', 'templateLayoutFactory',]

	};
	}
}


export default Mapyandex;
