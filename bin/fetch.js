const request = require('request');
const { JSDOM } = require('jsdom')
const fs = require('fs')
const { setTimeout } = require('timers/promises')

async function get_country_flag_image(url) {
	console.log("[INFO] fetching country flag")
	var filename = url.split('/').slice(-1)[0]
	var opt = {
		uri: url,
		encoding: null
	}
	request.get(opt, (err, res, body) => {
		if (!err) {
			fs.writeFile('../assets/tmp/' + filename, body, (err_w) => {
				if (err_w) {
					console.log("[ERROR] fail to save country flag image: " + url)
					console.log(err_w)
				}
			})
		} else {
			console.log('[ERROR] fail to get country flag image: ' + url)
			console.log(err)
		}
	})
}

async function get_country(link) {
	console.log("[INFO] fetching country: " + link['text'])
	var _imgsrc = ''
	try {
		let _dom = await JSDOM.fromURL('https://www.mofa.go.jp/mofaj/area/' + link['link'])
		_imgsrc = _dom.window.document.querySelector("span.title-image img").getAttribute('src')
		let imgurl = 'https://www.mofa.go.jp' + _imgsrc
		await get_country_flag_image(imgurl)
		await setTimeout(1000)
	} catch(e) {
		console.log(e)
	}
	return _imgsrc
}

async function main() {
	console.log("[INFO] fetching country list")
	let dom = await JSDOM.fromURL('https://www.mofa.go.jp/mofaj/area/index.html')
	let dom_links = dom.window.document.querySelectorAll("ul.list2 li a")

	var hrefs = []
	dom_links.forEach(link => {
		hrefs.push({
			'link': link.getAttribute('href'),
			'text': link.textContent.trim()
		})
	})
	console.log("[INFO] " + String(hrefs.length) + " countries found.")
	console.log("[INFO] start fetching each country.")
	for (var i = 0; i < hrefs.length; ++i) {
	//for (var i = 0; i < 10; ++i) {
		hrefs[i]['img'] = await get_country(hrefs[i])
	}

	console.log("[INFO] saving meta data")
	fs.writeFile('../assets/tmp/info.json', JSON.stringify(hrefs), (err) => {
		if (err) {
			console.log("[ERROR] fail to save meta data")
		}
	})
}
main()