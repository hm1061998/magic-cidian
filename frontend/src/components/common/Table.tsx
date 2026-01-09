import React, { ReactNode } from "react";

export interface Column<T> {
  header: ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => ReactNode;
  className?: string; // Applied to both th and td
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  keyExtractor: (item: T) => string | number;
  emptyImage?: ReactNode; // Optional icon/image for empty state
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

const Table = <T,>({
  columns,
  data,
  loading = false,
  keyExtractor,
  emptyImage,
  emptyMessage = "Không tìm thấy dữ liệu",
  onRowClick,
  className = "",
}: TableProps<T>) => {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`sticky top-0 z-20 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/95 backdrop-blur-sm ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length} className="px-6 py-8">
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                    {emptyImage && (
                      <div className="w-16 h-16 flex items-center justify-center">
                        {emptyImage}
                      </div>
                    )}
                    <p className="font-bold text-slate-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item)}
                  className={`hover:bg-slate-50/50 transition-colors group ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-4 ${col.className || ""}`}
                    >
                      {col.cell
                        ? col.cell(item, index)
                        : col.accessorKey
                        ? (item[col.accessorKey] as ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
