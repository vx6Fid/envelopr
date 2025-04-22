import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbf9f0]">
      <Head>
        <title>{"Envelopr | Secure Collaborative File Editing"}</title>
        <meta
          name="description"
          content="Real-time collaborative file editing with secure access control"
        />
      </Head>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Envelopr Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-blue-600">Envelopr</span>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="text-gray-700 border border-blue-500 rounded-lg px-5 py-2 hover:text-blue-600 transition hover:bg-blue-50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Collaborate on files <span className="text-blue-600">securely</span>{" "}
            in real-time
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Envelopr combines file sharing, editing, and access management in
            one beautiful interface. Perfect for creators, developers, and teams
            who value simplicity and control.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for secure, collaborative file editing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-[#fbf9f0] p-8 rounded-xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Collaboration
              </h3>
              <p className="text-gray-600">
                Multiple users can work on the same file simultaneously with
                live updates and auto-saving.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#fbf9f0] p-8 rounded-xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure Access Control
              </h3>
              <p className="text-gray-600">
                JWT authentication with server-side authorization ensures only
                authorized users can access files.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#fbf9f0] p-8 rounded-xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Flexible Sharing
              </h3>
              <p className="text-gray-600">
                Share with specific users or make files public with read-only
                links.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#fbf9f0] p-8 rounded-xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Simple Dashboard
              </h3>
              <p className="text-gray-600">
                Clean interface to manage all your files, collaborators, and
                sharing settings.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#fbf9f0] p-8 rounded-xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Modern Tech Stack
              </h3>
              <p className="text-gray-600">
                Built with Next.js, Go, and PostgreSQL for performance and
                reliability.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#fbf9f0] p-8 rounded-xl hover:shadow-lg transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Coming Soon
              </h3>
              <p className="text-gray-600">
                WebSocket collaboration, file versioning, and rich-text/markdown
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-[#fbf9f0] border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Security-First Architecture
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Envelopr is built with security as the foundation, not an
                afterthought.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    JWT authentication with access/refresh tokens
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Server-side authorization for all operations
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Context-aware mutations enforce access rules
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Private files are completely invisible to unauthorized users
                  </span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Technical Architecture
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                    <p className="text-gray-600">
                      Next.js (App Router, TypeScript, TailwindCSS), Apollo
                      Client
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
                    <p className="text-gray-600">
                      Go (Golang) + gqlgen (GraphQL)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Database</h4>
                    <p className="text-gray-600">
                      PostgreSQL with Docker volume persistence
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Authentication
                    </h4>
                    <p className="text-gray-600">
                      Custom JWT system with access/refresh tokens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to simplify your file collaboration?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join Envelopr today and experience secure, real-time file editing
            with complete control.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Image
                src="/logo.png"
                alt="Envelopr Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-white">Envelopr</span>
            </div>
            <div className="flex space-x-6 mb-6 md:mb-0">
              <Link href="#" className="hover:text-white transition">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition">
                Contact
              </Link>
              <Link href="#" className="hover:text-white transition">
                Docs
              </Link>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} Envelopr. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
