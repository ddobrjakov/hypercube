import { cloneDeep, merge } from 'lodash'
import { objectMap } from './utils'
import { colorMask, colorVector, logoMask, logoVector, cubeMaterial, stickers, cameraPosition, backgroundColor } from './options'
import * as OPTIONS from './options'

/** Plain options (basic types). */
export const defaultOptions = () => cloneDeep({
    animationTPS: 20,
	animationSound: 'none',
	colorMask: colorMask.presets['SOLVED'],
    colorVector: colorVector.presets['STANDARD'],
	logoMask: logoMask.presets['MAIN'],
	logoVector: logoVector.presets['MAIN'],
	cubeMaterial: cubeMaterial.presets['MAIN'],
	stickers: stickers.presets['SOLVED'],
	cameraPosition: cameraPosition.presets['MAIN'],
	backgroundColor: backgroundColor.presets['DARK'],
	enableControls: true,
})

/** Parse plain options. */
export const parseOptions = (plainOptions, ignoreUnknown = true) => {
	const options = merge(defaultOptions(), plainOptions)
	return objectMap(options, (propertyValue, propertyName) => {
		const property = OPTIONS[propertyName]
		if (property == undefined && !ignoreUnknown) 
			throw new Error(`Unknown property "${propertyName}".`)
		const parsePropertyValue = property?.parse ?? (v => v)
		return parsePropertyValue(propertyValue)
	})
}
