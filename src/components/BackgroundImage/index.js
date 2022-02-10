import Image from "next/image"

const BackgroundImage = () => {
	return (
		<div className="absolute w-100 h-30r z-0 top-0">
			<div className="h-100 w-100 relative">
				<div className="absolute h-100 w-100 bg-gray-50 z-5 top-0 opacity-70"></div>
			</div>
		</div>
	)
}

export default BackgroundImage
