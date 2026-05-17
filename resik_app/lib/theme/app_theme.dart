import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ResikTheme {
  // Color Palette
  static const Color deepNavy = Color(0xFF0A0E2E);
  static const Color darkBlue = Color(0xFF0D1B4B);
  static const Color midBlue = Color(0xFF1A3080);
  static const Color accentBlue = Color(0xFF2A7FFF);
  static const Color glowBlue = Color(0xFF4DA3FF);
  static const Color lightBlue = Color(0xFF7EC8FF);
  static const Color white = Color(0xFFFFFFFF);
  static const Color offWhite = Color(0xFFF0F4FF);
  static const Color lightGray = Color(0xFFE8EDF5);
  static const Color textGray = Color(0xFF8A9BC0);
  static const Color successGreen = Color(0xFF22C55E);
  static const Color warningOrange = Color(0xFFF59E0B);
  static const Color dangerRed = Color(0xFFEF4444);
  static const Color purple = Color(0xFF8B5CF6);

  // Glass colors
  static const Color glassWhite = Color(0x1AFFFFFF);
  static const Color glassBorder = Color(0x33FFFFFF);
  static const Color glassDark = Color(0x26000000);

  static ThemeData darkTheme() {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: deepNavy,
      primaryColor: accentBlue,
      colorScheme: const ColorScheme.dark(
        primary: accentBlue,
        secondary: glowBlue,
        surface: darkBlue,
        background: deepNavy,
        onPrimary: white,
        onSecondary: white,
        onSurface: white,
        onBackground: white,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: white, fontWeight: FontWeight.w800),
          displayMedium: TextStyle(color: white, fontWeight: FontWeight.w700),
          displaySmall: TextStyle(color: white, fontWeight: FontWeight.w700),
          headlineLarge: TextStyle(color: white, fontWeight: FontWeight.w700),
          headlineMedium: TextStyle(color: white, fontWeight: FontWeight.w600),
          headlineSmall: TextStyle(color: white, fontWeight: FontWeight.w600),
          titleLarge: TextStyle(color: white, fontWeight: FontWeight.w600),
          titleMedium: TextStyle(color: white, fontWeight: FontWeight.w500),
          titleSmall: TextStyle(color: offWhite, fontWeight: FontWeight.w500),
          bodyLarge: TextStyle(color: offWhite),
          bodyMedium: TextStyle(color: lightGray),
          bodySmall: TextStyle(color: textGray),
          labelLarge: TextStyle(color: white, fontWeight: FontWeight.w600),
          labelMedium: TextStyle(color: offWhite),
          labelSmall: TextStyle(color: textGray),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: white),
        titleTextStyle: TextStyle(
          color: white,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accentBlue,
          foregroundColor: white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
          elevation: 0,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.transparent,
        selectedItemColor: accentBlue,
        unselectedItemColor: textGray,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
    );
  }

  static ThemeData lightTheme() {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF0F4FF),
      primaryColor: accentBlue,
      colorScheme: const ColorScheme.light(
        primary: accentBlue,
        secondary: midBlue,
        surface: white,
        background: Color(0xFFF0F4FF),
        onPrimary: white,
        onSecondary: white,
        onSurface: deepNavy,
        onBackground: deepNavy,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: deepNavy),
      ),
    );
  }
}
