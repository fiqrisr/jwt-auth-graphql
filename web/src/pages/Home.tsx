import { useUsersQuery } from 'src/generated/graphql';

const Home: React.FC = () => {
	const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

	if (!data) return <div>loading...</div>;

	return (
		<div>
			<div>Users:</div>
			<ul>
				{data.users.map(user => (
					<li key={user.id}>
						{user.email}, {user.id}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
