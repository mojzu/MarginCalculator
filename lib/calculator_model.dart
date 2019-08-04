import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:xml/xml.dart' as xml;
import 'package:shared_preferences/shared_preferences.dart';

class Currency {
  Currency(this.code, this.text, this.rate);
  String code;
  String text;
  String rate;
}

enum _Action {
  Reset,
  SetCostPrice,
  SetCostPriceCurrency,
  SetSalePrice,
  SetSalePriceCurrency,
  SetMargin,
  SetMarkup,
  SetDiscount,
}

const explainNothingHere = "Nothing here... awkward turtle-duck.";
const explainYouDidThis = "You did this!";

class CalculatorModel with ChangeNotifier {
  CalculatorModel();

  static CalculatorModel of(BuildContext context) => Provider.of<CalculatorModel>(context);

  String _date = "2019-08-02";
  List<Currency> _currencies = [];
  String _costPrice = "";
  double _costPriceValue = double.nan;
  String _costPriceCurrency = "EUR";
  double _costPriceCurrencyRate = double.nan;
  String _salePrice = "";
  double _salePriceValue = double.nan;
  String _salePriceCurrency = "EUR";
  double _salePriceCurrencyRate = double.nan;
  String _margin = "";
  double _marginValue = double.nan;
  String _markup = "";
  double _markupValue = double.nan;
  String _discount = "";
  double _discountValue = double.nan;
  String _discountSalePrice = "";
  String _discountMargin = "";
  String _discountMarkup = "";

  String _explainCostPrice = explainNothingHere;
  String _explainSalePrice = explainNothingHere;
  String _explainMargin = explainNothingHere;
  String _explainMarkup = explainNothingHere;
  String _explainDiscount = explainNothingHere;
  String _explainDiscountSalePrice = explainNothingHere;
  String _explainDiscountMargin = explainNothingHere;
  String _explainDiscountMarkup = explainNothingHere;

  String get date => _date;
  List<Currency> get currencies => _currencies;
  String get costPrice => _costPrice;
  Currency get costPriceCurrency => _getCurrency(_costPriceCurrency);
  String get salePrice => _salePrice;
  Currency get salePriceCurrency => _getCurrency(_salePriceCurrency);
  String get margin => _margin;
  String get markup => _markup;
  String get discount => _discount;
  String get discountSalePrice => _discountSalePrice;
  String get discountMargin => _discountMargin;
  String get discountMarkup => _discountMarkup;

  String get explainCostPrice => _explainCostPrice;
  String get explainSalePrice => _explainSalePrice;
  String get explainMargin => _explainMargin;
  String get explainMarkup => _explainMarkup;
  String get explainDiscount => _explainDiscount;
  String get explainDiscountSalePrice => _explainDiscountSalePrice;
  String get explainDiscountMargin => _explainDiscountMargin;
  String get explainDiscountMarkup => _explainDiscountMarkup;

  reset() {
    _recalculate(_Action.Reset);
  }

  setCostPrice(String value) {
    _costPrice = value;
    _recalculate(_Action.SetCostPrice);
  }

  setCostPriceCurrency(String value) {
    _costPriceCurrency = value;
    _savePreferredCurrencies();
    _recalculate(_Action.SetCostPriceCurrency);
  }

  setCostPriceCurrencyRate(String value) {
    _setCurrencyRate(_costPriceCurrency, value);
    _recalculate(_Action.SetCostPriceCurrency);
  }

  setSalePrice(String value) {
    _salePrice = value;
    _recalculate(_Action.SetSalePrice);
  }

  setSalePriceCurrency(String value) {
    _salePriceCurrency = value;
    _savePreferredCurrencies();
    _recalculate(_Action.SetSalePriceCurrency);
  }

  setSalePriceCurrencyRate(String value) {
    _setCurrencyRate(_salePriceCurrency, value);
    _recalculate(_Action.SetSalePriceCurrency);
  }

  setMargin(String value) {
    _margin = value;
    _recalculate(_Action.SetMargin);
  }

  setMarkup(String value) {
    _markup = value;
    _recalculate(_Action.SetMarkup);
  }

  setDiscount(String value) {
    _discount = value;
    _recalculate(_Action.SetDiscount);
  }

  defaultCurrenciesRates() {
    _defaultCurrenciesRates();
    _recalculate(_Action.SetCostPriceCurrency);
    _recalculate(_Action.SetSalePriceCurrency);
  }

  Future<void> fetchCurrenciesRates() async {
    _defaultCurrenciesRates();

    try {
      final response = await http.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
      if (response.statusCode == 200) {
        final document = xml.parse(response.body);
        for (var element in document.findAllElements("Cube")) {
          var time = element.getAttribute("time");
          var currency = element.getAttribute("currency");
          var rate = element.getAttribute("rate");

          if (time != null) {
            _date = time;
          } else if (currency != null) {
            _setCurrencyRate(currency, rate);
          }
        }
      } else {
        // TODO: Log fetch failure.
      }
    } catch (error) {}

    await _loadPreferredCurrencies();
    _recalculate(_Action.SetCostPriceCurrency);
    _recalculate(_Action.SetSalePriceCurrency);
  }

  _defaultCurrenciesRates() {
    _currencies = [
      Currency("EUR", "Euro (EUR)", "1.0000"),
      Currency("GBP", "Pound Sterling (GBP)", "0.91505"),
      Currency("USD", "US Dollar (USD)", "1.1106"),
      Currency("JPY", "Yen (JPY)", "118.57"),
      Currency("BGN", "Bulgarian Lev (BGN)", "1.9558"),
      Currency("CZK", "Czech Koruna (CZK)", "25.763"),
      Currency("DKK", "Danish Krone (DKK)", "7.4660"),
      Currency("HUF", "Forint (HUF)", "326.96"),
      Currency("PLN", "Zloty (PLN)", "4.3014"),
      Currency("RON", "Romanian Leu (RON)", "4.7345"),
      Currency("SEK", "Swedish Krona (SEK)", "10.7223"),
      Currency("CHF", "Swiss Franc (CHF)", "1.0931"),
      Currency("ISK", "Icelandic Krona (ISK)", "136.30"),
      Currency("NOK", "Norwegian Krone (NOK)", "9.9105"),
      Currency("HRK", "Kuna (HRK)", "7.3815"),
      Currency("RUB", "Russian Ruble (RUB)", "72.5055"),
      Currency("TRY", "Turkish Lira (TRY)", "6.2221"),
      Currency("AUD", "Australian Dollar (AUD)", "1.6365"),
      Currency("BRL", "Brazilian Real (BRL)", "4.2958"),
      Currency("CAD", "Canadian Dollar (CAD)", "1.4698"),
      Currency("CNY", "Yuan Renminbi (CNY)", "7.7058"),
      Currency("HKD", "Hong Kong Dollar (HKD)", "8.6924"),
      Currency("IDR", "Rupiah (IDR)", "15772.45"),
      Currency("ILS", "New Israeli Sheqel (ILS)", "3.8786"),
      Currency("INR", "Indian Rupee (INR)", "77.3400"),
      Currency("KRW", "Won (KRW)", "1333.44"),
      Currency("MXN", "Mexican Peso (MXN)", "21.4542"),
      Currency("MYR", "Malaysian Ringgit (MYR)", "4.6173"),
      Currency("NZD", "New Zealand Dollar (NZD)", "1.7026"),
      Currency("PHP", "Philippine Peso (PHP)", "57.307"),
      Currency("SGD", "Singapore Dollar (SGD)", "1.5290"),
      Currency("THB", "Baht (THB)", "34.157"),
      Currency("ZAR", "Rand (ZAR)", "16.3271"),
    ];
  }

  _loadPreferredCurrencies() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _costPriceCurrency = prefs.getString("cost_price_currency") ?? _costPriceCurrency;
    _salePriceCurrency = prefs.getString("sale_price_currency") ?? _salePriceCurrency;
  }

  _savePreferredCurrencies() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString("cost_price_currency", _costPriceCurrency);
    await prefs.setString("sale_price_currency", _salePriceCurrency);
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

  _recalculate(_Action action) {
    switch (action) {
      case _Action.Reset:
        _costPrice = "";
        _costPriceValue = double.nan;
        _salePrice = "";
        _salePriceValue = double.nan;
        _margin = "";
        _marginValue = double.nan;
        _markup = "";
        _markupValue = double.nan;
        _discount = "";
        _discountValue = double.nan;
        _discountSalePrice = "";
        _discountMargin = "";
        _discountMarkup = "";

        _explainCostPrice = explainNothingHere;
        _explainSalePrice = explainNothingHere;
        _explainMargin = explainNothingHere;
        _explainMarkup = explainNothingHere;
        _explainDiscount = explainNothingHere;
        _explainDiscountSalePrice = explainNothingHere;
        _explainDiscountMargin = explainNothingHere;
        _explainDiscountMarkup = explainNothingHere;
        break;
      case _Action.SetCostPrice:
        _costPriceValue = double.tryParse(_costPrice) ?? double.nan;
        _explainCostPrice = explainYouDidThis;

        if (_costPriceValue.isFinite) {
          _costPriceValue = _costPriceValue * (1 / _costPriceCurrencyRate);

          if (_salePriceValue.isFinite) {
            _recalculateMargin();
            _recalculateMarkup();
          } else if (_marginValue.isFinite) {
            _recalculateSalePriceFromMargin();
            _recalculateMarkup();
          } else if (_markupValue.isFinite) {
            _recalculateSalePriceFromMarkup();
            _recalculateMargin();
          }
        }
        break;
      case _Action.SetCostPriceCurrency:
        var currency = _getCurrency(_costPriceCurrency);
        _costPriceCurrencyRate = double.tryParse(currency.rate) ?? double.nan;

        if (_costPriceCurrencyRate.isFinite) {
          if (_salePriceValue.isFinite) {
            if (_marginValue.isFinite) {
              _recalculateCostPriceFromMargin();
              _recalculateMarkup();
            } else if (_markupValue.isFinite) {
              _recalculateCostPriceFromMarkup();
              _recalculateMargin();
            }
          }

          _recalculateCostPriceCurrency();
        }
        break;
      case _Action.SetSalePrice:
        _salePriceValue = double.tryParse(_salePrice) ?? double.nan;
        _explainSalePrice = explainYouDidThis;

        if (_salePriceValue.isFinite) {
          _salePriceValue = _salePriceValue * (1 / _salePriceCurrencyRate);

          if (_costPriceValue.isFinite) {
            _recalculateMargin();
            _recalculateMarkup();
          } else if (_marginValue.isFinite) {
            _recalculateCostPriceFromMargin();
            _recalculateMarkup();
          } else if (_markupValue.isFinite) {
            _recalculateCostPriceFromMarkup();
            _recalculateMargin();
          }
        }
        break;
      case _Action.SetSalePriceCurrency:
        var currency = _getCurrency(_salePriceCurrency);
        _salePriceCurrencyRate = double.tryParse(currency.rate) ?? double.nan;

        if (_salePriceCurrencyRate.isFinite) {
          if (_costPriceValue.isFinite) {
            if (_marginValue.isFinite) {
              _recalculateSalePriceFromMargin();
              _recalculateMarkup();
            } else if (_markupValue.isFinite) {
              _recalculateSalePriceFromMarkup();
              _recalculateMargin();
            }
          }
          _recalculateSalePriceCurrency();
        }
        break;
      case _Action.SetMargin:
        _marginValue = double.tryParse(_margin) ?? double.nan;
        _explainMargin = explainYouDidThis;

        if (_marginValue.isFinite) {
          if (_costPriceValue.isFinite) {
            _recalculateSalePriceFromMargin();
            _recalculateMarkup();
          } else if (_salePriceValue.isFinite) {
            _recalculateCostPriceFromMargin();
            _recalculateMarkup();
          }
        }
        break;
      case _Action.SetMarkup:
        _markupValue = double.tryParse(_markup) ?? double.nan;
        _explainMarkup = explainYouDidThis;

        if (_markupValue.isFinite) {
          if (_costPriceValue.isFinite) {
            _recalculateSalePriceFromMarkup();
            _recalculateMargin();
          } else if (_salePriceValue.isFinite) {
            _recalculateCostPriceFromMarkup();
            _recalculateMargin();
          }
        }
        break;
      case _Action.SetDiscount:
        _discountValue = double.tryParse(_discount) ?? double.nan;
        _explainDiscount = explainYouDidThis;
        break;
    }

    if (_discountValue.isFinite && _costPriceValue.isFinite && _salePriceValue.isFinite) {
      _recalculateDiscount();
    }

    notifyListeners();
  }

  _recalculateMargin() {
    _marginValue = ((_salePriceValue - _costPriceValue) / _salePriceValue) * 100;
    _margin = _marginValue.toStringAsFixed(2);
    _explainMargin = _recalculateExplainMargin(_salePriceValue);
  }

  _recalculateMarkup() {
    _markupValue = ((_salePriceValue - _costPriceValue) / _costPriceValue) * 100;
    _markup = _markupValue.toStringAsFixed(2);
    _explainMarkup = _recalculateExplainMarkup(_salePriceValue);
  }

  _recalculateSalePriceFromMargin() {
    _salePriceValue = _costPriceValue / (1 - _marginValue / 100);
    _recalculateSalePriceCurrency();
    _explainSalePrice = _recalculateExplainSalePriceFromMargin();
  }

  _recalculateSalePriceFromMarkup() {
    _salePriceValue = _costPriceValue * (_markupValue / 100) + _costPriceValue;
    _recalculateSalePriceCurrency();
    _explainSalePrice = _recalculateExplainSalePriceFromMarkup();
  }

  _recalculateCostPriceFromMargin() {
    _costPriceValue = _salePriceValue - (_marginValue / 100) * _salePriceValue;
    _recalculateCostPriceCurrency();
    _explainCostPrice = _recalculateExplainCostPriceFromMargin();
  }

  _recalculateCostPriceFromMarkup() {
    _costPriceValue = _salePriceValue / (_markupValue / 100 + 1);
    _recalculateCostPriceCurrency();
    _explainCostPrice = _recalculateExplainCostPriceFromMarkup();
  }

  _recalculateSalePriceCurrency() {
    if (_salePriceValue.isFinite) {
      var salePriceInCurrency = _salePriceValue * _salePriceCurrencyRate;
      _salePrice = salePriceInCurrency.toStringAsFixed(2);
    }
  }

  _recalculateCostPriceCurrency() {
    if (_costPriceValue.isFinite) {
      var costPriceInCurrency = _costPriceValue * _costPriceCurrencyRate;
      _costPrice = costPriceInCurrency.toStringAsFixed(2);
    }
  }

  _recalculateDiscount() {
    var discountSalePrice = _salePriceValue * (1 - _discountValue / 100);
    var discountSalePriceInCurrency = discountSalePrice * _salePriceCurrencyRate;
    var discountMargin = ((discountSalePrice - _costPriceValue) / discountSalePrice) * 100;
    var discountMarkup = ((discountSalePrice - _costPriceValue) / _costPriceValue) * 100;

    _discountSalePrice = discountSalePriceInCurrency.toStringAsFixed(2);
    _explainDiscountSalePrice = _recalculateExplainDiscountSalePrice(_discountSalePrice);
    _discountMargin = discountMargin.toStringAsFixed(2);
    _explainDiscountMargin = _recalculateExplainMargin(discountSalePriceInCurrency);
    _discountMarkup = discountMarkup.toStringAsFixed(2);
    _explainDiscountMarkup = _recalculateExplainMarkup(discountSalePriceInCurrency);
  }

  String _recalculateExplainMargin(double salePrice) {
    var profit = salePrice - _costPriceValue;
    var displayProfit = profit.toStringAsFixed(2);
    var displaySalePrice = salePrice.toStringAsFixed(2);
    var displayCostPrice = _costPriceValue.toStringAsFixed(2);
    var displayMargin = _marginValue.toStringAsFixed(2);
    return """
    Profit = SalePrice - CostPrice
    $displayProfit = $displaySalePrice - $displayCostPrice

    Margin = (Profit / SalePrice) * 100
    $displayMargin = ($displayProfit / $displaySalePrice) * 100
    """;
  }

  String _recalculateExplainMarkup(double salePrice) {
    var profit = salePrice - _costPriceValue;
    var displayProfit = profit.toStringAsFixed(2);
    var displaySalePrice = salePrice.toStringAsFixed(2);
    var displayCostPrice = _costPriceValue.toStringAsFixed(2);
    var displayMarkup = _markupValue.toStringAsFixed(2);
    return """
    Profit = SalePrice - CostPrice
    $displayProfit = $displaySalePrice - $displayCostPrice

    Markup = (Profit / CostPrice) * 100
    $displayMarkup = ($displayProfit / $displayCostPrice) * 100
    """;
  }

  String _recalculateExplainSalePriceFromMargin() {
    var displaySalePrice = _salePriceValue.toStringAsFixed(2);
    var displayCostPrice = _costPriceValue.toStringAsFixed(2);
    var displayMargin = (_marginValue / 100).toStringAsFixed(2);
    return """
    SalePrice = CostPrice / (1 - Margin)
    $displaySalePrice = $displayCostPrice / (1 - $displayMargin)
    """;
  }

  String _recalculateExplainSalePriceFromMarkup() {
    var displaySalePrice = _salePriceValue.toStringAsFixed(2);
    var displayCostPrice = _costPriceValue.toStringAsFixed(2);
    var displayMarkup = (_markupValue / 100).toStringAsFixed(2);
    return """
    SalePrice = (CostPrice * Markup) + CostPrice
    $displaySalePrice = ($displayCostPrice * $displayMarkup) + $displayCostPrice
    """;
  }

  String _recalculateExplainCostPriceFromMargin() {
    var displaySalePrice = _salePriceValue.toStringAsFixed(2);
    var displayCostPrice = _costPriceValue.toStringAsFixed(2);
    var displayMargin = (_marginValue / 100).toStringAsFixed(2);
    return """
    CostPrice = SalePrice - (SalePrice * Margin)
    $displayCostPrice = $displaySalePrice - ($displaySalePrice * $displayMargin)
    """;
  }

  String _recalculateExplainCostPriceFromMarkup() {
    var displaySalePrice = _salePriceValue.toStringAsFixed(2);
    var displayCostPrice = _costPriceValue.toStringAsFixed(2);
    var displayMarkup = (_markupValue / 100).toStringAsFixed(2);
    return """
    CostPrice = SalePrice / (Markup + 1)
    $displayCostPrice = $displaySalePrice / ($displayMarkup + 1)
    """;
  }

  String _recalculateExplainDiscountSalePrice(String discountSalePrice) {
    var displaySalePrice = _salePriceValue.toStringAsFixed(2);
    var displayDiscount = (_discountValue / 100).toStringAsFixed(2);
    return """
    DiscountedSalePrice = SalePrice * (1 - Discount)
    $discountSalePrice = $displaySalePrice * (1 - $displayDiscount)
    """;
  }
}
