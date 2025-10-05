"use client";

import { X, AlertTriangle, Edit, Trash2 } from "lucide-react";

interface ConfirmationModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 type: "delete" | "edit";
 itemName: string;
 itemType?: string;
}

export default function ConfirmationModal({
 isOpen,
 onClose,
 onConfirm,
 type,
 itemName,
 itemType = "record",
}: ConfirmationModalProps) {
 if (!isOpen) return null;

 const isDelete = type === "delete";
 const isEdit = type === "edit";

 const getModalContent = () => {
  if (isDelete) {
   return {
    icon: <Trash2 className="h-8 w-8 text-red-600" />,
    title: "Delete Confirmation",
    message: `Are you sure you want to delete "${itemName}"?`,
    description:
     "This action cannot be undone. The record will be permanently removed from the system.",
    confirmText: "Delete",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white",
    cancelClass: "bg-gray-100 hover:bg-gray-200 text-gray-700",
   };
  } else {
   return {
    icon: <Edit className="h-8 w-8 text-blue-600" />,
    title: "Edit Confirmation",
    message: `Are you sure you want to edit "${itemName}"?`,
    description:
     "You are about to modify this record. Make sure you have the necessary permissions.",
    confirmText: "Edit",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
    cancelClass: "bg-gray-100 hover:bg-gray-200 text-gray-700",
   };
  }
 };

 const content = getModalContent();

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
   <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
    <div className="flex items-center justify-between p-6 border-b">
     <div className="flex items-center gap-3">
      {content.icon}
      <h2 className="text-xl font-semibold text-gray-900">{content.title}</h2>
     </div>
     <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 transition-colors">
      <X className="h-6 w-6" />
     </button>
    </div>

    <div className="p-6">
     <div className="flex items-start gap-3 mb-4">
      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div>
       <p className="text-gray-900 font-medium mb-2">{content.message}</p>
       <p className="text-sm text-gray-600">{content.description}</p>
      </div>
     </div>

     <div className="flex justify-end gap-3 pt-4 border-t">
      <button
       onClick={onClose}
       className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${content.cancelClass}`}>
       Cancel
      </button>
      <button
       onClick={() => {
        onConfirm();
        onClose();
       }}
       className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${content.confirmClass}`}>
       {content.confirmText}
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
