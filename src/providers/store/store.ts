import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { isFloat } from "container.ts/lib/validate";
import { ToastController } from "ionic-angular";
import { get, isArray, isString } from "lodash";
import { Observable } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { parseString } from "xml2js";
import { IState } from "../../store";
import * as Currencies from "../../store/currencies";

export interface ICache {
  time: string;
  currenciesRates: Currencies.ICurrenciesRates;
}

@Injectable()
export class StoreProvider {
  @Effect()
  public effectsInit$: Observable<Action> = this.actions$.pipe(
    ofType("@ngrx/effects/init"),
    mergeMap(() => this.effectsInit())
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

  protected effectsInit(): Observable<Action> {
    return this.loadCache().pipe(
      map((cache) => {
        if (cache != null) {
          const today = new Date().toISOString().slice(0, 10);
          if (cache.time < today) {
            // Get exchange rates if cache expired.
            return new Currencies.GetRequest();
          }
          // Use cached exchange rates.
          return new Currencies.GetResponse(cache);
        }
        // Get exchange rates, not cached.
        return new Currencies.GetRequest();
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
    return this.saveCache(action.payload).pipe(
      map((cache) => {
        this.presentToast(`Exchange rates from ${cache.time}.`);
        return { type: "Null" };
      })
    );
  }

  protected currenciesGetError(action: Currencies.GetError): Observable<Action> {
    this.presentToast(`Error getting exchange rates.`);
    return Observable.of({ type: "Null" });
  }

  protected loadCache(): Observable<ICache | undefined> {
    return Observable.fromPromise(this.storage.get("cache"));
  }

  protected saveCache(cache: ICache): Observable<ICache> {
    return Observable.fromPromise(this.storage.set("cache", cache)).pipe(map(() => cache));
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
