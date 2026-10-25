import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/services/api";

export function useFetch<T>(fetcher: () => Promise<T>, key: string) {
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${key}#${reloadCount}`;

  const [state, setState] = useState<{
    key: string;
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ key: requestKey, data: null, loading: true, error: null });

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let active = true;
    fetcherRef
      .current()
      .then((result) => {
        if (active) setState({ key: requestKey, data: result, loading: false, error: null });
      })
      .catch((err) => {
        if (active) setState({ key: requestKey, data: null, loading: false, error: getErrorMessage(err) });
      });
    return () => {
      active = false;
    };
  }, [requestKey]);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  const current =
    state.key === requestKey
      ? state
      : { key: requestKey, data: null, loading: true, error: null };

  return { data: current.data, loading: current.loading, error: current.error, refetch };
}
