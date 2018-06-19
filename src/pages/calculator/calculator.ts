import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController } from "ionic-angular";
import { get, has } from "lodash";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { StoreProvider } from "../../providers/store/store";
import * as Calculator from "../../store/calculator";
import * as Currencies from "../../store/currencies";

export interface ICurrencyCode {
  key: string;
  label: string;
}

export interface ICurrencySelect {
  label: string;
  value: string;
}

const currencyCodeTable: ICurrencyCode[] = [
  { key: "GBP", label: "GBP - Pound Sterling" },
  { key: "USD", label: "USD - US Dollar" },
  { key: "EUR", label: "EUR - Euro" },
  { key: "AUD", label: "AUD - Australian Dollar" },
  { key: "BGN", label: "BGN - Bulgarian Lev" },
  { key: "BRL", label: "BRL - Brazilian Real" },
  { key: "CAD", label: "CAD - Canadian Dollar" },
  { key: "CHF", label: "CHF - Swiss Franc" },
  { key: "CNY", label: "CNY - Yuan Renminbi" },
  { key: "CZK", label: "CZK - Czech Koruna" },
  { key: "DKK", label: "DKK - Danish Krone" },
  { key: "HKD", label: "HKD - Hong Kong Dollar" },
  { key: "HRK", label: "HRK - Kuna" },
  { key: "HUF", label: "HUF - Forint" },
  { key: "IDR", label: "IDR - Rupiah" },
  { key: "ILS", label: "ILS - New Israeli Sheqel" },
  { key: "INR", label: "INR - Indian Rupee" },
  { key: "JPY", label: "JPY - Yen" },
  { key: "KRW", label: "KRW - Won" },
  { key: "MXN", label: "MXN - Mexican Peso" },
  { key: "MYR", label: "MYR - Malaysian Ringgit" },
  { key: "NOK", label: "NOK - Norwegian Krone" },
  { key: "NZD", label: "NZD - New Zealand Dollar" },
  { key: "PHP", label: "PHP - Philippine Peso" },
  { key: "PLN", label: "PLN - Zloty" },
  { key: "RON", label: "RON - Romanian Leu" },
  { key: "RUB", label: "RUB - Russian Ruble" },
  { key: "SEK", label: "SEK - Swedish Krona" },
  { key: "SGD", label: "SGD - Singapore Dollar" },
  { key: "THB", label: "THB - Baht" },
  { key: "TRY", label: "TRY - Turkish Lira" },
  { key: "ZAR", label: "ZAR - Rand" }
];

@Component({
  selector: "page-calculator",
  templateUrl: "calculator.html"
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorPage implements OnDestroy {
  public readonly form: FormGroup;
  public readonly currenciesRates$: Observable<ICurrencySelect[]>;

  protected readonly unsubscribe$ = new Subject<void>();
  protected rates: Currencies.ICurrenciesRates = {};

  public constructor(
    protected readonly formBuilder: FormBuilder,
    protected readonly navCtrl: NavController,
    protected readonly store: StoreProvider
  ) {
    this.form = this.formBuilder.group({
      costPrice: [null, Validators.min(0)],
      costPriceCurrency: [null],
      costPriceCurrencyRate: [null, Validators.min(0)],
      salePrice: [null, Validators.min(0)],
      salePriceCurrency: [null],
      salePriceCurrencyRate: [null, Validators.min(0)],
      margin: [null, Validators.min(0)],
      markup: [null, Validators.min(0)],
      discount: [null, Validators.min(0)],
      discountedSalePrice: [null],
      discountedMargin: [null],
      discountedMarkup: [null]
    });
    this.store
      .select((state) => state.calculator)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((calculator) => {
        this.form.setValue(calculator.display);
      });

    this.currenciesRates$ = this.store.select((state) => state.currencies.currenciesRates).pipe(
      map((currenciesRates) => {
        this.rates = currenciesRates;
        const selectItems: ICurrencySelect[] = [];
        currencyCodeTable.map((item) => {
          if (has(currenciesRates, item.key)) {
            selectItems.push({ label: item.label, value: item.key });
          }
        });
        return selectItems;
      })
    );
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onResetClick(): void {
    this.store.dispatch(new Calculator.Reset());
  }

  public onCostPriceChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateCostPrice({ value }));
    }
  }

  public onCostPriceCurrencyChange(key?: string): void {
    if (key != null) {
      const value = get(this.rates, key, 1).toFixed(4);
      this.store.dispatch(new Calculator.UpdateCostPriceCurrency({ key, value }));
    }
  }

  public onCostPriceCurrencyRateChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateCostPriceCurrencyRate({ value }));
    }
  }

  public onSalePriceChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateSalePrice({ value }));
    }
  }

  public onSalePriceCurrencyChange(key?: string): void {
    if (key != null) {
      const value = get(this.rates, key, 1).toFixed(4);
      this.store.dispatch(new Calculator.UpdateSalePriceCurrency({ key, value }));
    }
  }

  public onSalePriceCurrencyRateChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateSalePriceCurrencyRate({ value }));
    }
  }

  public onMarginChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateMargin({ value }));
    }
  }

  public onMarkupChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateMarkup({ value }));
    }
  }

  public onDiscountChange(event?: object): void {
    const value = get(event || {}, "target.value", undefined);
    if (value != null) {
      this.store.dispatch(new Calculator.UpdateDiscount({ value }));
    }
  }
}
