import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { FolderPlus } from "lucide-react";

interface Province {
  id: number;
  name_en: string;
  name_km: string;
}

interface ProvincesPageProps {
  provinces: Province[];
}

const breadcrumbs = [
  {
    title: "Provinces",
    href: "/admin/provinces",
    icon: FolderPlus,
  },
];

export default function ProvincesPage({ provinces = [] }: ProvincesPageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Provinces" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Provinces</h1>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">English Name</th>
            <th className="border px-4 py-2 text-left">Khmer Name</th>
          </tr>
        </thead>
        <tbody>
          {provinces.map((province) => (
            <tr key={province.id}>
              <td className="border px-4 py-2">{province.id}</td>
              <td className="border px-4 py-2">{province.name_en}</td>
              <td className="border px-4 py-2">{province.name_km}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppLayout>
  );
}