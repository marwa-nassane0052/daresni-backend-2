import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class ProfGuard implements CanActivate{
    constructor(private readonly authService:AuthService){}
    async canActivate(context: ExecutionContext):Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const prof_id = await this.authService.getProf(token)
            request.prof=prof_id  
            return true
          } catch(error) {
            console.error("Error in AuthGuard:", error);
            throw new UnauthorizedException('Unauthorized'); 
          }
    }
    
}