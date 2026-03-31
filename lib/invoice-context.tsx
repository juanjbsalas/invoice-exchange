"use client";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { INVOICES } from "@/lib/mock-data";
import type { Invoice } from "@/lib/types";

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (inv: Invoice) => void;
}

const InvoiceContext = createContext<InvoiceContextType | null>(null);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  function addInvoice(inv: Invoice) {
    setInvoices((prev) => [inv, ...prev]);
  }
  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}
