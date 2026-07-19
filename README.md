# Katibim

Türkiye'deki kamu sektörü kâtiplik (zabıt kâtibi, icra kâtibi, memur vb.)
alım sınavlarına hazırlanan adaylar için uygulamalı klavye sınavı simülasyonu,
F/Q klavye ders sistemi ve detaylı tuş analitiği sunan, tamamen istemci
tarafında (backend'siz) çalışan bir Next.js uygulaması.

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır.
Prodüksiyon derlemesi için `npm run build && npm run start`.

## Mimari Özeti

- **Next.js (App Router) + TypeScript + Tailwind CSS**, backend yok.
- Tüm oturum geçmişi, tuş istatistikleri ve ayarlar tarayıcıda **IndexedDB**'de
  saklanır (`lib/repository/indexeddb.ts`), IndexedDB kullanılamıyorsa
  otomatik olarak **localStorage**'a düşer (`lib/repository/local-storage.ts`).
  Her iki implementasyon da `lib/repository/types.ts`'teki `Repository`
  arayüzünü uygular; ileride gerçek bir backend eklemek isterseniz sadece bu
  arayüzü uygulayan yeni bir sınıf yazıp `lib/repository/index.ts`'teki
  `getRepository()` fonksiyonunu güncellemeniz yeterlidir.
- Yazım motoru (`lib/typing-engine/engine.ts`) React state'inden bağımsız, saf
  bir TypeScript sınıfıdır; her tuş vuruşunu DOM'a doğrudan ref üzerinden
  uygular (React re-render'ı yoktur), böylece 16ms altı işlem süresi garanti
  edilir. `hooks/useTypingEngine.ts` bu sınıfı DOM'a bağlar.
- Klavye düzenleri (`lib/keyboard-layouts/f-klavye.ts`,
  `lib/keyboard-layouts/q-klavye.ts`) Microsoft'un resmî KBDTUF/KBDTUQ klavye
  düzeni referans tablolarından derlenmiştir; bazı ikincil AltGr sembolleri
  en iyi çaba ile doldurulmuştur ve dosya içindeki yorumlarda belirtilmiştir.

## Veri Modeli (`types/`)

- `Institution` — kurum ve sınav kuralları (`types/institution.ts`)
- `Lesson` / `LessonStep` — ders müfredatı (`types/lesson.ts`)
- `PracticeText` — pratik/sınav metinleri (`types/practice-text.ts`)
- `Session` / `KeyEvent` — bir oturumun tam kaydı (`types/session.ts`)
- `KeyStat` / `SubstitutionStat` — tuş bazlı toplu istatistikler (`types/key-stat.ts`)
- `Settings` — kullanıcı tercihleri (`types/settings.ts`)

## Yeni Kurum Ekleme

`data/institutions.ts` dosyasını açın ve `INSTITUTIONS` dizisine `Institution`
tipine uygun yeni bir kayıt ekleyin:

```ts
{
  id: "benzersiz-id",
  name: "Kurum Adı",
  category: "adalet-bakanligi" | "yuksek-yargi" | "universite" | "belediye-bakanlik-kit",
  roleTitle: "Kâtip / Büro Personeli",
  acceptedLayouts: "both", // "F" | "Q" | "both"
  durationSec: 180, // sayı biliniyorsa, bilinmiyorsa "ilana göre değişir"
  minNetWordsPerMin: 90,   // aynı şekilde
  penaltyPerError: "ilana göre değişir",
  textDelivery: "dikte", // "dikte" | "printed"
  allowBackspace: false,
  uncertainFields: ["penaltyPerError"], // emin olmadığınız alanların adları
  sourceNote: "Bu bilginin dayanağı / doğrulama notu",
  disclaimer: INSTITUTION_DISCLAIMER, // types/institution.ts'ten içe aktarın, değiştirmeyin
}
```

**Önemli kural:** Kesin rakamını bilmediğiniz hiçbir sayısal alanı tahmin
etmeyin — `"ilana göre değişir"` değerini kullanın ve alanı
`uncertainFields`'e ekleyin. Sınav kuralları ilandan ilana değişir; bu
platform kesin bir kaynak değildir. `lib/institution-resolve.ts`, bu
belirsiz alanları sınav simülasyonu için genel varsayılan değerlere
(180 sn / 90 net kelime / hata katsayısı 2 / geri silme kapalı) çevirir ve
kullanıcıya hangi değerlerin varsayılan olduğunu gösterir.

## Yeni Pratik Metni Ekleme

`data/practice-texts.ts` dosyasındaki `PRACTICE_TEXTS` dizisine ekleyin:

```ts
{
  id: "benzersiz-id",
  category: "genel" | "hukuki" | "resmi",
  difficulty: "baslangic" | "orta" | "ileri",
  title: "Başlık",
  body: "Metin içeriği...",
}
```

Sınav simülasyonu (`/sinav`), tek bir seçili metnin süreyi doldurmaya
yetmeyebileceği durumlar için `data/practice-texts.ts` içindeki
`buildExamText()` fonksiyonuyla birden fazla metni art arda birleştirir;
ayrıca metin eklemek bu havuzu otomatik olarak zenginleştirir.

## Yeni Ders/Alıştırma Adımı Ekleme

Ders müfredatı `data/lessons.ts` içinde, klavye düzeni haritalarından
(`lib/keyboard-layouts`) otomatik türetilir; böylece bir dersin metni asla
henüz öğretilmemiş bir tuşu içeremez. Yeni bir seviye eklemek isterseniz
`LEVEL_KEYS`, `LEVEL_TITLES` ve `LEVEL_DESCRIPTIONS` sabitlerine yeni bir
seviye numarası ekleyip `buildTrack()` çağrısındaki `[1, 2, 3, 4, 5]`
dizisini güncelleyin.

## Analitik ve Zayıflık Alıştırması

`lib/analytics/generate-drill.ts`, bir kullanıcının en yüksek hata
oranı × gecikme skoruna sahip tuşlarını alıp bunları sesli harflerle
harmanlayarak yazılabilir bir alıştırma metni üretir
(`generateWeaknessDrill`). Bu metin `/dashboard` sayfasındaki "Zayıf
tuşlarımla pratik yap" butonuyla tetiklenir ve `sessionStorage` üzerinden
`/antrenman?drill=1` sayfasına aktarılır.

## Bilinen Kapsam Dışı Noktalar

- Kimlik doğrulama, bulut senkronizasyonu ve admin paneli bu sürümde yoktur
  (`prompt.md`'nin backend'siz v1 kapsamına uygun olarak).
  `lib/repository` arayüzü bunun için hazırdır.
- Klavye düzeni haritalarındaki bazı ikincil AltGr sembolleri (çekirdek
  Türkçe harfler ç ğ ı ö ş ü İ hariç) en iyi çaba ile doldurulmuştur; sınav
  metinleri bu sembolleri gerektirmez.
