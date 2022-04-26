import * as options from '@hyper/hypercube/options'
import { preferences } from '@hyper/shared'

const defaultSettings = {
	animationTpsIndex: 2,
	colorSchemeIndex: 0,
	logoSideIndex: 1,
}

export function setupSettings(hypercube, container) {

	const settingsBtn = document.getElementById('settingsBtn')
	const settingsPanel = document.querySelector('.panel')
	settingsPanel.style.display = 'none'
	settingsBtn.addEventListener('click', toggleSettings)
	settingsBtn.addEventListener('touchstart', function (event) {
		toggleSettings()
		event.preventDefault()
	})

	function toggleSettings() {
		if (settingsPanel.style.display == 'none') {
			settingsPanel.style.display = 'flex'
			settingsBtn.style.bottom = '20px'
			settingsBtn.style.right = '20px'
			container.blur()
		}
		else {
			settingsPanel.style.display = 'none'
			settingsBtn.style.bottom = '0px'
			settingsBtn.style.right = '0px'
			container.focus()
		}
	}

	// Check that input is number
	const numberInputs = document.querySelectorAll('.numberInput');
	for (let i = 0; i < numberInputs.length; i++) {
		numberInputs[i].addEventListener('input', checkInput(0, 100));
		numberInputs[i].addEventListener('focus', function () {
			this.setSelectionRange(0, this.value.length)
		})
	}

	function checkInput(min, max) {
		return function () {
			this.value = this.value.replace(/[^0-9]/g, '')
			if (min != undefined && this.value < min) this.value = min
			if (max != undefined && this.value > max) this.value = max
		}
	}

	const save = func => (...args) => { func(...args); saveSettings() }

	const animationTpsSelect = document.getElementById('animationTPS')
	animationTpsSelect.addEventListener('change', save(updateAnimationTPS))
	function updateAnimationTPS() {
		const tps = parseFloat(animationTpsSelect.value)
		hypercube.cube.updateAnimationOptions(options => ({ ...options, tps }))
	}

	const colorSchemeSelect = document.getElementById('colorScheme')
	colorSchemeSelect.addEventListener('change', save(updateColorScheme))
	function updateColorScheme() {
		const scheme = colorSchemeSelect.value
		hypercube.cube.setColorVector(options.colorVector.parse(COLOR_SCHEMES[scheme]))
	}

	const logoSideSelect = document.getElementById('logo')
	logoSideSelect.addEventListener('change', save(updateLogoSide))
	function updateLogoSide() {
		const logoSide = logoSideSelect.value
		hypercube.cube.setLogos(hypercube.cube.position.byStickers(), LOGO_MASKS[logoSide])
	}

	function loadSettings(settings) {
		const { animationTpsIndex, colorSchemeIndex, logoSideIndex } = settings
		animationTpsSelect.selectedIndex = animationTpsIndex
		updateAnimationTPS()
		colorSchemeSelect.selectedIndex = colorSchemeIndex
		updateColorScheme()
		logoSideSelect.selectedIndex = logoSideIndex
		updateLogoSide()
	}

	function takeSettings() {
		return {
			animationTpsIndex: animationTpsSelect.selectedIndex,
			colorSchemeIndex: colorSchemeSelect.selectedIndex,
			logoSideIndex: logoSideSelect.selectedIndex,
		}
	}

	function saveSettings() {
		preferences.update(takeSettings())
	}

	preferences.setDefault(defaultSettings)
	loadSettings(preferences.get())

}

const COLOR_SCHEMES = {
	standard: options.colorVector.presets.STANDARD,
	pink: options.colorVector.presets.PINK,
	dark: options.colorVector.presets.DARK,
}

const LOGO_MASKS = (() => {
	const logos = options.logoMask.presets
	return {
		no: logos.NO_LOGOS,
		top: logos.TOP,
		left: logos.LEFT,
		front: logos.FRONT,
		right: logos.RIGHT,
		back: logos.BACK,
		bottom: logos.BOTTOM,
	}
})()
