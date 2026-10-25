// 建立婚宴出席回覆表單，放進「曲＋睿」資料夾，回覆自動寫進同資料夾的試算表
function createRsvpForm() {
  var folders = DriveApp.getFoldersByName('曲＋睿');
  if (!folders.hasNext()) folders = DriveApp.getFoldersByName('曲+睿');
  if (!folders.hasNext()) throw new Error('找不到「曲＋睿」資料夾');
  var folder = folders.next();

  var form = FormApp.create('Morris & Audrey 婚宴出席回覆');
  form.setDescription('2027.03.13（六）中午｜台中林酒店 三樓國全廳\n請於 2027 年 1 月 28 日前回覆，謝謝！')
      .setCollectEmail(false)
      .setLimitOneResponsePerUser(false)
      .setConfirmationMessage('收到你的回覆了，謝謝！3/13 見 ♡');

  form.addTextItem().setTitle('姓名').setRequired(true);
  form.addMultipleChoiceItem().setTitle('您是哪一方的親友？')
      .setChoiceValues(['新郎 Morris', '新娘 Audrey', '雙方共同']).setRequired(true);
  var attend = form.addMultipleChoiceItem().setTitle('是否出席？').setRequired(true);

  var pageAttend = form.addPageBreakItem().setTitle('出席資訊');
  form.addListItem().setTitle('出席人數（含自己）')
      .setChoiceValues(['1', '2', '3', '4', '5', '6']).setRequired(true);
  form.addTextItem().setTitle('其中兒童椅需求（張）').setHelpText('不需要請填 0');
  form.addMultipleChoiceItem().setTitle('素食需求')
      .setChoiceValues(['不需要', '蛋奶素', '全素']).setRequired(true);
  form.addTextItem().setTitle('素食份數').setHelpText('不需要請留白');
  form.addMultipleChoiceItem().setTitle('是否開車？（協助預估停車位）')
      .setChoiceValues(['會開車', '不開車']).setRequired(true);
  form.addParagraphTextItem().setTitle('想對新人說的話');

  var pageAbsent = form.addPageBreakItem().setTitle('留言給新人');
  form.addParagraphTextItem().setTitle('想對新人說的話（選填）');
  pageAbsent.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  attend.setChoices([
    attend.createChoice('會出席', pageAttend),
    attend.createChoice('無法出席', pageAbsent)
  ]);

  var ss = SpreadsheetApp.create('Morris & Audrey 婚宴出席回覆（回應）');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(ss.getId()).moveTo(folder);

  Logger.log('表單填寫網址: ' + form.getPublishedUrl());
  Logger.log('表單編輯網址: ' + form.getEditUrl());
  Logger.log('回應試算表: ' + ss.getUrl());
}
