import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/glass_card.dart';
import 'home_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with TickerProviderStateMixin {
  late AnimationController _orbitController;
  late AnimationController _fadeController;
  UserRole? _selectedRole;

  @override
  void initState() {
    super.initState();
    _orbitController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..forward();
  }

  @override
  void dispose() {
    _orbitController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  void _selectRole(UserRole role) {
    setState(() => _selectedRole = role);
    Future.delayed(const Duration(milliseconds: 300), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => HomeScreen(userRole: role),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeController,
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 32),
                    // Animated logo
                    _buildOrbitAnimation(),
                    const SizedBox(height: 24),
                    // App name
                    ShaderMask(
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [ResikTheme.glowBlue, ResikTheme.lightBlue],
                      ).createShader(bounds),
                      child: const Text(
                        'RESIK',
                        style: TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 6,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Circular Food Waste Ecosystem',
                      style: TextStyle(
                        color: ResikTheme.textGray,
                        fontSize: 14,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 48),
                    const Text(
                      'Pilih Peran Anda',
                      style: TextStyle(
                        color: ResikTheme.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Bergabunglah dalam ekosistem ekonomi\nsirkular pariwisata Indonesia',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: ResikTheme.textGray,
                        fontSize: 14,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 32),
                    // Role cards
                    _buildRoleCard(
                      role: UserRole.producer,
                      icon: Icons.restaurant_outlined,
                      title: 'Food Waste Producer',
                      subtitle: 'Hotel, Restoran, Katering & Wisata Kuliner',
                      description:
                          'Kelola smart bin dan pantau limbah makanan secara real-time',
                      gradient: [
                        const Color(0xFF1A3080),
                        const Color(0xFF2A7FFF),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildRoleCard(
                      role: UserRole.wasteManager,
                      icon: Icons.recycling_outlined,
                      title: 'Waste Manager',
                      subtitle: 'Pengelola & Pengangkut Limbah',
                      description:
                          'Terima notifikasi pickup dan olah limbah jadi produk bernilai',
                      gradient: [
                        const Color(0xFF0A3D2E),
                        const Color(0xFF22C55E),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildRoleCard(
                      role: UserRole.buyer,
                      icon: Icons.storefront_outlined,
                      title: 'Buyer',
                      subtitle: 'Petani, Peternak & UMKM Organik',
                      description:
                          'Beli pupuk kompos, maggot BSF & eco enzyme berkualitas',
                      gradient: [
                        const Color(0xFF3D1A80),
                        const Color(0xFF8B5CF6),
                      ],
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOrbitAnimation() {
    return SizedBox(
      width: 120,
      height: 120,
      child: AnimatedBuilder(
        animation: _orbitController,
        builder: (context, _) {
          return Stack(
            alignment: Alignment.center,
            children: [
              // Glow core
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      ResikTheme.accentBlue.withOpacity(0.9),
                      ResikTheme.midBlue.withOpacity(0.3),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: ResikTheme.accentBlue.withOpacity(0.6),
                      blurRadius: 24,
                      spreadRadius: 4,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.eco,
                  color: Colors.white,
                  size: 28,
                ),
              ),
              // Orbiting dots
              ..._buildOrbitingDots(),
            ],
          );
        },
      ),
    );
  }

  List<Widget> _buildOrbitingDots() {
    final dots = [
      (0.0, ResikTheme.successGreen, 48.0),
      (0.33, ResikTheme.warningOrange, 44.0),
      (0.66, ResikTheme.purple, 46.0),
    ];

    return dots.map((dot) {
      final angle = (_orbitController.value + dot.$1) * 2 * pi;
      final radius = dot.$3;
      return Positioned(
        left: 60 + radius * cos(angle) - 5,
        top: 60 + radius * sin(angle) - 5,
        child: Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: dot.$2,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: dot.$2.withOpacity(0.8),
                blurRadius: 6,
                spreadRadius: 1,
              ),
            ],
          ),
        ),
      );
    }).toList();
  }

  Widget _buildRoleCard({
    required UserRole role,
    required IconData icon,
    required String title,
    required String subtitle,
    required String description,
    required List<Color> gradient,
  }) {
    final isSelected = _selectedRole == role;

    return GestureDetector(
      onTap: () => _selectRole(role),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradient.map((c) => c.withOpacity(0.3)).toList(),
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? gradient[1]
                : ResikTheme.glassBorder,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: gradient[1].withOpacity(0.3),
                    blurRadius: 20,
                    spreadRadius: -2,
                  )
                ]
              : [],
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: gradient),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: gradient[1].withOpacity(0.4),
                    blurRadius: 12,
                    spreadRadius: -2,
                  ),
                ],
              ),
              child: Icon(icon, color: Colors.white, size: 26),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: ResikTheme.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: gradient[1].withOpacity(0.9),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: const TextStyle(
                      color: ResikTheme.textGray,
                      fontSize: 12,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle : Icons.arrow_forward_ios,
              color: isSelected ? gradient[1] : ResikTheme.textGray,
              size: isSelected ? 22 : 16,
            ),
          ],
        ),
      ),
    );
  }
}
