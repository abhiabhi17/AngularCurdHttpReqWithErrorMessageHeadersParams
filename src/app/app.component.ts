import { HttpClient, HttpHandler, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Product } from './model/Product';
import { ProductService } from './services/product.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'ANGULARHTTPREQUEST1';

  allProducts:Product[]=[];//to display allproducts to template
  isFetching:boolean=false; // display loading message while fetching the data
  editMode:boolean=false; // when we click on edit button 
  currentProductId:string|any; //to get currentProductId for update
  errorMessage:string|any; //to dispaly eroroMessage to template
  errorSub:Subscription|any; // to unsubsrcibe the subcribed errorMessage
 @ViewChild ('productsForm')form:NgForm | any; // to access the form we use NGFORM 
  constructor(private http:HttpClient,private productService:ProductService){}

  ngOnInit() {
  this.fetchProducts; //on load for displaying prodcuts
  this.productService.error.subscribe((message)=>{
this.errorMessage=message;
  });
  }

        // ---------- For Fetching the products ------------//
  onProductsFetch()
  {
    this.fetchProducts();
  }

 // ---------- For adding the products ------------//
  onProductCreate(products:{pName:string,desc:string,price:string})

  {
    if(!this.editMode) // if edit mode is false then create
this.productService.createProduct(products);
else
 this.productService.updateProduct(this.currentProductId,products);//if edit mode is true then update
this.form.setValue({ // this is used to set values to default when we click on add products
  pName:'',
  desc:'',
  price:''
})
  }

 // ---------- For Fetching the products ------------//
  private fetchProducts()
  {
    this.isFetching=true;
   this.productService.fetchProduct().subscribe((products)=>{
    this.allProducts=products;
    this.isFetching=false;
   },(err)=>{
    this.errorMessage=err.message;
   })
  }
  
   // ---------- For delete the products  based on id------------//
  onDeleteProduct(id:string)
  {
    this.productService.deleteProduct(id);
  }
   // ---------- For Deleting all the products ------------//
  deleteAllProducts()
  {
   this.productService.deleteAllProducts();
  }

   // ---------- For Edit the products and update  ------------//
  onEditClicked(id:string)
  {
    this.currentProductId=id;
    // Get the product based on id
   let currentProdct=this.allProducts.find((p)=>{ return  p.id === id;})

   //populate the form with the product details

   this.form.setValue({
    pName:currentProdct?.pName,
    desc:currentProdct?.desc,
    price:currentProdct?.price
   })


   //change the button value to update product
    this.editMode=true;
  }

  //-------- Error sub is subscribed now here we are destory
  ngOnDestroy(): void {
    this.errorSub.unsubcribe();
  }
}