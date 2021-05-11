import React from 'react';
import ReactDOM from 'react-dom';
import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	ApolloProvider,
	from
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getAccessToken } from './accessToken';
import App from './App';

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

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			);
		});
	}

	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
	link: from([errorLink, authLink.concat(httpLink)]),
	cache: new InMemoryCache(),
	credentials: 'include'
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
