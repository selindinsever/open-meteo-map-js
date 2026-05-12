Open Meteo API kullanarak Hava Durumunu Anlık gösteren ugulama
---
Bu çalışma; Open-Meteo API ve Leaflet.js kütüphanesi entegrasyonu ile geliştirilmiş, kullanıcı etkileşimli bir meteorolojik veri görselleştirme sistemidir.
Proje, koordinat tabanlı veri çekme ve ters coğrafi kodlama (reverse geocoding) süreçlerini tek bir arayüzde birleştirmeyi amaçlar.

Projenin Amacı ve Kapsamı
---
Projenin temel amacı, kullanıcılara karmaşık meteorolojik veri setlerini sade ve anlaşılır bir harita arayüzü üzerinden sunmaktır. 
Sistem, coğrafi koordinatları girdi olarak kabul eder ve asenkron veri transferi yöntemlerini kullanarak gerçek zamanlı analiz sonuçlarını kullanıcıya iletir.

Temel Fonksiyonlar
---
İnteraktif Veri Analizi
---
Harita üzerinde seçilen herhangi bir noktanın meteorolojik değişkenlerini anlık olarak sorgular.

Ters Coğrafi Kodlama
---
Nominatim mimarisi kullanılarak, ham koordinat verilerinin (Lat/Lon) anlamlı lokasyon isimlerine (İl/İlçe) dönüştürülmesi.

Meteorolojik Göstergeler
---
WMO (Dünya Meteoroloji Örgütü) standartlarına uygun hava durumu kodlaması, rüzgar hızı ve yönü analizi.

Lokalizasyon
---
Çok dilli (TR/EN) arayüz desteği ile evrensel erişilebilirlik.

Teknik Metodoloji
---
Sistemin mimarisi, yüksek performanslı ve düşük gecikmeli veri işleme süreçleri üzerine kurgulanmıştır.
