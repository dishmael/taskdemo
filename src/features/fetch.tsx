import { useEffect, useState } from "react"

export function useFetch(url: string) {
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ data, setData ] = useState<any | undefined>()
    const [ error, setError ] = useState<Error | undefined>()

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        fetch(url, { signal: controller.signal })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false))
        
        return () => {
            controller.abort()
        }
    }, [url])

    return { loading, data, error }
}