import { initialContracts } from '../data/mockData';
import type { DocumentationContract, ProjectSelection } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('DocProof is running in demo mode. No API base URL is configured.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`DocProof API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getContracts(): Promise<DocumentationContract[]> {
  if (!API_BASE_URL) return structuredClone(initialContracts);
  return request<DocumentationContract[]>('/contracts');
}

export async function getContract(id: string): Promise<DocumentationContract | undefined> {
  if (!API_BASE_URL) return structuredClone(initialContracts.find((contract) => contract.id === id));
  return request<DocumentationContract>(`/contracts/${encodeURIComponent(id)}`);
}

export async function triggerVerification(project: ProjectSelection): Promise<void> {
  if (!API_BASE_URL) return;
  await request('/verify', { method: 'POST', body: JSON.stringify(project) });
}

export async function approveFix(id: string): Promise<void> {
  if (!API_BASE_URL) return;
  await request(`/approve/${encodeURIComponent(id)}`, { method: 'POST' });
}

export async function rejectFix(id: string): Promise<void> {
  if (!API_BASE_URL) return;
  await request(`/reject/${encodeURIComponent(id)}`, { method: 'POST' });
}

export async function getTrustScore(): Promise<{ score: number }> {
  if (!API_BASE_URL) return { score: 0 };
  return request<{ score: number }>('/trust-score');
}

export const apiMode = API_BASE_URL ? 'api' : 'demo';
