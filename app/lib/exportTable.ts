export type ExportFormat = "png" | "pdf" | "xls";

export type ExportTable = {
  title: string;
  fileName: string;
  headers: string[];
  rows: string[][];
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function tableHtml({ headers, rows }: ExportTable) {
  const head = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<table border="1" cellspacing="0" cellpadding="6"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

// An HTML table saved as .xls opens in Excel and Google Sheets without a spreadsheet library.
function exportXls(table: ExportTable) {
  const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>${tableHtml(table)}</body></html>`;
  download(new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }), `${table.fileName}.xls`);
}

// Opens the browser print dialog on a clean copy of the table; "Save as PDF" produces the file.
function exportPdf(table: ExportTable) {
  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) throw new Error("Allow pop-ups to export as PDF");

  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(table.title)}</title>
<style>
  body { font-family: Inter, Arial, sans-serif; color: #101828; margin: 24px; }
  h1 { font-size: 18px; margin: 0 0 16px; }
  table { border-collapse: collapse; width: 100%; font-size: 12px; }
  th { background: #f3f4f6; text-align: left; }
  th, td { border: 1px solid #e5e7eb; padding: 6px 8px; }
  @page { size: landscape; margin: 12mm; }
</style></head><body><h1>${escapeHtml(table.title)}</h1>${tableHtml(table)}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

function exportPng(table: ExportTable) {
  const scale = 2;
  const padX = 16;
  const rowHeight = 36;
  const titleHeight = 48;
  const font = "14px Inter, Arial, sans-serif";

  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) throw new Error("Canvas is not supported in this browser");
  probe.font = `600 ${font}`;

  const widths = table.headers.map((header, col) => {
    const cells = table.rows.map((row) => probe.measureText(row[col] ?? "").width);
    return Math.ceil(Math.max(probe.measureText(header).width, ...cells)) + padX * 2;
  });
  const width = widths.reduce((sum, w) => sum + w, 0);
  const height = titleHeight + rowHeight * (table.rows.length + 1);

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.scale(scale, scale);
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#101828";
  ctx.font = `600 16px Inter, Arial, sans-serif`;
  ctx.fillText(table.title, padX, titleHeight / 2);

  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, titleHeight, width, rowHeight);

  const drawRow = (cells: string[], top: number, bold: boolean) => {
    ctx.font = `${bold ? "600" : "500"} ${font}`;
    ctx.fillStyle = bold ? "#364153" : "#4a5565";
    let x = 0;
    cells.forEach((cell, col) => {
      ctx.fillText(cell, x + padX, top + rowHeight / 2);
      x += widths[col];
    });
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, top + rowHeight - 1, width, 1);
  };

  drawRow(table.headers, titleHeight, true);
  table.rows.forEach((row, i) => drawRow(row, titleHeight + rowHeight * (i + 1), false));

  canvas.toBlob((blob) => {
    if (blob) download(blob, `${table.fileName}.png`);
  }, "image/png");
}

export function exportTable(format: ExportFormat, table: ExportTable) {
  if (format === "xls") return exportXls(table);
  if (format === "pdf") return exportPdf(table);
  return exportPng(table);
}
