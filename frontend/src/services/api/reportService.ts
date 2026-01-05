import { http } from "./httpService";

export interface DictionaryReport {
  id: string;
  userId: string;
  idiomId: string;
  type: "content_error" | "audio_error" | "missing_info" | "other";
  description: string;
  status: "pending" | "processing" | "resolved" | "rejected";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  idiom?: {
    hanzi: string;
    pinyin: string;
  };
  user?: {
    displayName: string;
    username: string;
  };
}

export interface CreateReportDto {
  idiomId: string;
  type: string;
  description: string;
}

export interface ReportQuery {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  filter?: {
    idiomId?: string;
  };
}

export const createReport = async (data: CreateReportDto) => {
  const response = await http.post<DictionaryReport>(
    "/dictionary-reports",
    data
  );
  return response.data;
};

export const getMyReports = async (query: ReportQuery = {}) => {
  const response = await http.get<{ data: DictionaryReport[]; meta: any }>(
    "/dictionary-reports/my",
    { ...query }
  );
  return response.data;
};

export const getAllReports = async (query: ReportQuery = {}) => {
  const response = await http.get<{ data: DictionaryReport[]; meta: any }>(
    "/dictionary-reports",
    { ...query }
  );
  return response.data;
};

export const updateReport = async (
  id: string,
  data: Partial<DictionaryReport>
) => {
  const response = await http.patch<DictionaryReport>(
    `/dictionary-reports/${id}`,
    data
  );
  return response.data;
};

export const deleteReport = async (id: string) => {
  const response = await http.delete(`/dictionary-reports/${id}`);
  return response.data;
};

export const bulkDeleteReport = async (ids: string[]) => {
  const response = await http.post(`/dictionary-reports/bulk-delete`, {
    ids,
  });
  return response.data;
};
