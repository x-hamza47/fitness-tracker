import { api } from "@/lib/api";

export type ReportType = "workouts" | "nutrition" | "progress";
export type ReportFormat = "csv" | "pdf";

export async function downloadReportFile(
    type: ReportType,
    format: ReportFormat,
    from?: string,
    to?: string,
): Promise<void> {
    const params: Record<string, string> = { format };
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await api.get(`/reports/${type}`, {
        params,
        responseType: "blob",
    });

    const blob = new Blob([response.data], {
        type: format === "pdf" ? "application/pdf" : "text/csv;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `forge_${type}_report.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
