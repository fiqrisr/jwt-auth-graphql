import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Routes: React.FC = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" render={() => <div>yo</div>} />
			</Switch>
		</BrowserRouter>
	);
};

export default Routes;
