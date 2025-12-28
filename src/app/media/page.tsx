import Link from "next/link";

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to Home */}
        <Link href="/" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-bevan)] mb-4 text-white">
            Media & Brand Guidelines
          </h1>
          <p className="text-xl text-gray-300">
            Design assets and style information for Rumble Raffle
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Typography</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Hero Font</h3>
              <p className="text-gray-300 mb-2">
                <strong>Font:</strong> Bevan (Google Fonts)
              </p>
              <p className="text-gray-300 mb-4">
                <strong>Usage:</strong> Main logo and hero headings
              </p>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-3xl font-[family-name:var(--font-bevan)] text-white">
                  Rumble Raffle
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Hero Text Shadow</h3>
              <p className="text-gray-300 font-mono text-sm bg-gray-900 p-3 rounded">
                textShadow: '4px 4px 0 #7c3aed, -2px -2px 0 #7c3aed, 2px -2px 0 #7c3aed, -2px 2px 0 #7c3aed, 2px 2px 0 #7c3aed, 4px 0 0 #7c3aed, -4px 0 0 #7c3aed, 0 4px 0 #7c3aed, 0 -4px 0 #7c3aed'
              </p>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="mb-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Color Palette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Primary Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-purple-600 border-2 border-white"></div>
                  <div>
                    <p className="text-white font-semibold">Purple Primary</p>
                    <p className="text-gray-400 font-mono text-sm">#7c3aed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-purple-700 border-2 border-white"></div>
                  <div>
                    <p className="text-white font-semibold">Purple Hover</p>
                    <p className="text-gray-400 font-mono text-sm">#6d28d9</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Background Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-slate-950 border-2 border-white"></div>
                  <div>
                    <p className="text-white font-semibold">Main Background</p>
                    <p className="text-gray-400 font-mono text-sm">#020617</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-gray-800 border-2 border-white"></div>
                  <div>
                    <p className="text-white font-semibold">Card Background</p>
                    <p className="text-gray-400 font-mono text-sm">#1f2937</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-gray-900 border-2 border-white"></div>
                  <div>
                    <p className="text-white font-semibold">Dark Accent</p>
                    <p className="text-gray-400 font-mono text-sm">#111827</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Patterns Section */}
        <section className="mb-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Gradient Patterns</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Hero Background Gradient</h3>
              <p className="text-gray-300 font-mono text-sm mb-2">
                bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900
              </p>
              <div className="h-24 rounded bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">CTA Section Gradient</h3>
              <p className="text-gray-300 font-mono text-sm mb-2">
                bg-gradient-to-r from-purple-600 to-purple-800
              </p>
              <div className="h-24 rounded bg-gradient-to-r from-purple-600 to-purple-800 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Grid Pattern (SVG)</h3>
              <p className="text-gray-300 text-sm mb-2">
                Subtle grid overlay with 20% opacity
              </p>
              <div className="h-24 rounded relative overflow-hidden bg-gray-900 border-2 border-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="mb-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TikTok */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00f2ea] to-[#ff0050] rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">TikTok</h3>
                  <p className="text-gray-400 text-sm">Coming Soon</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Follow us for wrestling raffle tips, event highlights, and community content.
              </p>
            </div>

            {/* X (Twitter) */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center border border-gray-600">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">X</h3>
                  <p className="text-gray-400 text-sm">Coming Soon</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Stay updated with the latest wrestling raffle news, updates, and announcements.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Icons */}
        <section className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Brand Icons</h2>
          <div className="space-y-6">
            {/* Wrestling Emoji */}
            <div className="flex items-center gap-4">
              <div className="text-6xl">🤼‍♂️</div>
              <div>
                <p className="text-white font-semibold mb-1">Wrestling Emoji</p>
                <p className="text-gray-400 text-sm">
                  Unicode: U+1F93C U+200D U+2642 U+FE0F
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Used as the brand icon across the platform
                </p>
              </div>
            </div>

            {/* RR Abbreviation */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                  <p className="text-4xl font-[family-name:var(--font-bevan)] text-white">RR</p>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">RR Abbreviation</p>
                  <p className="text-gray-400 text-sm">
                    Font: Bevan
                  </p>
                  <p className="text-gray-300 text-sm mt-2">
                    Used for mobile header and compact spaces
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
