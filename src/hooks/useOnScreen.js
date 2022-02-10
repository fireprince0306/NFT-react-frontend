import { useEffect, useState, useRef } from "react"

const useOnScreen = ref => {
	const [isOnScreen, setIsOnScreen] = useState(false)
	const observerRef = useRef(null)

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			([entry]) => {
				setIsOnScreen(entry.isIntersecting)
			},
			{
				root: document.querySelector("#infinite_scroll"),
				rootMargin: "500px",
				threshold: [0.01, 0.1, 0.5]
			}
		)
	}, [])

	useEffect(() => {
		observerRef.current.observe(ref.current)

		return () => {
			observerRef.current.disconnect()
		}
	}, [ref])

	return isOnScreen
}

export default useOnScreen
