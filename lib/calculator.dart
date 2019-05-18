import 'package:flutter/animation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:margin_calculator/calculator_model.dart';
import 'package:margin_calculator/style.dart';
import 'package:scoped_model/scoped_model.dart';

// TODO: Cache selected currencies, previous currency rates.
// TODO: Explanation modals.

class Calculator extends StatefulWidget {
  const Calculator(
    this.model, {
    Key key,
  }) : super(key: key);
  final CalculatorModel model;

  @override
  _CalculatorState createState() => new _CalculatorState(model);
}

class _CalculatorState extends State<Calculator> with TickerProviderStateMixin {
  _CalculatorState(this.model);
  final CalculatorModel model;
  AnimationController animationController;

  @override
  void initState() {
    animationController = AnimationController(
      duration: Duration(milliseconds: 1000),
      vsync: this,
    );
    animationController.forward();
    super.initState();
  }

  @override
  void dispose() {
    animationController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Margin Calculator", style: Theme.of(context).appBarTheme.textTheme.title),
        actions: <Widget>[
          Builder(
            builder: (context) {
              return IconButton(
                icon: Icon(Icons.refresh),
                tooltip: 'Reset Calculator',
                onPressed: () => _reset(context),
              );
            },
          ),
          Builder(
            builder: (context) {
              return IconButton(
                icon: Icon(Icons.file_download),
                tooltip: 'Download currency rates',
                onPressed: () => _fetch(context),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: ScopedModelDescendant<CalculatorModel>(
          builder: (context, child, calculator) => SingleChildScrollView(
                child: Container(
                  color: Colors.grey.shade200,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      _Price(
                        labelValue: "Cost Price",
                        getCurrencies: () => calculator.currencies,
                        getPrice: () => calculator.costPrice,
                        setPrice: calculator.setCostPrice,
                        getCurrency: () => calculator.costPriceCurrency,
                        setCurrency: calculator.setCostPriceCurrency,
                        setCurrencyRate: calculator.setCostPriceCurrencyRate,
                        animationController: animationController,
                      ),
                      _Price(
                        labelValue: "Sale Price",
                        getCurrencies: () => calculator.currencies,
                        getPrice: () => calculator.salePrice,
                        setPrice: calculator.setSalePrice,
                        getCurrency: () => calculator.salePriceCurrency,
                        setCurrency: calculator.setSalePriceCurrency,
                        setCurrencyRate: calculator.setSalePriceCurrencyRate,
                        animationController: animationController,
                      ),
                      _Percentage(
                        label: "Margin (%)",
                        getPercentage: () => calculator.margin,
                        setPercentage: calculator.setMargin,
                        animationController: animationController,
                      ),
                      _Percentage(
                        label: "Markup (%)",
                        getPercentage: () => calculator.markup,
                        setPercentage: calculator.setMarkup,
                        animationController: animationController,
                      ),
                      _Discount(
                        getDiscount: () => calculator.discount,
                        setDiscount: calculator.setDiscount,
                        getDiscountSalePrice: () => calculator.discountSalePrice,
                        getDiscountMargin: () => calculator.discountMargin,
                        getDiscountMarkup: () => calculator.discountMarkup,
                        animationController: animationController,
                      ),
                      _Information(model: calculator),
                    ],
                  ),
                ),
              ),
        ),
      ),
    );
  }

  _reset(BuildContext context) {
    model.reset();
    // _toast(context, "Calculator reset");
  }

  _fetch(BuildContext context) {
    model.fetchCurrenciesRates().then((_) {
      _toast(context, "Exchange rates from ${model.date}");
    });
  }

  _toast(BuildContext context, String text) {
    final scaffold = Scaffold.of(context);
    scaffold.showSnackBar(
      SnackBar(
        content: Text(text),
        action: SnackBarAction(
          label: 'Hide',
          onPressed: scaffold.hideCurrentSnackBar,
        ),
      ),
    );
  }
}

typedef GetCurrenciesCallback = List<Currency> Function();
typedef GetCurrencyCallback = Currency Function();
typedef GetValueCallback = String Function();
typedef SetValueCallback = void Function(String value);

class _ValueField extends StatelessWidget {
  const _ValueField({
    Key key,
    @required this.text,
    @required this.controller,
    @required this.focusNode,
  }) : super(key: key);
  final String text;
  final TextEditingController controller;
  final FocusNode focusNode;
  final _edgeValue = 10.0;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          Expanded(
            flex: 2,
            child: Container(
              padding: EdgeInsets.all(_edgeValue),
              child: Text(
                text,
                style: Theme.of(context).textTheme.body1,
                textAlign: TextAlign.right,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: TextField(
              controller: controller,
              focusNode: focusNode,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.deepPurple.shade100,
                contentPadding: EdgeInsets.all(_edgeValue),
                border: OutlineInputBorder(
                  borderSide: BorderSide.none,
                  borderRadius: BorderRadius.zero,
                ),
                hintText: "...",
              ),
              style: Theme.of(context).textTheme.body1,
              keyboardType: TextInputType.number,
            ),
          ),
        ],
      ),
    );
  }
}

class _ValueDisplay extends StatelessWidget {
  const _ValueDisplay({
    Key key,
    @required this.label,
    @required this.getValue,
  }) : super(key: key);
  final String label;
  final GetValueCallback getValue;
  final _edgeValue = 10.0;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          Expanded(
            flex: 2,
            child: Container(
              padding: EdgeInsets.all(_edgeValue),
              child: Text(
                label,
                style: Theme.of(context).textTheme.body1,
                textAlign: TextAlign.right,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Container(
              padding: EdgeInsets.all(_edgeValue),
              child: Text(
                getValue(),
                style: Theme.of(context).textTheme.body1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CurrencyField extends StatelessWidget {
  const _CurrencyField({
    Key key,
    @required this.text,
    @required this.getCurrencies,
    @required this.getCurrency,
    @required this.setCurrency,
  }) : super(key: key);
  final String text;
  final GetCurrenciesCallback getCurrencies;
  final GetCurrencyCallback getCurrency;
  final SetValueCallback setCurrency;
  final _edgeValue = 10.0;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Expanded(
            flex: 2,
            child: Container(
              padding: EdgeInsets.all(_edgeValue),
              child: Text(
                text,
                style: Theme.of(context).textTheme.body1,
                textAlign: TextAlign.right,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Container(
              color: Colors.deepPurple.shade100,
              padding: EdgeInsets.fromLTRB(_edgeValue, (_edgeValue - 2), 0, (_edgeValue - 2)),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  style: Theme.of(context).textTheme.body1,
                  value: getCurrency().code,
                  onChanged: setCurrency,
                  isDense: true,
                  items: getCurrencies().map((value) {
                    return DropdownMenuItem(
                      value: value.code,
                      child: Text(
                        value.text,
                        style: Theme.of(context).textTheme.body1,
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ContainerStyle extends StatelessWidget {
  const _ContainerStyle({
    Key key,
    @required this.child,
    @required this.animationController,
  }) : super(key: key);
  final Widget child;
  final AnimationController animationController;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(0, 0, 0, containerPadding),
      child: FadeTransition(
        opacity: CurvedAnimation(
          parent: animationController,
          curve: Curves.easeIn,
        ),
        child: Container(
          decoration: BoxDecoration(
            border: Border(
              top: BorderSide(color: Colors.grey.shade300),
              bottom: BorderSide(color: Colors.grey.shade300),
            ),
          ),
          child: ClipRRect(
            clipBehavior: Clip.antiAlias,
            borderRadius: BorderRadius.circular(0),
            child: child,
          ),
        ),
      ),
    );
  }
}

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
    return _ContainerStyle(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          _ValueField(
            text: labelValue,
            controller: c1,
            focusNode: fn1,
          ),
          _CurrencyField(
            text: "Currency",
            getCurrencies: getCurrencies,
            getCurrency: getCurrency,
            setCurrency: setCurrency,
          ),
          _ValueField(
            text: "Currency Rate",
            controller: c2,
            focusNode: fn2,
          ),
        ],
      ),
      animationController: animationController,
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
    return _ContainerStyle(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          _ValueField(
            text: label,
            controller: c1,
            focusNode: fn1,
          ),
        ],
      ),
      animationController: animationController,
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
    return _ContainerStyle(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          _ValueField(
            text: "Discount",
            controller: c1,
            focusNode: fn1,
          ),
          _ValueDisplay(
            label: "Discount Sale Price",
            getValue: getDiscountSalePrice,
          ),
          _ValueDisplay(
            label: "Discount Margin",
            getValue: getDiscountMargin,
          ),
          _ValueDisplay(
            label: "Discount Markup",
            getValue: getDiscountMarkup,
          ),
        ],
      ),
      animationController: animationController,
    );
  }
}

class _Information extends StatelessWidget {
  const _Information({
    Key key,
    @required this.model,
  }) : super(key: key);
  final CalculatorModel model;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        containerPadding,
        0,
        containerPadding,
        containerPadding,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Container(
            padding: EdgeInsets.fromLTRB(0, 0, 0, 4.0),
            child: Text(
              "Exchange rates from ${model.date}",
              style: Theme.of(context).textTheme.caption,
            ),
          ),
          Text(
            "Built by Sam Ward",
            style: Theme.of(context).textTheme.caption,
          ),
        ],
      ),
    );
  }
}
