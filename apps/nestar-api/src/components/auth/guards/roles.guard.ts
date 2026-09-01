import { BadRequestException, CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Message } from 'apps/nestar-api/src/libs/enums/common.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		// reflector orqali biz yuklagan roles larni ham chaqirib olayabdi
		// qaysi meta data foydalana olishi mumkunligini korsatilgan @Roles da
		if (!roles) return true;

		console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);

		if (context.contextType === 'graphql') { // context type check
			const request = context.getArgByIndex(2).req; // request ni qolga olib olayabmiz
			const bearerToken = request.headers.authorization;
			// request ni header dan authorizationi qabul qilayabmiz
			if (!bearerToken) throw new BadRequestException(Message.TOKEN_NOT_EXIST);

			const token = bearerToken.split(' ')[1],
			// beaerToken ni split qilb, bitta joy tashab , keyingi contextni qabul qilinyabdi
				authMember = await this.authService.verifyToken(token),
				hasRole = () => roles.indexOf(authMember.memberType) > -1,
				// @Roles da ruhsat berilgan typelar bilan, authmember typeni solishtirayabdi
				hasPermission: boolean = hasRole();

			if (!authMember || !hasPermission) throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);

			console.log('memberNick[roles] =>', authMember.memberNick);
			request.body.authMember = authMember;
			return true;
		}

		// description => http, rpc, gprs and etc are ignored
		return true;
	}
}
