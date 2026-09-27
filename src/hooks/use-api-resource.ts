import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

export function useApiResource<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isActive = useRef(false);
  const requestId = useRef(0);

  const execute = useCallback(() => {
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;

    setIsLoading(true);
    setError(null);

    loader()
      .then((nextData) => {
        if (isActive.current && requestId.current === currentRequestId) {
          setData(nextData);
        }
      })
      .catch((reason: unknown) => {
        if (isActive.current && requestId.current === currentRequestId) {
          setError(
            reason instanceof Error ? reason : new Error("發生未知錯誤。"),
          );
        }
      })
      .finally(() => {
        if (isActive.current && requestId.current === currentRequestId) {
          setIsLoading(false);
        }
      });
  }, [loader]);

  useFocusEffect(
    useCallback(() => {
      isActive.current = true;
      execute();

      return () => {
        isActive.current = false;
        requestId.current += 1;
      };
    }, [execute]),
  );

  return { data, error, isLoading, reload: execute, setData };
}
