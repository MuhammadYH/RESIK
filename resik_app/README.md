# RESIK - Circular Food Waste Ecosystem App

**Rekayasa Efisiensi Sistem Industri Kepariwisataan Berbasis Circular Food Waste Ecosystem**

Flutter mobile application for managing food waste in the tourism industry using IoT smart bins, real-time monitoring, and a circular economy marketplace.

---

## 🎨 Design Reference
Based on the provided UI mockup: glassmorphism aesthetic with deep navy/dark blue gradient background, glowing blue accents, and frosted glass card components.

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Onboarding** | Animated role selection (Producer / Waste Manager / Buyer) |
| **Dashboard** | Role-specific KPIs, weekly waste chart, bin status, recent activity |
| **Smart Bin Monitor** | Real-time fill level, status filters, pickup requests |
| **Circular Marketplace** | Product catalog with search & category filters |
| **Notifications** | Alerts for full bins, pickups, and orders |
| **Settings** | Profile, data insights (pie chart), IoT status, preferences |

---

## 👤 User Roles

- **Food Waste Producer** — Hotels, restaurants, caterers: manage smart bins, request pickup
- **Waste Manager** — Collection & processing teams: receive alerts, process waste into products
- **Buyer** — Farmers, livestock owners, SMEs: purchase compost, maggot BSF, eco enzyme

---

## 🛠 Setup

### Prerequisites
- Flutter SDK ≥ 3.0.0
- Dart ≥ 3.0.0

### Installation

```bash
cd resik_app
flutter pub get
flutter run
```

### Dependencies

```yaml
fl_chart: ^0.68.0          # Line & pie charts
percent_indicator: ^4.2.3  # Progress indicators
flutter_animate: ^4.5.0    # Animations
google_fonts: ^6.2.1       # Plus Jakarta Sans font
glassmorphism: ^3.0.0      # Glass effect cards
smooth_page_indicator: ^1.1.0
```

---

## 🎨 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `deepNavy` | `#0A0E2E` | App background |
| `accentBlue` | `#2A7FFF` | Primary actions, active states |
| `glowBlue` | `#4DA3FF` | Gradient highlights |
| `successGreen` | `#22C55E` | Normal status, compost category |
| `warningOrange` | `#F59E0B` | Warning status, maggot BSF |
| `dangerRed` | `#EF4444` | Full bins, critical alerts |
| `purple` | `#8B5CF6` | Buyer role, organic category |

---

## 📁 Project Structure

```
lib/
├── main.dart                    # App entry point
├── theme/
│   └── app_theme.dart           # Color palette & ThemeData
├── models/
│   └── models.dart              # Data models & mock data
├── widgets/
│   └── glass_card.dart          # GlassCard, GradientBackground, GlowButton, etc.
└── screens/
    ├── onboarding_screen.dart   # Role selection with orbit animation
    ├── home_screen.dart         # Dashboard with bottom nav shell
    ├── smart_bin_screen.dart    # IoT bin monitoring
    ├── marketplace_screen.dart  # Product marketplace
    ├── notifications_screen.dart# Alerts & notifications
    └── settings_screen.dart     # Profile, insights & preferences
```

---

## 🔮 Future Development

- Real IoT backend integration (ESP32 + MQTT)
- Firebase authentication per role
- Real-time push notifications for bin alerts
- Payment gateway for marketplace
- Google Maps integration for pickup routing
- Admin dashboard (web)

---

## 📋 Business Plan Reference

Based on the RESIK business plan document targeting:
- **Pilot area**: Pacet, Mojokerto (tourism zone)
- **SDGs alignment**: Goals 8, 11, 12, 13
- **Products**: Pupuk Kompos, Maggot BSF, Eco Enzyme, Pakan Ternak
- **Smart Bin sizes**: 20L (small food stalls), 40L (restaurants), 60L (hotels/buffets)
