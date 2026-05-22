export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] py-32 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest uppercase">Shipping Policy</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Seyal Impérial</p>
        </div>

        <div className="space-y-8 font-light leading-relaxed text-gray-300">
          <p>
            Thank you for choosing Seyal Impérial. We are committed to delivering your fragrances with care and providing a smooth shopping experience.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Order Processing</h2>
            <p>
              All orders are processed within 1–2 business days after order confirmation. Orders placed on weekends or public holidays will be processed on the next business day.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Shipping Coverage</h2>
            <p>
              We currently deliver across Pakistan.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Payment Methods</h2>
            <p>We accept both:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Cash on Delivery (COD)</li>
              <li>Prepaid payments</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Delivery Time</h2>
            <p>
              Estimated delivery time within Pakistan is 2–5 business days, depending on your location and courier service availability.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Shipping Partners</h2>
            <p>
              We work with trusted courier services to ensure safe and timely delivery. Courier services may vary depending on your location and availability.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Order Tracking</h2>
            <p>
              Once your order has been dispatched, tracking details will be provided (when available) so you can monitor your shipment.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Delivery Delays</h2>
            <p>
              Delivery times may occasionally be affected by weather conditions, public holidays, or courier-related delays.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white tracking-wider">Need Help?</h2>
            <p className="text-gray-400">
              For any questions regarding your order or shipping, please contact Seyal Impérial Customer Support.<br />
              Email: <a href="mailto:seyalimperial@gmail.com" className="hover:text-[var(--color-gold)] transition-colors">seyalimperial@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
