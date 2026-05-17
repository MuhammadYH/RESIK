import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/glass_card.dart';

class SmartBinScreen extends StatefulWidget {
  final UserRole userRole;

  const SmartBinScreen({super.key, required this.userRole});

  @override
  State<SmartBinScreen> createState() => _SmartBinScreenState();
}

class _SmartBinScreenState extends State<SmartBinScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _filterStatus = 'all';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<SmartBin> get _filteredBins {
    if (_filterStatus == 'all') return MockData.bins;
    return MockData.bins.where((b) => b.status == _filterStatus).toList();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Smart Bin Monitor',
                      style: TextStyle(
                        color: ResikTheme.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    GlassCard(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      borderRadius: 12,
                      child: Row(
                        children: [
                          const Icon(Icons.add, color: ResikTheme.accentBlue, size: 16),
                          const SizedBox(width: 4),
                          const Text(
                            'Tambah Bin',
                            style: TextStyle(
                              color: ResikTheme.accentBlue,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'Pantau kapasitas limbah secara real-time',
                  style: TextStyle(color: ResikTheme.textGray, fontSize: 13),
                ),
                const SizedBox(height: 20),
                // Summary row
                _buildSummaryRow(),
                const SizedBox(height: 20),
                // Filter chips
                _buildFilterChips(),
                const SizedBox(height: 16),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              itemCount: _filteredBins.length,
              itemBuilder: (ctx, i) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _BinDetailCard(
                  bin: _filteredBins[i],
                  userRole: widget.userRole,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow() {
    int total = MockData.bins.length;
    int normal = MockData.bins.where((b) => b.status == 'normal').length;
    int warning = MockData.bins.where((b) => b.status == 'warning').length;
    int full = MockData.bins.where((b) => b.status == 'full').length;

    return Row(
      children: [
        _statChip('$total', 'Total', ResikTheme.accentBlue),
        const SizedBox(width: 10),
        _statChip('$normal', 'Normal', ResikTheme.successGreen),
        const SizedBox(width: 10),
        _statChip('$warning', 'Hampir', ResikTheme.warningOrange),
        const SizedBox(width: 10),
        _statChip('$full', 'Penuh', ResikTheme.dangerRed),
      ],
    );
  }

  Widget _statChip(String value, String label, Color color) {
    return Expanded(
      child: GlassCard(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        borderRadius: 12,
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                color: color,
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              label,
              style: const TextStyle(color: ResikTheme.textGray, fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChips() {
    final filters = [
      ('all', 'Semua'),
      ('normal', 'Normal'),
      ('warning', 'Hampir'),
      ('full', 'Penuh'),
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((f) {
          final isActive = _filterStatus == f.$1;
          return GestureDetector(
            onTap: () => setState(() => _filterStatus = f.$1),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(right: 10),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isActive
                    ? ResikTheme.accentBlue
                    : ResikTheme.glassWhite,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isActive
                      ? ResikTheme.accentBlue
                      : ResikTheme.glassBorder,
                ),
              ),
              child: Text(
                f.$2,
                style: TextStyle(
                  color: isActive ? ResikTheme.white : ResikTheme.textGray,
                  fontSize: 12,
                  fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _BinDetailCard extends StatelessWidget {
  final SmartBin bin;
  final UserRole userRole;

  const _BinDetailCard({required this.bin, required this.userRole});

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    String statusText;
    IconData statusIcon;
    switch (bin.status) {
      case 'full':
        statusColor = ResikTheme.dangerRed;
        statusText = 'Penuh - Segera Pickup!';
        statusIcon = Icons.warning_amber_rounded;
        break;
      case 'warning':
        statusColor = ResikTheme.warningOrange;
        statusText = 'Hampir Penuh';
        statusIcon = Icons.info_outline_rounded;
        break;
      default:
        statusColor = ResikTheme.successGreen;
        statusText = 'Normal';
        statusIcon = Icons.check_circle_outline;
    }

    final diff = DateTime.now().difference(bin.lastPickup);
    final hoursAgo = diff.inHours;

    return GlassCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            children: [
              // Bin icon with fill indicator
              SizedBox(
                width: 52,
                height: 52,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: statusColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: statusColor.withOpacity(0.3),
                        ),
                      ),
                    ),
                    Icon(Icons.delete_outline, color: statusColor, size: 26),
                    Positioned(
                      bottom: 4,
                      right: 4,
                      child: StatusDot(status: bin.status, size: 8),
                    ),
                  ],
                ),
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
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined,
                            color: ResikTheme.textGray, size: 12),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            bin.location,
                            style: const TextStyle(
                              color: ResikTheme.textGray,
                              fontSize: 11,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: statusColor.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(statusIcon, color: statusColor, size: 12),
                    const SizedBox(width: 4),
                    Text(
                      statusText,
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Fill bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Kapasitas ${bin.capacityLiters}L',
                style: const TextStyle(color: ResikTheme.textGray, fontSize: 12),
              ),
              Text(
                '${(bin.fillPercentage * 100).toInt()}% terisi',
                style: TextStyle(
                  color: statusColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: bin.fillPercentage,
              backgroundColor: ResikTheme.glassWhite,
              valueColor: AlwaysStoppedAnimation<Color>(statusColor),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 14),
          // Stats row
          Row(
            children: [
              _infoItem(Icons.scale_outlined, '${bin.weightKg} kg', 'Berat'),
              _divider(),
              _infoItem(Icons.access_time, '$hoursAgo jam lalu', 'Pickup Terakhir'),
              _divider(),
              _infoItem(Icons.inventory_2_outlined, '${bin.capacityLiters}L', 'Kapasitas'),
            ],
          ),
          const SizedBox(height: 16),
          // Action buttons
          if (userRole == UserRole.producer)
            Row(
              children: [
                Expanded(
                  child: _actionBtn(
                    'Detail Bin',
                    Icons.bar_chart_outlined,
                    ResikTheme.accentBlue,
                    outline: true,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _actionBtn(
                    'Minta Pickup',
                    Icons.local_shipping_outlined,
                    statusColor,
                  ),
                ),
              ],
            )
          else if (userRole == UserRole.wasteManager)
            Row(
              children: [
                Expanded(
                  child: _actionBtn(
                    'Tandai Selesai',
                    Icons.check_circle_outline,
                    ResikTheme.successGreen,
                    outline: true,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _actionBtn(
                    'Mulai Pickup',
                    Icons.local_shipping_outlined,
                    ResikTheme.accentBlue,
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _infoItem(IconData icon, String value, String label) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, color: ResikTheme.textGray, size: 16),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: ResikTheme.white,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
          Text(
            label,
            style: const TextStyle(color: ResikTheme.textGray, fontSize: 10),
          ),
        ],
      ),
    );
  }

  Widget _divider() {
    return Container(
      width: 1,
      height: 36,
      color: ResikTheme.glassBorder,
    );
  }

  Widget _actionBtn(String label, IconData icon, Color color,
      {bool outline = false}) {
    return GestureDetector(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: outline ? Colors.transparent : color.withOpacity(0.15),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.5)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 15),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
