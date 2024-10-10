package main

import (
	"encoding/csv"
	"log"
	"os"
	"regexp"
)

func main() {
	// 入力CSVファイルを開く
	file, err := os.Open("pre.csv")
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
	materials := regexp.MustCompile(`.*?\\n素材 (.*?)\n`)
	size := regexp.MustCompile(`.*?\\nサイズ (.*?)\n`)
	madein := regexp.MustCompile(`.*?\\n製造国 (.*?)\n`)
	brand := regexp.MustCompile(`.*?\\nブランド.*?\n\\n(.*?)\n`)
	Pcode := regexp.MustCompile(`.*?\\n独自商品コード\n\\n(.*?)"`)

	// 各レコードに対して正規表現を適用して変換する
	for i, record := range records {
		if len(record) > 0 {
			description := record[7] // 商品詳細部分取得

			attr_materials := materials.FindStringSubmatch(description)
			attr_size := size.FindStringSubmatch(description)
			attr_madein := madein.FindStringSubmatch(description)
			attr_brand := brand.FindStringSubmatch(description)
			attr_Pcode := Pcode.FindStringSubmatch(description)

			if len(attr_materials) > 1 {
				record[39] = "素材"
				record[40] = attr_materials[1]
				record[41] = "1"
				record[42] = "0"
			}

			if len(attr_size) > 1 {
				record[63] = "サイズ"
				record[64] = attr_size[1]
				record[65] = "1"
				record[66] = "0"
			}

			if len(attr_madein) > 1 {
				record[67] = "製造国"
				record[68] = attr_madein[1]
				record[69] = "1"
				record[70] = "0"
			}

			if len(attr_brand) > 1 {
				record[71] = "ブランド"
				record[72] = attr_brand[1]
				record[73] = "1"
				record[74] = "0"
			}

			if len(attr_Pcode) > 1 {
				record[75] = "独自商品コード"
				record[76] = attr_Pcode[1]
				record[77] = "1"
				record[78] = "0"
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
