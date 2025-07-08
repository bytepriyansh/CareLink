import {  Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export default function Support() {
    return (
        <div className="container mx-auto mt-12 px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">FAQs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">How do I reset my password?</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You can reset your password from the login page or in your account settings.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">Where can I find my health reports?</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    All your reports are available in the Reports section of your dashboard.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">How do I contact my doctor?</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You can message your doctor directly through the Assistant feature.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <CardTitle className="text-lg font-semibold">Contact Support</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </label>
                                    <Input id="name" placeholder="Your name" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <Input id="email" type="email" placeholder="your@email.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">
                                    Subject
                                </label>
                                <Input id="subject" placeholder="What's this about?" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Describe your issue in detail..."
                                    className="min-h-[200px]"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                                    Send Message
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                  
                </div>
            </div>
        </div>
    );
}