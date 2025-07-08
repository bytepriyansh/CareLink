import { useAuth } from '../hooks/use-auth';
import { User, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function Profile() {
    const { user } = useAuth();

    const getUserInitials = () => {
        if (!user?.displayName) return 'U';
        const names = user.displayName.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="container mx-auto mt-14 px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-24 w-full"></div>
                        <CardHeader className="relative -mt-16 pb-0">
                            <div className="flex justify-center">
                                <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
                                    <AvatarImage src={user?.photoURL || undefined} />
                                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-600 text-white text-4xl font-bold">
                                        {getUserInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center pt-6 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.displayName || 'Anonymous User'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                            </div>

                

                           
                        </CardContent>
                    </Card>

                  
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-teal-100/50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                                    <p className="text-base font-medium">
                                        {user?.displayName || 'Not provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                    <p className="text-base font-medium">
                                        {user?.email || 'Not provided'}
                                    </p>
                                </div>
                            </div>

                        

                            

                
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Medical Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Blood Type</h3>
                                <Badge variant="outline" className="px-4 py-1.5 text-base border-teal-500 text-teal-600 dark:text-teal-400">
                                    O+
                                </Badge>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Allergies</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="px-3 py-1 border-red-500 text-red-600 dark:text-red-400">
                                        Penicillin
                                    </Badge>
                                    <Badge variant="outline" className="px-3 py-1 border-amber-500 text-amber-600 dark:text-amber-400">
                                        Pollen
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Conditions</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="px-3 py-1 border-blue-500 text-blue-600 dark:text-blue-400">
                                        Asthma
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Medications</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="px-3 py-1 border-purple-500 text-purple-600 dark:text-purple-400">
                                        Albuterol
                                    </Badge>
                                    <Badge variant="outline" className="px-3 py-1 border-green-500 text-green-600 dark:text-green-400">
                                        Vitamin D
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}