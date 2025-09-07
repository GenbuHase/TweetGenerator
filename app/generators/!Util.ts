import path from "path";
import fsExtra from "fs-extra";

export async function transpileFromArchive(targetPath: string, archivePaths: string[], pattern: RegExp): Promise<object[] | null> {
	// archivePathsの要素数が0の場合、nullを返却する
	if (archivePaths.length === 0) {
		return null;
	}

	/** トランスパイルされたデータを格納する配列 */
	const transpiled: object[] = [];

	for (const archivePath of archivePaths) {
		// archivePathが空文字列の場合、次のループへスキップする
		if (!archivePath.trim()) {
			console.warn("[WARN] Speficied file is empty");
			continue;
		}

		/** archivePathを相対パスから変換した絶対パス */
		const resolvedPath = path.resolve(import.meta.dirname, archivePath);

		// resolvedPathで指定されたパスが存在しない場合、警告を出力して次のループへスキップする
		if (!(await fsExtra.pathExists(resolvedPath))) {
			console.warn(`[WARN] Speficied file is not found: ${resolvedPath}`);
			continue;
		}

		console.log(`[LOG] Now Loading: ${resolvedPath}`);

		// resolvedPathで指定されたファイルをUTF-8エンコードで読み込む
		const content = await fsExtra.readFile(resolvedPath, "utf-8");
		// patternで指定された文字列を削除し、残りの部分をJSONとしてパースする
		const archiveDatas: object[] = JSON.parse(content.replace(pattern, "").trim());

		// archiveDatasの要素数が125000を越える場合、
		// Maximum call stack size exceededエラーが発生する
		for (let i = 0; i <= Math.floor(archiveDatas.length / 100000); i++) {
			// トランスパイルされたデータを100000件ごとに分割してtranspiledに追加する
			transpiled.push(...archiveDatas.slice(100000 * i, 100000 * (i + 1)));
		}
	}

	// targetPathで指定されたパスにtranspiledをJSON形式で出力する
	await fsExtra.writeJSON(targetPath, transpiled, {
		encoding: "utf-8",
		spaces: 2
	});

	return transpiled;
}
