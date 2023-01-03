import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICountryResponse, IStateResponse } from 'src/app/common/Form';
import { Order } from 'src/app/common/order';
import { Purchase } from 'src/app/common/purchase';
import { ShippingAddress } from 'src/app/common/shipping-address';
import { BillingAddress } from 'src/app/common/billing-address';
import { CartService } from 'src/app/service/cart.service';
import { CheckoutService } from 'src/app/service/checkout.service';
import { FormStaticService } from 'src/app/service/form-static.service';
import { CartValidator } from 'src/app/validators/cart-validator';
import { OrderItem } from 'src/app/common/order-item';
import { Customer } from 'src/app/common/customer';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonth: number[] = [];
  creditCardYears: number[] = [];
  getAllCountries: ICountryResponse[] = [];
  getAllStatesWithCountryCode: IStateResponse[] = [];
  shippingAddressStates: IStateResponse[] = [];
  billingAddressStates: IStateResponse[] = [];

  constructor(private fb: FormBuilder,
    private cartService: CartService,
    private formStatic: FormStaticService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.totalPrice.subscribe((totalPrice) => {
      this.totalPrice = totalPrice;
    });
    this.cartService.totalQuantity.subscribe((totalQuantity) => {
      this.totalQuantity = totalQuantity;
    });
    this.formStatic.getCreditCardMonths().subscribe((month) => {
      this.creditCardMonth = month;
    });
    this.formStatic.getCreditCardYear().subscribe((year) => {
      this.creditCardYears = year;
    });
    this.formStatic.getAllContries().subscribe((countries) => {
      this.getAllCountries = countries;
    });

    this.checkoutFormGroup = this.fb.group({
      customer: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        lastName: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        email: ['', [Validators.required, Validators.email]]
      }),
      shippingAddress: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        city: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]]
      }),
      billingAddress: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        city: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]]
      }),
      creditCard: this.fb.group({
        cardType: ['', [Validators.required]],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), CartValidator.notOnlyWhiteSpace]],
        cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
        securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
        expirationMonth: [''],
        expirationYear: ['']
      })
    })
  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    /**order */
    let order = new Order(this.totalPrice, this.totalQuantity);
    let cartItem = this.cartService.cartItems;

    /*order item */
    let orderItems: OrderItem[] = cartItem.map((obj) => new OrderItem(obj));

    let shippingAddressObj = this.checkoutFormGroup.controls['shippingAddress'].value;
    let shippingAddress = new ShippingAddress(
      shippingAddressObj.street,
      shippingAddressObj.city,
      shippingAddressObj.state.name,
      shippingAddressObj.country.name,
      shippingAddressObj.zipCode
    )

    let billingAddressObj = this.checkoutFormGroup.controls['billingAddress'].value;
    let billingAddress = new BillingAddress(
      billingAddressObj.street,
      billingAddressObj.city,
      billingAddressObj.state.name,
      billingAddressObj.country.name,
      billingAddressObj.zipCode
    )

    let customerObj = this.checkoutFormGroup.controls['customer'].value;
    let customer = new Customer(
      customerObj.firstName,
      customerObj.lastName,
      customerObj.email
    )
    let purchase = new Purchase(customer,
      shippingAddress,
      billingAddress,
      order,
      orderItems);

    let purchaseToString = JSON.stringify(purchase);
    let purchaseToParse = JSON.parse(purchaseToString);
    this.checkoutService.checkout(purchaseToParse).subscribe(
      (res) => {
        console.log(res.orderTrackingNumber);
        this.resetCart();
      },
      err => {
        console.log(err);
      }
    );
  }

  resetCart() {
     this.cartService.cartItems = [];
     this.cartService.totalPrice.next(0);
     this.cartService.totalQuantity.next(0);

     this.checkoutFormGroup.reset();

     this.router.navigateByUrl("/products");
  }

  copyShippingToBillingAddress(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      )
      // bug fix
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    };
  }

  handleMonthYear() {
    const creditCardForm = this.checkoutFormGroup.get("creditCard");
    const currentYear = new Date().getFullYear();

    let startMonth: number;

    const selectedYear = +creditCardForm?.value.expirationYear;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formStatic.getCreditCardMonths(startMonth).subscribe((month) => {
      this.creditCardMonth = month;
    })
  }

  onCountryChange(name: any) {
    const Form = this.checkoutFormGroup.get(name)
    const id = Form?.value.country.id;
    this.formStatic.getStateWithCountryId(id).subscribe((states) => {
      if (name === "shippingAddress") {
        this.shippingAddressStates = states;
      } else {
        this.billingAddressStates = states;
      }
      Form?.get('state')?.setValue(states[0]);
    });
  }

  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName");
  }

  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName");
  }

  get email() {
    return this.checkoutFormGroup.get("customer.email");
  }

  //shipping address

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get("shippingAddress.street");
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get("shippingAddress.city");
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get("shippingAddress.state");
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get("shippingAddress.country");
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get("shippingAddress.zipCode");
  }

  // billing address

  get billingAddressStreet() {
    return this.checkoutFormGroup.get("billingAddress.street");
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get("billingAddress.city");
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get("billingAddress.state");
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get("billingAddress.country");
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get("billingAddress.zipCode");
  }

  // credit card

  get creditCardCardType() {
    return this.checkoutFormGroup.get("creditCard.cardType");
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get("creditCard.nameOnCard");
  }

  get creditCardCardNumber() {
    return this.checkoutFormGroup.get("creditCard.cardNumber");
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get("creditCard.securityCode");
  }

}
