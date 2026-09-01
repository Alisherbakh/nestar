import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthMember = createParamDecorator((data: string, context: ExecutionContext | any) => {
	// createParamDecorator orqali yangi decorator hosil qilinyabdi
	let request: any;
	if (context.contextType === 'graphql') {// context type tekshirilyabdi graphQL
		request = context.getArgByIndex(2).req;
		if (request.body.authMember) {// request ni body qismidan authmember ni malumotlarini olinyabdi
			request.body.authMember.authorization = request.headers?.authorization;
		}
	} else request = context.switchToHttp().getRequest();

	const member = request.body.authMember; // qiymatni member bilan qaytaryabmiz

	if (member) return data ? member?.[data] : member;
	// data mavjud bolsa talab etilgan datani qaytaradi, bolmasam toliq memberni 
	else return null;
});
