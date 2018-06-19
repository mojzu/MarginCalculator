import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { isFloat } from "container.ts/lib/validate";
import { get, isArray, isString } from "lodash";
import { Observable } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { parseString } from "xml2js";
import { IState } from "../../store";
import * as Currencies from "../../store/currencies";

@Injectable()
export class StoreProvider {
  @Effect()
  public effectsInit$: Observable<Action> = this.actions$.pipe(
    ofType("@ngrx/effects/init"),
    map(() => new Currencies.GetRequest())
  );

  @Effect()
  public currenciesGetRequest$: Observable<Action> = this.actions$.pipe(
    ofType(Currencies.EActions.GetRequest),
    mergeMap(() => this.currenciesGetRequest())
  );

  public constructor(
    protected readonly http: HttpClient,
    protected readonly storage: Storage,
    protected readonly store: Store<IState>,
    protected readonly actions$: Actions
  ) {}

  public dispatch<A extends Action = Action>(action: A): void {
    this.store.dispatch<A>(action);
  }

  public select<S>(mapFn: (state: IState) => S): Observable<S> {
    return this.store.select<S>(mapFn);
  }

  protected currenciesGetRequest(): Observable<Action> {
    // // Proxy API requests in development to fix CORS error.
    // return this.http.get("/api/eurofxref-daily.xml", { responseType: "text" }).pipe(
    return this.http.get("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", { responseType: "text" }).pipe(
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
}
