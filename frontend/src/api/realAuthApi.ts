// Real API endpoints for CA authentication
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'}/api`;

export interface CARegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dobOrDoi: string;
  membershipNumber: string;
  profession: string;
  pan: string;
  telephone: string;
  mobile: string;
  officeAddress: string;
  pinCode: string;
  state: string;
  whatsappLink: string;
}

export interface CARegisterResponse {
  message: string;
  userId: number;
}

export interface LoginRequest {
  pan: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export const realAuthApi = {
  registerCA: async (data: CARegisterRequest): Promise<CARegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/ca/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },
};
