"use client";
import { Copy } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const HandleCopy = ({ api_key }: { api_key: string | undefined | null }) => {
  const HandleCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!api_key) return toast.error("Something went wrong");
    navigator.clipboard.writeText(api_key);
    toast.success("key copied");
  };
  return (
    <span className="hover:bg-slate-300 cursor-pointer p-2 rounded-lg transition-colors" onClick={HandleCopy}>
      <Copy className="w-4  h-4 " />
    </span>
  );
};

export default HandleCopy;
