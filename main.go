package replace

import (
	"encoding/csv"
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
	// desc := regexp.MustCompile(`.*?,.*?,.*?,.*?,.*?,.*?,.*?,"(.+?)",.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,`)
	materials := regexp.MustCompile(`.*?\n素材(.*?)\n`)
	size := regexp.MustCompile(`.*?\nサイズ(.*?)\n`)
	madein := regexp.MustCompile(`.*?\n製造国(.*?)\n`)
	brand := regexp.MustCompile(`.*?\nブランド.*?\n(.*?)\n`)
	Pcode := regexp.MustCompile(`.*?\n独自商品コード.*?\n(.*?)\n`)

	// 各レコード（行）に対して正規表現を適用して変換する
	for i, record := range records {
		if len(record) > 0 {
			description := record[8] // CSVの1行を文字列として取得

			// description := desc.FindString(input)
			attr_materials := materials.FindString(description)
			attr_size := size.FindString(description)
			attr_madein := madein.FindString(description)
			attr_brand := brand.FindString(description)
			attr_Pcode := Pcode.FindString(description)

			if attr_materials != "" {
				record[0] = "素材"
				record[1] = attr_materials
			}

			if attr_size != "" {
				record[0] = "サイズ"
				record[1] = attr_size
			}

			if attr_madein != "" {
				record[0] = "製造国"
				record[1] = attr_madein
			}

			if attr_brand != "" {
				record[0] = "ブランド"
				record[1] = attr_brand
			}

			if attr_Pcode != "" {
				record[0] = "独自商品コード"
				record[1] = attr_Pcode
			}

			// 変換結果をレコードに書き戻す
			records[i] = record
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
