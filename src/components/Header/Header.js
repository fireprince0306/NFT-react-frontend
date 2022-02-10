import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

export default function Header() {
	const title =
		"HAPEBEAST RARITY | Official NFT Rarity Tool | PRIME HAPE Ranking"
	const desc =
		"HAPERARITY.IO is an official, certified NFT tool for HAPEBEAST. Sorted & ranked by trait rarity: compare accurate percentages for HAPE valuation on OpenSea."
	const ogImgRelativePath = "/og.png"

	const siteURL = "https://haperarity.io"
	const ogImageURL = `https://d2134ty93psuer.cloudfront.net/fit-in/og.png`
	const pathName = useRouter().pathname
	const pageURL = pathName === "/" ? siteURL : siteURL + pathName
	const twitterHandle = "@HAPEBEASTGANG"
	const siteName = "haperarity.io"

	return (
		<NextSeo
			title={title}
			description={desc}
			canonical={pageURL}
			openGraph={{
				type: "website",
				locale: "en_US", //  Default is en_US
				url: pageURL,
				title,
				description: desc,
				images: [
					{
						url: ogImageURL,
						width: 1200,
						height: 630,
						alt: "HAPE RARITY"
					}
				],
				site_name: siteName
			}}
			twitter={{
				handle: twitterHandle,
				site: twitterHandle,
				cardType: "summary_large_image"
			}}
			additionalMetaTags={[
				{
					property: "author",
					content: title
				}
			]}
			additionalLinkTags={[
				{
					rel: "icon",
					href: `${siteURL}/favicon.ico`
				}
				// {
				//   rel: "manifest",
				//   href: "/site.manifest",
				// },
			]}
		/>
	)
}
