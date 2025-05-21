export default function Footer() {
    return (
      <footer className="relative overflow-hidden border-t border-amber-200">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100"></div>
        <div className="container mx-auto px-4 py-5 text-center relative z-10">
          <p className="text-gray-700 font-medium">© 2025 University Portal</p>
          <div className="mt-3 flex justify-center flex-wrap gap-x-8 gap-y-2">
            <a href="#" className="text-gray-600 hover:text-gray-800">Help Center</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Contact Support</a>
          </div>
        </div>
      </footer>
    );
  }