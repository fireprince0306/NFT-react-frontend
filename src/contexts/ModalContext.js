import React, { createContext } from "react"
import useModal from "../hooks/useModal"

const ModalContext = createContext()

function ModalProvider({ children }) {
	const {
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
	} = useModal()

	return (
		<ModalContext.Provider
			value={{
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
			}}
		>
			{children}
		</ModalContext.Provider>
	)
}

export { ModalContext, ModalProvider }
