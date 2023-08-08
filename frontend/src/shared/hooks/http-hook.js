import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';


export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const auth = useContext(AuthContext);


  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (endpoint, method = 'GET', body = null) => {
      console.log("useHttpClient", auth);
      const headers = {
        'Content-Type': 'application/json'
        
      }

      if(auth.token)
      headers["Authorization"] =  'Bearer ' + auth.token;

      // const url = `http://localhost:3000/gc-lms-bc/${endpoint}`;
      const url = `https://dev-apis.mogiio.com/gc-lms-bc/${endpoint}`;
      //https://dev-apis.mogiio.com/gc-lms-bc/
      console.log("url", url);
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
