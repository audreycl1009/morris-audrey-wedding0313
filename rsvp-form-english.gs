// 在現有出席回覆表單的每一題中文後面加上英文；重複執行不會加兩次
var FORM_ID = '14grVTlTdwZvjejb0xcyEdA-vr1feTdgu7KdPthRgSmA';

var TITLES = {
  '出席資訊': '出席資訊 Attendance',
  '姓名': '姓名 Name',
  '您是哪一方的親友？': '您是哪一方的親友？ Are you a guest of the groom or the bride?',
  '是否出席？': '是否出席？ Will you attend?',
  '人數調查': '人數調查 Party Size',
  '當天參加人數?': '當天參加人數？ How many people will attend?',
  '小孩是否需要兒童座椅?': '小孩是否需要兒童座椅？ Do you need high chairs for children?',
  '是否有吃素需求': '是否有吃素需求 Vegetarian meals needed?',
  '感謝您的填寫，歡迎留言給我們祝福。': '感謝您的填寫，歡迎留言給我們祝福。 Thank you! Feel free to leave us a message.',
  '想對新人說的話': '想對新人說的話 A message for the couple'
};
var HELP = {
  '範例：大人兩位小孩一位、大人三位': '範例：大人兩位小孩一位、大人三位\nExample: 2 adults and 1 child',
  '不需要請留空': '不需要請留空 Leave blank if not needed'
};
var CHOICES = {
  '新郎 胡俊睿 Morris': '新郎 胡俊睿 Groom Morris',
  '新娘 張廖軒曲 Audrey': '新娘 張廖軒曲 Bride Audrey',
  '會出席': '會出席 Yes, I\'ll be there',
  '無法出席，但給予祝福': '無法出席，但給予祝福 Can\'t make it, sending best wishes',
  '需要1張': '需要1張 1 chair', '需要2張': '需要2張 2 chairs', '需要3張': '需要3張 3 chairs', '需要4張': '需要4張 4 chairs',
  '無': '無 None', '1位': '1位 1 person', '2位': '2位 2 people', '3位': '3位 3 people', '4位': '4位 4 people'
};

var DESC_EN = [
  '',
  '────────── English ──────────',
  'Dear family and friends,',
  'We would love for you to celebrate with us. Please fill in this form by 23:59 on Thursday, January 28, 2027. Thank you!',
  '',
  'Date: Saturday, March 13, 2027',
  'Reception: Doors open at 11:00 with a mini bar. The banquet begins at 12:00 sharp.',
  'Venue: The Lin Hotel, Guo Quan Hall (3F), No. 99, Chaofu Rd., Xitun Dist., Taichung',
  '',
  'Parking at the hotel is limited on the day. We recommend nearby parking lots or public transport.'
].join('\n');

function addEnglish() {
  var form = FormApp.openById(FORM_ID);
  Logger.log('已收到的回覆數: ' + form.getResponses().length);

  if (form.getTitle().indexOf('RSVP') < 0) form.setTitle(form.getTitle() + ' | Wedding RSVP');
  // 2027/03/13 是星期六
  var desc = form.getDescription().split('2027/03/13 (日)').join('2027/03/13 (六)');
  if (desc.indexOf('English') < 0) desc += '\n' + DESC_EN;
  form.setDescription(desc);
  if (form.getConfirmationMessage().indexOf('Thank you') < 0)
    form.setConfirmationMessage(form.getConfirmationMessage() + '\nThank you for your reply! See you on March 13 ♡');

  form.getItems().forEach(function (it) {
    var t = it.getTitle();
    if (TITLES[t]) it.setTitle(TITLES[t]);
    var h = it.getHelpText();
    if (HELP[h]) it.setHelpText(HELP[h]);

    var type = it.getType();
    if (type == FormApp.ItemType.MULTIPLE_CHOICE || type == FormApp.ItemType.LIST) {
      var item = type == FormApp.ItemType.LIST ? it.asListItem() : it.asMultipleChoiceItem();
      var choices = item.getChoices(), changed = false;
      // 只有原本就設定「依答案跳頁」的題目才保留跳頁設定
      var branching = choices.some(function (c) {
        return c.getGotoPage() || (c.getPageNavigationType() && c.getPageNavigationType() != FormApp.PageNavigationType.CONTINUE);
      });
      var next = choices.map(function (c) {
        var v = CHOICES[c.getValue()] || c.getValue();
        if (v != c.getValue()) changed = true;
        if (!branching) return item.createChoice(v);
        return c.getGotoPage() ? item.createChoice(v, c.getGotoPage()) : item.createChoice(v, c.getPageNavigationType());
      });
      if (changed) item.setChoices(next);
    }
  });
  Logger.log('完成：' + form.getPublishedUrl());
}
