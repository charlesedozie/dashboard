"use client";

import React, { useState, useEffect } from "react";

interface BunnyZone {
  Id: number;
  Name: string;
  Region: string;
  StorageHostname: string;
  DateCreated: string;
}

const BunnyStorageZones: React.FC = () => {
  const [zones, setZones] = useState<BunnyZone[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 5; // show 5 per page

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch("/api/bunny/storageZones");
        const data = await res.json();
        setZones(data);
      } catch (err) {
        console.error("Failed to fetch zones", err);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  // Filtered + Paginated data
  const filteredZones = zones.filter(zone =>
    zone.Name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (currentPage - 1) * pageSize;
  const paginatedZones = filteredZones.slice(start, start + pageSize);
  const totalPages = Math.ceil(filteredZones.length / pageSize);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  if (loading) return <div>Loading zones...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bunny Storage Zones</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by zone name"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Region</th>
            <th className="border p-2">Hostname</th>
            <th className="border p-2">Date Created</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedZones.map(zone => (
            <tr key={zone.Id}>
              <td className="border p-2">{zone.Name}</td>
              <td className="border p-2">{zone.Region}</td>
              <td className="border p-2">{zone.StorageHostname}</td>
              <td className="border p-2">{new Date(zone.DateCreated).toLocaleString()}</td>
              <td className="border p-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleCopy(zone.Name)}
                >
                  Copy Name
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BunnyStorageZones;
