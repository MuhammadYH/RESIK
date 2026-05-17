import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final _notifications = [
    _NotifData(
      icon: Icons.warning_amber_rounded,
      color: ResikTheme.dangerRed,
      title: 'Smart Bin BIN-003 Penuh!',
      body: 'Pujasera Pacet Stand A telah mencapai kapasitas 92%. Segera lakukan pengambilan limbah.',
      time: '5 menit lalu',
      isRead: false,
      type: 'alert',
    ),
    _NotifData(
      icon: Icons.local_shipping_outlined,
      color: ResikTheme.accentBlue,
      title: 'Pickup Dijadwalkan',
      body: 'Petugas akan mengambil limbah dari Hotel Pacet Indah pada pukul 14.00 WIB hari ini.',
      time: '30 menit lalu',
      isRead: false,
      type: 'info',
    ),
    _NotifData(
      icon: Icons.check_circle_outline,
      color: ResikTheme.successGreen,
      title: 'Pickup Selesai',
      body: 'Pengambilan limbah dari Restoran Sari Rasa berhasil. 32.5 kg limbah telah diangkut.',
      time: '2 jam lalu',
      isRead: true,
      type: 'success',
    ),
    _NotifData(
      icon: Icons.recycling,
      color: ResikTheme.successGreen,
      title: 'Produk Siap Dijual',
      body: 'Pengolahan 120 kg kompos organik selesai dan sudah tersedia di marketplace.',
      time: '4 jam lalu',
      isRead: true,
      type: 'success',
    ),
    _NotifData(
      icon: Icons.info_outline_rounded,
      color: ResikTheme.warningOrange,
      title: 'Smart Bin BIN-001 Hampir Penuh',
      body: 'Hotel Pacet Indah – Dapur mencapai kapasitas 78%. Jadwalkan pickup dalam 24 jam.',
      time: '6 jam lalu',
      isRead: true,
      type: 'warning',
    ),
    _NotifData(
      icon: Icons.shopping_bag_outlined,
      color: ResikTheme.purple,
      title: 'Pesanan Baru Masuk',
      body: 'Ada pesanan 15 kg pupuk kompos dari Pak Budi – Petani Pacet.',
      time: '8 jam lalu',
      isRead: true,
      type: 'info',
    ),
    _NotifData(
      icon: Icons.eco_outlined,
      color: ResikTheme.successGreen,
      title: 'Selamat! Target Mingguan Tercapai',
      body: 'RESIK berhasil mengumpulkan 378 kg limbah makanan minggu ini. Terus tingkatkan!',
      time: '1 hari lalu',
      isRead: true,
      type: 'success',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final unread = _notifications.where((n) => !n.isRead).length;

    return SafeArea(
      bottom: false,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Notifikasi',
                      style: TextStyle(
                        color: ResikTheme.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    if (unread > 0)
                      Text(
                        '$unread notifikasi belum dibaca',
                        style: const TextStyle(
                            color: ResikTheme.textGray, fontSize: 13),
                      ),
                  ],
                ),
                GestureDetector(
                  onTap: () => setState(() {
                    for (var n in _notifications) {
                      n.isRead = true;
                    }
                  }),
                  child: GlassCard(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    borderRadius: 12,
                    child: const Text(
                      'Tandai Semua Dibaca',
                      style: TextStyle(
                        color: ResikTheme.accentBlue,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Icon summary row
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
            child: Row(
              children: [
                _iconStat(Icons.warning_amber_rounded, ResikTheme.dangerRed,
                    'Alert', '1'),
                const SizedBox(width: 10),
                _iconStat(Icons.local_shipping_outlined, ResikTheme.accentBlue,
                    'Pickup', '2'),
                const SizedBox(width: 10),
                _iconStat(Icons.check_circle_outline, ResikTheme.successGreen,
                    'Selesai', '3'),
                const SizedBox(width: 10),
                _iconStat(Icons.shopping_bag_outlined, ResikTheme.purple,
                    'Pesanan', '1'),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              itemCount: _notifications.length,
              itemBuilder: (ctx, i) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _NotifCard(
                  data: _notifications[i],
                  onTap: () => setState(() => _notifications[i].isRead = true),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _iconStat(IconData icon, Color color, String label, String count) {
    return Expanded(
      child: GlassCard(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
        borderRadius: 12,
        child: Column(
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(icon, color: color, size: 22),
                Positioned(
                  right: -6,
                  top: -6,
                  child: Container(
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        count,
                        style: const TextStyle(
                          color: ResikTheme.white,
                          fontSize: 8,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(color: ResikTheme.textGray, fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}

class _NotifData {
  final IconData icon;
  final Color color;
  final String title;
  final String body;
  final String time;
  bool isRead;
  final String type;

  _NotifData({
    required this.icon,
    required this.color,
    required this.title,
    required this.body,
    required this.time,
    required this.isRead,
    required this.type,
  });
}

class _NotifCard extends StatelessWidget {
  final _NotifData data;
  final VoidCallback onTap;

  const _NotifCard({required this.data, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(16),
        color: data.isRead
            ? ResikTheme.glassWhite
            : data.color.withOpacity(0.08),
        border: Border.all(
          color: data.isRead
              ? ResikTheme.glassBorder
              : data.color.withOpacity(0.3),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: data.color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(data.icon, color: data.color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          data.title,
                          style: TextStyle(
                            color: ResikTheme.white,
                            fontWeight: data.isRead
                                ? FontWeight.w500
                                : FontWeight.w700,
                            fontSize: 13,
                          ),
                        ),
                      ),
                      if (!data.isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: data.color,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    data.body,
                    style: const TextStyle(
                      color: ResikTheme.textGray,
                      fontSize: 11,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    data.time,
                    style: const TextStyle(
                      color: ResikTheme.textGray,
                      fontSize: 10,
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
}
