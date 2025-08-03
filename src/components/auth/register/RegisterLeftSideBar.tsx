import { CalendarIcon, ShieldCheckIcon, Sparkles } from "lucide-react";

export function RegisterLeftSideBar() {
  const features = [
    { icon: CalendarIcon, label: "Upcoming Workshops" },
    { icon: ShieldCheckIcon, label: "Access Control" },
    { icon: Sparkles, label: "Exclusive Benefits" },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <div className="text-white space-y-8 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Discover Events That Match Your Journey
          </h1>
          <p className="text-xl text-blue-100">
            Explore handpicked events designed to elevate your skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {features.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
