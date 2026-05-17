import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final double borderRadius;
  final Color? color;
  final double blurStrength;
  final Border? border;
  final double? width;
  final double? height;
  final VoidCallback? onTap;
  final List<BoxShadow>? shadows;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius = 20,
    this.color,
    this.blurStrength = 10,
    this.border,
    this.width,
    this.height,
    this.onTap,
    this.shadows,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blurStrength, sigmaY: blurStrength),
          child: Container(
            width: width,
            height: height,
            padding: padding ?? const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color ?? (isDark ? ResikTheme.glassWhite : Colors.white.withOpacity(0.7)),
              borderRadius: BorderRadius.circular(borderRadius),
              border: border ??
                  Border.all(
                    color: isDark ? ResikTheme.glassBorder : Colors.white.withOpacity(0.6),
                    width: 1.0,
                  ),
              boxShadow: shadows ??
                  [
                    BoxShadow(
                      color: Colors.black.withOpacity(isDark ? 0.3 : 0.08),
                      blurRadius: 20,
                      spreadRadius: -4,
                      offset: const Offset(0, 8),
                    ),
                  ],
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

// Gradient background container
class GradientBackground extends StatelessWidget {
  final Widget child;

  const GradientBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(-0.3, -0.6),
          radius: 1.2,
          colors: [
            Color(0xFF1A3080),
            Color(0xFF0A0E2E),
            Color(0xFF050814),
          ],
          stops: [0.0, 0.6, 1.0],
        ),
      ),
      child: child,
    );
  }
}

// Glow indicator dot
class StatusDot extends StatelessWidget {
  final String status;
  final double size;

  const StatusDot({super.key, required this.status, this.size = 8});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (status) {
      case 'full':
        color = ResikTheme.dangerRed;
        break;
      case 'warning':
        color = ResikTheme.warningOrange;
        break;
      default:
        color = ResikTheme.successGreen;
    }

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.5),
            blurRadius: 6,
            spreadRadius: 1,
          ),
        ],
      ),
    );
  }
}

// Blue glow button
class GlowButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final IconData? icon;
  final bool outline;

  const GlowButton({
    super.key,
    required this.label,
    required this.onTap,
    this.icon,
    this.outline = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: outline ? Colors.transparent : ResikTheme.accentBlue,
          borderRadius: BorderRadius.circular(12),
          border: outline
              ? Border.all(color: ResikTheme.accentBlue, width: 1.5)
              : null,
          boxShadow: outline
              ? null
              : [
                  BoxShadow(
                    color: ResikTheme.accentBlue.withOpacity(0.4),
                    blurRadius: 16,
                    spreadRadius: -2,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 16, color: ResikTheme.white),
              const SizedBox(width: 8),
            ],
            Text(
              label,
              style: const TextStyle(
                color: ResikTheme.white,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Section header
class SectionHeader extends StatelessWidget {
  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  const SectionHeader({
    super.key,
    required this.title,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: ResikTheme.white,
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
        if (actionLabel != null)
          GestureDetector(
            onTap: onAction,
            child: Text(
              actionLabel!,
              style: const TextStyle(
                color: ResikTheme.accentBlue,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
      ],
    );
  }
}
