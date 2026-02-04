'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Globe, Database, Moon, AlertTriangle } from 'lucide-react';
import SettingSection from '@/components/pages/admin/settings/SettingSection';
import SettingsModal from '@/components/pages/admin/settings/SettingsModal';
import GeneralSettingsForm from '@/components/pages/admin/settings/GeneralSettingsForm';
import SecuritySettingsForm from '@/components/pages/admin/settings/SecuritySettingsForm';
import MaintenanceSettingsForm from '@/components/pages/admin/settings/MaintenanceSettingsForm';
import api from '@/lib/api';

export default function AdminSettings() {
    const [activeSetting, setActiveSetting] = useState<string | null>(null);
    const [settingsData, setSettingsData] = useState<any>(null);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettingsData(res.data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleOpen = (key: string) => () => setActiveSetting(key);
    const handleClose = () => setActiveSetting(null);
    const handleSaved = () => {
        fetchSettings();
        handleClose();
    };

    const renderActiveForm = () => {
        switch (activeSetting) {
            case 'general':
                return <GeneralSettingsForm onSaved={handleSaved} initialData={settingsData} />;
            case 'security':
                return <SecuritySettingsForm onSaved={handleSaved} initialData={settingsData} />;
            case 'maintenance':
                return <MaintenanceSettingsForm onSaved={handleSaved} initialData={settingsData} />;
            default:
                return <div className="p-4 text-center text-gray-500">Feature coming soon...</div>;
        }
    };

    const getModalTitle = () => {
        switch (activeSetting) {
            case 'general': return 'General Configuration';
            case 'security': return 'Security Settings';
            case 'maintenance': return 'Maintenance Mode';
            default: return 'Settings';
        }
    };

    // Update the SettingCard component to accept an onClick handler
    // We need to modify SettingSection/SettingCard to allow passing onClick.
    // Since SettingSection takes direct items, I'll assume I need to pass the onClick in the item object or modify SettingSection.
    // A quicker way without modifying widely used components (if reused) is to pass a custom renderer or just update the props in SettingSection.
    // Let's see SettingSection again... it maps items to SettingCard.
    // I will pass an 'action' property to items which is the click handler.

    const items = [
        {
            title: 'General Configuration',
            desc: 'Basic system info and core behavior',
            icon: Settings,
            onClick: handleOpen('general')
        },
        {
            title: 'Security & Access',
            desc: 'Manage passwords and session policies',
            icon: Lock,
            onClick: handleOpen('security')
        },
        {
            title: 'Maintenance Mode',
            desc: 'Control public access to the site',
            icon: AlertTriangle,
            onClick: handleOpen('maintenance')
        },
        { title: 'Email Notifications', desc: 'Configure SMTP and automated alerts', icon: Bell, onClick: () => alert('Coming soon') },
        { title: 'API Integration', desc: 'External services and webhook settings', icon: Globe, onClick: () => alert('Coming soon') },
        { title: 'Appearance & UI', desc: 'Customize themes and branding assets', icon: Moon, onClick: () => alert('Coming soon') },
    ];

    return (
        <>
            <SettingSection
                heading="System Settings"
                subHeading="Configure platform parameters and administrator preferences."
                items={items}
            />

            <SettingsModal
                isOpen={!!activeSetting}
                onClose={handleClose}
                title={getModalTitle()}
            >
                {renderActiveForm()}
            </SettingsModal>
        </>
    );
}
