const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

interface FetchOptions extends RequestInit {
  body?: any;
}

export const cjClient = {
  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const token = process.env.CJ_API_TOKEN;
    
    if (!token) {
      throw new Error('Variável de ambiente CJ_API_TOKEN não está definida.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'CJ-Access-Token': token,
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${CJ_API_BASE}${endpoint}`, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = response.statusText;
      }
      throw new Error(`CJ API Error [${response.status}]: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // A API da CJ costuma retornar 200 OK mas com status de erro no body. 
    // Esta validação garante que a camada de serviço saiba que algo falhou.
    if (data.code && data.code !== 200) {
      throw new Error(`CJ Business Error [${data.code}]: ${data.message || 'Erro desconhecido na CJ'}`);
    }

    return data as T;
  }
};