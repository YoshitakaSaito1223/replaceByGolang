function replace_attributes() {
    // フォルダIDとファイル名
    let folderId = '1Z_IMqrabPeStrsqV-X8mGH18ai3-FQJIBmwU3E_OtY4';
    let fileName = 'wc-product-export-7-10-2024-1728281447083.csv';
    let sheetName='wc-product-export-7-10-2024-1728281447083';
  
  
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    var range = sheet.getRange(1, 1, lastRow, lastColumn);
    var values = range.getValues();
  
    // 正規表現
    let materialRegex = /\\n素材 (.*?)\n/;
    let sizeRegex= /\\nサイズ (.*?)\n/;
    let madeinRegex= /\\n製造国 (.*?)\n/;
    let brandRegex= /\\nブランド.*?\n\\n(.*?)\\n/;
    let pCodeRegex= /\\n独自商品コード.*?\n\\n(.*?)$/;
  
    //各属性の列
    let disc=getColumnIndex("H");
    let attr1_col=getColumnIndex("AN")+1;
    let attr2_col=getColumnIndex("BL")+1;
    let attr3_col=getColumnIndex("BP")+1;
    let attr4_col=getColumnIndex("BT")+1;
    let attr5_col=getColumnIndex("BX")+1;
    let attr6_col=getColumnIndex("CB")+1;
  
    console.log(values.length);
  
    // H列のデータをループで処理
    for (let i = 17; i < values.length; i++) {
      var value = values[i][disc]; 
  
      if(value==""){
        continue;
      }
  
      var materialMatch = value.match(materialRegex);
      var sizeMatch = value.match(sizeRegex);
      var madeinMatch = value.match(madeinRegex);
      var brandMatch = value.match(brandRegex);
      var pCodeMatch = value.match(pCodeRegex);
  
      
  
      if (materialMatch) {
        sheet.getRange(i + 1, attr1_col).setValue("素材");
        sheet.getRange(i + 1, attr1_col+1).setValue(materialMatch[1]);
        sheet.getRange(i + 1, attr1_col+2).setValue("1");
        sheet.getRange(i + 1, attr1_col+3).setValue("0");
        value.replace(materialRegex, '$1');
      }
      if (sizeMatch) {
        sheet.getRange(i + 1, attr2_col).setValue("サイズ");
        sheet.getRange(i + 1, attr2_col+1).setValue(sizeMatch[1]);
        sheet.getRange(i + 1, attr2_col+2).setValue("1");
        sheet.getRange(i + 1, attr2_col+3).setValue("0");
        value.replace(sizeRegex, '$1');
      }
      if (madeinMatch) {
        sheet.getRange(i + 1, attr3_col).setValue("製造国");
        sheet.getRange(i + 1, attr3_col+1).setValue(madeinMatch[1]);
        sheet.getRange(i + 1, attr3_col+2).setValue("1");
        sheet.getRange(i + 1, attr3_col+3).setValue("0");
        value.replace(madeinRegex, '$1');
      }
      if (brandMatch) {
        sheet.getRange(i + 1, attr4_col).setValue("ブランド");
        sheet.getRange(i + 1, attr4_col+1).setValue(brandMatch[1]);
        sheet.getRange(i + 1, attr4_col+2).setValue("1");
        sheet.getRange(i + 1, attr4_col+3).setValue("0");
        value.replace(brandRegex, '$1');
      }
      if (pCodeMatch) {
        sheet.getRange(i + 1, attr5_col).setValue("独自商品コード");
        sheet.getRange(i + 1, attr5_col+1).setValue(pCodeMatch[1]);
        sheet.getRange(i + 1, attr5_col+2).setValue("1");
        sheet.getRange(i + 1, attr5_col+3).setValue("0");
        value.replace(pCodeRegex, '$1');
      }
      
    }
  
  }
  
  function getColumnIndex(columnName) {
    var range = SpreadsheetApp.getActiveSpreadsheet().getRange("A1:" + columnName + "1");
    return range.getLastColumn() - 1;
  }
  
  