import { Layout } from '@/components/layout/Layout';
import { Mail, Award, BookOpen, MapPin } from 'lucide-react';

export default function About() {
    const founder = {
        name: "Mr. Mugilan B",
        email: "mugilanbara161@gmail.com",
        location: "Chennai, Tamil Nadu",
        education: "B.Tech in AI & Data Science",
        interests: [
            "UI/UX Design",
            "Artificial Intelligence",
            "Data Science",
            "Machine Learning"
        ],
        image: "https://res.cloudinary.com/dtbsyy5zm/image/upload/v1772376607/mugilan_rd8whr.jpg"
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            About the Developer
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                            Meet the creator behind AuraFit, dedicated to revolutionizing the virtual try-on experience through AI technology.
                        </p>
                    </div>

                    {/* Founder Card: Photo on left, Details on right */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                            {/* Photo Section (Left) */}
                            <div className="relative min-h-[380px] md:min-h-[480px] bg-gray-100">
                                <img
                                    src={founder.image}
                                    alt={founder.name}
                                    className="w-full h-full object-cover object-center absolute inset-0"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80";
                                    }}
                                />
                            </div>

                            {/* Details Section (Right) */}
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{founder.name}</h2>
                                    <p className="text-blue-600 font-semibold text-sm">Founder & Developer</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block text-xs">Email</span>
                                            <a href={`mailto:${founder.email}`} className="text-blue-600 hover:underline">
                                                {founder.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block text-xs">Location</span>
                                            <span>{founder.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Award className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block text-xs">Education</span>
                                            <span>{founder.education}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm text-gray-600">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <BookOpen className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 block text-xs">Interests</span>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {founder.interests.map((interest) => (
                                                    <span
                                                        key={interest}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Section */}
                    <div className="bg-blue-600 rounded-3xl p-10 text-center text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">The Vision Behind AuraFit</h3>
                        <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            To bridge the gap between digital shopping and physical reality, empowering users to discover their perfect style with confidence and ease.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}