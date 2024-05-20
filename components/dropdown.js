import React, { useState } from 'react'
import { createPopper } from '@popperjs/core'

const Dropdown = ({
  backgourndColor,
  data,
  color,
  onHandleGetItem,
  position,
}) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false)
  const [showValue, setShowValue] = useState(data[0])
  const btnDropdownRef = React.createRef()
  const popoverDropdownRef = React.createRef()
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
    })
    setDropdownPopoverShow(true)
  }
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false)
  }

  const handleSelected = (item) => {
    setShowValue(item)
    onHandleGetItem(item)
    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover()
  }

  return (
    <>
      <div className="mt-2">
        <div className="relative w-full">
          <div
            className={
              'font-bold text-sm rounded shadow outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 flex justify-start items-center w-full h-12 px-4 cursor-pointer ' +
              color +
              ' text-' +
              position
            }
            style={{ backgroundColor: backgourndColor }}
            ref={btnDropdownRef}
            onClick={() => {
              dropdownPopoverShow
                ? closeDropdownPopover()
                : openDropdownPopover()
            }}
          >
            <div className="w-11/12 font-bold">{showValue}</div>
            <div className="w-1/12 flex justify-end items-center">
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div
            ref={popoverDropdownRef}
            className={
              (dropdownPopoverShow ? 'block ' : 'hidden ') +
              ' text-base z-50 float-left py-2 list-none text-left rounded shadow-lg w-full '
            }
            style={{ backgroundColor: backgourndColor }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className={
                  'text-sm py-2 px-4 block w-full whitespace-nowrap bg-transparent hover:text-sky-500 cursor-pointer font-bold ' +
                  color +
                  ' text-' +
                  position
                }
                onClick={() => handleSelected(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dropdown
