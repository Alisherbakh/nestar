import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    private readonly logger: Logger = new Logger();
   // kirdi chiqdi malumotlarni terminalga chiroyli chiqarish mumkun Logger


  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now(); // kirib kelgan vaqti
    const requestType = context.getType<GqlContextType>(); // kirib kelgan requestlarni typeni aniqlash uchun
    

    if (requestType === 'http'){
        /*  Develop if needed */
    } else if (requestType === 'graphql'){
        /* (1) Print Request */

        const gqlContext = GqlExecutionContext.create(context);
        this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');

        /* (2) if there is error, error handling via GraphQL, and stop here */

        /* (3) if no Errors, giving Response below */

        return next.handle().pipe(
        tap((context) => {
            const responseTime = Date.now() - recordTime; // chop etish vaqti( hozrgi vaqtdan - kirib kelgan vaqt)
            this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE'); // dolya sekund
        }), 
      );

    }
    
  }

  private stringify(context: ExecutionContext): string {
    return JSON.stringify(context).slice(0,75);
  }
}