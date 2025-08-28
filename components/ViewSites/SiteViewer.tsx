'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShiftLocation } from '@/lib/type';
import { SiteCard } from './SiteCard';
import SiteDetailsSheet from './SiteDetailsSheet';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function SitesViewer() {
  const [sites, setSites] = useState<ShiftLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  
  const [selectedSite, setSelectedSite] = useState<ShiftLocation | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const response = await fetch('/api/locations');
        if (!response.ok) throw new Error('Failed to fetch sites');
        const data = await response.json();
        setSites(data);
      } catch (err) {
        setError(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSites();
  }, []);

  const handleSelectSite = (site: ShiftLocation) => {
    setSelectedSite(site);
    setIsSheetOpen(true);
  };

  const handleAddNewSite = () => {
    setSelectedSite(null); // Clear selection to indicate "create" mode
    setIsSheetOpen(true);
  };

  const handleSiteUpdate = (updatedSite: ShiftLocation) => {
    setSites(prev => {
      const exists = prev.some(s => s.id === updatedSite.id);
      if (exists) {
        return prev.map(s => (s.id === updatedSite.id ? updatedSite : s));
      }
      return [updatedSite, ...prev]; // Add new site to the top
    });
  };

  const handleSiteDelete = (siteId: string) => {
    setSites(prev => prev.filter(s => s.id !== siteId));
  };

  const filteredSites = useMemo(() => {
    if (!searchQuery) return sites;
    return sites.filter(site =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sites, searchQuery]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <SiteDetailsSheet
        site={selectedSite}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSiteUpdate={handleSiteUpdate}
        onSiteDelete={handleSiteDelete}
      />

      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-6 sticky top-4 z-10 bg-white/80 backdrop-blur-sm p-2 -m-2 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by site name or address..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Button onClick={handleAddNewSite} className="flex-shrink-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Site
            </Button>
          </div>
        </div>

        {isLoading && <p className="text-center text-gray-500">Loading sites...</p>}
        {error && <p className="text-center text-red-500">Error: Could not load sites.</p>}

        {!isLoading && !error && (
          <ul className="space-y-3 md:grid md:grid-cols-2 gap-4">
            {filteredSites.length > 0 ? (
              filteredSites.map(site => (
                <SiteCard key={site.id} site={site} handleSelectSite={handleSelectSite} />
              ))
            ) : (
              <p className="text-center text-gray-500">No sites found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}