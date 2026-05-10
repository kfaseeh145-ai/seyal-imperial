export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest uppercase">Privacy Policy</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Last updated: 10 May 2026</p>
        </div>

        <div className="space-y-8 font-light leading-relaxed text-gray-300">
          <p>
            Seyal Group LLC (“we”, “our”, “us”) operates the website www.seyalimperial.com.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, and protect your information when you use our website.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">1. Information We Collect</h2>
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping address</li>
              <li>Payment information (processed securely by third-party providers)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Process and deliver orders</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
              <li>Send order updates</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">3. Data Protection</h2>
            <p>
              We take appropriate security measures to protect your personal information. Payment data is processed securely by third-party payment providers and is not stored on our servers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">4. Sharing Information</h2>
            <p>
              We do not sell or rent your personal information. We may share data only with trusted service providers necessary to operate our business (payment processors, shipping companies).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">5. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal data by contacting us.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">6. Contact Us</h2>
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
