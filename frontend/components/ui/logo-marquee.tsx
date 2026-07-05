"use client";

import { webp } from "@/lib/img";

const ASSET =
  "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset";

// All companies / institutions / organisations Khadafi has contributed to,
// learned at, or created work with — every logo hosted in storage.
const LOGOS = [
  { name: "Be Unstoppable 365", src: `${ASSET}/LOGO%20BE365.png` },
  { name: "Dimple Bindra", src: `${ASSET}/LOGO%20DIMPLE%20BINDRA.png` },
  { name: "OpenWay", src: `${ASSET}/LOGO%20OPENWAY.png` },
  { name: "Science Hunter Indonesia", src: `${ASSET}/LOGO%20SHI.png` },
  { name: "University of Brawijaya", src: `${ASSET}/logo%20ub.png` },
  { name: "Bangkit Academy", src: `${ASSET}/logo%20bangkit.png` },
  { name: "Alterra Academy", src: `${ASSET}/logo%20alterra.png` },
  { name: "ASEAN Data Science Explorers", src: `${ASSET}/logo%20asean%20data%20scientist.png` },
  { name: "Tanoto Foundation", src: `${ASSET}/Tanoto-logo-green.webp` },
  { name: "Institut Teknologi Bandung", src: `${ASSET}/logo%20itb.png` },
  { name: "Universitas Gadjah Mada", src: `${ASSET}/logo%20ugm.png` },
  { name: "Universitas Diponegoro", src: `${ASSET}/logo%20undiponegoro.png` },
  { name: "Kemendikbud", src: `${ASSET}/logo%20kemendikbud.png` },
  { name: "Universitas Negeri Surabaya", src: `${ASSET}/logo%20unesa.png` },
  { name: "IPB University", src: `${ASSET}/logo%20ipb.png` },
  { name: "Poltekkes Kemenkes Bandung", src: `${ASSET}/logo%20poltekkes%20kemenkes%20bandung.png` },
  { name: "UIN Sunan Kalijaga", src: `${ASSET}/logo%20uin%20sunan%20kalijaga.jpg`, card: true },
  { name: "Universitas Negeri Semarang", src: `${ASSET}/logo%20unnes.png` },
  { name: "Universitas Negeri Yogyakarta", src: `${ASSET}/logo%20uny.png` },
  { name: "Universitas Islam Lamongan", src: `${ASSET}/logo%20unisla.png` },
  { name: "IPDN", src: `${ASSET}/logo%20ipdn.png` },
  { name: "Universitas Sultan Ageng Tirtayasa", src: `${ASSET}/logo%20sultan%20ageng%20tirta.png` },
  { name: "Universitas Lampung", src: `${ASSET}/logo%20unila.png` },
  { name: "Universitas Hasanuddin", src: `${ASSET}/logo%20unhas.png` },
  { name: "Universitas Mulawarman", src: `${ASSET}/logo%20mulwarman.png` },
  { name: "Ideanation", src: `${ASSET}/logo%20ideanation.png` },
  { name: "Universitas Darussalam Gontor", src: `${ASSET}/logo%20unida%20gontor.png` },
  { name: "Institut Teknologi Sepuluh Nopember", src: `${ASSET}/logo%20its.png` },
  { name: "Universitas Muhammadiyah Gombong", src: `${ASSET}/logo%20unigombong.png` },
  { name: "Universitas Sebelas Maret", src: `${ASSET}/logo%20uns.png` },
  { name: "Universitas Pekalongan", src: `${ASSET}/logo%20universitas%20pekalongan.png` },
  { name: "Universitas Jenderal Soedirman", src: `${ASSET}/Logo%20unsoed.png` },
  { name: "Universitas Sumatera Utara", src: `${ASSET}/logo%20usu.png` },
  { name: "Universitas Swadaya Gunung Jati", src: `${ASSET}/logo%20swadaya%20gunung%20jati.png` },
  { name: "Permira", src: `${ASSET}/logo%20permira.jpg` },
];

// Certification issuers & funders. Microsoft/Google/SAP now point at transparent
// WebP re-uploaded to storage, so they blend on the dark strip (no white box).
const CERTS = [
  // ?v=2 busts the browser cache — the old white-background files lived at these
  // same URLs before the transparent re-upload.
  { name: "Microsoft", src: `${ASSET}/Microsoft.webp?v=2`, flag: false },
  { name: "Google", src: `${ASSET}/Google.webp?v=2`, flag: false },
  { name: "SAP", src: `${ASSET}/SAP.webp?v=2`, flag: false },
  { name: "Coursera", src: `${ASSET}/Coursera.webp`, flag: false },
];

// Countries his work / awards have reached (rendered as flags).
const FLAGS = [
  { name: "Indonesia", code: "id" },
  { name: "United States", code: "us" },
  { name: "Hong Kong", code: "hk" },
  { name: "Germany", code: "de" },
  { name: "Belgium", code: "be" },
  { name: "Nigeria", code: "ng" },
  { name: "Iran", code: "ir" },
  { name: "Turkey", code: "tr" },
  { name: "Malaysia", code: "my" },
  { name: "South Korea", code: "kr" },
  { name: "India", code: "in" },
].map((f) => ({ name: f.name, src: `https://flagcdn.com/w320/${f.code}.png`, flag: true }));

const ITEMS = [...LOGOS.map((l) => ({ ...l, flag: false })), ...CERTS, ...FLAGS];

/** Auto-scrolling marquee of the real logos Khadafi has worked with / studied at,
 *  plus the countries his work & awards have reached (flags).
 *  Seamless loop = the list rendered twice, translated by -50%. Pauses on hover. */
export function LogoMarquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section className="logo-marquee-sec" aria-label="Companies and institutions I've been part of">
      <div className="logo-marquee-head">
        <p className="logo-marquee-kicker">Where I&apos;ve</p>
        <p className="logo-marquee-title">Contributed, Learned &amp; Created</p>
      </div>
      <div className="logo-marquee">
        <div className="logo-marquee-track">
          {row.map((l, i) => (
            <div
              className={
                "logo-marquee-item" +
                (l.flag ? " is-flag" : "") +
                ((l as { card?: boolean }).card ? " is-card" : "")
              }
              key={i}
              aria-hidden={i >= ITEMS.length}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={webp(l.src)} alt={l.name} title={l.name} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
