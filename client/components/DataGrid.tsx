"use client";

import { useState, useEffect } from "react";
import {
 Search,
 Filter,
 MoreVertical,
 Wifi,
 UserPlus,
 X,
 Download,
 ArrowUp,
 ArrowDown,
 Info,
 Menu,
 Plus,
 Edit,
 Trash2,
 ChevronDown,
} from "lucide-react";

interface ColumnDefinition<T> {
 key: keyof T | null;
 label: string;
 fullLabel?: string;
 filterable?: boolean;
 sortable?: boolean;
 renderCell?: (value: any, row: T) => React.ReactNode;
}

interface DataGridProps<T> {
 data: T[];
 columns: ColumnDefinition<T>[];
 uniqueIdentifier: keyof T;
 filterableFields?: Array<keyof T>;
 onDownload?: (data: T[]) => void;
 onAdd?: () => void;
 onEdit?: (row: T) => void;
 onDelete?: (row: T) => void;
 onEditConfirm?: (row: T) => void;
 onDeleteConfirm?: (row: T) => void;
 showSearch?: boolean;
 searchPlaceholder?: string;
 rowsPerPage?: number;
 showUserProfile?: boolean;
 userId?: string;
 userName?: string;
 onUserChange?: (userId: string) => void;
 onRowAction?: (row: T, action: string) => void;
 selectableRows?: boolean;
 taggableField?: keyof T;
 allowFiltering?: boolean;
}

interface SortConfig<T> {
 key: keyof T | null;
 direction: "asc" | "desc" | null;
}

type FilterState = Record<string, string[]>;

export default function DataGrid<T extends Record<string, any>>({
 data,
 columns,
 uniqueIdentifier,
 filterableFields = [],
 onDownload,
 onAdd,
 onEdit,
 onDelete,
 onEditConfirm,
 onDeleteConfirm,
 showSearch = true,
 searchPlaceholder = "Search...",
 rowsPerPage = 5,
 showUserProfile = false,
 userId,
 userName,
 onUserChange,
 onRowAction,
 selectableRows = false,
 taggableField,
 allowFiltering = true,
}: DataGridProps<T>) {
 const [filters, setFilters] = useState<FilterState>({});
 const [tempFilters, setTempFilters] = useState<FilterState>({});
 const [filterDropdown, setFilterDropdown] = useState<string | null>(null);
 const [currentPage, setCurrentPage] = useState<number>(1);
 const [currentRowsPerPage, setCurrentRowsPerPage] =
  useState<number>(rowsPerPage);
 const [tooltip, setTooltip] = useState<string | null>(null);
 const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
  key: null,
  direction: null,
 });
 const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
 const [searchTerm, setSearchTerm] = useState<string>("");

 useEffect(() => {
  const initialFilters: FilterState = {};
  filterableFields.forEach((field) => {
   initialFilters[field as string] = [];
  });
  setFilters(initialFilters);
  setTempFilters(initialFilters);
 }, [filterableFields]);

 const resetAllFilters = () => {
  const resetFilters: FilterState = {};
  filterableFields.forEach((field) => {
   resetFilters[field as string] = [];
  });
  setFilters(resetFilters);
  setTempFilters(resetFilters);
  setSortConfig({ key: null, direction: null });
  setSearchTerm("");
 };

 const handleSort = (key: keyof T) => {
  let direction: "asc" | "desc" | null = "asc";

  if (sortConfig.key === key) {
   if (sortConfig.direction === "asc") {
    direction = "desc";
   } else if (sortConfig.direction === "desc") {
    direction = null;
   }
  }

  setSortConfig({ key, direction });
 };

 let processedData = [...data];

 if (searchTerm) {
  processedData = processedData.filter((item) => {
   return Object.values(item).some(
    (val) =>
     val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
   );
  });
 }

 processedData = processedData.filter((item) => {
  return Object.entries(filters).every(([field, allowedValues]) => {
   if (!allowedValues.length) return true; // No filter applied
   return allowedValues.includes(item[field]?.toString());
  });
 });

 if (sortConfig.key && sortConfig.direction) {
  processedData.sort((a, b) => {
   const aValue = a[sortConfig.key as keyof T];
   const bValue = b[sortConfig.key as keyof T];

   if (aValue < bValue) {
    return sortConfig.direction === "asc" ? -1 : 1;
   }
   if (aValue > bValue) {
    return sortConfig.direction === "asc" ? 1 : -1;
   }
   return 0;
  });
 }

 const paginatedData = processedData.slice(
  (currentPage - 1) * currentRowsPerPage,
  currentPage * currentRowsPerPage
 );
 const totalPages = Math.max(
  1,
  Math.ceil(processedData.length / currentRowsPerPage)
 );

 const uniqueValues = (field: string) => {
  const set = new Set<string>(
   data
    .map((item) => item[field]?.toString())
    .filter((val): val is string => val !== undefined && val !== null)
  );
  return Array.from(set);
 };

 const handleTempChange = (filterKey: string, value: string) => {
  setTempFilters((prev) => {
   const alreadySelected = prev[filterKey]?.includes(value) || false;
   return {
    ...prev,
    [filterKey]: alreadySelected
     ? prev[filterKey].filter((v) => v !== value)
     : [...(prev[filterKey] || []), value],
   };
  });
 };

 const applyFilters = (key: string) => {
  setFilters((prev) => ({
   ...prev,
   [key]: tempFilters[key] || [],
  }));
  setFilterDropdown(null);
 };

 const clearFilters = (key: string) => {
  setFilters((prev) => ({ ...prev, [key]: [] }));
  setTempFilters((prev) => ({ ...prev, [key]: [] }));
  setFilterDropdown(null);
 };

 const handleDownload = () => {
  onDownload?.(processedData);
 };

 const handleRowsPerPageChange = (newRowsPerPage: number) => {
  setCurrentRowsPerPage(newRowsPerPage);
  setCurrentPage(1); // Reset to first page when changing rows per page
 };

 const renderSortIcon = (key: keyof T) => {
  if (sortConfig.key !== key) {
   return (
    <button
     onClick={() => handleSort(key)}
     className="ml-1 text-gray-300 hover:text-gray-600">
     <ArrowUp className="h-3 w-3" />
    </button>
   );
  }

  if (sortConfig.direction === "asc") {
   return (
    <button onClick={() => handleSort(key)} className="ml-1 text-blue-500">
     <ArrowUp className="h-3 w-3" />
    </button>
   );
  }

  if (sortConfig.direction === "desc") {
   return (
    <button onClick={() => handleSort(key)} className="ml-1 text-blue-500">
     <ArrowDown className="h-3 w-3" />
    </button>
   );
  }

  return null;
 };

 const handleClickOutside = (e: MouseEvent) => {
  if (
   filterDropdown &&
   !(e.target as Element).closest(".filter-dropdown") &&
   !(e.target as Element).closest(".filter-button")
  ) {
   setFilterDropdown(null);
  }
 };

 useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, [filterDropdown]);

 useEffect(() => {
  setCurrentPage(1);
 }, [filters, data, searchTerm, currentRowsPerPage]);

 return (
  <div className="space-y-6">
   {/* Header Row with User Profile and Search Bar */}
   <div className="flex flex-col md:flex-row md:items-center gap-4">
    {/* User Profile - Optional */}
    {showUserProfile && (
     <div className="flex items-center gap-2">
      <div className="flex items-center gap-0 bg-gray-50 rounded-lg border-[0.05px] border-gray-400 overflow-hidden w-fit">
       <input
        className="bg-transparent text-sm font-medium px-3 py-2 outline-none w-[85px] border-r border-gray-400"
        value={userId || ""}
        readOnly={!onUserChange}
        onChange={(e) => onUserChange?.(e.target.value)}
       />
       <div className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 cursor-pointer">
        <UserPlus className="h-5 w-5 text-black" />
       </div>
      </div>
     </div>
    )}

    {/* Search & Tags - mobile responsive */}
    <div className="flex flex-1 flex-wrap items-center gap-3 mt-4 md:mt-0">
     {showSearch && (
      <div className="flex w-full  max-w-md md:w-2/3  items-center gap-2 rounded-lg border bg-white px-3 py-2">
       <Search className="h-5 w-5 text-gray-400" />
       <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchPlaceholder}
        className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
       />
      </div>
     )}

     {/* Action buttons */}
     <div className="ml-auto mr-auto md:mr-0 flex gap-2 mt-4 sm:mt-0">
      {allowFiltering && (
       <button
        className="md:hidden flex items-center justify-center bg-neutral-400 bg-opacity-20 w-20 h-10 font-medium text-base text-black hover:text-gray-600 rounded-lg px-4"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
        Filters
       </button>
      )}

      {onAdd && (
       <div
        className="relative"
        onMouseEnter={() => setTooltip("add")}
        onMouseLeave={() => setTooltip(null)}>
        <button
         onClick={onAdd}
         className="flex items-center justify-center gap-2 bg-green-600 h-10 font-medium text-base text-white hover:bg-green-700 rounded-lg px-2 w-10 lg:w-32 lg:px-3">
         <Plus className="h-5 w-5" />
         <span className="hidden lg:inline">Add New</span>
        </button>
        {tooltip === "add" && (
         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          Add new record
         </div>
        )}
       </div>
      )}

      {onDownload && (
       <div
        className="relative"
        onMouseEnter={() => setTooltip("download")}
        onMouseLeave={() => setTooltip(null)}>
        <button
         onClick={handleDownload}
         className="flex items-center justify-center gap-2 bg-neutral-400 bg-opacity-20 h-10 font-medium text-base text-black hover:text-gray-600 rounded-lg px-2 w-10 lg:w-32 lg:px-3">
         <Download className="h-5 w-5" />
         <span className="hidden lg:inline">Download</span>
        </button>
        {tooltip === "download" && (
         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          Download data
         </div>
        )}
       </div>
      )}

      <div
       className="relative"
       onMouseEnter={() => setTooltip("cancel")}
       onMouseLeave={() => setTooltip(null)}>
       <button
        className="flex items-center justify-center gap-2 rounded-lg border bg-red-600 h-10 font-medium text-white hover:bg-red-700 px-2 w-10 lg:w-auto lg:px-4"
        onClick={resetAllFilters}>
        <X className="h-4 w-4" />
        <span className="hidden lg:inline">Reset</span>
       </button>
       {tooltip === "cancel" && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
         Reset all filters and selections
        </div>
       )}
      </div>
     </div>
    </div>
   </div>

   {/* Mobile filters panel */}
   {allowFiltering && mobileFiltersOpen && (
    <div className="md:hidden bg-white rounded-lg border p-4 space-y-4">
     <div className="flex justify-between items-center">
      <h3 className="font-medium">Filters</h3>
      <X
       className="h-5 w-5 cursor-pointer"
       onClick={() => setMobileFiltersOpen(false)}
      />
     </div>

     {/* Filter groups */}
     {filterableFields.map((filterKey) => (
      <div key={filterKey as string} className="space-y-2">
       <h4 className="text-sm font-medium capitalize">{filterKey as string}</h4>
       <div className="space-y-1">
        {uniqueValues(filterKey as string).map((val) => (
         <label key={val} className="flex items-center gap-2 text-sm">
          <input
           type="checkbox"
           checked={filters[filterKey as string]?.includes(val) || false}
           onChange={() => {
            handleTempChange(filterKey as string, val);
            // Immediately apply on mobile
            setFilters((prev) => {
             const alreadySelected =
              prev[filterKey as string]?.includes(val) || false;
             return {
              ...prev,
              [filterKey as string]: alreadySelected
               ? prev[filterKey as string].filter((v) => v !== val)
               : [...(prev[filterKey as string] || []), val],
             };
            });
           }}
          />
          {val}
         </label>
        ))}
       </div>
      </div>
     ))}

     <button
      onClick={() => {
       resetAllFilters();
       setMobileFiltersOpen(false);
      }}
      className="w-full bg-red-600 text-white py-2 rounded-lg text-sm">
      Clear All Filters
     </button>
    </div>
   )}

   {/* Table Container */}
   <div className="rounded-lg border bg-white shadow-sm">
    {/* Table Header */}
    <div className="relative overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
       <tr>
        {columns.map((column, idx) => {
         const isFilterable =
          column.key && filterableFields.includes(column.key as keyof T);
         const columnKeyString = column.key as string;

         return (
          <th
           key={idx}
           className={`relative py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${
            column.key === null ? "px-2 text-center" : "px-3 md:px-6"
           }`}>
           <div className="flex items-center gap-1">
            <span className="hidden sm:inline truncate">
             {column.fullLabel || column.label}
            </span>
            <span className="sm:hidden truncate">{column.label}</span>

            {isFilterable && allowFiltering && column.key && (
             <button
              className="hidden md:block filter-button ml-1"
              onClick={() => {
               setTempFilters((prevFilters) => ({
                ...prevFilters,
                [columnKeyString]: [...(filters[columnKeyString] || [])],
               }));
               setFilterDropdown(
                filterDropdown === columnKeyString ? null : columnKeyString
               );
              }}>
              <Filter className="h-4 w-4 text-gray-400 hover:text-gray-600" />
             </button>
            )}

            {column.key &&
             column.sortable !== false &&
             renderSortIcon(column.key)}
           </div>

           {filterDropdown === columnKeyString && isFilterable && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded border bg-white shadow-lg p-2 space-y-2 text-sm z-50 filter-dropdown">
             <div className="max-h-48 overflow-y-auto pb-1">
              {uniqueValues(columnKeyString).map((val) => (
               <label
                key={val}
                className="flex items-center gap-2 py-1 px-1 hover:bg-gray-50">
                <input
                 type="checkbox"
                 checked={tempFilters[columnKeyString]?.includes(val) || false}
                 onChange={() => handleTempChange(columnKeyString, val)}
                />
                <span className="truncate">{val}</span>
               </label>
              ))}
             </div>
             <div className="flex justify-between pt-2 border-t">
              <button
               onClick={() => applyFilters(columnKeyString)}
               className="text-blue-600 hover:underline text-xs px-2 py-1">
               Apply
              </button>
              <button
               onClick={() => clearFilters(columnKeyString)}
               className="text-red-500 hover:underline text-xs px-2 py-1">
               Clear
              </button>
             </div>
            </div>
           )}
          </th>
         );
        })}
       </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
       {paginatedData.length > 0 ? (
        paginatedData.map((row) => (
         <tr
          key={row[uniqueIdentifier] as string}
          className="hover:bg-gray-50 transition-colors">
          {columns.map((column, cellIdx) => {
           if (column.key === null) {
            return (
             <td key={cellIdx} className="px-2 py-4 text-center">
              {column.renderCell ? (
               column.renderCell(null, row)
              ) : (
               <div className="flex items-center justify-center gap-2">
                <button
                 className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                 onClick={(e) => {
                  e.stopPropagation();
                  onEditConfirm?.(row);
                 }}
                 title="Edit">
                 <Edit className="h-4 w-4" />
                </button>
                <button
                 className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-105"
                 onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConfirm?.(row);
                 }}
                 title="Delete">
                 <Trash2 className="h-4 w-4" />
                </button>
               </div>
              )}
             </td>
            );
           }

           const cellValue = row[column.key];

           return (
            <td
             key={cellIdx}
             className={`px-3 md:px-6 py-4 text-sm text-gray-900 ${
              column.key === "name" ? "font-medium" : ""
             } ${
              column.key === "website"
               ? "text-blue-600 hover:text-blue-800"
               : ""
             }`}>
             {column.renderCell ? (
              column.renderCell(cellValue, row)
             ) : column.key === "status" ? (
              <span
               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                cellValue === "Active"
                 ? "bg-green-100 text-green-800"
                 : cellValue === "Inactive"
                 ? "bg-red-100 text-red-800"
                 : "bg-yellow-100 text-yellow-800"
               }`}>
               {cellValue}
              </span>
             ) : column.key === "website" ? (
              <a
               href={`https://${cellValue}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-800 underline truncate block">
               {cellValue}
              </a>
             ) : column.key === "revenue" || column.key === "employees" ? (
              <span className="text-gray-700 font-medium">{cellValue}</span>
             ) : (
              <span className="truncate block">{cellValue}</span>
             )}
            </td>
           );
          })}
         </tr>
        ))
       ) : (
        <tr>
         <td
          colSpan={columns.length}
          className="px-6 py-12 text-center text-sm text-gray-500">
          <div className="flex flex-col items-center gap-2">
           <div className="text-gray-400 text-4xl">📊</div>
           <p className="font-medium">No data matches the current filters</p>
           <p className="text-xs text-gray-400">
            Try adjusting your search or filters
           </p>
          </div>
         </td>
        </tr>
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t bg-gray-50">
     {/* Rows per page selector and pagination controls */}
     <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      {/* Rows per page dropdown */}
      <div className="flex items-center gap-2 order-2 sm:order-1">
       <label className="text-sm text-gray-600 whitespace-nowrap">
        Rows per page:
       </label>
       <select
        value={currentRowsPerPage}
        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
       </select>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
       <button
        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}>
        Previous
       </button>
       <div className="flex items-center gap-1 mx-2">
        <span className="px-3 py-1.5 text-sm text-gray-600 bg-white rounded-md">
         Page {currentPage} of {totalPages}
        </span>
       </div>
       <button
        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}>
        Next
       </button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
