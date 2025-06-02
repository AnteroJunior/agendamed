import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async verifyToken(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }

    try {

      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;

      if (!exp) {
        return false;
      } 

      const now = Math.floor(Date.now() / 1000);
      return exp > now;

    } catch (e) {
      return false;
    }
  }

}
