import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/react-hooks';
import Routes from './Routes';
import { getAccessToken } from './accessToken';

const httpLink = createHttpLink({
	uri: 'http://localhost:4000/graphql'
});

const authLink = setContext((_, { headers }) => {
	const accessToken = getAccessToken();

	return {
		headers: {
			...headers,
			authorization: accessToken ? `Bearer ${accessToken}` : ''
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	credentials: 'include'
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Routes />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
