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
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { getAccessToken, setAccessToken } from './accessToken';
import App from './App';

const httpLink = createHttpLink({
	uri: 'http://localhost:4000/graphql',
	credentials: 'include'
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

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		const token = getAccessToken();

		if (!token) return true;

		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const { exp } = jwtDecode(token);

			if (Date.now() >= exp * 1000) return false;

			return true;
		} catch {
			return false;
		}
	},
	fetchAccessToken: () => {
		return fetch('http://localhost:4000/refresh_token', {
			method: 'POST',
			credentials: 'include'
		});
	},
	handleFetch: accessToken => {
		setAccessToken(accessToken);
	},
	handleError: err => {
		console.warn('Your refresh token is invalid. Try to relogin');
		console.error(err);
	}
});

const client = new ApolloClient({
	link: from([tokenRefreshLink, errorLink, authLink.concat(httpLink)]),
	cache: new InMemoryCache()
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
