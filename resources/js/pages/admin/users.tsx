import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { FolderPlus } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UsersPageProps {
  users: User[];
}

const breadcrumbs = [
  {
    title: "Users",
    href: "/admin/users",
    icon: FolderPlus,
  },
];

export default function UsersPage({ users = [] }: UsersPageProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex flex-col gap-4 p-4 min-h-screen bg-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Manage Users</h1>
        </div>
        <div className="rounded border bg-white">
          <table className="min-w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2 text-left text-blue-700">ID</th>
                <th className="border px-4 py-2 text-left text-blue-700">Name</th>
                <th className="border px-4 py-2 text-left text-blue-700">Email</th>
                <th className="border px-4 py-2 text-left text-blue-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td className="border px-4 py-2 text-blue-900">{user.id}</td>
                  <td className="border px-4 py-2 text-blue-900">{user.name}</td>
                  <td className="border px-4 py-2 text-blue-900">{user.email}</td>
                  <td className="border px-4 py-2 text-blue-900 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
