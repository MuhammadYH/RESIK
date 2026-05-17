// Smart Bin Model
class SmartBin {
  final String id;
  final String location;
  final int capacityLiters;
  final double fillPercentage;
  final DateTime lastPickup;
  final String status; // 'normal', 'warning', 'full'
  final double weightKg;

  SmartBin({
    required this.id,
    required this.location,
    required this.capacityLiters,
    required this.fillPercentage,
    required this.lastPickup,
    required this.status,
    required this.weightKg,
  });
}

// Waste Collection Activity
class WasteActivity {
  final String id;
  final String title;
  final String subtitle;
  final DateTime timestamp;
  final double weightKg;
  final String type; // 'pickup', 'processing', 'delivered'
  final String imageUrl;

  WasteActivity({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.timestamp,
    required this.weightKg,
    required this.type,
    required this.imageUrl,
  });
}

// Marketplace Product
class MarketProduct {
  final String id;
  final String name;
  final String description;
  final double pricePerKg;
  final double availableKg;
  final String category; // 'compost', 'maggot_bsf', 'eco_enzyme', 'organic'
  final String sellerName;
  final double rating;
  final String imageUrl;

  MarketProduct({
    required this.id,
    required this.name,
    required this.description,
    required this.pricePerKg,
    required this.availableKg,
    required this.category,
    required this.sellerName,
    required this.rating,
    required this.imageUrl,
  });
}

// User type enum
enum UserRole { producer, wasteManager, buyer }

// Data chart point
class ChartPoint {
  final String label;
  final double value;

  ChartPoint(this.label, this.value);
}

// Mock Data
class MockData {
  static List<SmartBin> bins = [
    SmartBin(
      id: 'BIN-001',
      location: 'Hotel Pacet Indah - Dapur',
      capacityLiters: 60,
      fillPercentage: 0.78,
      lastPickup: DateTime.now().subtract(const Duration(hours: 6)),
      status: 'warning',
      weightKg: 28.5,
    ),
    SmartBin(
      id: 'BIN-002',
      location: 'Restoran Sari Rasa - Area Makan',
      capacityLiters: 40,
      fillPercentage: 0.45,
      lastPickup: DateTime.now().subtract(const Duration(hours: 12)),
      status: 'normal',
      weightKg: 12.2,
    ),
    SmartBin(
      id: 'BIN-003',
      location: 'Pujasera Pacet - Stand A',
      capacityLiters: 20,
      fillPercentage: 0.92,
      lastPickup: DateTime.now().subtract(const Duration(hours: 2)),
      status: 'full',
      weightKg: 8.7,
    ),
    SmartBin(
      id: 'BIN-004',
      location: 'Villa Tretes - Restoran',
      capacityLiters: 40,
      fillPercentage: 0.25,
      lastPickup: DateTime.now().subtract(const Duration(hours: 20)),
      status: 'normal',
      weightKg: 6.1,
    ),
  ];

  static List<WasteActivity> activities = [
    WasteActivity(
      id: 'ACT-001',
      title: 'Pengambilan Limbah',
      subtitle: 'Hotel Pacet Indah',
      timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      weightKg: 32.5,
      type: 'pickup',
      imageUrl: '',
    ),
    WasteActivity(
      id: 'ACT-002',
      title: 'Pengolahan Kompos',
      subtitle: 'Fasilitas Pengolahan Sentral',
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      weightKg: 45.2,
      type: 'processing',
      imageUrl: '',
    ),
    WasteActivity(
      id: 'ACT-003',
      title: 'Pengiriman Produk',
      subtitle: 'Pupuk ke Petani Lokal',
      timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      weightKg: 18.8,
      type: 'delivered',
      imageUrl: '',
    ),
    WasteActivity(
      id: 'ACT-004',
      title: 'Pengambilan Limbah',
      subtitle: 'Pujasera Pacet Stand B',
      timestamp: DateTime.now().subtract(const Duration(hours: 8)),
      weightKg: 14.3,
      type: 'pickup',
      imageUrl: '',
    ),
  ];

  static List<MarketProduct> products = [
    MarketProduct(
      id: 'PROD-001',
      name: 'Pupuk Kompos Premium',
      description: 'Kompos organik dari limbah restoran, kaya nutrisi untuk tanaman.',
      pricePerKg: 8500,
      availableKg: 120.0,
      category: 'compost',
      sellerName: 'RESIK Processing',
      rating: 4.8,
      imageUrl: '',
    ),
    MarketProduct(
      id: 'PROD-002',
      name: 'Maggot BSF Kering',
      description: 'Pakan ternak berkualitas tinggi dari maggot Black Soldier Fly.',
      pricePerKg: 25000,
      availableKg: 45.0,
      category: 'maggot_bsf',
      sellerName: 'RESIK Processing',
      rating: 4.9,
      imageUrl: '',
    ),
    MarketProduct(
      id: 'PROD-003',
      name: 'Eco Enzyme Multi',
      description: 'Enzim organik serbaguna dari fermentasi limbah buah dan sayuran.',
      pricePerKg: 12000,
      availableKg: 80.0,
      category: 'eco_enzyme',
      sellerName: 'RESIK Processing',
      rating: 4.7,
      imageUrl: '',
    ),
    MarketProduct(
      id: 'PROD-004',
      name: 'Pupuk Cair Organik',
      description: 'Pupuk cair fermentasi tinggi untuk urban farming dan hortikultura.',
      pricePerKg: 15000,
      availableKg: 60.0,
      category: 'organic',
      sellerName: 'RESIK Processing',
      rating: 4.6,
      imageUrl: '',
    ),
  ];

  static List<ChartPoint> weeklyWasteData = [
    ChartPoint('Sen', 42.5),
    ChartPoint('Sel', 38.2),
    ChartPoint('Rab', 55.8),
    ChartPoint('Kam', 48.3),
    ChartPoint('Jum', 62.1),
    ChartPoint('Sab', 71.4),
    ChartPoint('Min', 59.7),
  ];

  static Map<String, double> productionBreakdown = {
    'Kompos': 45.0,
    'Maggot BSF': 25.0,
    'Eco Enzyme': 20.0,
    'Lainnya': 10.0,
  };
}
