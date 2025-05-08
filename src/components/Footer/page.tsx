import Link from 'next/link';


export default function Footer() {
    return (
      <footer className="py-10 bg-gray-900 text-white text-center">
        <div className="mb-4">
          <Link href="#" className="text-gray-400 mx-4 hover:text-white">About</Link>
          <Link href="#" className="text-gray-400 mx-4 hover:text-white">Contact</Link>
        </div>
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    );
  }
  