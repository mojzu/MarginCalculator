import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:margin_calculator/calculator_model.dart';
import 'package:scoped_model/scoped_model.dart';

// TODO: Use better change detection than onChanged.

class Calculator extends StatefulWidget {
  const Calculator({
    Key key,
    @required this.model,
  }) : super(key: key);
  final CalculatorModel model;

  @override
  _CalculatorState createState() => new _CalculatorState(model);
}

class _CalculatorState extends State<Calculator> {
  _CalculatorState(
    this.model,
  );
  final CalculatorModel model;
  Future<String> fetch;

  @override
  void initState() {
    fetch = model.fetchCurrenciesRates().then((date) {
      setState(() {});
      return date;
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: FutureBuilder<String>(
          future: fetch,
          builder: (context, snapshot) {
            switch (snapshot.connectionState) {
              case ConnectionState.none:
              case ConnectionState.waiting:
                return Center(child: new CircularProgressIndicator());
              default:
                // TODO: Handle future error.
                return _CalculatorActive(date: snapshot.data);
            }
          },
        ),
      ),
    );
  }
}

class _CalculatorActive extends StatelessWidget {
  const _CalculatorActive({
    Key key,
    @required this.date,
  }) : super(key: key);
  final String date;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: ScopedModelDescendant<CalculatorModel>(
        builder: (context, child, calculator) => Column(
              mainAxisAlignment: MainAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                _Header(
                  reset: calculator.reset,
                ),
                _Price(
                  labelValue: "Cost Price",
                  getCurrencies: () => calculator.currencies,
                  getPrice: () => calculator.costPrice,
                  setPrice: calculator.setCostPrice,
                  getCurrency: () => calculator.costPriceCurrency,
                  setCurrency: calculator.setCostPriceCurrency,
                  setCurrencyRate: calculator.setCostPriceCurrencyRate,
                ),
                _Price(
                  labelValue: "Sale Price",
                  getCurrencies: () => calculator.currencies,
                  getPrice: () => calculator.salePrice,
                  setPrice: calculator.setSalePrice,
                  getCurrency: () => calculator.salePriceCurrency,
                  setCurrency: calculator.setSalePriceCurrency,
                  setCurrencyRate: calculator.setSalePriceCurrencyRate,
                ),
                _Percentage(
                  label: "Margin",
                  getPercentage: () => calculator.margin,
                  setPercentage: calculator.setMargin,
                ),
                _Percentage(
                  label: "Markup",
                  getPercentage: () => calculator.markup,
                  setPercentage: calculator.setMarkup,
                ),
                _Discount(
                  getDiscount: () => calculator.discount,
                  setDiscount: calculator.setDiscount,
                  getDiscountSalePrice: () => calculator.discountSalePrice,
                  getDiscountMargin: () => calculator.discountMargin,
                  getDiscountMarkup: () => calculator.discountMarkup,
                ),
                Text(date),
              ],
            ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({
    Key key,
    @required this.reset,
  }) : super(key: key);
  final VoidCallback reset;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        Expanded(
          child: Padding(
            padding: EdgeInsets.all(12.0),
            child: Text(
              "Margin Calculator",
              style: Theme.of(context).primaryTextTheme.title,
            ),
          ),
        ),
        IconButton(
          icon: Icon(Icons.refresh),
          iconSize: 22.0,
          tooltip: 'Reset Calculator',
          onPressed: reset,
        ),
      ],
    );
  }
}

typedef GetCurrenciesCallback = List<Currency> Function();
typedef GetCurrencyCallback = Currency Function();
typedef GetValueCallback = String Function();
typedef SetValueCallback = void Function(String value);

class _Price extends StatefulWidget {
  const _Price({
    Key key,
    @required this.labelValue,
    @required this.getCurrencies,
    @required this.getPrice,
    @required this.setPrice,
    @required this.getCurrency,
    @required this.setCurrency,
    @required this.setCurrencyRate,
  }) : super(key: key);
  final String labelValue;
  final GetCurrenciesCallback getCurrencies;
  final GetValueCallback getPrice;
  final SetValueCallback setPrice;
  final GetCurrencyCallback getCurrency;
  final SetValueCallback setCurrency;
  final SetValueCallback setCurrencyRate;

  @override
  _PriceState createState() =>
      new _PriceState(labelValue, getCurrencies, getPrice, setPrice, getCurrency, setCurrency, setCurrencyRate);
}

class _PriceState extends State<_Price> {
  _PriceState(
    this.labelValue,
    this.getCurrencies,
    this.getPrice,
    this.setPrice,
    this.getCurrency,
    this.setCurrency,
    this.setCurrencyRate,
  );
  final String labelValue;
  final GetCurrenciesCallback getCurrencies;
  final GetValueCallback getPrice;
  final SetValueCallback setPrice;
  final GetCurrencyCallback getCurrency;
  final SetValueCallback setCurrency;
  final SetValueCallback setCurrencyRate;
  final TextEditingController c1 = TextEditingController();
  final TextEditingController c2 = TextEditingController();

  @override
  dispose() {
    c1?.dispose();
    c2?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (getPrice() != c1.value.text) {
      c1.text = getPrice();
    }
    if (getCurrency().rate != c2.value.text) {
      c2.text = getCurrency().rate;
    }
    return Flexible(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text(labelValue),
              ),
              Flexible(
                flex: 3,
                child: TextField(
                  controller: c1,
                  decoration: InputDecoration(
                    filled: true,
                    // border: OutlineInputBorder(
                    //   borderSide: BorderSide.none,
                    // ),
                  ),
                  keyboardType: TextInputType.number,
                  onChanged: setPrice,
                ),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text("Currency"),
              ),
              Flexible(
                flex: 3,
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: getCurrency().code,
                    // isDense: true,
                    onChanged: setCurrency,
                    // style: TextStyle(decoration: )
                    items: getCurrencies().map((value) {
                      return DropdownMenuItem(
                        value: value.code,
                        child: Text(value.text),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text("Currency Rate"),
              ),
              Flexible(
                flex: 3,
                child: TextField(
                  controller: c2,
                  decoration: InputDecoration(
                      filled: true,
                      border: OutlineInputBorder(
                        borderSide: BorderSide.none,
                      )),
                  keyboardType: TextInputType.number,
                  onChanged: setCurrencyRate,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _Percentage extends StatefulWidget {
  const _Percentage({
    Key key,
    @required this.label,
    @required this.getPercentage,
    @required this.setPercentage,
  }) : super(key: key);
  final String label;
  final GetValueCallback getPercentage;
  final SetValueCallback setPercentage;

  @override
  _PercentageState createState() => new _PercentageState(label, getPercentage, setPercentage);
}

class _PercentageState extends State<_Percentage> {
  _PercentageState(
    this.label,
    this.getPercentage,
    this.setPercentage,
  );
  final String label;
  final GetValueCallback getPercentage;
  final SetValueCallback setPercentage;
  final TextEditingController c1 = TextEditingController();

  @override
  dispose() {
    c1?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (getPercentage() != c1.value.text) {
      c1.text = getPercentage();
    }
    return Flexible(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Flexible(
            flex: 2,
            child: Text(label),
          ),
          Flexible(
            flex: 3,
            child: TextField(
              controller: c1,
              decoration: InputDecoration(
                  filled: true,
                  border: OutlineInputBorder(
                    borderSide: BorderSide.none,
                  )),
              keyboardType: TextInputType.number,
              onChanged: setPercentage,
            ),
          ),
        ],
      ),
    );
  }
}

class _Discount extends StatefulWidget {
  const _Discount({
    Key key,
    @required this.getDiscount,
    @required this.setDiscount,
    @required this.getDiscountSalePrice,
    @required this.getDiscountMargin,
    @required this.getDiscountMarkup,
  }) : super(key: key);
  final GetValueCallback getDiscount;
  final SetValueCallback setDiscount;
  final GetValueCallback getDiscountSalePrice;
  final GetValueCallback getDiscountMargin;
  final GetValueCallback getDiscountMarkup;

  @override
  _DiscountState createState() =>
      new _DiscountState(getDiscount, setDiscount, getDiscountSalePrice, getDiscountMargin, getDiscountMarkup);
}

class _DiscountState extends State<_Discount> {
  _DiscountState(
    this.getDiscount,
    this.setDiscount,
    this.getDiscountSalePrice,
    this.getDiscountMargin,
    this.getDiscountMarkup,
  );
  final GetValueCallback getDiscount;
  final SetValueCallback setDiscount;
  final GetValueCallback getDiscountSalePrice;
  final GetValueCallback getDiscountMargin;
  final GetValueCallback getDiscountMarkup;
  final TextEditingController c1 = TextEditingController();

  @override
  dispose() {
    c1?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (getDiscount() != c1.value.text) {
      c1.text = getDiscount();
    }
    return Flexible(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text("Discount"),
              ),
              Flexible(
                flex: 3,
                child: TextField(
                  controller: c1,
                  decoration: InputDecoration(
                      filled: true,
                      border: OutlineInputBorder(
                        borderSide: BorderSide.none,
                      )),
                  keyboardType: TextInputType.number,
                  onChanged: setDiscount,
                ),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text("Discount Sale Price"),
              ),
              Flexible(
                flex: 3,
                child: Text(getDiscountSalePrice()),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text("Discount Margin"),
              ),
              Flexible(
                flex: 3,
                child: Text(getDiscountMargin()),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Flexible(
                flex: 2,
                child: Text("Discount Markup"),
              ),
              Flexible(
                flex: 3,
                child: Text(getDiscountMarkup()),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
