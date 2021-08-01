import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/header/header';
import Main from './components/main/main';
import Map from './components/map/map';
import Footer from './components/footer/footer';

const Wrapper = () => {
	return (
		<Router>
			<Fragment>
				<Header/>
				<Route path="/" component={ Main } exact/>
				<Route path="/map" component={ Map } exact/>
				<Footer/>
			</Fragment>
		</Router>
	);
}

ReactDOM.render(<Wrapper/>, document.getElementById('wrapper'));