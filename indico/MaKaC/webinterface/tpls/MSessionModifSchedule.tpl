<table width="100%" class="timetableTab"><tr><td>
<table align="center" width="90%" border="0">
    <tr>
        <td class="dataCaptionTD"><span class="dataCaptionFormat"> <%= _("Start date")%></span></td>
        <td bgcolor="white" class="blacktext"><%= start_date %></td>
        <form action=<%= editURL %> method="POST">
        <td rowspan="2" valign="bottom" align="right" width="1%">
        	<%= fitToInnerSlots %>
        </td>
        </form>
    </tr>
    <tr>
        <td class="dataCaptionTD"><span class="dataCaptionFormat"> <%= _("End date")%></span></td>
        <td bgcolor="white" class="blacktext"><%= end_date %></td>
    </tr>
	<tr>
        <td colspan="3" class="horizontalLine">&nbsp;</td>
    </tr>
</table>
<table align="center" width="90%" cellpadding="0" cellspacing="0">
    <tr>
        <td><%= schedule %></td>
    </tr>
    <tr>
        <td><br><br></td>
    </tr>
</table>
</td></tr></table>