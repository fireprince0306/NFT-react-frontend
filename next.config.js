const path = require("path")
const { withSentryConfig } = require("@sentry/nextjs")

const moduleExports = {
	env: {
		REACT_APP_URI: process.env.REACT_APP_URI,
		REACT_APP_API_URI: process.env.REACT_APP_API_URI
	},
	reactStrictMode: true,
	i18n: {
		// These are all the locales to support
		locales: ["en-EN"],
		// This is the default locale
		defaultLocale: "en-EN"
	},
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")]
	},
	images: {
		domains: [
			"www.fillmurray.com",
			"herodigital.com",
			"www.herodigital.com",
			"cdn.discordapp.com",
			"gateway.ipfs.io",
			"lh3.googleusercontent.com",
			"d2134ty93psuer.cloudfront.net",
			"d2txl75rmr4hou.cloudfront.net",
			"picsum.photos"
		]
	}
}

const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore

	silent: true // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
