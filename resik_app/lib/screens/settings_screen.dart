import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/glass_card.dart';

class SettingsScreen extends StatelessWidget {
  final UserRole userRole;

  const SettingsScreen({super.key, required this.userRole});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Pengaturan',
              style: TextStyle(
                color: ResikTheme.white,
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 20),
            // Profile card
            _buildProfileCard(),
            const SizedBox(height: 20),
            // Data Insights
            const Text(
              'Data Insights',
              style: TextStyle(
                color: ResikTheme.white,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 14),
            _buildInsightsCards(),
            const SizedBox(height: 20),
            _buildPieSection(),
            const SizedBox(height: 24),
            // Settings sections
            const Text(
              'Akun & Preferensi',
              style: TextStyle(
                color: ResikTheme.white,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 14),
            _buildSettingSection([
              _SettingItem(Icons.person_outline, 'Profil Pengguna', null, ResikTheme.accentBlue),
              _SettingItem(Icons.notifications_outlined, 'Notifikasi', 'Aktif', ResikTheme.accentBlue),
              _SettingItem(Icons.language, 'Bahasa', 'Indonesia', ResikTheme.accentBlue),
              _SettingItem(Icons.dark_mode_outlined, 'Tema Gelap', 'Aktif', ResikTheme.accentBlue),
            ]),
            const SizedBox(height: 16),
            const Text(
              'Sistem & IoT',
              style: TextStyle(
                color: ResikTheme.white,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 14),
            _buildSettingSection([
              _SettingItem(Icons.wifi_outlined, 'Koneksi IoT', 'Terhubung', ResikTheme.successGreen),
              _SettingItem(Icons.sensors, 'Kalibrasi Sensor', null, ResikTheme.warningOrange),
              _SettingItem(Icons.update, 'Pembaruan Sistem', 'v1.0.0', ResikTheme.accentBlue),
              _SettingItem(Icons.security, 'Keamanan Data', null, ResikTheme.accentBlue),
            ]),
            const SizedBox(height: 16),
            const Text(
              'Lainnya',
              style: TextStyle(
                color: ResikTheme.white,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 14),
            _buildSettingSection([
              _SettingItem(Icons.help_outline, 'Bantuan & FAQ', null, ResikTheme.accentBlue),
              _SettingItem(Icons.privacy_tip_outlined, 'Kebijakan Privasi', null, ResikTheme.accentBlue),
              _SettingItem(Icons.info_outline, 'Tentang RESIK', null, ResikTheme.accentBlue),
            ]),
            const SizedBox(height: 20),
            // Logout
            GlassCard(
              padding: const EdgeInsets.symmetric(vertical: 14),
              border: Border.all(color: ResikTheme.dangerRed.withOpacity(0.4)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.logout, color: ResikTheme.dangerRed, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Keluar',
                    style: TextStyle(
                      color: ResikTheme.dangerRed,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileCard() {
    String name, role, location;
    IconData roleIcon;
    Color roleColor;

    switch (userRole) {
      case UserRole.producer:
        name = 'Hotel Pacet Indah';
        role = 'Food Waste Producer';
        location = 'Pacet, Mojokerto';
        roleIcon = Icons.restaurant_outlined;
        roleColor = ResikTheme.accentBlue;
        break;
      case UserRole.wasteManager:
        name = 'Tim Pengelola RESIK';
        role = 'Waste Manager';
        location = 'Sentral Pengolahan Pacet';
        roleIcon = Icons.recycling;
        roleColor = ResikTheme.successGreen;
        break;
      case UserRole.buyer:
        name = 'Pak Budi Santoso';
        role = 'Buyer – Petani Lokal';
        location = 'Trawas, Mojokerto';
        roleIcon = Icons.storefront_outlined;
        roleColor = ResikTheme.purple;
        break;
    }

    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [roleColor.withOpacity(0.8), roleColor.withOpacity(0.3)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Icon(roleIcon, color: Colors.white, size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    color: ResikTheme.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 2),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: roleColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    role,
                    style: TextStyle(
                      color: roleColor,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined,
                        color: ResikTheme.textGray, size: 12),
                    const SizedBox(width: 3),
                    Text(
                      location,
                      style: const TextStyle(
                          color: ResikTheme.textGray, fontSize: 11),
                    ),
                  ],
                ),
              ],
            ),
          ),
          GlassCard(
            padding: const EdgeInsets.all(8),
            borderRadius: 10,
            child: const Icon(Icons.edit_outlined,
                color: ResikTheme.accentBlue, size: 18),
          ),
        ],
      ),
    );
  }

  Widget _buildInsightsCards() {
    return Row(
      children: [
        Expanded(
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            borderRadius: 14,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.delete_sweep_outlined,
                    color: ResikTheme.accentBlue, size: 22),
                const SizedBox(height: 8),
                const Text(
                  '1.2 Ton',
                  style: TextStyle(
                    color: ResikTheme.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const Text(
                  'Total Limbah\nTerkumpul',
                  style: TextStyle(color: ResikTheme.textGray, fontSize: 11),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            borderRadius: 14,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.eco, color: ResikTheme.successGreen, size: 22),
                const SizedBox(height: 8),
                const Text(
                  '480 kg',
                  style: TextStyle(
                    color: ResikTheme.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const Text(
                  'Produk\nDihasilkan',
                  style: TextStyle(color: ResikTheme.textGray, fontSize: 11),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            borderRadius: 14,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.co2, color: ResikTheme.warningOrange, size: 22),
                const SizedBox(height: 8),
                const Text(
                  '0.8 T',
                  style: TextStyle(
                    color: ResikTheme.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const Text(
                  'CO₂\nDikurangi',
                  style: TextStyle(color: ResikTheme.textGray, fontSize: 11),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPieSection() {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Distribusi Produk',
            style: TextStyle(
              color: ResikTheme.white,
              fontWeight: FontWeight.w700,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              SizedBox(
                width: 120,
                height: 120,
                child: PieChart(
                  PieChartData(
                    sectionsSpace: 2,
                    centerSpaceRadius: 30,
                    sections: [
                      PieChartSectionData(
                        value: 45,
                        color: ResikTheme.successGreen,
                        title: '45%',
                        titleStyle: const TextStyle(
                            fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                        radius: 36,
                      ),
                      PieChartSectionData(
                        value: 25,
                        color: ResikTheme.warningOrange,
                        title: '25%',
                        titleStyle: const TextStyle(
                            fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                        radius: 36,
                      ),
                      PieChartSectionData(
                        value: 20,
                        color: ResikTheme.accentBlue,
                        title: '20%',
                        titleStyle: const TextStyle(
                            fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                        radius: 36,
                      ),
                      PieChartSectionData(
                        value: 10,
                        color: ResikTheme.purple,
                        title: '10%',
                        titleStyle: const TextStyle(
                            fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                        radius: 36,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _legend(ResikTheme.successGreen, 'Kompos', '45%'),
                    const SizedBox(height: 8),
                    _legend(ResikTheme.warningOrange, 'Maggot BSF', '25%'),
                    const SizedBox(height: 8),
                    _legend(ResikTheme.accentBlue, 'Eco Enzyme', '20%'),
                    const SizedBox(height: 8),
                    _legend(ResikTheme.purple, 'Lainnya', '10%'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _legend(Color color, String label, String pct) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(color: ResikTheme.textGray, fontSize: 12),
          ),
        ),
        Text(
          pct,
          style: const TextStyle(
            color: ResikTheme.white,
            fontWeight: FontWeight.w700,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingSection(List<_SettingItem> items) {
    return GlassCard(
      padding: EdgeInsets.zero,
      child: Column(
        children: items.asMap().entries.map((entry) {
          final i = entry.key;
          final item = entry.value;
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: item.color.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(item.icon, color: item.color, size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        item.title,
                        style: const TextStyle(
                          color: ResikTheme.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    if (item.value != null)
                      Text(
                        item.value!,
                        style: const TextStyle(
                          color: ResikTheme.textGray,
                          fontSize: 12,
                        ),
                      ),
                    const SizedBox(width: 8),
                    const Icon(Icons.chevron_right,
                        color: ResikTheme.textGray, size: 18),
                  ],
                ),
              ),
              if (i < items.length - 1)
                Container(
                  height: 0.5,
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  color: ResikTheme.glassBorder,
                ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class _SettingItem {
  final IconData icon;
  final String title;
  final String? value;
  final Color color;

  _SettingItem(this.icon, this.title, this.value, this.color);
}
