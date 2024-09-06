"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountToMillion } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputDateFormat = "yyyy-MM-dd";

const requiredColumns = ["amount", "payee", "date"];

export interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});
  const [headers, ...body] = data;

  const onTableHeaderSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prev) => {
      const newState = { ...prev };
      for (const key in newState) {
        if (newState[key] === value) {
          newState[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }
      newState[`column_${columnIndex}`] = value;
      return newState;
    });
  };

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((cell) => cell === null) ? [] : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {} as any);
    });

    const data = arrayOfData.map((row) => {
      return {
        ...row,
        amount: convertAmountToMillion(parseFloat(row.amount)),
        date: format(parse(row.date, dateFormat, new Date()), outputDateFormat),
      };
    });

    onSubmit(data);
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg line-clamp-1">Import Transactions</CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button size="sm" className="w-full lg:w-auto" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" className="w-full lg:w-auto" disabled={progress < requiredColumns.length}>
              Continue ({progress} / {requiredColumns.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeaderSelectChange={onTableHeaderSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
