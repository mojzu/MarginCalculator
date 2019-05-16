import 'package:flutter/material.dart';
import 'package:margin_calculator/calculator.dart';
import 'package:margin_calculator/calculator_model.dart';
import 'package:scoped_model/scoped_model.dart';

// TODO: Sentry integration.
// <https://github.com/flutter/sentry>

void main() {
  final calculator = CalculatorModel();

  runApp(
    ScopedModel<CalculatorModel>(
      model: calculator,
      child: _App(model: calculator),
    ),
  );
}

class _App extends StatefulWidget {
  const _App({
    Key key,
    @required this.model,
  }) : super(key: key);
  final CalculatorModel model;

  @override
  _AppState createState() => new _AppState(model);
}

class _AppState extends State<_App> {
  _AppState(
    this.model,
  );
  final CalculatorModel model;
  Future<void> fetch;

  @override
  void initState() {
    fetch = model.fetchCurrenciesRates().then((_) {
      setState(() {});
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Margin Calculator',
      theme: ThemeData(
        primarySwatch: Colors.lightGreen,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => FutureBuilder(
              future: fetch,
              builder: (context, snapshot) {
                switch (snapshot.connectionState) {
                  case ConnectionState.none:
                  case ConnectionState.waiting:
                    return Center(child: new CircularProgressIndicator());
                  default:
                    // TODO: Handle error.
                    return Calculator();
                }
              },
            ),
      },
    );
  }
}
