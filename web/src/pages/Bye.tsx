import { useByeQuery } from 'src/generated/graphql';

const Bye: React.FC = () => {
	const { data, loading, error } = useByeQuery({
		fetchPolicy: 'network-only'
	});

	if (loading) return <div>loading...</div>;

	if (error) {
		return <div>error</div>;
	}

	if (!data) return <div>no data</div>;

	return <div>{data.bye}</div>;
};

export default Bye;
