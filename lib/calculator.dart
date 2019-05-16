import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:margin_calculator/calculator_model.dart';
import 'package:scoped_model/scoped_model.dart';

class Calculator extends StatelessWidget {
  const Calculator({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: ScopedModelDescendant<CalculatorModel>(
            builder: (context, child, calculator) => Column(
                  children: <Widget>[
                    _Header(
                      reset: calculator.reset,
                    ),
                    _Price(
                      getCurrencies: () => calculator.currencies,
                      getPrice: () => calculator.costPrice,
                      setPrice: calculator.setCostPrice,
                      getCurrency: () => calculator.costPriceCurrency,
                      setCurrency: calculator.setCostPriceCurrency,
                      setCurrencyRate: calculator.setCostPriceCurrencyRate,
                    ),
                    _Price(
                      getCurrencies: () => calculator.currencies,
                      getPrice: () => calculator.salePrice,
                      setPrice: calculator.setSalePrice,
                      getCurrency: () => calculator.salePriceCurrency,
                      setCurrency: calculator.setSalePriceCurrency,
                      setCurrencyRate: calculator.setSalePriceCurrencyRate,
                    ),
                    _Percentage(
                      getPercentage: () => calculator.margin,
                      setPercentage: calculator.setMargin,
                    ),
                    _Percentage(
                      getPercentage: () => calculator.markup,
                      setPercentage: calculator.setMarkup,
                    ),
                    _Discount(
                      getDiscount: () => calculator.discount,
                      setDiscount: calculator.setDiscount,
                    ),
                  ],
                ),
          ),
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
    @required this.getCurrencies,
    @required this.getPrice,
    @required this.setPrice,
    @required this.getCurrency,
    @required this.setCurrency,
    @required this.setCurrencyRate,
  }) : super(key: key);
  final GetCurrenciesCallback getCurrencies;
  final GetValueCallback getPrice;
  final SetValueCallback setPrice;
  final GetCurrencyCallback getCurrency;
  final SetValueCallback setCurrency;
  final SetValueCallback setCurrencyRate;

  @override
  _PriceState createState() => new _PriceState(getCurrencies, getPrice,
      setPrice, getCurrency, setCurrency, setCurrencyRate);
}

class _PriceState extends State<_Price> {
  _PriceState(
    this.getCurrencies,
    this.getPrice,
    this.setPrice,
    this.getCurrency,
    this.setCurrency,
    this.setCurrencyRate,
  );
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
    return Row(
      children: <Widget>[
        Expanded(
          flex: 2,
          child: Column(
            children: <Widget>[
              new Text("Cost Price"),
              new Text("Currency"),
              new Text("Currency Rate"),
            ],
          ),
        ),
        Expanded(
          flex: 3,
          child: Padding(
            padding: EdgeInsets.all(10),
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.green.shade100, width: 1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  TextField(
                    controller: c1,
                    decoration: InputDecoration(
                        hintText: "COST PRICE",
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                        )),
                    keyboardType: TextInputType.number,
                    onChanged: setPrice,
                  ),
                    DropdownButtonHideUnderline(
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
                  // ),
                  TextField(
                    controller: c2,
                    decoration: InputDecoration(
                        hintText: "COST PRICE CURRENCY RATE",
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                        )),
                    keyboardType: TextInputType.number,
                    onChanged: setCurrencyRate,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _Percentage extends StatefulWidget {
  const _Percentage({
    Key key,
    @required this.getPercentage,
    @required this.setPercentage,
  }) : super(key: key);
  final GetValueCallback getPercentage;
  final SetValueCallback setPercentage;

  @override
  _PercentageState createState() =>
      new _PercentageState(getPercentage, setPercentage);
}

class _PercentageState extends State<_Percentage> {
  _PercentageState(
    this.getPercentage,
    this.setPercentage,
  );
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
    return Column(
      children: <Widget>[
        TextField(
          controller: c1,
          decoration: InputDecoration(
              filled: true,
              border: OutlineInputBorder(borderRadius: BorderRadius.zero)),
          keyboardType: TextInputType.number,
          onChanged: setPercentage,
        ),
      ],
    );
  }
}

class _Discount extends StatefulWidget {
  const _Discount({
    Key key,
    @required this.getDiscount,
    @required this.setDiscount,
  }) : super(key: key);
  final GetValueCallback getDiscount;
  final SetValueCallback setDiscount;

  @override
  _DiscountState createState() => new _DiscountState(getDiscount, setDiscount);
}

class _DiscountState extends State<_Discount> {
  _DiscountState(
    this.getDiscount,
    this.setDiscount,
  );
  final GetValueCallback getDiscount;
  final SetValueCallback setDiscount;
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
    return Column(
      children: <Widget>[
        TextField(
          controller: c1,
          decoration: InputDecoration(
              filled: true,
              border: OutlineInputBorder(borderRadius: BorderRadius.zero)),
          keyboardType: TextInputType.number,
          onChanged: setDiscount,
        ),
      ],
    );
  }
}
