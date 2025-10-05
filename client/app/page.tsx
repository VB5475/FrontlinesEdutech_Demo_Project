"use client";

import { useState, useEffect } from "react";
import DataGrid from "@/components/DataGrid";
import CompanyModal from "@/components/CompanyModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { MoreVertical } from "lucide-react";

interface CompanyData {
 id?: number;
 name: string;
 location: string;
 industry: string;
 employees: string;
 revenue: string;
 website: string;
 founded: string;
 status: string;
}

export default function Home() {
 const [companiesData, setCompaniesData] = useState<CompanyData[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
 const [confirmationModal, setConfirmationModal] = useState<{
  isOpen: boolean;
  type: "delete" | "edit";
  company: CompanyData | null;
 }>({
  isOpen: false,
  type: "delete",
  company: null,
 });

 useEffect(() => {
  const fetchCompanies = async () => {
   try {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${apiUrl}/companies`, {
     signal: controller.signal,
     headers: {
      "Content-Type": "application/json",
     },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
     throw new Error(
      `Failed to fetch companies data: ${response.status} ${response.statusText}`
     );
    }
    const data = await response.json();
    setCompaniesData(data);
   } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
     setError("Request timeout - server is not responding");
    } else {
     setError(err instanceof Error ? err.message : "An error occurred");
    }
    console.error("Error fetching companies:", err);
   } finally {
    setLoading(false);
   }
  };

  fetchCompanies();
 }, []);

 const downloadDataAsCsv = (data: CompanyData[]) => {
  const headers = [
   "Name",
   "Location",
   "Industry",
   "Employees",
   "Revenue",
   "Website",
   "Founded",
   "Status",
  ];

  const escapeField = (field: string, isWebsite: boolean = false): string => {
   if (isWebsite) {
    return `"'${field.replace(/"/g, '""')}"`;
   }

   if (
    field &&
    (field.includes(",") || field.includes('"') || field.includes("\n"))
   ) {
    return `"${field.replace(/"/g, '""')}"`;
   }
   return field;
  };

  const csvData = [
   headers.join(","),
   ...data.map((row) =>
    [
     escapeField(row.name),
     escapeField(row.location),
     escapeField(row.industry),
     escapeField(row.employees),
     escapeField(row.revenue),
     escapeField(row.website, true),
     escapeField(row.founded),
     escapeField(row.status),
    ].join(",")
   ),
  ].join("\n");

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "companies_directory.csv";
  a.click();
  URL.revokeObjectURL(url);
 };

 const columns = [
  { key: "name" as keyof CompanyData, label: "Company Name", filterable: true },
  { key: "location" as keyof CompanyData, label: "Location", filterable: true },
  { key: "industry" as keyof CompanyData, label: "Industry", filterable: true },
  { key: "employees" as keyof CompanyData, label: "Employees" },
  { key: "revenue" as keyof CompanyData, label: "Revenue" },
  { key: "website" as keyof CompanyData, label: "Website" },
  { key: "founded" as keyof CompanyData, label: "Founded" },
  { key: "status" as keyof CompanyData, label: "Status" },
  {
   key: null,
   label: "Actions",
  },
 ];

 const handleRowAction = (row: CompanyData, action: string) => {
  console.log(`Action ${action} on row:`, row);
 };

 const handleAddCompany = () => {
  setEditingCompany(null);
  setIsModalOpen(true);
 };

 const handleEditCompany = (company: CompanyData) => {
  setConfirmationModal({
   isOpen: true,
   type: "edit",
   company: company,
  });
 };

 const handleDeleteCompany = (company: CompanyData) => {
  setConfirmationModal({
   isOpen: true,
   type: "delete",
   company: company,
  });
 };

 const handleEditConfirm = (company: CompanyData) => {
  setEditingCompany(company);
  setIsModalOpen(true);
 };

 const handleDeleteConfirm = async (company: CompanyData) => {
  try {
   const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/companies/${
     company.id
    }`,
    {
     method: "DELETE",
    }
   );

   if (response.ok) {
    // Refresh the data
    const updatedData = companiesData.filter((c) => c.id !== company.id);
    setCompaniesData(updatedData);
   } else {
    alert("Failed to delete company");
   }
  } catch (error) {
   console.error("Error deleting company:", error);
   alert("Error deleting company");
  }
 };

 const handleSaveCompany = async (companyData: CompanyData) => {
  try {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

   if (editingCompany) {
    // Update existing company
    const response = await fetch(`${apiUrl}/companies/${editingCompany.id}`, {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(companyData),
    });

    if (response.ok) {
     const updatedData = companiesData.map((c) =>
      c.id === editingCompany.id ? { ...companyData, id: editingCompany.id } : c
     );
     setCompaniesData(updatedData);
    } else {
     alert("Failed to update company");
    }
   } else {
    // Add new company
    const response = await fetch(`${apiUrl}/companies`, {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(companyData),
    });

    if (response.ok) {
     const newCompany = await response.json();
     setCompaniesData((prev) => [...prev, newCompany]);
    } else {
     alert("Failed to add company");
    }
   }
  } catch (error) {
   console.error("Error saving company:", error);
   alert("Error saving company");
  }
 };

 if (loading) {
  return (
   <main className="min-h-screen bg-gray-50 p-4 md:p-6">
    <div className="mx-auto max-w-[1400px]">
     <div className="flex items-center justify-center h-64">
      <div className="text-center">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
       <p className="text-gray-600">Loading companies data...</p>
      </div>
     </div>
    </div>
   </main>
  );
 }

 if (error) {
  return (
   <main className="min-h-screen bg-gray-50 p-4 md:p-6">
    <div className="mx-auto max-w-[1400px]">
     <div className="flex items-center justify-center h-64">
      <div className="text-center">
       <div className="text-red-600 text-6xl mb-4">⚠️</div>
       <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Error Loading Data
       </h2>
       <p className="text-gray-600 mb-4">{error}</p>
       <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Retry
       </button>
      </div>
     </div>
    </div>
   </main>
  );
 }

 return (
  <main className="min-h-screen bg-gray-50 p-4 md:p-6">
   <div className="mx-auto max-w-[1400px]">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
     <h1 className="text-2xl font-semibold text-gray-900">
      Companies Directory
     </h1>
     <div className="text-sm text-gray-500">
      <p>Project created by Vatsal Bhatti</p>
      <p>Responsive for Desktop And Mobile devices</p>
      <p className="text-green-600 font-medium">Data from JSON Server</p>
     </div>
    </div>

    <DataGrid
     data={companiesData}
     columns={columns}
     uniqueIdentifier="name"
     filterableFields={["name", "location", "industry"]}
     onDownload={downloadDataAsCsv}
     onAdd={handleAddCompany}
     onEditConfirm={handleEditCompany}
     onDeleteConfirm={handleDeleteCompany}
     showSearch={true}
     searchPlaceholder="Search for a company, location, or industry"
     rowsPerPage={5}
     showUserProfile={true}
     userId="ADMIN"
     userName="Admin"
     taggableField="name"
     allowFiltering={true}
     onRowAction={handleRowAction}
    />

    <CompanyModal
     isOpen={isModalOpen}
     onClose={() => setIsModalOpen(false)}
     onSave={handleSaveCompany}
     company={editingCompany}
     title={editingCompany ? "Edit Company" : "Add New Company"}
    />

    <ConfirmationModal
     isOpen={confirmationModal.isOpen}
     onClose={() =>
      setConfirmationModal({ isOpen: false, type: "delete", company: null })
     }
     onConfirm={() => {
      if (confirmationModal.company) {
       if (confirmationModal.type === "edit") {
        // Close confirmation modal and open edit modal
        setConfirmationModal({ isOpen: false, type: "delete", company: null });
        handleEditConfirm(confirmationModal.company);
       } else {
        // Close confirmation modal and delete the company
        setConfirmationModal({ isOpen: false, type: "delete", company: null });
        handleDeleteConfirm(confirmationModal.company);
       }
      }
     }}
     type={confirmationModal.type}
     itemName={confirmationModal.company?.name || ""}
     itemType="company"
    />
   </div>
  </main>
 );
}
