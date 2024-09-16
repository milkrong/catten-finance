"use client";

import { DataGrid } from "@/components/DataGrid";
import { DataCharts } from "@/components/DataCharts";

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
