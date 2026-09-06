const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message ?? 'Network request failed. Please retry.')
  return body as T
}

export interface PatientRecord {
  id: string
  name: string
  age: number
  gender: string
  language: string
  complaint: string
  priority: 'URGENT' | 'HIGH' | 'NORMAL'
  status: string
  conditions?: string[]
  medication?: string
  initials?: string
  time?: string
  tag?: string
  assignedDoctor?: string
}

export const api = {
  health: () => request<{ status: string; mode: string }>('/health'),
  login: (email: string, password: string) => 
    request<{ token: string; user: { id: string; name: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: { name: string; email: string; password: string }) => 
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getQueue: (token?: string) =>
    request<{ patients: PatientRecord[] }>('/doctor/queue', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  assignDoctor: (patientId: string, assignedDoctor: string, token?: string) =>
    request<{ message: string; patient: PatientRecord }>(`/patients/${patientId}/assign`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ assignedDoctor }),
    }),
  questions: (complaint: string) => 
    request<{ questions: string[] }>(`/questions?complaint=${encodeURIComponent(complaint)}`),
  redFlags: (values: string[], token?: string) => 
    request<{ isRedFlag: boolean; severity: string; message: string; symptoms: string[] }>('/red-flags/check', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ values }),
    }),
  generateSummary: (patientId: string, token?: string) => 
    request<{ id: string; patientId: string; content: string; verified: boolean }>('/summaries/generate', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ patientId }),
    }),
  confirmSummary: (summaryId: string, token?: string) =>
    request<{ id: string; verified: boolean; message: string }>(`/summaries/${summaryId}/confirm`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getTimeline: (patientId: string, token?: string) =>
    request<Array<{ year: string; title: string; detail: string; source: string }>>(`/timeline/${patientId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  submitConsent: (patientId: string, agreed: boolean, token?: string) =>
    request('/consent', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ patientId, agreed }),
    }),
}
