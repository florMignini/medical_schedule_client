"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

interface Office {
  id: string;
  name: string;
  location: string;
  specialty: string;
  status: "Activo" | "Inactivo";
  hours: string;
}


const demoOffices: Office[] = Array.from({ length: 25 }, (_, i) => ({
  id: `demo-${i + 1}`,
  name: `Consultorio ${i + 1}`,
  location: `Piso ${Math.ceil(Math.random() * 3)}`,
  specialty: ["Cardiología", "Pediatría", "Radiología", "Dermatología"][i % 4],
  status: i % 2 === 0 ? "Activo" : "Inactivo",
  hours: "08:00 - 17:00",
}));

const ITEMS_PER_PAGE = 6;

export default function Offices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState<Office[]>([]);
const {isDemo} = useProfessionalIncludes();
  useEffect(() => {
    setLoading(true);
    if (isDemo) {
      // Usamos datos demo
      setOffices(demoOffices);
      setTimeout(() => setLoading(false), 500);
    } else {
      // Aquí iría fetch real si existiera
      setTimeout(() => setLoading(false), 500);
    }
  }, [isDemo]);

  const filteredOffices = useMemo(() => {
    return offices.filter((o) => {
      const matchesSearch =
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.location.toLowerCase().includes(search.toLowerCase()) ||
        o.specialty.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        o.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, offices]);

  const totalPages = Math.ceil(filteredOffices.length / ITEMS_PER_PAGE);
  const paginatedOffices = filteredOffices.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold"
      >
        Oficinas / Consultorios de la Institución
      </motion.h1>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <Input
          placeholder="Buscar office..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border rounded-md p-2"
        >
          <option value="all">Todos</option>
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
        </select>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-400 text-white hover:bg-emerald-500 transition">
              Agregar Office
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-lg">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Office</DialogTitle>
            </DialogHeader>
            <p className="p-4 text-gray-600">
              Formulario de creación de office aquí
            </p>
          </DialogContent>
        </Dialog>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-md rounded-2xl animate-pulse">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <AnimatePresence>
              {paginatedOffices.map((office, idx) => (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition rounded-2xl cursor-pointer">
                    <CardHeader>
                      <CardTitle>{office.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <p>
                        <strong>Ubicación:</strong> {office.location}
                      </p>
                      <p>
                        <strong>Especialidad:</strong> {office.specialty}
                      </p>
                      <p>
                        <strong>Horario:</strong> {office.hours}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        <span
                          className={
                            office.status === "Activo"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {office.status}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span>
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
