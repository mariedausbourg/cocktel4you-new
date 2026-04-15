import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin | Cocktel4you',
  description: 'Tableau de bord admin Cocktel4you pour le suivi des stocks et des demandes de contact.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
