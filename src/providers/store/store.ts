import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { isFloat } from "container.ts/lib/validate";
import { ToastController } from "ionic-angular";
import { get, isArray, isString } from "lodash";
import { Observable } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { parseString } from "xml2js";
import { IState } from "../../store";
import * as Calculator from "../../store/calculator";
import * as Currencies from "../../store/currencies";

export interface ICache {
  getResponse?: { time: string; currenciesRates: Currencies.ICurrenciesRates };
  costPriceCurrency?: string;
  salePriceCurrency?: string;
}

@Injectable()
export class StoreProvider {
  @Effect()
  public cacheGetResponseInit$: Observable<Action> = this.actions$.pipe(
    ofType("@ngrx/effects/init"),
    mergeMap(() => this.cacheGetResponse())
  );

  @Effect()
  public cacheCostPriceCurrencyInit$: Observable<Action> = this.actions$.pipe(
    ofType(Currencies.EActions.GetResponse),
    mergeMap((action) => this.cacheCostPriceCurrency(action as Currencies.GetResponse))
  );

  @Effect()
  public cacheSalePriceCurrencyInit$: Observable<Action> = this.actions$.pipe(
    ofType(Currencies.EActions.GetResponse),
    mergeMap((action) => this.cacheSalePriceCurrency(action as Currencies.GetResponse))
  );

  @Effect()
  public currenciesGetRequest$: Observable<Action> = this.actions$.pipe(
    ofType(Currencies.EActions.GetRequest),
    mergeMap(() => this.currenciesGetRequest())
  );

  @Effect()
  public currenciesGetResponse$: Observable<Action> = this.actions$.pipe(
    ofType(Currencies.EActions.GetResponse),
    mergeMap((action) => this.currenciesGetResponse(action as Currencies.GetResponse))
  );

  @Effect()
  public currenciesGetError$: Observable<Action> = this.actions$.pipe(
    ofType(Currencies.EActions.GetError),
    mergeMap((action) => this.currenciesGetError(action as Currencies.GetError))
  );

  @Effect()
  public calculatorSetCostPriceCurrency$: Observable<Action> = this.actions$.pipe(
    ofType(Calculator.EActions.UpdateCostPriceCurrency),
    mergeMap((action) => this.calculatorUpdateCostPriceCurrency(action as Calculator.UpdateCostPriceCurrency))
  );

  @Effect()
  public calculatorSetSalePriceCurrency$: Observable<Action> = this.actions$.pipe(
    ofType(Calculator.EActions.UpdateSalePriceCurrency),
    mergeMap((action) => this.calculatorUpdateSalePriceCurrency(action as Calculator.UpdateSalePriceCurrency))
  );

  public constructor(
    protected readonly http: HttpClient,
    protected readonly storage: Storage,
    protected readonly toastController: ToastController,
    protected readonly store: Store<IState>,
    protected readonly actions$: Actions
  ) {}

  public dispatch<A extends Action = Action>(action: A): void {
    this.store.dispatch<A>(action);
  }

  public select<S>(mapFn: (state: IState) => S): Observable<S> {
    return this.store.select<S>(mapFn);
  }

  protected cacheGetResponse(): Observable<Action> {
    return this.loadCache().pipe(
      map((cache) => {
        if (cache != null && cache.getResponse != null) {
          const today = new Date().toISOString().slice(0, 10);
          if (cache.getResponse.time < today) {
            // Get exchange rates if cache expired.
            return new Currencies.GetRequest();
          }
          // Use cached exchange rates.
          return new Currencies.GetResponse(cache.getResponse);
        }
        // Get exchange rates, not cached.
        return new Currencies.GetRequest();
      })
    );
  }

  protected cacheCostPriceCurrency(action: Currencies.GetResponse): Observable<Action> {
    return this.loadCache().pipe(
      filter((cache) => cache != null && cache.costPriceCurrency != null),
      map((cache) => {
        const value = get(action.payload.currenciesRates, cache.costPriceCurrency, 1).toFixed(4);
        return new Calculator.UpdateCostPriceCurrency({ key: cache.costPriceCurrency, value });
      })
    );
  }

  protected cacheSalePriceCurrency(action: Currencies.GetResponse): Observable<Action> {
    return this.loadCache().pipe(
      filter((cache) => cache != null && cache.salePriceCurrency != null),
      map((cache) => {
        const value = get(action.payload.currenciesRates, cache.salePriceCurrency, 1).toFixed(4);
        return new Calculator.UpdateSalePriceCurrency({ key: cache.salePriceCurrency, value });
      })
    );
  }

  protected currenciesGetRequest(): Observable<Action> {
    // // Proxy API requests in development to fix CORS error.
    // return this.http.get("/api/eurofxref-daily.xml", { responseType: "text" }).pipe(
    return this.http
      .get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", { responseType: "text" })
      .pipe(
        mergeMap((response) => Observable.fromPromise(this.parseXml(response))),
        map((response) => {
          // Extract time and currencies rates data.
          const time: string = get(response, "gesmes:Envelope.Cube.0.Cube.0.$.time", undefined);
          const timeIsValid = time != null && isString(time);
          const data: object[] = get(response, "gesmes:Envelope.Cube.0.Cube.0.Cube", undefined);
          const dataIsValid = data != null && isArray(data);
          if (!timeIsValid || !dataIsValid) {
            throw new Error("Failed to parse currencies rates.");
          }

          // Extract currencies:rates dictionary from data array.
          const currenciesRates: Currencies.ICurrenciesRates = {};
          data.map((value) => {
            const currency: string = get(value, "$.currency", undefined);
            const currencyIsValid = currency != null && isString(currency);
            const rate: string = get(value, "$.rate", undefined);
            const rateIsValid = rate != null && isString(rate);
            if (!currencyIsValid || !rateIsValid) {
              throw new Error("Failed to parse currencies rates.");
            }
            currenciesRates[currency] = isFloat(rate);
          });

          // Currencies rates response action.
          return new Currencies.GetResponse({ time, currenciesRates });
        }),
        catchError((error: any) => {
          return Observable.of(new Currencies.GetError({ error }));
        })
      );
  }

  protected currenciesGetResponse(action: Currencies.GetResponse): Observable<Action> {
    return this.saveCache({ getResponse: action.payload }).pipe(
      map((cache) => {
        this.presentToast(`Exchange rates from ${cache.getResponse.time}.`);
        return { type: "Null" };
      })
    );
  }

  protected currenciesGetError(action: Currencies.GetError): Observable<Action> {
    this.presentToast(`Error getting exchange rates.`);
    return Observable.of({ type: "Null" });
  }

  protected calculatorUpdateCostPriceCurrency(action: Calculator.UpdateCostPriceCurrency): Observable<Action> {
    return this.saveCache({ costPriceCurrency: action.payload.key }).pipe(
      map((cache) => ({ type: "Null" }))
    );
  }

  protected calculatorUpdateSalePriceCurrency(action: Calculator.UpdateSalePriceCurrency): Observable<Action> {
    return this.saveCache({ salePriceCurrency: action.payload.key }).pipe(
      map((cache) => ({ type: "Null" }))
    );
  }

  protected loadCache(): Observable<ICache | undefined> {
    return Observable.fromPromise(this.storage.get("cache"));
  }

  protected saveCache(updateCache: Partial<ICache>): Observable<ICache> {
    return this.loadCache().pipe(
      mergeMap((currentCache) => {
        const cache = { ...currentCache, ...updateCache };
        return Observable.fromPromise(this.storage.set("cache", cache));
      }),
      mergeMap(() => this.loadCache()),
      map((cache) => cache)
    );
  }

  protected parseXml(xml: string): Promise<object> {
    return new Promise((resolve, reject) => {
      parseString(xml, (error: any, result: object) => {
        if (error != null) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  protected presentToast(message: string): void {
    const toast = this.toastController.create({
      message,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }
}
