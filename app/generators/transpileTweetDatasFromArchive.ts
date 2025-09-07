import path from "path";

import { transpileFromArchive } from "./!Util";

/** ツイートデータの出力先パス */
const TARGET_PATH = path.resolve(import.meta.dirname, "../assets/twitter-archive/generated/tweets.json");

/** ツイートアーカイブのパス一覧 */
const TWEET_ARCHIVE_PATHS: string[] = [
	//
	"../assets/twitter-archive/data/tweets.js",
	"../assets/twitter-archive/data/tweets-part1.js"
];

/**
 * Transpile tweet datas from Twitter Archives
 * @see https://x.com/settings/download_your_data
 */
export default async function transpileTweetDatasFromArchive(): Promise<object[] | null> {
	return transpileFromArchive(
		TARGET_PATH,
		TWEET_ARCHIVE_PATHS,

		// 先頭の "window.YTD.tweets.part${0-*} = " にマッチする正規表現
		/^window\.YTD\.tweets\.part\d*\s*=\s*/
	);
}

transpileTweetDatasFromArchive();
