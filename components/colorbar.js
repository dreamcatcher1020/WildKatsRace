import React from 'react'

const defaultStyles = {
  rowContainerStyle: {
    padding: '5px 0',
    display: 'block',
  },
  labelContainerStyle: {
    display: 'inline-block',
    fontSize: 14,
  },
  labelStyle: {
    fontSize: 14,
    color: '#999',
    paddingLeft: 5,
  },
  valueStyle: {
    float: 'right',
    fontSize: 14,
    color: '#333',
    fontWeight: 600,
  },
  colorBarSectionsContainer: {
    display: 'flex',
    borderRadius: 5,
    overflow: 'hidden',
    height: 20,
    width: '100%',
  },
}

const ColorBar = ({ title, data, rootStyle, barContainerStyle }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const tooltipDisappearEvent = isMobile ? 'touchstart' : undefined
  const sum = data.reduce((total, obj) => obj.value + total, 0)
  const colorBarSections = []

  data.forEach((d, i) => {
    colorBarSections.push(
      <div
        key={i}
        data-tip
        data-for={`color-bar-tooltip-${i}-${title}`}
        style={{
          backgroundColor: d.color,
          height: '100%',
          borderLeft: '1px soild #bdabab',
          borderRight: '1px soild #bdabab',
          display: 'inline-block',
          width: `${(d.value / sum) * 100}%`,
        }}
      ></div>,
    )
  })

  return (
    <div style={rootStyle}>
      <div
        style={{
          ...defaultStyles.colorBarSectionsContainer,
          ...barContainerStyle,
        }}
      >
        {colorBarSections}
      </div>
    </div>
  )
}

export default ColorBar
