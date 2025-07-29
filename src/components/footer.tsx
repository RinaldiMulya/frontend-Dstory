// src/components/footer.tsx
/* eslint-disable */

import React from 'react';
import {
    Heart,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Code,
    Palette,
    Database,
    Globe,
    Smartphone,
    Zap
} from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

// Define Technology interface
interface Technology {
    name: string;
    icon: string;
    category: string;
    description: string;
    color: string;
    textColor: string;
}

// Technology data with icons and descriptions
const technologies: Technology[] = [
    {
        name: "Next.js",
        icon: "⚡",
        category: "Frontend Framework",
        description: "React framework untuk production dengan SSR, SSG, dan optimasi performa otomatis.",
        color: "from-black to-gray-800",
        textColor: "text-white"
    },
    {
        name: "React",
        icon: "⚛️",
        category: "Library",
        description: "Library JavaScript untuk membangun user interface yang interaktif dan reusable.",
        color: "from-blue-400 to-blue-600",
        textColor: "text-white"
    },
    {
        name: "TypeScript",
        icon: "📘",
        category: "Language",
        description: "Superset JavaScript dengan static typing untuk development yang lebih aman.",
        color: "from-blue-500 to-blue-700",
        textColor: "text-white"
    },
    {
        name: "Tailwind CSS",
        icon: "🎨",
        category: "CSS Framework",
        description: "Utility-first CSS framework untuk rapid UI development dengan design system.",
        color: "from-cyan-400 to-blue-500",
        textColor: "text-white"
    },
    {
        name: "shadcn/ui",
        icon: "🔧",
        category: "UI Components",
        description: "Beautiful and accessible React components built with Radix UI and Tailwind.",
        color: "from-gray-800 to-black",
        textColor: "text-white"
    },
    {
        name: "Leaflet",
        icon: "🗺️",
        category: "Mapping",
        description: "Open-source JavaScript library untuk interactive maps dengan mobile support.",
        color: "from-green-500 to-green-600",
        textColor: "text-white"
    },
    {
        name: "Prisma",
        icon: "🔷",
        category: "Database ORM",
        description: "Modern database toolkit dengan type-safe client dan intuitive data modeling.",
        color: "from-indigo-500 to-purple-600",
        textColor: "text-white"
    },
    {
        name: "Zod",
        icon: "✅",
        category: "Validation",
        description: "TypeScript-first schema validation dengan static type inference.",
        color: "from-purple-500 to-pink-500",
        textColor: "text-white"
    }
];

// Define props interface for TechCard
interface TechCardProps {
    tech: Technology;
}

const TechCard: React.FC<TechCardProps> = ({ tech }) => (
    <HoverCard>
        <HoverCardTrigger asChild>
            <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-90 transition-opacity group-hover:opacity-100`} />

                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        <div className="text-3xl mb-2 transform transition-transform group-hover:scale-110">
                            {tech.icon}
                        </div>
                        <h3 className={`font-semibold text-sm ${tech.textColor} transition-colors`}>
                            {tech.name}
                        </h3>
                        <p className={`text-xs ${tech.textColor} opacity-80 mt-1`}>
                            {tech.category}
                        </p>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
            </div>
        </HoverCardTrigger>

        <HoverCardContent className="w-80 p-4 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{tech.icon}</div>
                    <div>
                        <h4 className="font-bold text-gray-900">{tech.name}</h4>
                        <p className="text-sm text-blue-600 font-medium">{tech.category}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {tech.description}
                </p>
            </div>
        </HoverCardContent>
    </HoverCard>
);

export default function ModernFooter() {
    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                {/* Tech Stack Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-6">
                        <Code className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Technology Stack</span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Built with Modern Technologies
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                        Aplikasi ini dibangun menggunakan teknologi terdepan untuk memberikan pengalaman pengguna yang optimal, performa tinggi, dan maintainability yang baik.
                    </p>

                    {/* Tech Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-12">
                        {technologies.map((tech, index) => (
                            <TechCard key={tech.name} tech={tech} />
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-12" />

                {/* Footer Content */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900">Stories App</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Platform berbagi cerita dengan lokasi geografis. Bagikan momen berharga Anda dengan dunia melalui stories yang interaktif dan menarik.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Globe className="w-4 h-4" />
                            <span>Jakarta, Indonesia</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Features
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Interactive Maps Integration
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Real-time Story Sharing
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                Location-based Stories
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                                Responsive Design
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Connect
                        </h3>
                        <div className="space-y-3">
                            <a
                                href="https://github.com"
                                className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                            >
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                                    <Github className="w-4 h-4 group-hover:text-white" />
                                </div>
                                <span>GitHub Repository</span>
                            </a>

                            <a
                                href="https://linkedin.com"
                                className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <Linkedin className="w-4 h-4 group-hover:text-white text-blue-600" />
                                </div>
                                <span>LinkedIn Profile</span>
                            </a>

                            <a
                                href="mailto:contact@example.com"
                                className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 transition-colors group"
                            >
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                                    <Mail className="w-4 h-4 group-hover:text-white text-green-600" />
                                </div>
                                <span>Email Contact</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2024 Stories App. Built with <Heart className="w-4 h-4 inline text-red-500" /> and modern web technologies.
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Smartphone className="w-4 h-4" />
                                Mobile Friendly
                            </span>
                            <span className="flex items-center gap-1">
                                <Palette className="w-4 h-4" />
                                Modern UI/UX
                            </span>
                            <span className="flex items-center gap-1">
                                <Database className="w-4 h-4" />
                                Secure & Fast
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-xl" />
        </footer>
    );
}