import { http } from "./httpService";
import { Exercise } from "@/types";

export interface PaginationParams {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export const fetchExercises = async (params?: PaginationParams) => {
  const response = await http.get<PaginatedResponse<Exercise>>(
    "/exercises",
    params
  );
  return response.data;
};

export const fetchAdminExercises = async (params?: PaginationParams) => {
  const response = await http.get<PaginatedResponse<Exercise>>(
    "/admin/exercises",
    params
  );
  return response.data;
};

export const fetchExerciseById = async (id: string) => {
  const response = await http.get<Exercise>(`/exercises/${id}`);
  return response.data;
};

export const fetchAdminExerciseById = async (id: string) => {
  const response = await http.get<Exercise>(`/admin/exercises/${id}`);
  return response.data;
};

export const createExercise = async (data: Partial<Exercise>) => {
  const response = await http.post<Exercise>("/admin/exercises", data);
  return response.data;
};

export const bulkCreateExercises = async (data: Partial<Exercise>[]) => {
  const response = await http.post<Exercise[]>("/admin/exercises/bulk", data);
  return response.data;
};

export const updateExercise = async (id: string, data: Partial<Exercise>) => {
  const response = await http.patch<Exercise>(`/admin/exercises/${id}`, data);
  return response.data;
};

export const deleteExercise = async (id: string) => {
  const response = await http.delete(`/admin/exercises/${id}`);
  return response.data;
};

export const getUserProgress = async () => {
  const response = await http.get<
    {
      id: string;
      userId: string;
      exerciseId: string;
      score: number;
      completedAt: string;
    }[]
  >("/exercises/progress");
  return response.data;
};

export const saveProgress = async (exerciseId: string, score: number) => {
  const response = await http.post("/exercises/progress", {
    exerciseId,
    score,
  });
  return response.data;
};

export const resetUserProgress = async () => {
  const response = await http.delete("/exercises/progress");
  return response.data;
};
