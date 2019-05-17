import 'package:flutter/material.dart';
import 'package:margin_calculator/calculator.dart';
import 'package:margin_calculator/calculator_model.dart';
import 'package:scoped_model/scoped_model.dart';
// import 'package:flutter/scheduler.dart' show timeDilation;
// // Enable to slow animations.
// timeDilation = 5.0;

// TODO: Sentry integration.
// <https://github.com/flutter/sentry>

void main() {
  final calculator = CalculatorModel();

  runApp(
    ScopedModel<CalculatorModel>(
      model: calculator,
      child: _App(),
    ),
  );
}

class _App extends StatelessWidget {
  const _App({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var model = CalculatorModel.of(context);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Margin Calculator',
      theme: ThemeData(
        primarySwatch: Colors.lightGreen,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => Calculator(model: model),
      },
    );
  }
}
