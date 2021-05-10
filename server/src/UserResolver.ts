import {
	Arg,
	Field,
	Mutation,
	ObjectType,
	Query,
	Resolver
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import { User } from './entity/User';
import { sign } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi!';
	}

	@Query(() => [User])
	users() {
		return User.find();
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

		return true;
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email', () => String) email: string,
		@Arg('password', () => String) password: string
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) throw new Error('Invalid credentials');

		const valid = await compare(password, user.password);

		if (!valid) throw new Error('Invalid credentials');

		return {
			accessToken: sign({ userId: user.id }, 'jdslafjbuaidj', {
				expiresIn: '15m'
			})
		};
	}
}
