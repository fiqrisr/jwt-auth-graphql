import { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRegisterMutation } from 'src/generated/graphql';

const Register: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [register] = useRegisterMutation();

	return (
		<form
			action="post"
			onSubmit={async e => {
				e.preventDefault();
				const response = await register({
					variables: {
						email,
						password
					}
				});

				console.log(response);
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
			<button type="submit">register</button>
		</form>
	);
};

export default Register;
