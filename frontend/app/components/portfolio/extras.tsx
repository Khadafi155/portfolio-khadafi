"use client";

import * as React from "react";

import * as PD from "@/lib/portfolioData";
import { Icon } from "@/app/components/portfolio/Icon";
import {
  GraduationCap,
  Award,
  Cpu,
  Handshake,
  BookOpen,
  School,
  Bot,
  Code2,
  Server,
  LayoutTemplate,
  Database,
  Cloud,
  Wrench,
} from "lucide-react";

/** Icon for an education badge (Degree / Program / Academy). */
const EDU_TAG_ICON: Record<string, React.ReactNode> = {
  Degree: <GraduationCap size={12} />,
  Program: <BookOpen size={12} />,
  Academy: <School size={12} />,
};

/** Per-group icon for the technical-skills columns. */
const SKILL_GROUP_ICON: Record<string, React.ReactNode> = {
  "AI & Automation": <Bot size={13} />,
  Languages: <Code2 size={13} />,
  "Backend & APIs": <Server size={13} />,
  Frontend: <LayoutTemplate size={13} />,
  "Data & Storage": <Database size={13} />,
  "Cloud & DevOps": <Cloud size={13} />,
  "Tools & Growth": <Wrench size={13} />,
};

import { WorkingExperience, ProjectsBlock, CardImage } from "@/app/components/portfolio/sections";
import { webp } from "@/lib/img";
import { Carousel } from "@/app/components/portfolio/Carousel";
import { FocusRail } from "@/components/ui/focus-rail";
import CarouselCard, {
  type CardData,
  type CarouselCardApi,
} from "@/components/ui/carousel-card";
import WheelPagination from "@/components/ui/wheel-pagination";
import {
  useReveal,
  GroupBand,
  SubHead,
  ImageSlot,
  TagIcon,
} from "@/app/components/portfolio/primitives";

/* ============================================================
   BACKGROUND - education, awards, organization, publication
   ============================================================ */
function EducationBlock() {
  return (
    <div className="sub-block">
      <SubHead id="education" eyebrow="Education" title="From a Instrumentation to Fullstack & AI Developer." index="01.1" icon={<GraduationCap size={14} />} />
      <div className="edu-layout">
        <div className="edu-stack">
          {PD.educationList.map((e, i) => (
            <article className="spot-card c-card edu-card2" key={i}>
              <span className="c-tag edu-corner-tag cta-tag">
                {EDU_TAG_ICON[e.tag]}
                {e.tag}
              </span>
              <div className="edu-head">
                {e.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={webp(e.logo)}
                    alt=""
                    className="edu-logo"
                    onError={(ev) => {
                      ev.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <h4 className="c-title">{e.school}</h4>
              </div>
              <p className="c-sub">{e.program} · {e.when}</p>
              <p className="c-desc">{e.detail}</p>
            </article>
          ))}
        </div>
        <div className="edu-photos-col">
          <FocusRail
            className="h-full min-h-[640px] rounded-2xl bg-transparent"
            loop
            autoPlay
            interval={2000}
            showInfo={false}
            showControls={false}
            items={PD.eduPhotos.map((p, i) => ({
              id: i,
              title: p.caption,
              imageSrc: webp(p.src),
              bgSrc: webp(PD.eduBackground),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export function AwardsBlock() {
  const a = PD.awards;
  const cardApi = React.useRef<CarouselCardApi | null>(null);
  const [page, setPage] = React.useState(0);
  // Placeholder images until real award photos are provided.
  const ph = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;
  const ASSET =
    "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset";
  // Organizer logos (shared across cards from the same institution).
  const LOGO = {
    ub: `${ASSET}/logo%20ub.png`, // Universitas Brawijaya
    itb: `${ASSET}/logo%20itb.png`, // Institut Teknologi Bandung
    ugm: `${ASSET}/logo%20ugm.png`, // Universitas Gadjah Mada
    undip: `${ASSET}/logo%20undiponegoro.png`, // Universitas Diponegoro
    kemendikbud: `${ASSET}/logo%20kemendikbud.png`,
    unesa: `${ASSET}/logo%20unesa.png`, // Surabaya State University
    ipb: `${ASSET}/logo%20ipb.png`,
    poltekkesBandung: `${ASSET}/logo%20poltekkes%20kemenkes%20bandung.png`,
    uinSuka: `${ASSET}/logo%20uin%20sunan%20kalijaga.jpg`,
    unnes: `${ASSET}/logo%20unnes.png`, // Semarang State University
    uny: `${ASSET}/logo%20uny.png`, // Yogyakarta State University
    unisla: `${ASSET}/logo%20unisla.png`, // Islamic University of Lamongan
    ipdn: `${ASSET}/logo%20ipdn.png`,
    untirta: `${ASSET}/logo%20sultan%20ageng%20tirta.png`, // Sultan Ageng Tirtayasa University
    unila: `${ASSET}/logo%20unila.png`, // University of Lampung
    unhas: `${ASSET}/logo%20unhas.png`, // Hasanuddin University
    mulawarman: `${ASSET}/logo%20mulwarman.png`,
    unsoed: `${ASSET}/Logo%20unsoed.png`, // Jenderal Soedirman University
    usu: `${ASSET}/logo%20usu.png`, // University of North Sumatra
    permira: `${ASSET}/logo%20permira.jpg`,
    swadayaGunungJati: `${ASSET}/logo%20swadaya%20gunung%20jati.png`,
    ideanation: `${ASSET}/logo%20ideanation.png`, // PT. Inovasi Indonesia Berkarya
    unidaGontor: `${ASSET}/logo%20unida%20gontor.png`, // Darussalam Gontor University
    its: `${ASSET}/logo%20its.png`, // Sepuluh Nopember Institute of Technology
    unigombong: `${ASSET}/logo%20unigombong.png`, // Muhammadiyah Gombong
    uns: `${ASSET}/logo%20uns.png`, // Sebelas Maret University
    unpekalongan: `${ASSET}/logo%20universitas%20pekalongan.png`,
  };
  // Organizer logo per national-award index.
  const natLogos: Record<number, string> = {
    0: `${ASSET}/logo%20ugm.png`, // MICROFEST - UGM
    1: `${ASSET}/logo%20undiponegoro.png`, // MASTERPIECE - UNDIP
    2: `${ASSET}/logo%20itb.png`, // Insight Challenge - ITB
    3: `${ASSET}/logo%20ideanation.png`, // Ideanation Energy - PT. Inovasi Indonesia Berkarya
    4: `${ASSET}/logo%20ideanation.png`, // Ideanation Event - PT. Inovasi Indonesia Berkarya
    5: `${ASSET}/Tanoto-logo-green.webp`, // TSRA - Tanoto Foundation
    6: `${ASSET}/logo%20kemendikbud.png`, // PIMNAS - Kemendikbud
  };
  // Real certificate images per gold-award index.
  const goldCerts: Record<number, string> = {
    0: `${ASSET}/setifikat%20AIIE.png`,
    1: `${ASSET}/sertifikat%20IAYSF.png`,
    2: `${ASSET}/sertifikat%201%20IDEA%201%20WORLD.png`,
    3: `${ASSET}/sertifikat%20INDES.png`,
  };
  // Host-country flag per gold-award index (international expos).
  const goldFlags: Record<number, string> = {
    0: "ng", // AIIE - Nigeria
    1: "ir", // IAYSF - Iran
    2: "tr", // 1 IDEA 1 WORLD - Turkey
    3: "my", // INDES - Malaysia
  };
  // Real certificate images per national-award index.
  const natCerts: Record<number, string> = {
    0: `${ASSET}/sertifikat%20Microfest.png`,
    1: `${ASSET}/sertifikat%20MASTERPIECE.png`,
    2: `${ASSET}/sertifikat%20INSIGHT.png`,
    3: `${ASSET}/setifikat%20ideanation.png`,
    4: `${ASSET}/ideanation%20event.webp?v=2`,
    5: `${ASSET}/sertifikat%20TANOTO.jpeg`,
    6: `${ASSET}/sertifikat%20PIMNAS.png`,
  };
  const medalOf = (title: string): "gold" | "silver" | "bronze" | undefined => {
    if (/^(1st|juara 1|peringkat 1|gold)\b/i.test(title)) return "gold";
    if (/^(2nd|juara 2|peringkat 2|silver)\b/i.test(title)) return "silver";
    if (/^(3rd|juara 3|peringkat 3|bronze)\b/i.test(title)) return "bronze";
    return undefined;
  };
  const cards: CardData[] = [
    {
      id: 0,
      medal: "gold",
      logo: LOGO.ub,
      imgUrl:
        "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/sertifikat%20mawapres.png",
      content: (
        <>
          <h4 className="c-title sm">Most Outstanding Student</h4>
          <p className="c-sub">
            Faculty of Mathematics &amp; Natural Sciences, University of Brawijaya
          </p>
          <span className="c-year">2021 · 1 of 3,988</span>
        </>
      ),
    },
    {
      id: 1,
      event: true,
      logo: LOGO.ub,
      imgUrl:
        "https://fenaqrrsfbmgzjiirzsz.supabase.co/storage/v1/object/public/website%20asset/Pilmapres.png",
      content: (
        <>
          <h4 className="c-title sm">Pilmapres Event</h4>
          <p className="c-sub">Outstanding Student Selection</p>
          <span className="c-year">2021</span>
        </>
      ),
    },
    ...a.golds.map((g, i) => ({
      id: 10 + i,
      medal: "gold" as const,
      flag: goldFlags[i],
      imgUrl: goldCerts[i] ?? ph(`award-gold-${i}`),
      content: (
        <>
          <h4 className="c-title sm">{g.title}</h4>
          <p className="c-sub">{g.org}</p>
          <span className="c-year">Gold · {g.year}</span>
        </>
      ),
    })),
    ...a.nationals.map((n, i) => ({
      id: 100 + i,
      medal: medalOf(n.title),
      event: i === 4,
      funding: i === 5 || i === 6,
      imgTop: i === 4,
      logo: natLogos[i],
      imgUrl: natCerts[i] ?? ph(`award-nat-${i}`),
      content:
        i === 4 ? (
          <>
            <h4 className="c-title sm">Ideanation Event</h4>
            <p className="c-sub">PT. Inovasi Indonesia Berkarya</p>
            <span className="c-year">2021</span>
          </>
        ) : (
          <>
            <h4 className="c-title sm">{n.title}</h4>
            <p className="c-sub">{n.org}</p>
            <span className="c-year">{n.year}</span>
          </>
        ),
    })),
    {
      id: 200,
      event: true,
      logo: LOGO.itb,
      imgUrl: `${ASSET}/Insight%20event.png`,
      content: (
        <>
          <h4 className="c-title sm">Insight Event</h4>
          <p className="c-sub">Institute of Technology Bandung</p>
          <span className="c-year">2019</span>
        </>
      ),
    },
    {
      id: 201,
      medal: "silver",
      flag: "kr",
      imgUrl: `${ASSET}/sertifikat%20KIWIE.png`,
      content: (
        <>
          <h4 className="c-title sm">Korea International Women&apos;s Invention Exposition (KIWIE)</h4>
          <p className="c-sub">KWIA &amp; KIPO, South Korea</p>
          <span className="c-year">Silver Prize · 2020</span>
        </>
      ),
    },
    {
      id: 202,
      medal: "bronze",
      flag: "my",
      imgUrl: `${ASSET}/sertifikat%20INIIC.png`,
      content: (
        <>
          <h4 className="c-title sm">International Invention &amp; Innovative Competition (InIIC)</h4>
          <p className="c-sub">MNNF Network, Selangor, Malaysia</p>
          <span className="c-year">Bronze · 2019</span>
        </>
      ),
    },
    {
      id: 203,
      medal: "silver",
      flag: "in",
      imgUrl: `${ASSET}/sertifikat%20GYSC.png`,
      content: (
        <>
          <h4 className="c-title sm">Global Young Scientist Challenge (GYSC)</h4>
          <p className="c-sub">IIA &amp; IBS Global, Hyderabad, India</p>
          <span className="c-year">Silver · 2020</span>
        </>
      ),
    },
    {
      id: 204,
      medal: "gold",
      flag: "id",
      imgUrl: `${ASSET}/sertifikat%20AISEEF.jpeg`,
      content: (
        <>
          <h4 className="c-title sm">ASEAN Innovative Science, Environmental &amp; Entrepreneur Fair (AISEEF)</h4>
          <p className="c-sub">IYSA · Jakarta, Indonesia</p>
          <span className="c-year">Gold Medal · 2021</span>
        </>
      ),
    },
    {
      id: 205,
      medal: "gold",
      logo: LOGO.unesa,
      imgUrl: `${ASSET}/sertifikat%20FEN.jpeg`,
      content: (
        <>
          <h4 className="c-title sm">National Essay Festival (FEN)</h4>
          <p className="c-sub">IPNU-IPPNU, Surabaya State University</p>
          <span className="c-year">1st Winner · 2020</span>
        </>
      ),
    },
    {
      id: 206,
      medal: "silver",
      flag: "id",
      imgUrl: `${ASSET}/sertifikat%20I2ASPO.jpg`,
      content: (
        <>
          <h4 className="c-title sm">Indonesia International Applied Science Project Olympiad (I2ASPO)</h4>
          <p className="c-sub">IYSA · Jakarta, Indonesia</p>
          <span className="c-year">Silver Medal · 2020</span>
        </>
      ),
    },
    {
      id: 207,
      medal: "gold",
      flag: "id",
      imgUrl: `${ASSET}/sertifikat%20ISIF.jpeg`,
      content: (
        <>
          <h4 className="c-title sm">International Science and Invention Fair (ISIF)</h4>
          <p className="c-sub">IYSA · Jakarta, Indonesia</p>
          <span className="c-year">Gold Medal · 2020</span>
        </>
      ),
    },
    {
      id: 208,
      medal: "gold",
      logo: LOGO.unidaGontor,
      imgUrl: `${ASSET}/sertifikat%20ANEPH.jpeg`,
      content: (
        <>
          <h4 className="c-title sm">National Essay Competition (ANEPH)</h4>
          <p className="c-sub">Darussalam Gontor University</p>
          <span className="c-year">1st Winner · 2020</span>
        </>
      ),
    },
    ...(
      [
        { f: "sertifikat PYSCO.jpeg", t: "Essay - Psychology Championship (PYSCO)", s: "Faculty of Social & Political Sciences, University of Brawijaya", y: "1st Winner · 2020", m: "gold", lg: LOGO.ub },
        { f: "sertifikat PEKALO.jpeg", t: "National Essay Competition", s: "Nursing Student Assoc., University of Pekalongan", y: "1st Winner · 2020", m: "gold", lg: LOGO.unpekalongan },
        { f: "sertifikat SYNTAC.jpeg", t: "Science Youth National Competition (SYNTAC)", s: "Student Board (FMIPA), University of Brawijaya", y: "1st Winner Essay · 2020", m: "gold", lg: LOGO.ub },
        { f: "sertifikat OCIIP.jpeg", t: "OCIIP World IP Fair", s: "OCIIP, Nigeria", y: "Gold Award · 2021", m: "gold", fl: "ng" },
        { f: "sertifikat SEAFAST.jpeg", t: "SEAFAST-Indofood Food Product Development Competition", s: "SEAFAST Center, IPB University", y: "2nd Winner · 2020", m: "silver", lg: LOGO.ipb },
        { f: "sertifikat IICYMS.png", t: "International Invention Competition for Young Moslem Scientists (IICYMS)", s: "IYSA, Bandung, Indonesia", y: "Gold Medal · 2021", m: "gold", fl: "id" },
        { f: "sertifikat LDR.png", t: "Essay from Home Competition (LDR)", s: "Interdisciplinary Research Unit, University of Gadjah Mada", y: "2nd Winner · 2020", m: "silver", lg: LOGO.ugm },
        { f: "sertifikat PHARMODIA.png", t: "Essay - Pharmodia National", s: "Bandung Health Polytechnic", y: "2nd Winner · 2020", m: "silver", lg: LOGO.poltekkesBandung },
        { f: "sertifikat KALSICS.png", t: "Kalsics National Essay Competition - Physics Festival", s: "UIN Sunan Kalijaga, Yogyakarta", y: "2nd Winner · 2020", m: "silver", lg: LOGO.uinSuka },
        { f: "sertifikat COLLOTRIUM.png", t: "Essay - Collutrium National", s: "D3 Pharmacy, Sebelas Maret University", y: "2nd Winner · 2019", m: "silver", lg: LOGO.uns },
        { f: "sertifikat VAGANZA.png", t: "Scientific Vaganza - Indonesia Paper Competition", s: "Faculty of Math & Natural Sciences, Semarang State University", y: "2nd Winner · 2020", m: "silver", lg: LOGO.unnes },
        { f: "sertifikat SOLVER.jpeg", t: "Solver Festival - Essay Competition", s: "Solve It, Institut Teknologi Bandung", y: "2nd Winner · 2020", m: "silver", lg: LOGO.itb },
        { f: "sertifikat RWrc.jpeg", t: "Reality Writing Competition (RWrC)", s: "Faculty of Education, Yogyakarta State University", y: "2nd Winner · 2020", m: "silver", lg: LOGO.uny },
        { f: "sertifikat UNISLA.jpeg", t: "Essay Innovation Competition", s: "Islamic University of Lamongan", y: "3rd Winner · 2020", m: "bronze", lg: LOGO.unisla },
        { f: "sertifikat HIMAFARSI.jpeg", t: "Essay - HIMAFARSI", s: "Muhammadiyah Gombong School of Health Sciences", y: "3rd Winner · 2020", m: "bronze", lg: LOGO.unigombong },
        { f: "sertifikat IYA.jpeg", t: "Writing Competition", s: "Indonesia Youth Association", y: "Top 100 Finalist · 2020", b: "finalist" },
        { f: "sertifikat COIN.jpeg", t: "KIME on Ideas Competition", s: "Faculty of Economics, Semarang State University", y: "2nd Runner-up · 2020", b: "honorable", lg: LOGO.unnes },
        { f: "sertifikat IPDN.jpeg", t: "Nusantara Innovation Summit", s: "IPDN Expo, Institute of Home Affairs Governance", y: "3rd Runner-up · 2020", b: "honorable", lg: LOGO.ipdn },
        { f: "sertifikat BIOEXPO.jpeg", t: "Biology Expo - National Essay", s: "Biology Education, Sultan Ageng Tirtayasa University", y: "2nd Winner · 2021", m: "silver", lg: LOGO.untirta },
        { f: "sertifikat ESAI UNNES.jpeg", t: "National Student Essay Competition", s: "Chemistry Student Assoc., Semarang State University", y: "1st Winner · 2021", m: "gold", lg: LOGO.unnes },
        { f: "sertifikat ESAI FESTAFORA.jpeg", t: "Festafora - National Essay Festival", s: "Fosmaki, University of Lampung", y: "1st Winner · 2021", m: "gold", lg: LOGO.unila },
        { f: "sertifikat SEAGIC.png", t: "Southeast Asia Global Innovation Challenge (SEA-GIC)", s: "American Chemical Society (ACS)", y: "Finalist · 2020", b: "finalist", fl: "us" },
        { f: "sertifikat IEEE.png", t: "IEEE Health DisasterHack - Hackathon", s: "IEEE SIGHT, ITB Student Branch", y: "Finalist · 2019", b: "finalist", lg: LOGO.itb },
        { f: "sertifikat SEF.png", t: "Essay Competition - Science Education Fair (SEF)", s: "HIMADIKPA, Faculty of Education, Sebelas Maret University", y: "1st Winner · 2021", m: "gold", lg: LOGO.uns },
        { f: "sertifikat Virulen.png", t: "Essay - Environmental Research Event (VIRULEN)", s: "Faculty of Math & Natural Sciences, Hasanuddin University", y: "Finalist · 2020", b: "finalist", lg: LOGO.unhas },
        { f: "sertifikat Eurykoma.png", t: "Eurykoma National Essay - Top 10", s: "Faculty of Pharmacy, Mulawarman University", y: "Finalist · 2020", b: "finalist", lg: LOGO.mulawarman },
        { f: "sertifikat Upchance.png", t: "Idea, Innovation & Invention Challenge (UPCHANCE)", s: "Interdisciplinary Research Unit, University of Gadjah Mada", y: "Finalist · 2019", b: "finalist", lg: LOGO.ugm },
        { f: "sertifikat Science Week.png", t: "National Essay Competition - Science Week", s: "Physics Education, Sebelas Maret University", y: "Finalist · 2020", b: "finalist", lg: LOGO.uns },
        { f: "sertifikat Biosfer.png", t: "Biology Open House (BIOSFER XIII) - National Essay", s: "Faculty of Math & Natural Sciences, University of Brawijaya", y: "Finalist · 2019", b: "finalist", lg: LOGO.ub },
        { f: "sertifikat Pharasoed.png", t: "Pharmacy of Soedirman Competition (PHARASOED) - National Essay", s: "Faculty of Health Sciences, Jenderal Soedirman University", y: "Finalist · 2020", b: "finalist", lg: LOGO.unsoed },
        { f: "sertifikat SGC.png", t: "National Essay Competition (SGC) - Top 10", s: "Smart Generation Community, University of North Sumatra", y: "Finalist · 2020", b: "finalist", lg: LOGO.usu },
        { f: "sertifikat Insight unhas.png", t: "Scientific Writing & Youth Competition (INSIGHT)", s: "Hasanuddin University", y: "Finalist · 2020", b: "finalist", lg: LOGO.unhas },
        { f: "sertifikat Katulistiwa.png", t: "National Scientific Paper Competition (KATULISTIWA)", s: "Faculty of Economics & Business, University of Brawijaya", y: "Finalist · 2020", b: "finalist", lg: LOGO.ub },
        { f: "sertifikat perwira.png", t: "Scientific Paper Competition (LKTI PERMIRA)", s: "Permira - National Scientific Paper Competition", y: "Finalist · 2020", b: "finalist", lg: LOGO.permira },
        { f: "sertifikat reaction.png", t: "Applied Chemistry Competition (REACTION) - Chemistry Week", s: "Chemistry Dept., Sepuluh Nopember Institute of Technology (ITS)", y: "Finalist · 2019", b: "finalist", lg: LOGO.its },
        { f: "sertifikat lte on.png", t: "National Online Essay Competition (LTE-ON)", s: "Physics Dept., Yogyakarta State University", y: "Finalist · 2020", b: "finalist", lg: LOGO.uny },
        { f: "sertifikat semarak esai nasional.png", t: "Semarak National Essay Competition", s: "Swadaya Gunung Jati University, Cirebon", y: "Finalist · 2020", b: "finalist", lg: LOGO.swadayaGunungJati },
        { f: "Collutrium.png", t: "Collutrium Event", s: "D3 Pharmacy, Sebelas Maret University", y: "2019", b: "event", lg: LOGO.uns },
      ] as { f: string; t: string; s: string; y: string; m?: "gold" | "silver" | "bronze"; b?: "finalist" | "honorable" | "event"; cv?: boolean; fl?: string; lg?: string }[]
    ).map((c, i) => ({
      id: 300 + i,
      medal: c.m,
      event: c.b === "event",
      finalist: c.b === "finalist",
      honorable: c.b === "honorable",
      cover: c.cv,
      flag: c.fl,
      logo: c.lg,
      imgUrl: `${ASSET}/${c.f.replace(/ /g, "%20")}`,
      content: (
        <>
          <h4 className="c-title sm">{c.t}</h4>
          <p className="c-sub">{c.s}</p>
          <span className="c-year">{c.y}</span>
        </>
      ),
    })),
  ];

  // Ordering:
  //   Group 0 = Most Outstanding Student (flagship, pinned first)
  //   Group 1 = International   →  Group 2 = Funding  →  Group 3 = National
  // Within each group: CV-listed awards first (in CV order), then winner →
  // non-winner (gold → silver → bronze → finalist → honorable → event).
  const cvOrder: Record<number, number> = {
    0: 1, // Most Outstanding Student
    10: 2, // AIIE (gold)
    11: 3, // IAYSF (gold)
    12: 4, // 1 IDEA 1 WORLD (gold)
    13: 5, // INDES (gold)
    105: 6, // TSRA (research funding)
    106: 7, // PIMNAS (research funding)
    100: 8, // MICROFEST (1st)
    101: 9, // MASTERPIECE (1st)
    102: 10, // Insight Challenge (2nd)
    103: 11, // Ideanation Energy (3rd)
  };
  const rankOf = (c: CardData) =>
    c.medal === "gold" ? 0 : c.medal === "silver" ? 1 : c.medal === "bronze" ? 2
      : c.finalist ? 3 : c.honorable ? 4 : c.event ? 5 : c.funding ? 6 : 7;
  // Group 0 (pinned top): Most Outstanding Student first, then all the event
  // cards (the ones that show a photo of me) grouped next to each other.
  const groupOf = (c: CardData) =>
    c.id === 0 || c.event ? 0 : c.funding ? 2 : c.flag ? 1 : 3;
  const sortedCards = cards
    .map((card, i) => ({ card, i, g: groupOf(card), cv: cvOrder[card.id] ?? Infinity, rank: rankOf(card) }))
    .sort((a, b) => {
      if (a.g !== b.g) return a.g - b.g; // International → Funding → National
      if (a.cv !== b.cv) return a.cv - b.cv; // CV-listed first (in CV order)
      if (a.rank !== b.rank) return a.rank - b.rank; // winner → non-winner
      return a.i - b.i; // stable
    })
    .map((x) => x.card);

  return (
    <div className="sub-block">
      <SubHead id="awards" eyebrow="Achievements & Awards" title="50+ awards, national & international." index="01.5" icon={<Award size={14} />} />
      <CarouselCard
        data={sortedCards}
        cardsPerView={3}
        showControls={false}
        apiRef={cardApi}
        onIndexChange={setPage}
      />
      <WheelPagination
        className="awards-nav"
        totalPages={sortedCards.length}
        visibleCount={7}
        loop
        page={page}
        onChange={(i) => {
          setPage(i);
          cardApi.current?.goTo(i);
        }}
      />
    </div>
  );
}

export function Background() {
  const head = useReveal();
  return (
    <section className="section block" id="background-group">
      <div className="reveal" ref={head} style={{ marginBottom: 8 }}>
        <GroupBand label="Background" index="01" />
        <h2 className="section-title">Where it started.</h2>
      </div>
      <EducationBlock />
      <TechnicalSkills />
      <SoftSkills />
      <WorkingExperience />
      <ProjectsBlock />
    </section>
  );
}

/* ============================================================
   SKILL - technical & stack, soft skills
   ============================================================ */
function TechnicalSkills() {
  return (
    <div className="sub-block">
      <SubHead id="skills-tech" eyebrow="Technical skills & stack" title="The stack, end to end." index="01.2" icon={<Cpu size={14} />} />
      <Carousel label="Technical skills">
        {PD.skills.map((g, i) => (
          <div className="spot-card skill-group" key={i}>
            <h3>
              <span className="sg-badge">
                {SKILL_GROUP_ICON[g.title] ?? <Icon name="spark" size={13} />}
                {g.title}
              </span>
            </h3>
            <ul className="skill-list">
              {g.items.map((s, j) => (
                <li className="skill" key={j}>
                  <TagIcon label={s} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

function SoftSkills() {
  const r = useReveal();
  return (
    <div className="sub-block">
      <SubHead id="skills-soft" eyebrow="Soft skills" title="How I work with people." index="01.3" icon={<Handshake size={14} />} />
      <div className="soft-panel reveal" ref={r}>
        <ul className="skill-list">
          {PD.softSkills.map((s, i) => (
            <li className="skill" key={i}>
              <TagIcon label={s} />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   CERTIFICATION & COURSE
   ============================================================ */
export function Certifications() {
  const head = useReveal();
  return (
    <section className="section block" id="certs">
      <div className="reveal" ref={head} style={{ marginBottom: 8 }}>
        <GroupBand label="Certification & Course" index="03" />
        <h2 className="section-title">Certified &amp; always learning.</h2>
      </div>

      <Carousel label="Certifications and courses">
        {PD.certs.map((c, i) => (
          <article className="c-card cert-card" key={i}>
            <CardImage src={c.img} alt={c.title} />
            <h4 className="c-title sm">{c.title}</h4>
            <p className="c-sub">{c.issuer}</p>
          </article>
        ))}
      </Carousel>
    </section>
  );
}
