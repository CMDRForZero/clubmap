import React from 'react';
import { Link } from 'react-router-dom';



const Menulist = () => {
	return (
		<ul className="menu__list">
			<li><a href="#for-who" className="menu__link">Для кого</a></li>
			<li><a href="#how" className="menu__link">Как пользоваться</a></li>
			<li><a href="#questions" className="menu__link">Вопросы</a></li>
			<li><Link to="/map" className="menu__link">Карта мероприятий</Link></li>
		</ul>
	);
}


export default Menulist;