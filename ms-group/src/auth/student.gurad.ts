import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class StudentGurad implements CanActivate{
    constructor(private readonly authService:AuthService){}
    async canActivate(context: ExecutionContext):Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const student_id = await this.authService.getStudent(token)
            request.student=student_id 
            return true
          } catch(error) {
            console.error("Error in AuthGuard:", error);
            throw new UnauthorizedException('Unauthorized'); 
          }
    }
    
}