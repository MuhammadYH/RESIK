import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/glass_card.dart';
import 'smart_bin_screen.dart';
import 'marketplace_screen.dart';
import 'notifications_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatefulWidget {
  final UserRole userRole;

  const HomeScreen({super.key, required this.userRole});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      DashboardPage(userRole: widget.userRole),
      SmartBinScreen(userRole: widget.userRole),
      MarketplaceScreen(),
      NotificationsScreen(),
      SettingsScreen(userRole: widget.userRole),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: _pages[_currentIndex],
      ),
      extendBody: true,
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: GlassCard(
        padding: const EdgeInsets.symmetric(vertical: 4),
        borderRadius: 24,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _navItem(0, Icons.dashboard_rounded, 'Beranda'),
            _navItem(1, Icons.inventory_2_outlined, 'Smart Bin'),
            _navItem(2, Icons.storefront_outlined, 'Pasar'),
            _navItem(3, Icons.notifications_outlined, 'Notifikasi'),
            _navItem(4, Icons.settings_outlined, 'Pengaturan'),
          ],
        ),
      ),
    );
  }

  Widget _navItem(int index, IconData icon, String label) {
    final isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? ResikTheme.accentBlue.withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isActive ? ResikTheme.accentBlue : ResikTheme.textGray,
              size: 22,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                color: isActive ? ResikTheme.accentBlue : ResikTheme.textGray,
                fontSize: 9,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Dashboard page
class DashboardPage extends StatelessWidget {
  final UserRole userRole;

  const DashboardPage({super.key, required this.userRole});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            _buildHeader(),
            const SizedBox(height: 24),
            _buildSummaryCards(),
            const SizedBox(height: 24),
            _buildWeeklyChart(),
            const SizedBox(height: 24),
            _buildBinStatus(),
            const SizedBox(height: 24),
            _buildRecentActivity(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    String greeting = _getGreeting();
    String roleLabel = _getRoleLabel();

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              greeting,
              style: const TextStyle(
                color: ResikTheme.textGray,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 2),
            const Text(
              'Selamat Datang 👋',
              style: TextStyle(
                color: ResikTheme.white,
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: ResikTheme.accentBlue.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: ResikTheme.accentBlue.withOpacity(0.4)),
              ),
              child: Text(
                roleLabel,
                style: const TextStyle(
                  color: ResikTheme.accentBlue,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        GlassCard(
          padding: const EdgeInsets.all(10),
          borderRadius: 16,
          child: Stack(
            children: [
              const Icon(Icons.person_outline, color: ResikTheme.white, size: 28),
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: ResikTheme.dangerRed,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryCards() {
    final cards = _getSummaryCards();
    return Row(
      children: cards
          .map(
            (c) => Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  right: c != cards.last ? 12 : 0,
                ),
                child: GlassCard(
                  padding: const EdgeInsets.all(14),
                  borderRadius: 16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: c['color'].withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(c['icon'], color: c['color'], size: 18),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        c['value'],
                        style: const TextStyle(
                          color: ResikTheme.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        c['label'],
                        style: const TextStyle(
                          color: ResikTheme.textGray,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildWeeklyChart() {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Data Limbah Mingguan',
                style: TextStyle(
                  color: ResikTheme.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: ResikTheme.successGreen.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Minggu ini',
                  style: TextStyle(
                    color: ResikTheme.successGreen,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Total: 378.0 kg terkumpul',
            style: TextStyle(color: ResikTheme.textGray, fontSize: 12),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 150,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 20,
                  getDrawingHorizontalLine: (_) => FlLine(
                    color: ResikTheme.glassBorder,
                    strokeWidth: 0.8,
                  ),
                ),
                titlesData: FlTitlesData(
                  leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        final labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                        if (value.toInt() < labels.length) {
                          return Text(
                            labels[value.toInt()],
                            style: const TextStyle(
                              color: ResikTheme.textGray,
                              fontSize: 10,
                            ),
                          );
                        }
                        return const Text('');
                      },
                    ),
                  ),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: MockData.weeklyWasteData
                        .asMap()
                        .entries
                        .map((e) => FlSpot(e.key.toDouble(), e.value.value))
                        .toList(),
                    isCurved: true,
                    color: ResikTheme.accentBlue,
                    barWidth: 2.5,
                    isStrokeCapRound: true,
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, _, __, ___) => FlDotCirclePainter(
                        radius: 3,
                        color: ResikTheme.white,
                        strokeWidth: 2,
                        strokeColor: ResikTheme.accentBlue,
                      ),
                    ),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          ResikTheme.accentBlue.withOpacity(0.3),
                          ResikTheme.accentBlue.withOpacity(0.0),
                        ],
                      ),
                    ),
                  ),
                ],
                minY: 0,
                maxY: 100,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBinStatus() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(title: 'Status Smart Bin', actionLabel: 'Lihat Semua'),
        const SizedBox(height: 14),
        ...MockData.bins.take(3).map((bin) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _BinCard(bin: bin),
            )),
      ],
    );
  }

  Widget _buildRecentActivity() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionHeader(title: 'Aktivitas Terkini', actionLabel: 'Lihat Semua'),
        const SizedBox(height: 14),
        ...MockData.activities.take(3).map((act) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _ActivityCard(activity: act),
            )),
      ],
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Selamat Pagi ☀️';
    if (hour < 17) return 'Selamat Siang 🌤️';
    return 'Selamat Malam 🌙';
  }

  String _getRoleLabel() {
    switch (userRole) {
      case UserRole.producer:
        return 'Food Waste Producer';
      case UserRole.wasteManager:
        return 'Waste Manager';
      case UserRole.buyer:
        return 'Buyer';
    }
  }

  List<Map<String, dynamic>> _getSummaryCards() {
    switch (userRole) {
      case UserRole.producer:
        return [
          {'value': '4', 'label': 'Smart Bin', 'icon': Icons.delete_outline, 'color': ResikTheme.accentBlue},
          {'value': '142kg', 'label': 'Limbah/Hari', 'icon': Icons.scale_outlined, 'color': ResikTheme.warningOrange},
          {'value': '1', 'label': 'Perlu Pickup', 'icon': Icons.warning_amber_outlined, 'color': ResikTheme.dangerRed},
        ];
      case UserRole.wasteManager:
        return [
          {'value': '12', 'label': 'Pickup Hari Ini', 'icon': Icons.local_shipping_outlined, 'color': ResikTheme.accentBlue},
          {'value': '483kg', 'label': 'Diolah', 'icon': Icons.recycling, 'color': ResikTheme.successGreen},
          {'value': '3', 'label': 'Notifikasi Baru', 'icon': Icons.notifications_active_outlined, 'color': ResikTheme.dangerRed},
        ];
      case UserRole.buyer:
        return [
          {'value': '4', 'label': 'Produk', 'icon': Icons.inventory_outlined, 'color': ResikTheme.accentBlue},
          {'value': '3', 'label': 'Pesanan Aktif', 'icon': Icons.shopping_bag_outlined, 'color': ResikTheme.successGreen},
          {'value': '12%', 'label': 'Diskon', 'icon': Icons.local_offer_outlined, 'color': ResikTheme.warningOrange},
        ];
    }
  }
}

class _BinCard extends StatelessWidget {
  final SmartBin bin;

  const _BinCard({required this.bin});

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    String statusText;
    switch (bin.status) {
      case 'full':
        statusColor = ResikTheme.dangerRed;
        statusText = 'Penuh';
        break;
      case 'warning':
        statusColor = ResikTheme.warningOrange;
        statusText = 'Hampir Penuh';
        break;
      default:
        statusColor = ResikTheme.successGreen;
        statusText = 'Normal';
    }

    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: statusColor.withOpacity(0.3)),
            ),
            child: Icon(Icons.delete_outline, color: statusColor, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  bin.id,
                  style: const TextStyle(
                    color: ResikTheme.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  bin.location,
                  style: const TextStyle(
                    color: ResikTheme.textGray,
                    fontSize: 11,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: bin.fillPercentage,
                          backgroundColor: ResikTheme.glassWhite,
                          valueColor: AlwaysStoppedAnimation<Color>(statusColor),
                          minHeight: 5,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${(bin.fillPercentage * 100).toInt()}%',
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  statusText,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${bin.capacityLiters}L',
                style: const TextStyle(
                  color: ResikTheme.textGray,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActivityCard extends StatelessWidget {
  final WasteActivity activity;

  const _ActivityCard({required this.activity});

  @override
  Widget build(BuildContext context) {
    IconData icon;
    Color color;
    switch (activity.type) {
      case 'pickup':
        icon = Icons.local_shipping_outlined;
        color = ResikTheme.accentBlue;
        break;
      case 'processing':
        icon = Icons.recycling;
        color = ResikTheme.successGreen;
        break;
      default:
        icon = Icons.check_circle_outline;
        color = ResikTheme.purple;
    }

    final diff = DateTime.now().difference(activity.timestamp);
    String timeAgo;
    if (diff.inHours < 1) {
      timeAgo = '${diff.inMinutes} menit lalu';
    } else {
      timeAgo = '${diff.inHours} jam lalu';
    }

    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activity.title,
                  style: const TextStyle(
                    color: ResikTheme.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
                Text(
                  activity.subtitle,
                  style: const TextStyle(
                    color: ResikTheme.textGray,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${activity.weightKg} kg',
                style: const TextStyle(
                  color: ResikTheme.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                ),
              ),
              Text(
                timeAgo,
                style: const TextStyle(
                  color: ResikTheme.textGray,
                  fontSize: 10,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
