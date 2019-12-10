const http = require('http')

module.exports =  async function get(verb) {
	return new Promise((resolve, reject) => {
		const url = "http://www.les-verbes.com/conjuguer.php?verbe="
		http.get(`${url}${verb}`, (response) => {
			let data = ""
			response.on("data", chunk => data += chunk)
			response.on("end", () => resolve(data))
		}).on("error", error => {
			reject(error)
		})
	})
}