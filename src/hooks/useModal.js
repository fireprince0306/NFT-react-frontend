import { useState } from "react"

function useModal() {
	const [entity, setEntity] = useState(null)
	const [isModalOpen, setModalIsOpen] = useState(false)
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
	const [appliedFilters, setAppliedFilters] = useState(null)
	const [searchedToken, setSearchedToken] = useState("")
	const [appliedSortBy, setAppliedSortBy] = useState(null)

	return {
		entity,
		setEntity,
		isModalOpen,
		setModalIsOpen,
		isFilterModalOpen,
		setIsFilterModalOpen,
		appliedFilters,
		setAppliedFilters,
		searchedToken,
		setSearchedToken,
		appliedSortBy,
		setAppliedSortBy
	}
}

export default useModal
