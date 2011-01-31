<%!
location = self._conf.getLocation()
room = self._conf.getRoom()

if location:
    locationName = location.getName()
    address = self._conf.getLocation().getAddress().replace('\r\n','\\n').replace('\n','\\n')
else:
    locationName = 'None'
    address = ''

if room:
    roomName = room.name
else:
    roomName = 'None'

%>

<form action=<%= quickSearchURL %> method="POST">
    <span class="titleCellFormat"> <%= _("Quick search: contribution ID")%></span> <input type="text" name="selContrib"><input type="submit" class="btn" value="<%= _("seek it")%>">
</form>
<br>
<%= menu %>
<br>
<span>
    <form action="<%= newContribURL %>" method="POST" style="padding:0px;margin:0px; display:inline">
      <input type="hidden" name="contributionCreatedFrom" value="contributionList"/>
      <input type="button" onclick="addContribution()" class="btn" name="" value="<%= _("new")%>">
    </form>
    <form action=<%= moveURL %> method="post" style="padding:0px;margin:0px; display:inline">
    <span style="display:none"><%= contribsToPrint %></span>
    <input type="submit" class="btn" value="<%= _("move all")%>">
    </form>
    <form action=<%= contributionsPDFURL %> method="post" target="_blank" style="padding:0px; margin:0px; display:inline">
    <span style="display:none"><%= contribsToPrint %></span>
    <input type="submit" class="btn" value="<%= _("PDF of all")%>">
    </form>
    <form action=<%= participantListURL %> method="post" target="_blank" style="padding:0px; margin:0px; display:inline">
    <span style="display:none"><%= contribsToPrint %></span>
    <input type="submit" class="btn" value="<%= _("author list of all")%>">
    </form>
    <form action=<%= materialPkgURL %> method="post" style="padding:0px; margin:0px; display:inline">
    <span style="display:none"><%= contribsToPrint %></span>
    <input type="submit" class="btn" value="<%= _("material package of all")%>">
    </form>
    <form action=<%= proceedingsURL %> method="post" style="padding:0px; margin:0px; display:inline">
    <span style="display:none"><%= contribsToPrint %></span>
    <input type="submit" class="btn" value="<%= _("proceedings")%>">
    </form>
</span>
<table width="100%" cellspacing="0" align="center" border="0" style="border-left: 1px solid #777777;padding-left:2px">
    <tr>
        <td colspan="11" nowrap class="groupTitle" style="marging-bottom:3px">
            <%= _("Found contributions")%> (<%= numContribs %>)
        </td>
    </tr>
    <tr><td>&nbsp;</td></tr>
    <tr>
		<td></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= numberImg %><a href=<%= numberSortingURL %>> <%= _("Id")%></a></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= dateImg %><a href=<%= dateSortingURL %>> <%= _("Date")%></a></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= _("Duration")%></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= typeImg %><a href=<%= typeSortingURL %>> <%= _("Type")%></a></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= titleImg %><a href=<%= titleSortingURL %>> <%= _("Title")%></a></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= speakerImg %><a href=<%= speakerSortingURL %>> <%= _("Presenter")%></a></a></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= sessionImg %><a href=<%= sessionSortingURL %>> <%= _("Session")%></a></td>
        <td nowrap class="titleCellFormat" style="Border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"><%= trackImg %><a href=<%= trackSortingURL %>> <%= _("Track")%></a></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"> <%= _("Status")%></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;border-bottom: 1px solid #5294CC;"> <%= _("Material")%></td>
    </tr>
	<form action=<%= contribSelectionAction %> method="post">
    <tr>
        <%= contributions %>
    </tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td colspan="11" align="center"><font color="black"> <%= _("Total Duration of Selected")%>: <b><%= totaldur %></b></font></td></tr>


	<tr><td>&nbsp;</td></tr>


	<tr>
		<td colspan="11" style="border-top:2px solid #777777;padding-top:5px" valign="bottom" align="left">&nbsp;</td>
	</tr>


	<tr>
		<td colspan="10" valign="bottom" align="left">
			<input type="submit" class="btn" name="move" value="<%= _("move selected")%>">
        </td>
    </tr>
	<tr>
		<td colspan="10" valign="bottom" align="left">
			<input type="submit" class="btn" name="PDF" value="<%= _("PDF of selected")%>" onClick='this.form.action=<%= contributionsPDFURL %>;this.form.target="_blank";'>
        </td>
    </tr>
	<tr>
		<td colspan="10" valign="bottom" align="left">
			<input type="submit" class="btn" name="AUTH" value="<%= _("author list of selected")%>">
		</td>
	</tr>
	<tr>
		<td colspan="10" valign="bottom" align="left">
			<input type="submit" class="btn" name="PKG" value="<%= _("material package of selected")%>">
		</td>
	</tr>
	</form>
</table>

<script type="text/javascript">
var parentEventRoomData = $O(<%= jsonEncode(roomInfo(self._rh._target)) %>);

var addContribution = function() {
    var dialog = new AddNewContributionDialog(
                       'schedule.event.addContribution',
                       null,
		       <%= jsonEncode({'conference': self._conf.id }) %>,
		       <%= jsonEncode({'location': locationName,
		       'room': roomName,
		       'address': address }) %>,
                       parentEventRoomData,
                       '',
                       '',
                       <%= jsBoolean(self._conf.getType() != 'meeting') %>,
                       [],
                       null,
                       null,
                       function() {
                          window.location.reload();
                       },
                       <%= jsBoolean(self._conf.getAbstractMgr().isActive()) %>,
                       <%= bookings %>
                       );

    dialog.execute();
};
</script>