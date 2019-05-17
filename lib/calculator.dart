import 'package:flutter/animation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:margin_calculator/calculator_model.dart';
import 'package:scoped_model/scoped_model.dart';

// TODO: Cache selected currencies, previous currency rates.
// TODO: Information page.
// TODO: Explanation modals.

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
    super.initState();
    fetch = model.fetchCurrenciesRates().then((date) {
      setState(() {});
      return date;
    });
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

class _CalculatorActive extends StatefulWidget {
  const _CalculatorActive({
    Key key,
    @required this.date,
  }) : super(key: key);
  final String date;

  @override
  _CalculatorActiveState createState() => new _CalculatorActiveState(date);
}

class _CalculatorActiveState extends State<_CalculatorActive> with TickerProviderStateMixin {
  _CalculatorActiveState(this.date);
  final String date;
  AnimationController a1;
  AnimationController a2;
  AnimationController a3;
  AnimationController a4;
  AnimationController a5;

  @override
  initState() {
    super.initState();
    var incrementMs = 100;
    a1 = AnimationController(
      duration: Duration(milliseconds: incrementMs * 1),
      vsync: this,
    );
    a2 = AnimationController(
      duration: Duration(milliseconds: incrementMs * 2),
      vsync: this,
    );
    a3 = AnimationController(
      duration: Duration(milliseconds: incrementMs * 3),
      vsync: this,
    );
    a4 = AnimationController(
      duration: Duration(milliseconds: incrementMs * 4),
      vsync: this,
    );
    a5 = AnimationController(
      duration: Duration(milliseconds: incrementMs * 5),
      vsync: this,
    );

    a1.forward();
    a2.forward();
    a3.forward();
    a4.forward();
    a5.forward();
  }

  @override
  void dispose() {
    a1?.dispose();
    a2?.dispose();
    a3?.dispose();
    a4?.dispose();
    a5?.dispose();
    super.dispose();
  }

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
                Text("Exchange rates from $date"),
                _Price(
                  labelValue: "Cost Price",
                  getCurrencies: () => calculator.currencies,
                  getPrice: () => calculator.costPrice,
                  setPrice: calculator.setCostPrice,
                  getCurrency: () => calculator.costPriceCurrency,
                  setCurrency: calculator.setCostPriceCurrency,
                  setCurrencyRate: calculator.setCostPriceCurrencyRate,
                  animationController: a1,
                ),
                _Price(
                  labelValue: "Sale Price",
                  getCurrencies: () => calculator.currencies,
                  getPrice: () => calculator.salePrice,
                  setPrice: calculator.setSalePrice,
                  getCurrency: () => calculator.salePriceCurrency,
                  setCurrency: calculator.setSalePriceCurrency,
                  setCurrencyRate: calculator.setSalePriceCurrencyRate,
                  animationController: a2,
                ),
                _Percentage(
                  label: "Margin",
                  getPercentage: () => calculator.margin,
                  setPercentage: calculator.setMargin,
                  animationController: a3,
                ),
                _Percentage(
                  label: "Markup",
                  getPercentage: () => calculator.markup,
                  setPercentage: calculator.setMarkup,
                  animationController: a4,
                ),
                _Discount(
                  getDiscount: () => calculator.discount,
                  setDiscount: calculator.setDiscount,
                  getDiscountSalePrice: () => calculator.discountSalePrice,
                  getDiscountMargin: () => calculator.discountMargin,
                  getDiscountMarkup: () => calculator.discountMarkup,
                  animationController: a5,
                ),
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
    @required this.animationController,
  }) : super(key: key);
  final String labelValue;
  final GetCurrenciesCallback getCurrencies;
  final GetValueCallback getPrice;
  final SetValueCallback setPrice;
  final GetCurrencyCallback getCurrency;
  final SetValueCallback setCurrency;
  final SetValueCallback setCurrencyRate;
  final AnimationController animationController;

  @override
  _PriceState createState() => new _PriceState(
      labelValue, getCurrencies, getPrice, setPrice, getCurrency, setCurrency, setCurrencyRate, animationController);
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
    this.animationController,
  );
  final String labelValue;
  final GetCurrenciesCallback getCurrencies;
  final GetValueCallback getPrice;
  final SetValueCallback setPrice;
  final GetCurrencyCallback getCurrency;
  final SetValueCallback setCurrency;
  final SetValueCallback setCurrencyRate;
  final TextEditingController c1 = TextEditingController();
  final FocusNode fn1 = FocusNode();
  final TextEditingController c2 = TextEditingController();
  final FocusNode fn2 = FocusNode();
  final AnimationController animationController;

  @override
  initState() {
    super.initState();
    fn1.addListener(() {
      if (!fn1.hasFocus) {
        setPrice(c1.text);
      }
    });
    fn2.addListener(() {
      if (!fn2.hasFocus) {
        setCurrencyRate(c2.text);
      }
    });
  }

  @override
  dispose() {
    c1?.dispose();
    fn1?.dispose();
    c2?.dispose();
    fn2?.dispose();
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
      child: FadeTransition(
        opacity: CurvedAnimation(parent: animationController, curve: Curves.easeIn),
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
                    focusNode: fn1,
                    decoration: InputDecoration(
                      filled: true,
                      // border: OutlineInputBorder(
                      //   borderSide: BorderSide.none,
                      // ),
                    ),
                    keyboardType: TextInputType.number,
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
                    focusNode: fn2,
                    decoration: InputDecoration(
                        filled: true,
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                        )),
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
          ],
        ),
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
    @required this.animationController,
  }) : super(key: key);
  final String label;
  final GetValueCallback getPercentage;
  final SetValueCallback setPercentage;
  final AnimationController animationController;

  @override
  _PercentageState createState() => new _PercentageState(label, getPercentage, setPercentage, animationController);
}

class _PercentageState extends State<_Percentage> {
  _PercentageState(
    this.label,
    this.getPercentage,
    this.setPercentage,
    this.animationController,
  );
  final String label;
  final GetValueCallback getPercentage;
  final SetValueCallback setPercentage;
  final AnimationController animationController;
  final TextEditingController c1 = TextEditingController();
  final FocusNode fn1 = FocusNode();

  @override
  initState() {
    super.initState();
    fn1.addListener(() {
      if (!fn1.hasFocus) {
        setPercentage(c1.text);
      }
    });
  }

  @override
  dispose() {
    c1?.dispose();
    fn1?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (getPercentage() != c1.value.text) {
      c1.text = getPercentage();
    }
    return Flexible(
      child: FadeTransition(
        opacity: CurvedAnimation(parent: animationController, curve: Curves.easeIn),
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
                focusNode: fn1,
                decoration: InputDecoration(
                    filled: true,
                    border: OutlineInputBorder(
                      borderSide: BorderSide.none,
                    )),
                keyboardType: TextInputType.number,
              ),
            ),
          ],
        ),
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
    @required this.animationController,
  }) : super(key: key);
  final GetValueCallback getDiscount;
  final SetValueCallback setDiscount;
  final GetValueCallback getDiscountSalePrice;
  final GetValueCallback getDiscountMargin;
  final GetValueCallback getDiscountMarkup;
  final AnimationController animationController;

  @override
  _DiscountState createState() => new _DiscountState(
      getDiscount, setDiscount, getDiscountSalePrice, getDiscountMargin, getDiscountMarkup, animationController);
}

class _DiscountState extends State<_Discount> {
  _DiscountState(
    this.getDiscount,
    this.setDiscount,
    this.getDiscountSalePrice,
    this.getDiscountMargin,
    this.getDiscountMarkup,
    this.animationController,
  );
  final GetValueCallback getDiscount;
  final SetValueCallback setDiscount;
  final GetValueCallback getDiscountSalePrice;
  final GetValueCallback getDiscountMargin;
  final GetValueCallback getDiscountMarkup;
  final AnimationController animationController;
  final TextEditingController c1 = TextEditingController();
  final FocusNode fn1 = FocusNode();

  @override
  initState() {
    super.initState();
    fn1.addListener(() {
      if (!fn1.hasFocus) {
        setDiscount(c1.text);
      }
    });
  }

  @override
  dispose() {
    c1?.dispose();
    fn1?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (getDiscount() != c1.value.text) {
      c1.text = getDiscount();
    }
    return Flexible(
      child: FadeTransition(
        opacity: CurvedAnimation(parent: animationController, curve: Curves.easeIn),
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
                    focusNode: fn1,
                    decoration: InputDecoration(
                        filled: true,
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                        )),
                    keyboardType: TextInputType.number,
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
      ),
    );
  }
}
