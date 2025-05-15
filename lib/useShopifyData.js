import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

export function useShopifyData(query: any, variables: any) {
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutos em millisegundos

  const shouldRefetch = () => {
    return Date.now() - lastFetch > CACHE_TIME;
  };

  const { loading, error, data, refetch } = useQuery(query, {
    variables,
    skip: !shouldRefetch(),
    onCompleted: () => {
      setLastFetch(Date.now());
    }
  });

  return { loading, error, data };
}