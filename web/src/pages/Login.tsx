import { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { setAccessToken } from 'src/accessToken';
import { useLoginMutation } from 'src/generated/graphql';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login] = useLoginMutation();

	return (
		<form
			action="post"
			onSubmit={async e => {
				e.preventDefault();
				const response = await login({
					variables: {
						email,
						password
					}
				});

				console.log(response);

				if (response && response.data) {
					setAccessToken(response.data.login.accessToken);
				}

				history.push('/');
			}}
		>
			<div>
				<input
					value={email}
					placeholder="email"
					type="email"
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			<div>
				<input
					value={password}
					placeholder="password"
					type="password"
					onChange={e => setPassword(e.target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	);
};

export default Login;
