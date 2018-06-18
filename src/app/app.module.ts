import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicStorageModule } from "@ionic/storage";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { CalculatorPage } from "../pages/calculator/calculator";
import { StoreProvider } from "../providers/store/store";
import { initialState, reducers } from "../store";
import { MyApp } from "./app.component";

@NgModule({
  declarations: [MyApp, CalculatorPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers, { initialState }),
    EffectsModule.forRoot([StoreProvider])
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, CalculatorPage],
  providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }, StoreProvider]
})
export class AppModule {}
