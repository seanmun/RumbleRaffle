// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="w-full bg-gray-900 text-white text-center p-4">
        <p>© {new Date().getFullYear()} RumbleRaffle. All rights reserved.</p>
        <p>
          Built by{" "}
          <a
            href="https://seanmun.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
          >
            Seanmun.com
          </a>
        </p>
      </footer>
    );
  }
  