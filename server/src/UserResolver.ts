import {
	Arg,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuthMiddleware';
import { sendRefreshToken } from './sendRefreshToken';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;

	@Field(() => User)
	user: User;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi!';
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(@Ctx() { payload }: MyContext) {
		return `your user id is ${payload!.userId}`;
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() context: MyContext) {
		const authorization = context.req.headers['authorization'];

		if (!authorization) return null;

		try {
			const token = authorization.split(' ')[1];
			const payload: any = verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!
			);
			return User.findOne(payload.userId);
		} catch (err) {
			console.log(err);
			return null;
		}
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
		@Arg('password', () => String) password: string,
		@Ctx() { res }: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) throw new Error('Invalid credentials');

		const valid = await compare(password, user.password);

		if (!valid) throw new Error('Invalid credentials');

		sendRefreshToken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user
		};
	}

	@Mutation(() => Boolean)
	async revokeRefreshTokenForUser(@Arg('userId', () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1);

		return true;
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: MyContext) {
		sendRefreshToken(res, '');
		return true;
	}
}
