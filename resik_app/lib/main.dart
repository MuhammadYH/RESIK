import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/app_theme.dart';
import 'screens/onboarding_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Colors.transparent,
  ));
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  runApp(const ResikApp());
}

class ResikApp extends StatelessWidget {
  const ResikApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RESIK - Circular Food Waste Ecosystem',
      debugShowCheckedModeBanner: false,
      theme: ResikTheme.darkTheme(),
      home: const OnboardingScreen(),
    );
  }
}
