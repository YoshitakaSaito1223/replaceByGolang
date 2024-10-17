function replace_attributes() {
  // フォルダIDとファイル名
  const sheetName = "wc-product";

  //////////////////////////　列追加　start　///////////////////////////////
  // 追加行数
  const addRowCount = 16;
  // 対象のスプレッドシートを取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();

  // CA列のインデックスを取得
  var caColumnIndex = sheet.getRange("CA1").getColumn();

  // CA列の右側に12列挿入
  sheet.insertColumnsAfter(caColumnIndex, addRowCount);

  // 挿入した列の1行目に文字列をセット
  var range = sheet.getRange(1, caColumnIndex + 1, 1, addRowCount);
  var values = [
    "属性 6 の名前",
    "属性 6 の値",
    "属性 6 を表示",
    "属性 6 のグローバル",
    "属性 7 の名前",
    "属性 7 の値",
    "属性 7 を表示",
    "属性 7 のグローバル",
    "属性 8 の名前",
    "属性 8 の値",
    "属性 8 を表示",
    "属性 8 のグローバル",
    "属性 9 の名前",
    "属性 9 の値",
    "属性 9 を表示",
    "属性 9 のグローバル",
  ];
  range.setValues([values]);
  //////////////////////////　列追加　end　///////////////////////////////

  // シート内容を取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  var range = sheet.getRange(1, 1, lastRow, lastColumn);
  var values = range.getValues();

  // 正規表現
  let materialRegex = /\\n素材 (.*?)\n/;
  let diamondRegex = /\\nダイヤ (.*?)\n/;
  let gradeRegex = /\\n中石グレード (.*?)\n/;
  let chainLengthRegex = /\\nチェーン幅 (.*?)\n/;
  let earringRegex = /\\nイヤリング金具 (.*?)\n/;
  let sizeRegex = /\\nサイズ (.*?)\n/;
  let earringSizeRegex = /\\nピアスサイズ (.*?)\n/;
  let charmSizeRegex = /\\nチャームサイズ (.*?)\n/;
  let lengthRegex1 = /\\n全長 (.*?)\n(?!\\n\()/;
  let lengthRegex2 = /\\n全長：(.*?)\n/;
  let length2RowRegex = /\\n全長 (.*?)\n\\n(\(.*?\))\n(?!\\n\*)/;
  let length3RowRegex = /\\n全長 (.*?)\n\\n(\(.*?\))\n\\n(\*.*?)\n/;
  let pearlRegex1 = /\\nパールサイズ (.*?)\n/;
  let pearlRegex2 = /\\nパールの大きさ (.*?)\n/;
  let ringGaugeRegex = /\\nリング線径 (.*?)\n/;
  let rignSizeRegex = /\\nリングサイズ (.*?)\n/;
  let ringOnArmRegex = /\\nリング腕の太さ (.*?)\n/;
  let innerDiaRegex1 = /\\nバチカンの内径 (.*?)\n\\n(.*?)\n/;
  let innerDiaRegex2 = /\\nバチカン (.*?)\n\\n(.*?)\n/;
  let motifRegex = /\\nモチーフサイズ (.*?)\n/;
  let chokerInnerCircumRegex = /\\n内径 (.*?)\n/;
  let chokerOpeningRegex = /\\n開口 (.*?)\n/;
  let hoopOuterDiaRegex = /\\nフープ部分外径 (.*?)\n/;
  let madeinRegex = /\\n製造国 (.*?)\n/;
  let brandRegex = /\\nブランド.*?\n\\n(.*?)\n/;
  let pCodeRegex1 = /\\n独自商品コード.*?\n\\n(.*?)$/;
  let pCodeRegex2 = /\\n独自商品コード.*?\n\\n(.*?)\n/;
  let pCode2RowRegex0 = /\\n独自商品コード.*?\n\\n(.*?)\n\\n(\S+?)$/;
  let pCode2RowRegex1 = /\\n独自商品コード.*?\n\\n(.*?)\/\n\\n(.*?)$/;
  let pCode2RowRegex2 = /\\n独自商品コード.*?\n\\n(.*?)\/\n\\n(.*?)\n/;
  let pCode2RowRegex3 = /\\n独自商品コード.*?\n\\n(.*?)\n\\n\/(.*?)\n/;

  let regex_array = [
    ["素材", materialRegex],
    ["ダイヤ", diamondRegex],
    ["中石グレード", gradeRegex],
    ["チェーン幅", chainLengthRegex],
    ["イヤリング金具", earringRegex],
    ["サイズ", sizeRegex],
    ["ピアスサイズ", earringSizeRegex],
    ["チャームサイズ", charmSizeRegex],
    ["全長", lengthRegex1],
    ["全長", lengthRegex2],
    ["全長", length2RowRegex],
    ["全長", length3RowRegex],
    ["パールサイズ", pearlRegex1],
    ["パールの大きさ", pearlRegex2],
    ["リング線径", ringGaugeRegex],
    ["リングサイズ", rignSizeRegex],
    ["リング腕の太さ", ringOnArmRegex],
    ["バチカンの内径", innerDiaRegex1],
    ["バチカン", innerDiaRegex2],
    ["モチーフサイズ", motifRegex],
    ["内径", chokerInnerCircumRegex],
    ["開口", chokerOpeningRegex],
    ["フープ部分外径", hoopOuterDiaRegex],
    ["製造国", madeinRegex],
    ["ブランド", brandRegex],
    ["独自商品コード", pCodeRegex1],
    ["独自商品コード", pCodeRegex2],
    ["独自商品コード", pCode2RowRegex0],
    ["独自商品コード", pCode2RowRegex1],
    ["独自商品コード", pCode2RowRegex2],
    ["独自商品コード", pCode2RowRegex3],
  ];

  //各属性の列 //大体の要素
  let disc = getColumnIndex("H"); //簡単な説明
  let attr1_col = getColumnIndex("BL") + 1; //素材
  let attr2_col = attr1_col + 4; //ダイヤ or チェーン幅
  let attr3_col = attr2_col + 4; //中石グレード
  let attr4_col = attr3_col + 4; //サイズ or 全長
  let attr5_col = attr4_col + 4; //モチーフサイズ
  let attr6_col = attr5_col + 4; //製造国
  let attr7_col = attr6_col + 4; //ブランド
  let attr8_col = attr7_col + 4; //独自商品コード
  let attr_array = [
    attr1_col,
    attr2_col,
    attr3_col,
    attr4_col,
    attr5_col,
    attr6_col,
    attr7_col,
    attr8_col,
  ];

  console.log(values.length);

  // H列のデータをループで処理
  for (let i = 0; i < values.length; i++) {
    var value = values[i][disc];

    if (value == "") {
      continue;
    }

    var match_array = [];

    for (let n = 0; n < regex_array.length; n++) {
      match_array = [...match_array, value.match(regex_array[n][1])];
    }

    var attr_count = 0;
    for (let j = 0; j < match_array.length; j++) {
      if (match_array[j]) {
        sheet
          .getRange(i + 1, attr_array[attr_count])
          .setValue(regex_array[j][0]);
        sheet
          .getRange(i + 1, attr_array[attr_count] + 1)
          .setValue(match_array[j][1]);
        sheet.getRange(i + 1, attr_array[attr_count] + 2).setValue("1");
        sheet.getRange(i + 1, attr_array[attr_count] + 3).setValue("0");
        var value = value.replace(regex_array[j][1], "");
        sheet.getRange(i + 1, disc + 1).setValue(value);
        attr_count++;
      }
    }
  }
}

function getColumnIndex(columnName) {
  let range = SpreadsheetApp.getActiveSpreadsheet().getRange(
    "A1:" + columnName + "1"
  );
  return range.getLastColumn() - 1;
}
