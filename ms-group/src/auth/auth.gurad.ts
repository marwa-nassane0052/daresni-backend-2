import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly authService:AuthService){}
    async canActivate(context: ExecutionContext):Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const message = await this.authService.checkAuth(token)
            if(message){
                return true
            }
            return false
           
            
          } catch(error) {
            console.error("Error in AuthGuard:", error);
            throw new UnauthorizedException('Unauthorized'); 
          }
    }
    
}