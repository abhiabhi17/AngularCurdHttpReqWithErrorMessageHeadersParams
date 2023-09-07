import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../model/Product";
import { Subject, map,catchError, throwError } from "rxjs";

@Injectable({providedIn:"root"})
export class ProductService
{

  //Created firfox database for trail .
  error=new Subject<string>() // Error to display to component with subject 

  constructor(private http:HttpClient){}

  createProduct(products:{pName:string,desc:string,price:string})
  {
    const headers=new HttpHeaders({'myHeader':'abhi'}); //creating of headers
this.http.post('https://angularhttp-a8876-default-rtdb.firebaseio.com/products.json',
products,{headers:headers}).subscribe((res)=>
{ console.log(res);} ,  
(err)=>{
    this.error.next(err.message);

}
)
  }

  //---------------- Fecting the product------------------//
  fetchProduct()
  {
    const header=new HttpHeaders()
    .set('content-type','application.json') // Headers
    .set('Access-control-Allow-origin','*')

    const params=new HttpParams().set('print','pretty');// params to print the json pretty in response headers
    
return this.http.get<{[key:string]:Product}>('https://angularhttp-a8876-default-rtdb.firebaseio.com/products.json',
                                    {'headers':header,params:params})
              .pipe(map((res)=>{
                const products:any[]=[];
                for(const key in res)
                {
                    products.push({...res[key],id:key})
                }
                return products;
              }),catchError((err)=>{
                //write the logic for logging
                 return throwError(err);
              }))
  }
//-----------------------Delete product based on id-------------------//
  deleteProduct(id:string)
  {
    let header=new HttpHeaders();
    header=header.append('myHeader1','value1');
    header=header.append('myHeader2','value2'); //As headers are immutable we useed let 

    this.http.delete('https://angularhttp-a8876-default-rtdb.firebaseio.com/products/'+id+'.json',{headers:header}).subscribe();
  }

  //------------------- Delete all products------------------------//
  deleteAllProducts()
  {
    this.http.delete('https://angularhttp-a8876-default-rtdb.firebaseio.com/products.json').subscribe();
  }

  //------------------------------updating the product based on Id---------------------//
  
  updateProduct(id:string,value:Product)
  {
    this.http.put('https://angularhttp-a8876-default-rtdb.firebaseio.com/products/'+id+'.json',value).subscribe();
  }
}