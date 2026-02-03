'use client';

import { Settings, Bell, Lock, Globe, Database, Moon } from 'lucide-react';
import SettingSection from '@/components/pages/admin/settings/SettingSection';

export default function AdminSettings() {
    return (
        <SettingSection
            heading="System Settings"
            subHeading="Configure platform parameters and administrator preferences."
            items={[
                { title: 'General Configuration', desc: 'Basic system info and core behavior', icon: Settings },
                { title: 'Email Notifications', desc: 'Configure SMTP and automated alerts', icon: Bell },
                { title: 'Security & Access', desc: 'Manage passwords and session policies', icon: Lock },
                { title: 'API Integration', desc: 'External services and webhook settings', icon: Globe },
                { title: 'Database Maintenance', desc: 'Backups, cleanup, and maintenance mode', icon: Database },
                { title: 'Appearance & UI', desc: 'Customize themes and branding assets', icon: Moon },
            ]}
        />
    );
}
