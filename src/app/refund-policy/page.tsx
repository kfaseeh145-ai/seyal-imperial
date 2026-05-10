export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest uppercase">Refund Policy</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Last updated: 10 May 2026</p>
        </div>

        <div className="space-y-8 font-light leading-relaxed text-gray-300">
          <p>
            At Seyal Impérial, we aim to ensure customer satisfaction.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">1. Returns</h2>
            <p>
              Due to the nature of perfumes and hygiene products, all sales are final unless the product arrives damaged or incorrect.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">2. Damaged or Incorrect Orders</h2>
            <p>
              If you receive a damaged or incorrect item, please contact us within 7 days of delivery with photos of the product.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">3. Refunds</h2>
            <p>
              Approved refunds will be processed back to the original payment method within 5–10 business days.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">4. Shipping Costs</h2>
            <p>
              Shipping costs are non-refundable unless the error was caused by us.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">5. Contact</h2>
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
