import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICountryResponse, IState, IStateResponse } from 'src/app/common/Form';
import { CartService } from 'src/app/service/cart.service';
import { FormStaticService } from 'src/app/service/form-static.service';
import { CartValidator } from 'src/app/validators/cart-validator';

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
    private formStatic: FormStaticService
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
    console.log(this.checkoutFormGroup.get('customer')?.value);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
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
