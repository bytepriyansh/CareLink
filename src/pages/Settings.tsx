import { User, Lock, Bell, Shield, Database, Mail, Globe, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useTheme } from '../components/ThemeProvider';

export default function Settings() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start">
                                <User className="h-4 w-4 mr-2" />
                                Account
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Lock className="h-4 w-4 mr-2" />
                                Security
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Bell className="h-4 w-4 mr-2" />
                                Notifications
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Shield className="h-4 w-4 mr-2" />
                                Privacy
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Database className="h-4 w-4 mr-2" />
                                Data & Storage
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Settings */}
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Settings  />
                                <CardTitle className="text-lg font-semibold">Account Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="English" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="(UTC-08:00) Pacific Time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pst">(UTC-08:00) Pacific Time</SelectItem>
                                        <SelectItem value="mst">(UTC-07:00) Mountain Time</SelectItem>
                                        <SelectItem value="cst">(UTC-06:00) Central Time</SelectItem>
                                        <SelectItem value="est">(UTC-05:00) Eastern Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                                </div>
                                <Switch id="marketing-emails" />
                            </div>

                            <div className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-3">
                                    <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                    <Label htmlFor="public-profile">Public Profile</Label>
                                </div>
                                <Switch id="public-profile" />
                            </div>

                            <div className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-3">
                                    {theme === 'dark' ? (
                                        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                    )}
                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                </div>
                                <Switch
                                    id="dark-mode"
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="border-0 bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-800/30 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <CardTitle className="text-lg font-semibold">Security</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Password</h3>
                                <div className="flex space-x-4">
                                    <Button variant="outline">Change Password</Button>
                                    <Button variant="outline">Set Up 2FA</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Active Sessions</h3>
                                <div className="rounded-lg border dark:border-slate-700 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Chrome on Windows</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">San Francisco, CA • Last active 2 hours ago</p>
                                        </div>
                                        <Button variant="ghost" size="sm">Revoke</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Danger Zone</h3>
                                <div className="flex space-x-4">
                                    <Button variant="destructive">Deactivate Account</Button>
                                    <Button variant="destructive">Delete Account</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}