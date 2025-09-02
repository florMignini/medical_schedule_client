"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_BASE_URL } from "@/lib/constants.api";
import { ICreateInstitution, PatientsIncluded, Patient } from "@/interfaces";
import Link from "next/link";

const ITEMS_PER_PAGE = 8;

export default function Overview({ institutionId }: { institutionId: string }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState<PatientsIncluded[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Traemos la institución con sus pacientes
  useEffect(() => {
    if (!institutionId) return;

    setLoading(true);
    axios
      .get<ICreateInstitution>(
        `${API_BASE_URL.prod}/institutions/get-institution/${institutionId}`
      )
      .then(({ data }) => {
        setPatients(data.patientsIncluded ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [institutionId]);

  const filteredPatients = useMemo(() => {
    return patients.filter(({ patient }) => {
      const fullName = `${patient.firstName} ${patient.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Activo" && patient.isActive) ||
        (statusFilter === "Inactivo" && !patient.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, patients]);

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
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
        Detalles de la Institución
      </motion.h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          {/* Institution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Nombre", value: "Clínica Médica Central" }, // TODO: tomar de data real
              { title: "Dirección", value: "Av. Siempre Viva 123" }, // TODO: tomar de data real
              { title: "Pacientes Asociados", value: patients.length },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <Card className="hover:shadow-lg transition rounded-2xl">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <Input
              placeholder="Buscar paciente..."
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
          </motion.div>

          {/* Patients Table */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Pacientes Asociados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedPatients.length > 0 ? (
                      paginatedPatients.map(({ patient }, idx) => (
                        <motion.tr
                          key={patient.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-emerald-50 transition cursor-pointer"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <TableCell>
                            {patient.firstName} {patient.lastName}
                          </TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>
                            {patient.isActive ? "Activo" : "Inactivo"}
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No se encontraron pacientes
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center mt-4"
          >
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
          </motion.div>

          {/* Patient Preview Modal */}
          <Dialog
            open={!!selectedPatient}
            onOpenChange={() => setSelectedPatient(null)}
          >
            <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-lg">
              <DialogHeader>
                <DialogTitle>Información del Paciente</DialogTitle>
              </DialogHeader>
              {selectedPatient && (
                <div className="p-4 space-y-1">
                  <p>
                    <strong>Nombre:</strong> {selectedPatient.firstName}{" "}
                    {selectedPatient.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPatient.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedPatient.phone}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {selectedPatient.isActive ? "Activo" : "Inactivo"}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Link
                      href={`/professional/patients/${selectedPatient.id}`}
                      className="font-bold p-2 mt-10 text-sm text-gray-600 hover:border-gray-300 shadow-lg rounded-lg"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
