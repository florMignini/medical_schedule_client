import { Button } from "../../../../components/ui/button";
import { InstitutionList } from "./components/InstitutionList";

export default function InstitutionsPage() {
  return (
    <section className="w-[99%] mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md h-screen">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Instituciones</h2>
      </header>

      <InstitutionList />
    </section>
  );
}
