import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { MarginCalculatorPage } from "../pages/margin-calculator/margin-calculator";
import { MyApp } from "./app.component";

@NgModule({
  declarations: [MyApp, MarginCalculatorPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, MarginCalculatorPage],
  providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
