import Image from "next/image";

export default function Contact() {
  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          Get in Touch
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Contact Us</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <span className="text-xs opacity-40">🐾</span>
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <div className="flex justify-center gap-5 mt-6 mb-6">
          <a href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>

      {/* Contact details */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-32">
        <a
          href="mailto:info@brakenkie.co.za"
          className="flex-1 max-w-xs mx-auto sm:mx-0 bg-[var(--card)] border border-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all duration-300 p-10 text-center group"
        >
          <div className="w-6 h-px bg-[var(--accent)]/40 mx-auto mb-6 group-hover:w-10 transition-all duration-500" />
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-35 font-sans mb-3">Email</p>
          <p className="font-serif text-lg font-light">info@brakenkie.co.za</p>
        </a>

        <a
          href="tel:+27718981890"
          className="flex-1 max-w-xs mx-auto sm:mx-0 bg-[var(--card)] border border-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all duration-300 p-10 text-center group"
        >
          <div className="w-6 h-px bg-[var(--accent)]/40 mx-auto mb-6 group-hover:w-10 transition-all duration-500" />
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-35 font-sans mb-3">WhatsApp / Phone</p>
          <p className="font-serif text-lg font-light">+27 71 898 1890</p>
        </a>
      </div>

      <div className="flex justify-center mb-32 -mt-20">
        <a
          href="https://chat.whatsapp.com/D3Y7kEQbRz0G1C6q3Xj2tS?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs bg-[var(--card)] border border-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all duration-300 p-10 text-center group"
        >
          <div className="w-6 h-px bg-[var(--accent)]/40 mx-auto mb-6 group-hover:w-10 transition-all duration-500" />
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-35 font-sans mb-3">WhatsApp Community</p>
          <p className="font-serif text-lg font-light mb-6">Join Our Group</p>
          <div className="flex justify-center">
            <Image
              src="/Images/QR.png"
              alt="WhatsApp Community QR Code"
              width={140}
              height={140}
              className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </a>
      </div>

      <div className="flex justify-center gap-6 mb-32 -mt-20">
        <a href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>

      {/* From Our Families */}
      <section className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-5">
            <div className="h-px w-10 bg-[var(--accent)]/35" />
            <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] font-sans opacity-70">
              From Our Families
            </p>
            <div className="h-px w-10 bg-[var(--accent)]/35" />
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row items-start gap-0">
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:mr-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none" style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
            <div className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]" style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}>
              <img src="/api/image?path=attestation%2FElton%20John.jpeg" alt="Happy client" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pl-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">
            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">&ldquo;</div>
            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />
            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              Thank you Brak & Kie for this beautiful gift of a brand new family member!
              Elton Johan has changed our life and now we cannot imagine our little family without him!
              We absolutely adore and love our Frenchie!
            </p>
            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">Louise Volschenk (Mommy club van die Hoofstad)</p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30 mt-1">Johannesburg <span className="inline-block align-middle mx-1 opacity-40"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.5c-3.2 0-5.5-1.9-5.5-4.8 0-1.4.7-2.6 1.8-3.5C9.4 8.3 10.7 7.8 12 7.8s2.6.5 3.7 1.4c1.1.9 1.8 2.1 1.8 3.5 0 2.9-2.3 4.8-5.5 4.8z"/><circle cx="7" cy="8" r="1.5"/><circle cx="17" cy="8" r="1.5"/><circle cx="5" cy="11.5" r="1.5"/><circle cx="19" cy="11.5" r="1.5"/></svg></span> 2025</p>
            </div>
          </div>
        </div>

        {/* Lanny — Dubai */}
        <div className="relative flex flex-col md:flex-row-reverse items-start gap-0 mt-20">
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:ml-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none" style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
            <div className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]" style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}>
              <img src="/api/image?path=attestation%2FLanny.jpeg" alt="Lanny in Dubai" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pr-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">
            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">&ldquo;</div>
            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />
            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              We are so happy with our boy Lanny! He is the first BrakEnKie puppy to make his home
              in Dubai. He has settled in beautifully and we absolutely adore him.
            </p>
            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">Megan Zofka</p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30 mt-1">Dubai <span className="inline-block align-middle mx-1 opacity-40"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.5c-3.2 0-5.5-1.9-5.5-4.8 0-1.4.7-2.6 1.8-3.5C9.4 8.3 10.7 7.8 12 7.8s2.6.5 3.7 1.4c1.1.9 1.8 2.1 1.8 3.5 0 2.9-2.3 4.8-5.5 4.8z"/><circle cx="7" cy="8" r="1.5"/><circle cx="17" cy="8" r="1.5"/><circle cx="5" cy="11.5" r="1.5"/><circle cx="19" cy="11.5" r="1.5"/></svg></span> 2025</p>
            </div>
          </div>
        </div>

        {/* Ghana — Bloubergstrand */}
        <div className="relative flex flex-col md:flex-row items-start gap-0 mt-20">
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:mr-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none" style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
            <div className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]" style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}>
              <img src="/api/image?path=attestation%2FGhana.jpeg" alt="Ghana living his best life" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pl-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">
            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">&ldquo;</div>
            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />
            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              Our boy Ghana is living his absolute best life in Bloubergstrand. From day one he has
              been the heart of our home — full of character, joy, and endless Frenchie charm.
              Follow his adventures with Kenya over on Instagram.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">Jako Venter</p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30">Bloubergstrand <span className="inline-block align-middle mx-1 opacity-40"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.5c-3.2 0-5.5-1.9-5.5-4.8 0-1.4.7-2.6 1.8-3.5C9.4 8.3 10.7 7.8 12 7.8s2.6.5 3.7 1.4c1.1.9 1.8 2.1 1.8 3.5 0 2.9-2.3 4.8-5.5 4.8z"/><circle cx="7" cy="8" r="1.5"/><circle cx="17" cy="8" r="1.5"/><circle cx="5" cy="11.5" r="1.5"/><circle cx="19" cy="11.5" r="1.5"/></svg></span> 2023</p>
              <a
                href="https://www.instagram.com/frenchietales_kenya_and_ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-1 text-[10px] tracking-[0.2em] uppercase font-sans opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @frenchietales_kenya_and_ghana
              </a>
            </div>
          </div>
        </div>

        {/* Loodle — Chantel Cronje */}
        <div className="relative flex flex-col md:flex-row-reverse items-start gap-0 mt-20">
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:ml-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none" style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
            <div className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]" style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}>
              <img src="/api/image?path=attestation%2FLoodle.jpeg" alt="Loodle" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pr-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">
            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">&ldquo;</div>
            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />
            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              Ok soooo hy is cute verby… 😍🤩 ons is mal oor hom…. So baie dankie…. Loodle is verby cute ♥️
            </p>
            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">Chantel Cronje</p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30 mt-1">Vereeniging <span className="inline-block align-middle mx-1 opacity-40"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.5c-3.2 0-5.5-1.9-5.5-4.8 0-1.4.7-2.6 1.8-3.5C9.4 8.3 10.7 7.8 12 7.8s2.6.5 3.7 1.4c1.1.9 1.8 2.1 1.8 3.5 0 2.9-2.3 4.8-5.5 4.8z"/><circle cx="7" cy="8" r="1.5"/><circle cx="17" cy="8" r="1.5"/><circle cx="5" cy="11.5" r="1.5"/><circle cx="19" cy="11.5" r="1.5"/></svg></span> 2024</p>
            </div>
          </div>
        </div>

      </section>

    </main>
  );
}
