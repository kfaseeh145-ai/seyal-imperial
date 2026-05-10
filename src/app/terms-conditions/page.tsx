export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest uppercase">Terms & Conditions</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Last updated: 10 May 2026</p>
        </div>

        <div className="space-y-8 font-light leading-relaxed text-gray-300">
          <p>
            Welcome to Seyal Impérial. By using our website, you agree to the following terms.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">1. General</h2>
            <p>
              This website is operated by Seyal Group LLC.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">2. Products</h2>
            <p>
              We sell luxury fragrances. We reserve the right to modify or discontinue products at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">3. Orders</h2>
            <p>
              We reserve the right to refuse or cancel any order if fraud or misuse is suspected.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">4. Pricing</h2>
            <p>
              All prices are listed in USD and may change without notice.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">5. Limitation of Liability</h2>
            <p>
              We are not responsible for any indirect damages resulting from the use of our products.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">6. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United States.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">7. Contact</h2>
            <p className="text-gray-400">
              Email: <a href="mailto:seyalimperial@gmail.com" className="hover:text-[var(--color-gold)] transition-colors">seyalimperial@gmail.com</a><br />
              Company: Seyal Group LLC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
