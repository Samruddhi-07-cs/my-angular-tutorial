import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private seller:SellerService) { }
  userSignup(data:object):void{
    console.warn(data)
    this.seller.userSignup

  }
}
