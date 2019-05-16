import 'package:flutter/material.dart';
import 'package:scoped_model/scoped_model.dart';
import 'package:http/http.dart' as http;
import 'package:xml/xml.dart' as xml;

class Currency {
  Currency(this.code, this.text, this.rate);
  String code;
  String text;
  String rate;
}

class CalculatorModel extends Model {
  CalculatorModel();

  static CalculatorModel of(BuildContext context) =>
      ScopedModel.of<CalculatorModel>(context);

  List<Currency> _currencies = [];
  String _costPrice = "";
  String _costPriceCurrency = "EUR";
  String _salePrice = "";
  String _salePriceCurrency = "EUR";
  String _margin = "";
  String _markup = "";
  String _discount = "";

  List<Currency> get currencies => _currencies;
  String get costPrice => _costPrice;
  Currency get costPriceCurrency => _getCurrency(_costPriceCurrency);
  String get salePrice => _salePrice;
  Currency get salePriceCurrency => _getCurrency(_salePriceCurrency);
  String get margin => _margin;
  String get markup => _markup;
  String get discount => _discount;

  reset() {
    print("TODO: Reset");
    _costPrice = "";
    _salePrice = "";
    _margin = "";
    _markup = "";
    _discount = "";
    notifyListeners();
  }

  setCostPrice(String value) {
    _costPrice = value;
    notifyListeners();
  }

  setCostPriceCurrency(String value) {
    _costPriceCurrency = value;
    notifyListeners();
  }

  setCostPriceCurrencyRate(String value) {
    _setCurrencyRate(_costPriceCurrency, value);
    notifyListeners();
  }

  setSalePrice(String value) {
    _salePrice = value;
    notifyListeners();
  }

  setSalePriceCurrency(String value) {
    _salePriceCurrency = value;
    notifyListeners();
  }

  setSalePriceCurrencyRate(String value) {
    _setCurrencyRate(_salePriceCurrency, value);
    notifyListeners();
  }

  setMargin(String value) {
    _margin = value;
    notifyListeners();
  }

  setMarkup(String value) {
    _markup = value;
    notifyListeners();
  }

  setDiscount(String value) {
    _discount = value;
    notifyListeners();
  }

  _defaultCurrenciesRates() {
    _currencies = [
      Currency("EUR", "Euro (EUR)", "1.0000"),
      Currency("GBP", "Pound Sterling (GBP)", "0.86250"),
      Currency("USD", "US Dollar (USD)", "1.1230"),
      Currency("JPY", "Yen (JPY)", "123.25"),
      Currency("BGN", "Bulgarian Lev (BGN)", "1.9558"),
      Currency("CZK", "Czech Koruna (CZK)", "25.732"),
      Currency("DKK", "Danish Krone (DKK)", "7.4658"),
      Currency("HUF", "Forint (HUF)", "323.52"),
      Currency("PLN", "Zloty (PLN)", "4.2960"),
      Currency("RON", "Romanian Leu (RON)", "4.7598"),
      Currency("SEK", "Swedish Krona (SEK)", "10.8108"),
      Currency("CHF", "Swiss Franc (CHF)", "1.1378"),
      Currency("ISK", "Icelandic Krona (ISK)", "137.00"),
      Currency("NOK", "Norwegian Krone (NOK)", "9.8193"),
      Currency("HRK", "Kuna (HRK)", "7.4090"),
      Currency("RUB", "Russian Ruble (RUB)", "73.3493"),
      Currency("TRY", "Turkish Lira (TRY)", "6.8837"),
      Currency("AUD", "Australian Dollar (AUD)", "1.6059"),
      Currency("BRL", "Brazilian Real (BRL)", "4.4405"),
      Currency("CAD", "Canadian Dollar (CAD)", "1.5132"),
      Currency("CNY", "Yuan Renminbi (CNY)", "7.6628"),
      Currency("HKD", "Hong Kong Dollar (HKD)", "8.8135"),
      Currency("IDR", "Rupiah (IDR)", "16177.38"),
      Currency("ILS", "New Israeli Sheqel (ILS)", "4.0004"),
      Currency("INR", "Indian Rupee (INR)", "78.6075"),
      Currency("KRW", "Won (KRW)", "1325.32"),
      Currency("MXN", "Mexican Peso (MXN)", "21.5589"),
      Currency("MYR", "Malaysian Ringgit (MYR)", "4.6781"),
      Currency("NZD", "New Zealand Dollar (NZD)", "1.7025"),
      Currency("PHP", "Philippine Peso (PHP)", "58.722"),
      Currency("SGD", "Singapore Dollar (SGD)", "1.5305"),
      Currency("THB", "Baht (THB)", "35.464"),
      Currency("ZAR", "Rand (ZAR)", "15.9762"),
    ];
  }

  // TODO: Currency conversion support.
  Future<void> fetchCurrenciesRates() async {
    _defaultCurrenciesRates();
    notifyListeners();

    // final response = await http
    //     .get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
    // if (response.statusCode == 200) {
    //   final document = xml.parse(response.body);
    //   print(document.findAllElements("Cube"));
    // } else {
    //   print("TODO: Handle fetch failure");
    //   print(response.body);
    // }
  }

  Currency _getCurrency(String code) {
    for (var currency in _currencies) {
      if (currency.code == code) {
        return currency;
      }
    }
    return null;
  }

  _setCurrencyRate(String code, String rate) {
    for (var currency in _currencies) {
      if (currency.code == code) {
        currency.rate = rate;
      }
    }
  }
}
