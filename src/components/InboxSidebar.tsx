"use client";

import {
  Archive,
  ChevronDown,
  ChevronRight,
  Edit,
  Folder,
  FolderOpen,
  Inbox,
  Mail,
  Plus,
  Send,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InboxSidebarProps {
  currentFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
  emailCounts: {
    inbox: number;
    sent: number;
    drafts: number;
    trash: number;
    spam: number;
    starred: number;
    important: number;
  };
}

interface CustomFolder {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function InboxSidebar({
  currentFolder,
  onFolderChange,
  onCompose,
  emailCounts,
}: InboxSidebarProps) {
  const [customFolders, setCustomFolders] = useState<CustomFolder[]>([
    { id: "work", name: "Work", count: 12, color: "blue" },
    { id: "personal", name: "Personal", count: 8, color: "green" },
    { id: "projects", name: "Projects", count: 5, color: "purple" },
  ]);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["custom"]);

  const defaultFolders = [
    {
      id: "inbox",
      name: "Inbox",
      icon: Inbox,
      count: emailCounts.inbox,
      color: "blue",
    },
    {
      id: "sent",
      name: "Sent",
      icon: Send,
      count: emailCounts.sent,
      color: "gray",
    },
    {
      id: "drafts",
      name: "Drafts",
      icon: Edit,
      count: emailCounts.drafts,
      color: "orange",
    },
    {
      id: "starred",
      name: "Starred",
      icon: Star,
      count: emailCounts.starred,
      color: "yellow",
    },
    {
      id: "important",
      name: "Important",
      icon: Star,
      count: emailCounts.important,
      color: "red",
    },
    {
      id: "spam",
      name: "Junk",
      icon: Trash2,
      count: emailCounts.spam,
      color: "red",
    },
    {
      id: "trash",
      name: "Trash",
      icon: Trash2,
      count: emailCounts.trash,
      color: "gray",
    },
  ];

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: CustomFolder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, "-"),
      name: newFolderName,
      count: 0,
      color: "blue",
    };

    setCustomFolders([...customFolders, newFolder]);
    setNewFolderName("");
    setShowNewFolderDialog(false);
  };

  const handleDeleteFolder = (folderId: string) => {
    setCustomFolders(customFolders.filter((folder) => folder.id !== folderId));
  };

  const toggleFolderExpansion = (folderType: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderType)
        ? prev.filter((f) => f !== folderType)
        : [...prev, folderType],
    );
  };

  const getFolderColor = (color: string) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      yellow: "text-yellow-600",
      red: "text-red-600",
      gray: "text-gray-600",
    };
    return colors[color as keyof typeof colors] || "text-gray-600";
  };

  const getFolderBgColor = (color: string) => {
    const colors = {
      blue: "bg-blue-50 hover:bg-blue-100",
      green: "bg-green-50 hover:bg-green-100",
      purple: "bg-purple-50 hover:bg-purple-100",
      orange: "bg-orange-50 hover:bg-orange-100",
      yellow: "bg-yellow-50 hover:bg-yellow-100",
      red: "bg-red-50 hover:bg-red-100",
      gray: "bg-gray-50 hover:bg-gray-100",
    };
    return (
      colors[color as keyof typeof colors] || "bg-gray-50 hover:bg-gray-100"
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Inbox
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Compose Button */}
        <Button
          onClick={onCompose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Edit className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Default Folders */}
          <div className="space-y-1 mb-4">
            {defaultFolders.map((folder) => {
              const Icon = folder.icon;
              const isActive = currentFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => onFolderChange(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? `${getFolderBgColor(folder.color)} ${getFolderColor(folder.color)}`
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{folder.name}</span>
                  </div>
                  {folder.count > 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        isActive ? "bg-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {folder.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Folders */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={() => toggleFolderExpansion("custom")}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                {expandedFolders.includes("custom") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span>Folders</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowNewFolderDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {expandedFolders.includes("custom") && (
              <div className="ml-4 space-y-1">
                {customFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between group"
                  >
                    <button
                      onClick={() => onFolderChange(folder.id)}
                      className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentFolder === folder.id
                          ? `${getFolderBgColor(folder.color)} ${getFolderColor(folder.color)}`
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Folder
                          className={`h-4 w-4 ${
                            currentFolder === folder.id ? "fill-current" : ""
                          }`}
                        />
                        <span>{folder.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {folder.count > 0 && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              currentFolder === folder.id
                                ? "bg-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {folder.count}
                          </Badge>
                        )}
                      </div>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your emails.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewFolderDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
