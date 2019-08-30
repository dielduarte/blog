const colorsMap = ['#cf6679', '#3700b3', '#bb86fc', '#03dac6', '#1ca0ee']

const getRandomBg = (colorsMap) => () => {
  return colorsMap[Math.floor((Math.random()*colorsMap.length))]
}

export default getRandomBg(colorsMap)