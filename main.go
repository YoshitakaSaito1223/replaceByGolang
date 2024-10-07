package replace

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"regexp"
)

func replace() {
	// 入力CSVファイルを開く
	file, err := os.Open("input.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// CSVリーダーを作成
	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1 // 可変長のフィールド数を許可

	// CSVデータを全て読み込む
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	// 正規表現のパターンを定義
	materials := regexp.MustCompile(`\d+,\w+,[A-Z0-9]+,.+?,\d+,\d+,\w+,"(.+?)",\w+,,,taxable,,(\d+),,,(\d+),(\d+),,,,,(\d+),,,,(\d+),"(.*?)",,,,"(.*?)",,,`)

	// 各レコード（行）に対して正規表現を適用して変換する
	for i, record := range records {
		if len(record) > 0 {
			input := record[0] // CSVの1行を文字列として取得

			output := materials.ReplaceAllString(input, ``)

			// 結果を出力（または他の処理に利用）
			fmt.Printf("変換前: %s\n", input)
			fmt.Printf("変換後: %s\n", output)

			// 変換結果をレコードに書き戻す
			records[i][0] = output
		}
	}

	// 変換後のCSVをファイルに書き出す
	outputFile, err := os.Create("output.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer outputFile.Close()

	writer := csv.NewWriter(outputFile)
	defer writer.Flush()

	// 書き込む
	err = writer.WriteAll(records)
	if err != nil {
		log.Fatal(err)
	}
}
