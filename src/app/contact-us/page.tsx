export default function ContactUs() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest uppercase">Contact Us</h1>
        </div>

        <div className="space-y-8 font-light leading-relaxed text-gray-300 text-center max-w-xl mx-auto bg-white/5 p-12 rounded-lg border border-white/10">
          <p className="text-lg text-white">We are here to help you.</p>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Company</p>
              <p className="text-white text-lg font-serif">Seyal Group LLC</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Email</p>
              <a href="mailto:seyalimperial@gmail.com" className="text-white text-lg hover:text-[var(--color-gold)] transition-colors block">
                seyalimperial@gmail.com
              </a>
            </div>

            <div>
              <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">WhatsApp</p>
              <a href="https://wa.me/923019123717" target="_blank" rel="noopener noreferrer" className="text-white text-lg hover:text-[var(--color-gold)] transition-colors block">
                +92 301 9123717
              </a>
            </div>

            <div>
              <p className="text-gray-400 text-sm tracking-widest uppercase mb-1">Address</p>
              <p className="text-white text-lg font-light max-w-md mx-auto leading-relaxed">
                Fida Shaheed Road, Pull Sutri Watt, O/S Bohar gate, Multan, PK
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-gray-400">
              For customer support, order inquiries, or business collaborations, please contact us via email.
            </p>
            <p className="text-[var(--color-gold)] mt-4 tracking-widest uppercase text-sm">
              We aim to respond within 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
