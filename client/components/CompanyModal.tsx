"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

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

interface CompanyModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSave: (company: CompanyData) => void;
 company?: CompanyData | null;
 title: string;
}

export default function CompanyModal({
 isOpen,
 onClose,
 onSave,
 company,
 title,
}: CompanyModalProps) {
 const [formData, setFormData] = useState<CompanyData>({
  name: "",
  location: "",
  industry: "",
  employees: "",
  revenue: "",
  website: "",
  founded: "",
  status: "Active",
 });

 const [errors, setErrors] = useState<Partial<CompanyData>>({});

 useEffect(() => {
  if (company) {
   setFormData(company);
  } else {
   setFormData({
    name: "",
    location: "",
    industry: "",
    employees: "",
    revenue: "",
    website: "",
    founded: "",
    status: "Active",
   });
  }
  setErrors({});
 }, [company, isOpen]);

 const validateForm = (): boolean => {
  const newErrors: Partial<CompanyData> = {};

  if (!formData.name.trim()) newErrors.name = "Company name is required";
  if (!formData.location.trim()) newErrors.location = "Location is required";
  if (!formData.industry.trim()) newErrors.industry = "Industry is required";
  if (!formData.employees.trim())
   newErrors.employees = "Employee count is required";
  if (!formData.revenue.trim()) newErrors.revenue = "Revenue is required";
  if (!formData.website.trim()) newErrors.website = "Website is required";
  if (!formData.founded.trim()) newErrors.founded = "Founded year is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
   onSave(formData);
   onClose();
  }
 };

 const handleChange = (field: keyof CompanyData, value: string) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
  if (errors[field]) {
   setErrors((prev) => ({ ...prev, [field]: undefined }));
  }
 };

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
   <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
    <div className="flex items-center justify-between p-6 border-b">
     <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
      <X className="h-6 w-6" />
     </button>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-4">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Company Name *
       </label>
       <input
        type="text"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.name ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Enter company name"
       />
       {errors.name && (
        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Location *
       </label>
       <input
        type="text"
        value={formData.location}
        onChange={(e) => handleChange("location", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.location ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Enter location"
       />
       {errors.location && (
        <p className="text-red-500 text-xs mt-1">{errors.location}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Industry *
       </label>
       <select
        value={formData.industry}
        onChange={(e) => handleChange("industry", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.industry ? "border-red-500" : "border-gray-300"
        }`}>
        <option value="">Select industry</option>
        <option value="Technology">Technology</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Finance">Finance</option>
        <option value="Energy">Energy</option>
        <option value="Retail">Retail</option>
        <option value="Education">Education</option>
        <option value="Automotive">Automotive</option>
        <option value="Logistics">Logistics</option>
        <option value="Manufacturing">Manufacturing</option>
        <option value="Other">Other</option>
       </select>
       {errors.industry && (
        <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Employees *
       </label>
       <select
        value={formData.employees}
        onChange={(e) => handleChange("employees", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.employees ? "border-red-500" : "border-gray-300"
        }`}>
        <option value="">Select employee count</option>
        <option value="1-10">1-10</option>
        <option value="11-50">11-50</option>
        <option value="51-100">51-100</option>
        <option value="101-500">101-500</option>
        <option value="501-1000">501-1000</option>
        <option value="1000+">1000+</option>
       </select>
       {errors.employees && (
        <p className="text-red-500 text-xs mt-1">{errors.employees}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Revenue *
       </label>
       <select
        value={formData.revenue}
        onChange={(e) => handleChange("revenue", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.revenue ? "border-red-500" : "border-gray-300"
        }`}>
        <option value="">Select revenue range</option>
        <option value="<$1M">Less than $1M</option>
        <option value="$1M - $10M">$1M - $10M</option>
        <option value="$10M - $50M">$10M - $50M</option>
        <option value="$50M - $100M">$50M - $100M</option>
        <option value="$100M+">$100M+</option>
       </select>
       {errors.revenue && (
        <p className="text-red-500 text-xs mt-1">{errors.revenue}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Website *
       </label>
       <input
        type="url"
        value={formData.website}
        onChange={(e) => handleChange("website", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.website ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="https://example.com"
       />
       {errors.website && (
        <p className="text-red-500 text-xs mt-1">{errors.website}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Founded Year *
       </label>
       <input
        type="number"
        value={formData.founded}
        onChange={(e) => handleChange("founded", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
         errors.founded ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="2020"
        min="1900"
        max={new Date().getFullYear()}
       />
       {errors.founded && (
        <p className="text-red-500 text-xs mt-1">{errors.founded}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Status
       </label>
       <select
        value={formData.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
       </select>
      </div>
     </div>

     <div className="flex justify-end gap-3 pt-4 border-t">
      <button
       type="button"
       onClick={onClose}
       className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
       Cancel
      </button>
      <button
       type="submit"
       className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
       {company ? "Update" : "Add"} Company
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}
