function replace_attributes() {
  // フォルダIDとファイル名
  let folderId = "1Z_IMqrabPeStrsqV-X8mGH18ai3-FQJIBmwU3E_OtY4";
  let fileName = "wc-product-export-7-10-2024-1728281447083.csv";
  let sheetName = "wc-product-export-7-10-2024-1728281447083";

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
  let disc = getColumnIndex("H");
  let attr1_col = getColumnIndex("AN") + 1; //素材
  let attr2_col = getColumnIndex("BL") + 1; //ダイヤ or チェーン幅
  let attr3_col = getColumnIndex("BP") + 1; //中石グレード
  let attr4_col = getColumnIndex("BT") + 1; //サイズ or 全長
  let attr5_col = getColumnIndex("BX") + 1; //モチーフサイズ
  let attr6_col = getColumnIndex("CB") + 1; //製造国
  let attr7_col = attr6_col + 4 ; //ブランド
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
      var match_array = [...match_array, value.match(regex_array[n][1])];
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
        var value = value.replace(regex_array[j][1], "$1");
        sheet.getRange(i + 1, disc+1).setValue(value);
        attr_count++;
      }
    }
  }
}

function getColumnIndex(columnName) {
  var range = SpreadsheetApp.getActiveSpreadsheet().getRange(
    "A1:" + columnName + "1"
  );
  return range.getLastColumn() - 1;
}
