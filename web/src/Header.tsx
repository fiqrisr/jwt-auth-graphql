import { Link } from 'react-router-dom';
import { setAccessToken } from './accessToken';
import { useLogoutMutation, useMeQuery } from './generated/graphql';

const Header: React.FC = () => {
	const { data, loading } = useMeQuery();
	const [logout, { client }] = useLogoutMutation();

	let body = null;

	if (loading) body = null;
	else if (data && data.me)
		body = <div>you are logged in as: {data.me.email}</div>;
	else body = <div>not logged in</div>;

	return (
		<header>
			<div>
				<Link to="/">Home</Link>
			</div>
			<div>
				<Link to="/register">Register</Link>
			</div>
			<div>
				<Link to="/login">Login</Link>
			</div>
			<div>
				<Link to="/bye">Bye</Link>
			</div>
			{!loading && data && data.me ? (
				<div>
					<button
						onClick={async () => {
							await logout();
							setAccessToken('');
							await client?.resetStore();
						}}
					>
						logout
					</button>
				</div>
			) : null}
			{body}
		</header>
	);
};

export default Header;
