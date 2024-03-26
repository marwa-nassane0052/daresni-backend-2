import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(private readonly authService:AuthService){}
    async canActivate(context: ExecutionContext):Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const admin_id = await this.authService.getAdmin(token)
            request.admin=admin_id  
            return true
          } catch(error) {
            console.error("Error in AuthGuard:", error);
            throw new UnauthorizedException('Unauthorized'); 
          }
    }
    
}