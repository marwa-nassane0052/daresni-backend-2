import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import axios from 'axios';
@Injectable()
export class AuthService {
    async checkAuth(token:string):Promise<any>{
        const data=await axios.post("http://localhost:3000/auth/verify",{},{
            headers: {
                Authorization: token,
              }
        })
        
        return data;
        
    }
    async getAdmin(token:string){
        const data=await axios.get("http://localhost:3000/auth/user/admin",{
            headers: {
                Authorization: token,
              }
        })
        return data.data.id

    }

    async getProf(token:string){
        const data=await axios.get("http://localhost:3000/auth/user/prof",{
            headers: {
                Authorization: token,
              }
        })
        return data.data
    }

    async getStudent(token:string){
        const data=await axios.get("http://localhost:3000/auth/user/student",{
            headers: {
                Authorization: token,
              }
        })
        return data.data
    }
}
