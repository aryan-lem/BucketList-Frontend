// components/layout/Footer.js
export default function Footer() {
  return (
    <footer className="py-6 text-center text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} BucketList App. All rights reserved.</p>
    </footer>
  );
}