import prismaClient from "@/services/prisma"
import Link from "next/link"
import { Building2, Mail, MapPin, Users } from "lucide-react"

export default async function Page(){
    const companies = await prismaClient.company.findMany({
        include:{
            owner: true,
            _count: {
                select: {
                    jobs: true
                }
            }
        }
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Companies
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover companies that are actively hiring on our platform
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <Building2 size={16} />
                        <span>{companies.length} companies available</span>
                    </div>
                </div>

                {/* Companies Grid */}
                {companies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <Link 
                                key={company.id} 
                                href={`/company/${company.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 h-full flex flex-col group-hover:border-gray-300">
                                    {/* Company Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {company.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                                {company.name}
                                            </h2>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Building2 size={14} />
                                                <span>Company Profile</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Description */}
                                    <div className="flex-1 mb-4">
                                        {company.description ? (
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                {company.description}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400 text-sm italic">
                                                No description available
                                            </p>
                                        )}
                                    </div>

                                    {/* Company Stats */}
                                    <div className="border-t border-gray-100 pt-4 mt-auto">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail size={14} />
                                                <span className="line-clamp-1">{company.owner.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                                                <Users size={14} />
                                                <span>{company._count?.jobs || 0} jobs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No companies found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                There are currently no companies registered on our platform.
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>Companies will appear here once they:</p>
                                <ul className="space-y-1">
                                    <li>• Register on the platform</li>
                                    <li>• Complete their company profile</li>
                                    <li>• Start posting job listings</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 