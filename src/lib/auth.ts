export interface AuthData {
  token: string;
  userId: string;
  role: 'JobSeeker' | 'Company';
  email: string;
}

export const AUTH_STORAGE_KEY = 'job_agency_auth';

export const saveAuthData = (authData: AuthData): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

export const getAuthData = (): AuthData | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return getAuthData() !== null;
};

export const getUserRole = (): 'JobSeeker' | 'Company' | null => {
  const authData = getAuthData();
  return authData?.role || null;
};

export const getAuthToken = (): string | null => {
  const authData = getAuthData();
  return authData?.token || null;
};

export const getUserId = (): string | null => {
  const authData = getAuthData();
  return authData?.userId || null;
};

export const decodeJwtPayload = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};
