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
      <div className="flex flex-col gap-4 p-4 min-h-screen bg-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Manage Provinces</h1>
        </div>
        <div className="rounded border bg-white">
          <table className="min-w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2 text-left text-blue-700">ID</th>
                <th className="border px-4 py-2 text-left text-blue-700">English Name</th>
                <th className="border px-4 py-2 text-left text-blue-700">Khmer Name</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((province, idx) => (
                <tr key={province.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td className="border px-4 py-2 text-blue-900">{province.id}</td>
                  <td className="border px-4 py-2 text-blue-900">{province.name_en}</td>
                  <td className="border px-4 py-2 text-blue-900">{province.name_km}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}