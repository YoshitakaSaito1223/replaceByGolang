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

	// fmt.Print(records[4310])

	// 正規表現のパターンを定義
	materials := regexp.MustCompile(`.*?\\n素材 (.*?)\\n`)
	size := regexp.MustCompile(`.*?\\nサイズ (.*?)\\n`)
	madein := regexp.MustCompile(`.*?\\n製造国 (.*?)\\n`)
	brand := regexp.MustCompile(`.*?\\nブランド.*?\\n(.*?)\\n`)
	Pcode := regexp.MustCompile(`.*?\\n独自商品コード\\n(.*?)$`)

	// 各レコードに対して正規表現を適用して変換する
	for i, record := range records {
		if len(record) > 6 {
			description := record[7] // 商品詳細部分取得

			attr_materials := materials.FindStringSubmatch(description)
			attr_size := size.FindStringSubmatch(description)
			attr_madein := madein.FindStringSubmatch(description)
			attr_brand := brand.FindStringSubmatch(description)
			attr_Pcode := Pcode.FindStringSubmatch(description)

			new_record := record[:]
			if len(attr_materials) > 1 {
				new_record[39] = "素材"
				new_record[40] = attr_materials[1]
				new_record[41] = "1"
				new_record[42] = "0"
			} else {
				new_record[39] = ""
				new_record[40] = ""
				new_record[41] = ""
				new_record[42] = ""
			}

			if len(attr_size) > 1 {
				new_record = append(new_record, "サイズ", attr_size[1], "1", "0")
			} else {
				new_record = append(new_record, "", "", "", "")
			}

			if len(attr_madein) > 1 {
				new_record = append(new_record, "製造国", attr_madein[1], "1", "0")
			} else {
				new_record = append(new_record, "", "", "", "")
			}

			if len(attr_brand) > 1 {
				new_record = append(new_record, "ブランド", attr_brand[1], "1", "0")
			} else {
				new_record = append(new_record, "", "", "", "")
			}

			if len(attr_Pcode) > 1 {
				new_record = append(new_record, "独自商品コード", attr_Pcode[1], "1", "0")
			} else {
				new_record = append(new_record, "", "", "", "")
			}
			// 変換結果をレコードに書き戻す
			records[i] = new_record
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
