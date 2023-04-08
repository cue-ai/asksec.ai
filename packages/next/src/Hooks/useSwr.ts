import useSWR, { SWRConfiguration } from "swr";

// @ts-ignore
const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

export const useSwr = <T>(url?: string | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, ...res } = useSWR<T>(url, fetcher, config);

  return {
    data,
    isLoading,
    isError: error,
    error,
    ...res,
  };
};
