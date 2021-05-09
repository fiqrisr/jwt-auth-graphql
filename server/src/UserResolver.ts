import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { hash } from 'bcryptjs';
import { User } from './entity/User';

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi!';
	}

	@Mutation(() => Boolean)
	async register(
		@Arg('email', () => String) email: string,
		@Arg('password', () => String) password: string
	) {
		const hashedPassowrd = await hash(password, 12);

		try {
			await User.insert({
				email,
				password: hashedPassowrd
			});
		} catch (err) {
			console.log(err);
			return false;
		}
	}
}
