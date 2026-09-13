export function AboutPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Company Information</h1>

      <div className="bg-white rounded-3xl p-6">
        <div className="mb-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsart_25-10-06_10-21-30-294-Iof44S3dPljnGJfR9SsJo9SMr11plx.jpg"
            alt="CNC Electric"
            className="w-full rounded-2xl mb-4"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">About CNC</h2>
        <p className="text-gray-700 leading-relaxed mb-6 text-justify">
          CNC Electric was founded in 1988 with the launch of our inaugural molded case circuit breakers — marking the
          beginning of our journey in power solutions. With a focus on product development and manufacturing, we
          reorganized into a corporate group by 1995 and introduced our first full low-voltage series, earning a
          reputation for rugged reliability. Today, our integrated R&D, manufacturing, trade, and service capabilities
          empower distributors in over 130 countries. Rooted in trust and driven by innovation, we deliver low-voltage
          systems, renewable energy solutions, and power transmission & distribution equipment. Backed by international
          certifications and smart manufacturing, our solutions combine performance and sustainability—empowering
          industries, partners, and communities to accelerate energy transitions. More than a supplier, CNC Electric is
          your trusted partner—connecting every part of the electrical ecosystem to build a smarter, more sustainable
          future.
        </p>

        <h3 className="text-xl font-bold mb-3">Our Purpose</h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          Empowering every connection within the electrical ecosystem, uniting industries, partners, and communities for
          a sustainable future.
        </p>

        <h3 className="text-xl font-bold mb-3">Our Mission</h3>
        <p className="text-gray-700 leading-relaxed">
          Put customers first, driving innovation and efficiency in all we do. Embrace responsibility, striving for
          continuous improvement while delivering sustainable, high-quality electrical solutions that power progress
          worldwide.
        </p>
      </div>
    </div>
  )
}
