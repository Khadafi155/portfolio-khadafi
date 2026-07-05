"use client";

import type { SVGProps } from "react";
import { Mail, Workflow } from "lucide-react";
import { profile } from "@/lib/portfolioData";

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const N8N_URL =
  "https://drive.google.com/drive/folders/1NdQcstibn586Q-V2f6P93ITEQw7BadJQ";

// lucide-react dropped brand logos, so LinkedIn/GitHub are inline SVGs.
function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

/** Site footer: centred logo + tagline, social links, and a copyright bar.
 *  Themed to the site (dark + tosca accent) rather than the source template. */
export function SiteFooter() {
  const wa = profile.phone.replace(/[^\d]/g, "");
  const socials = [
    { label: "Email", caption: "Email", href: `mailto:${profile.email}`, Icon: Mail, ext: false },
    { label: "WhatsApp", caption: "WhatsApp", href: `https://wa.me/${wa}`, Icon: WhatsAppIcon, ext: true },
    { label: "LinkedIn", caption: "LinkedIn", href: profile.linkedinUrl, Icon: LinkedInIcon, ext: true },
    { label: "GitHub — Khadafi15", caption: "GitHub 1st", href: "https://github.com/Khadafi15", Icon: GithubIcon, ext: true },
    { label: "GitHub — Khadafi155", caption: "GitHub 2nd", href: "https://github.com/Khadafi155", Icon: GithubIcon, ext: true },
    { label: "n8n workflows", caption: "n8n", href: N8N_URL, Icon: Workflow, ext: true },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <a className="site-footer-brand" href="#top" aria-label={profile.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kk-logo.svg" alt="" width={40} height={40} />
        </a>
        <p className="site-footer-name">{profile.name}</p>
        <p className="site-footer-tagline">
          An AI-native portfolio - ask my AI anything about my work. It&apos;s
          grounded in my CV &amp; project docs and answers with sources.
        </p>
        <div className="site-footer-socials">
          {socials.map(({ label, caption, href, Icon, ext }) => (
            <a
              key={label}
              className="site-footer-social"
              href={href}
              aria-label={label}
              title={label}
              {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className="site-footer-social-ic"><Icon /></span>
              <span className="site-footer-social-cap">{caption}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="site-footer-bottom">
        © 2026 {profile.name} · Built in {profile.location}. All rights reserved.
      </div>
    </footer>
  );
}
