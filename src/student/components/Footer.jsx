export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#0A1A2F] to-[#1F2D3D] text-gray-300 text-sm pt-8 pb-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-white">SmartEd</h3>
          <p className="text-gray-400">Empowering students worldwide.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-white">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white transition-colors duration-150">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-150">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-white">Legal</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8 pt-4 border-t border-gray-600 text-xs">
        <p>© {new Date().getFullYear()} SmartEd. All rights reserved.</p>
      </div>
    </footer>
  );
}
