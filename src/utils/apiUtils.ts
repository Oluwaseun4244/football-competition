import axios, { AxiosResponse } from "axios";
import {
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query'


interface ApiErrorResponse {
  message: string;
  response: {
    data: {
      data?: unknown;
      message: string;
      messages: string[];
      exception: string;
      supportMessage: string
    };
    status?: number;
    statusText?: string
  }
}

interface getConfig {
  url: string;
  queryKeys: (string | boolean | any)[]
}


const BASE_URL = process.env.REACT_APP_API_URL;

export function decodeJwt(token: string) {
  // Split the JWT into its 3 parts
  const base64Url = token.split('.')[1];

  // Decode Base64 (replace characters to make it URL-safe)
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Decode the Base64-encoded payload into a JSON string
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  // Parse the JSON string into an object
  const payload = JSON.parse(jsonPayload);
  return payload;
}

const accessToken = localStorage.getItem('token')

export const getData = async<T>(url: string): Promise<T> => {
  return new Promise(async (resolve, reject) => {

    try {

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response: AxiosResponse<T> = await axios.get(`${BASE_URL}/${url}`, config);

      if (response.status < 200 || response.status >= 300) {
        reject(response.statusText)
      }
      resolve(response.data)
    } catch (error: any) {
      reject(error)
    }
  })
}

export const postData = async <T>(url: string, payload: unknown): Promise<T> => {


  return new Promise(async (resolve, reject) => {


    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };

      const response: AxiosResponse<T> = await axios.post(`${BASE_URL}/${url}`, payload, config);

      if (response.status === 200 || response.status === 201) {
        resolve(response.data)
      }
      reject(response.statusText)
    } catch (error: any) {

      reject(error)
    }
  })
};

export const postDataWithFile = async <T>(url: string, payload: unknown): Promise<T> => {

  return new Promise(async (resolve, reject) => {


    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' }
      };

      const response: AxiosResponse<T> = await axios.post(`${BASE_URL}/${url}`, payload, config);

      if (response.status === 200 || response.status === 201) {
        resolve(response.data)
      }
      reject(response.statusText)
    } catch (error: any) {

      reject(error)
    }
  })
};
export const putData = async <T>(url: string, payload: unknown): Promise<T> => {


  return new Promise(async (resolve, reject) => {


    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };

      const response: AxiosResponse<T> = await axios.put(`${BASE_URL}/${url}`, payload, config);

      if (response.status === 200 || response.status === 201) {
        resolve(response.data)
      }
      reject(response.statusText)
    } catch (error: any) {

      reject(error)
    }
  })
};

export const useGetQuery = <T>(config: getConfig, options?: Omit<UseQueryOptions<T, ApiErrorResponse, T, QueryKey>, 'queryFn'>) => {

  return useQuery<T, ApiErrorResponse>({
    queryKey: config.queryKeys,
    queryFn: () => getData<T>(config.url),
    retry: options?.retry ?? 2,
    ...options
  })
}


export const usePostQuery = <ResponseType, MutationVariables>(
  url: string,
  options?: UseMutationOptions<ResponseType, ApiErrorResponse, MutationVariables>,
  mutationKeys?: string[]
) => {

  return useMutation<ResponseType, ApiErrorResponse, MutationVariables>({
    mutationFn: (payload: MutationVariables) => postData<ResponseType>(url, payload),
    mutationKey: mutationKeys,
    ...options,
  });
};

export const usePostQueryWithFile = <ResponseType, MutationVariables>(
  url: string,
  options?: UseMutationOptions<ResponseType, ApiErrorResponse, MutationVariables>,
  mutationKeys?: string[]
) => {

  return useMutation<ResponseType, ApiErrorResponse, MutationVariables>({
    mutationFn: (payload: MutationVariables) => postDataWithFile<ResponseType>(url, payload),
    mutationKey: mutationKeys,
    ...options,
  });
};
export const usePutQuery = <ResponseType, MutationVariables>(
  url: string,
  options?: UseMutationOptions<ResponseType, ApiErrorResponse, MutationVariables>,
  mutationKeys?: string[]
) => {

  return useMutation<ResponseType, ApiErrorResponse, MutationVariables>({
    mutationFn: (payload: MutationVariables) => putData<ResponseType>(url, payload),
    mutationKey: mutationKeys,
    ...options,
  });
};

