import { Suspense } from 'react'
import AdminSidebar from '@/components/admin/sidebar'
import { getAllQuotes } from '@/lib/data'
import DevisTable from './devis-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function QuotesTable() {
  const quotes = await getAllQuotes();
  return <DevisTable quotes={quotes} />;
}

function QuotesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Devis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminQuotesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Devis</h1>
              <p className="text-gray-600">Gérez et suivez tous les devis clients</p>
            </div>
            <Link href="/admin/devis/nouveau">
              <Button>
                <Plus className="mr-2" size={16} />
                Nouveau Devis
              </Button>
            </Link>
          </div>
          <Suspense fallback={<QuotesTableSkeleton />}>
            <QuotesTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
