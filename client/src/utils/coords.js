export const getNaturalCoords = naturalProps => currentProps => xy =>
  [
    ~~(xy[0] * naturalProps.width / currentProps.width),
    ~~(xy[1] * naturalProps.heigth / currentProps.heigth)
  ]

export const getCoords = (e) => {
  const rect = e.target.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  return [x, y]
}
