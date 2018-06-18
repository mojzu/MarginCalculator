import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IState } from "../../store";
import * as Currencies from "../../store/currencies";

@Injectable()
export class StoreProvider {
  @Effect()
  public init$: Observable<Action> = this.actions$.pipe(
    ofType("@ngrx/effects/init"),
    // TODO(M): Caching handling here?
    map(() => new Currencies.GetRequest())
  );

  public constructor(
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
}
