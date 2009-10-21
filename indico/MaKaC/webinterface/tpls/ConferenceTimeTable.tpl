
<div id="timetable" style="position: relative;">

<div class="timetablePreLoading" style="width: 700px; height: 300px;">
    <div class="text" style="padding-top: 200px;">&nbsp;&nbsp;&nbsp;<%= _("Building timetable...") %></div>
</div>

<div class="clearfix"></div>

<script type="text/javascript">

IndicoUI.executeOnLoad(function(){
  var ttdata = <%= str(ttdata).replace('%','%%') %>;

  var timetable = new TimeTableDisplay(ttdata,710,$E('timetable'), false);
  $E('timetable').set(timetable.draw());
  timetable.postDraw();

  $E('menuLink_timetable').append(timetable.filterMenu());
  $E('menuLink_timetable').append(timetable.layoutMenu());
  $E('menuLink_timetable').append(timetable.printMenu());
});
</script>
