import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WithoutGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		console.info('--- @guard() Authentication [WithoutGuard] ---');

		if (context.contextType === 'graphql') {
			const request = context.getArgByIndex(2).req,
				bearerToken = request.headers.authorization;

			if (bearerToken) {
				try {
					const token = bearerToken.split(' ')[1],
						authMember = await this.authService.verifyToken(token);
					request.body.authMember = authMember;
		// auth bolgan bolsa, requestga auth member malumotlarini joylab beradi
				} catch (err) {
					request.body.authMember = null;
					// auth bolmagan bolsa ham, auth member malumotlarni null qilib qaytarvoradi
				}
			} else request.body.authMember = null;
// auth bolmagan bolsa ham, auth member malumotlarni null qilib qaytarvoradi(otkazib yuboradi)
			console.log('memberNick[without] =>', request.body.authMember?.memberNick ?? 'none');
			return true;
		}// auth bolsa ham, bolmasa ham keyingi mantiqga otkazib yuboradi

		// description => http, rpc, gprs and etc are ignored
		return true;
	}
}
