import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

type QueryTypes = {
  url?: string,
  method?: string,
  body?: any,
  query?: any,
  runOnLoad?: boolean,
  queryKey?: any,
  authorization?: string,
  onSuccess?: any,
  onError?: any
}

export const queryClient = useQueryClient;

export const useQueryStack = ({ queryKey, url, method, body, query, runOnLoad, authorization }: QueryTypes) => {
  let queryURL = `${process.env.REACT_BACKEND_URI}${url}`;

  if (query) {
    queryURL = `${queryURL}?${convertObjectToURLParams(query)}`
  }

  function convertObjectToURLParams(obj: any) {
    return new URLSearchParams(obj).toString();
  }

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      let additionalHeaders = {}
      if (authorization) {
        additionalHeaders = {
          'Authorization': 'Bearer ' + authorization
        }
      }
      const response = await fetch(queryURL, {
        method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders
        },
      })
      let toJson = await response.json()
      return {
        ...toJson,
        status: response.status
      }
    },
    refetchOnWindowFocus: false,
    enabled: runOnLoad == true ? true : false
  })
}


export const useMutationStack = ({ url, method, body, query, runOnLoad, onSuccess, onError, authorization }: QueryTypes) => {
  let queryURL = `${process.env.REACT_BACKEND_URI}${url}`;

  if (query) {
    queryURL = `${queryURL}?${convertObjectToURLParams(query)}`
  }

  function convertObjectToURLParams(obj: any) {
    return new URLSearchParams(obj).toString();
  }

  return useMutation({
    mutationFn: async () => {
      let additionalHeaders = {}
      if (authorization) {
        additionalHeaders = {
          'Authorization': 'Bearer ' + authorization
        }
      }
      const response = await fetch(queryURL, {
        method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders
        },
      })
      let toJson = await response.json()
      return {
        ...toJson,
        status: response.status
      }
    },
    onSuccess: (data, variables, context) => {
      if (onSuccess && data.status === 200) {
        onSuccess()
      } else if( onError && data.status !== 200){
        onError(data.message)
      }
    },

  })
}
