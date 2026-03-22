/**
 * API configuration and helpers
 * This file will contain API endpoints and fetch helpers
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response;
}

// API endpoints will be added here as needed
export const api = {
  // products: {
  //   getAll: () => apiCall('/products'),
  //   getById: (id: string) => apiCall(`/products/${id}`),
  // },
};
