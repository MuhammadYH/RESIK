import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/glass_card.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  String _selectedCategory = 'all';
  final _searchController = TextEditingController();

  final categories = [
    ('all', 'Semua', Icons.grid_view_rounded),
    ('compost', 'Kompos', Icons.grass),
    ('maggot_bsf', 'Maggot BSF', Icons.pest_control),
    ('eco_enzyme', 'Eco Enzyme', Icons.science_outlined),
    ('organic', 'Organik', Icons.eco_outlined),
  ];

  List<MarketProduct> get _filtered {
    final q = _searchController.text.toLowerCase();
    return MockData.products.where((p) {
      final matchCat = _selectedCategory == 'all' || p.category == _selectedCategory;
      final matchQ = q.isEmpty || p.name.toLowerCase().contains(q);
      return matchCat && matchQ;
    }).toList();
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
                const Text(
                  'Circular Marketplace',
                  style: TextStyle(
                    color: ResikTheme.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  'Produk hasil olahan limbah berkualitas',
                  style: TextStyle(color: ResikTheme.textGray, fontSize: 13),
                ),
                const SizedBox(height: 16),
                // Search bar
                GlassCard(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  borderRadius: 14,
                  child: Row(
                    children: [
                      const Icon(Icons.search, color: ResikTheme.textGray, size: 20),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          onChanged: (_) => setState(() {}),
                          style: const TextStyle(color: ResikTheme.white, fontSize: 14),
                          decoration: const InputDecoration(
                            hintText: 'Cari produk...',
                            hintStyle: TextStyle(color: ResikTheme.textGray),
                            border: InputBorder.none,
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Category chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: categories.map((c) {
                      final isActive = _selectedCategory == c.$1;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedCategory = c.$1),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.only(right: 10),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 8),
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
                          child: Row(
                            children: [
                              Icon(c.$3,
                                  size: 14,
                                  color: isActive
                                      ? ResikTheme.white
                                      : ResikTheme.textGray),
                              const SizedBox(width: 6),
                              Text(
                                c.$2,
                                style: TextStyle(
                                  color: isActive
                                      ? ResikTheme.white
                                      : ResikTheme.textGray,
                                  fontSize: 12,
                                  fontWeight: isActive
                                      ? FontWeight.w700
                                      : FontWeight.w400,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
          Expanded(
            child: _filtered.isEmpty
                ? _buildEmpty()
                : GridView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 0.72,
                    ),
                    itemCount: _filtered.length,
                    itemBuilder: (ctx, i) => _ProductCard(product: _filtered[i]),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, color: ResikTheme.textGray, size: 48),
          const SizedBox(height: 12),
          const Text(
            'Produk tidak ditemukan',
            style: TextStyle(color: ResikTheme.textGray, fontSize: 14),
          ),
        ],
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final MarketProduct product;

  const _ProductCard({required this.product});

  Color get _catColor {
    switch (product.category) {
      case 'compost': return ResikTheme.successGreen;
      case 'maggot_bsf': return ResikTheme.warningOrange;
      case 'eco_enzyme': return ResikTheme.accentBlue;
      default: return ResikTheme.purple;
    }
  }

  IconData get _catIcon {
    switch (product.category) {
      case 'compost': return Icons.grass;
      case 'maggot_bsf': return Icons.pest_control;
      case 'eco_enzyme': return Icons.science_outlined;
      default: return Icons.eco_outlined;
    }
  }

  String get _catLabel {
    switch (product.category) {
      case 'compost': return 'Kompos';
      case 'maggot_bsf': return 'Maggot BSF';
      case 'eco_enzyme': return 'Eco Enzyme';
      default: return 'Organik';
    }
  }

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product image placeholder
          Container(
            width: double.infinity,
            height: 90,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _catColor.withOpacity(0.2),
                  _catColor.withOpacity(0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _catColor.withOpacity(0.2)),
            ),
            child: Center(
              child: Icon(_catIcon, color: _catColor, size: 40),
            ),
          ),
          const SizedBox(height: 10),
          // Category badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: _catColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              _catLabel,
              style: TextStyle(
                color: _catColor,
                fontSize: 9,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            product.name,
            style: const TextStyle(
              color: ResikTheme.white,
              fontWeight: FontWeight.w700,
              fontSize: 13,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          // Rating
          Row(
            children: [
              const Icon(Icons.star, color: Colors.amber, size: 12),
              const SizedBox(width: 3),
              Text(
                product.rating.toString(),
                style: const TextStyle(
                  color: ResikTheme.textGray,
                  fontSize: 10,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                '${product.availableKg.toInt()} kg tersedia',
                style: const TextStyle(
                  color: ResikTheme.textGray,
                  fontSize: 10,
                ),
              ),
            ],
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Harga/kg',
                    style: TextStyle(color: ResikTheme.textGray, fontSize: 9),
                  ),
                  Text(
                    'Rp ${_formatPrice(product.pricePerKg.toInt())}',
                    style: const TextStyle(
                      color: ResikTheme.white,
                      fontWeight: FontWeight.w800,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: ResikTheme.accentBlue,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: ResikTheme.accentBlue.withOpacity(0.4),
                        blurRadius: 8,
                        spreadRadius: -2,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.add_shopping_cart,
                    color: ResikTheme.white,
                    size: 14,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatPrice(int price) {
    if (price >= 1000) {
      return '${(price / 1000).toStringAsFixed(price % 1000 == 0 ? 0 : 1)}k';
    }
    return price.toString();
  }
}
