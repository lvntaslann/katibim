const INTERVIEW_CRITERIA = [
  "Genel kültür",
  "Mesleki bilgi",
  "Bir konuyu kavrayıp özetleme, ifade yeteneği",
  "Temsil kabiliyeti, tavır ve davranışların göreve uygunluğu",
  "Özgüven, ikna kabiliyeti ve inandırıcılık",
  "Genel yetenek ve genel kültür",
  "Bilimsel ve teknolojik gelişmelere açıklık",
];

const SAMPLE_QUESTIONS = [
  {
    q: "Neden bu kurumda çalışmak istiyorsunuz?",
    a: "Kurumun görev alanını ve kamu hizmetindeki önemini bildiğinizi gösteren, kişisel motivasyonunuzla desteklenmiş kısa ve somut bir cevap hazırlayın; ezbere değil kendi cümlelerinizle anlatın.",
  },
  {
    q: "Zabıt kâtipliği / kâtiplik görevinin size göre en önemli özelliği nedir?",
    a: "Dikkat, gizlilik, tarafsızlık ve hız-doğruluk dengesini vurgulayan, göreve dair somut bir örnekle desteklenmiş cevap verin.",
  },
  {
    q: "Stresli bir durumla nasıl başa çıkarsınız?",
    a: "Sakin kalma stratejinizi (önceliklendirme, kısa mola, yöntemli çalışma) somut bir örnekle anlatın; abartılı iddialardan kaçının.",
  },
  {
    q: "Ekip içinde mi yoksa bireysel mi çalışmayı tercih edersiniz?",
    a: "Her iki çalışma biçimine de uyum sağlayabildiğinizi, göreve göre esnek davranabileceğinizi kısa bir örnekle gösterin.",
  },
  {
    q: "Bir hata yaptığınızda ne yaparsınız?",
    a: "Hatayı fark etme, bildirme ve düzeltme adımlarını sorumluluk alan bir dille anlatın; hatayı gizlemeyi asla önermeyin.",
  },
];

const MISTAKES = [
  "Soruları ezbere, kendi cümleleri olmadan yanıtlamak",
  "Kurum ve görev hakkında hiç araştırma yapmadan gelmek",
  "Aşırı gergin veya aşırı rahat bir tavır sergilemek",
  "Önceki işveren/kurumlar hakkında olumsuz konuşmak",
  "Belirsiz, dolaylı ve uzun cevaplar vermek",
  "Göz teması kurmamak, beden dilini ihmal etmek",
];

const CHECKLIST = [
  "Kimlik belgesi ve sınav/mülakat davetiyesi",
  "İstenen diploma, sertifika ve belgelerin asıl ve fotokopileri",
  "Sade, resmî görünüme uygun kıyafet",
  "Mülakat yerine erken varış planı",
  "Kurum ve göreve dair kısa bir ön araştırma",
  "Olası soruların kendi cümlelerinizle prova edilmesi",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
      {children}
    </section>
  );
}

export default function MulakatPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Mülakat Hazırlığı</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Sözlü mülakat süreci, sık sorulan sorular ve hazırlık kontrol listesi.
        </p>
      </div>

      <Section title="Mülakat Süreci">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          Uygulamalı klavye sınavını geçen adaylar, komisyon önünde sözlü bir mülakata alınır. Komisyon,
          adayları aşağıdaki ölçütler üzerinden değerlendirir:
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {INTERVIEW_CRITERIA.map((c) => (
            <li
              key={c}
              className="rounded-xl bg-neutral-100 px-3 py-2 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Sık Sorulan Sorular ve Cevap Yapısı">
        <div className="flex flex-col gap-4">
          {SAMPLE_QUESTIONS.map((item) => (
            <div key={item.q} className="border-l-2 border-blue-500 pl-4">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.q}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sık Yapılan Hatalar">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-neutral-600 dark:text-neutral-300">
          {MISTAKES.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Section>

      <Section title="Kıyafet ve Belgeler">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          Sade, resmî ve kurumsal bir kıyafet tercih edin; aşırı renkli/rahat kıyafetlerden kaçının. İlanda
          istenen tüm belgeleri (kimlik, diploma, sertifikalar) asıl ve fotokopi olarak eksiksiz getirin.
        </p>
      </Section>

      <Section title="Hazırlık Kontrol Listesi">
        <ul className="flex flex-col gap-2">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <span className="mt-0.5 h-4 w-4 flex-none rounded border border-neutral-400 dark:border-neutral-600" />
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
