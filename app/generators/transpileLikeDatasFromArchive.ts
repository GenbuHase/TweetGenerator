import path from "path";

import { transpileFromArchive } from "./!Util";

/** いいねデータの出力先パス */
const TARGET_PATH = path.resolve(import.meta.dirname, "../assets/twitter-archive/generated/likes.json");

/** ツイートアーカイブのパス一覧 */
const LIKE_ARCHIVE_PATHS: string[] = [
	//
	"../assets/twitter-archive/data/like.js",
	"../assets/twitter-archive/data/like-part1.js"
];

/**
 * Transpile like datas from Twitter Archives
 * @see https://x.com/settings/download_your_data
 */
export default async function transpileLikeDatasFromArchive(): Promise<object[] | null> {
	return transpileFromArchive(
		TARGET_PATH,
		LIKE_ARCHIVE_PATHS,

		// 先頭の "window.YTD.like.part${0-*} = " にマッチする正規表現
		/^window\.YTD\.like\.part\d*\s*=\s*/
	);
}

transpileLikeDatasFromArchive();
