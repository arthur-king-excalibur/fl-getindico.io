<!-- CONTEXT HELP DIVS -->
<div id="tooltipPool" style="display: none">
    <div id="eventsVisibilityHelp" class="tip">
        <%= _("""<b>Indicates when events from this category are shown in the event overview webpage.</b><br>
        - <b>Everywhere</b>: events are shown in the event overview webpage for this category and the parent categories<br>
        - <b>""" + name + """</b>: events are shown only in the overview webpage for this category (""" + name + """)<br>
        - <b>Nowhere</b>: events are not shown in any overview webpage.""")%>
    </div>
</div>
<!-- END OF CONTEXT HELP DIVS -->

<div class="groupTitle"><%= _("General Settings")%></div>

<table width="100%">
<tr>
  <td>
    <table width="90%" align="left" border="0">
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"> <%= _("Name")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= name %></td>
      <td rowspan="2" valign="bottom" align="right">
	<form action="<%= dataModificationURL %>" method="POST">
	<%= dataModifButton %>
	</form>
      </td>
    </tr>
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"><%= _("Description")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= description %></td>
    </tr>
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"><%= _("Default&nbsp;Timezone")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= defaultTimezone %></td>
    </tr>
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"><%= _("Icon")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= icon %></td>
    </tr>
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"> <%= _("Default&nbsp;lectures style")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= defaultLectureStyle %></td>
    </tr>
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"> <%= _("Default&nbsp;meetings style")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= defaultMeetingStyle %></td>
    </tr>
    <tr>
      <td class="dataCaptionTD"><span class="dataCaptionFormat"> <%= _("Events visibility")%></span></td>
      <td bgcolor="white" width="100%" class="blacktext"><%= defaultVisibility %> <% contextHelp('eventsVisibilityHelp') %></td>
    </tr>
    <tr>
      <td colspan="3" class="horizontalLine">&nbsp;</td>
    </tr>
    <tr><td></td></tr>
    <!-- <tr>
        <td class="dataCaptionTD">
          <a name="sections"></a>
          <span class="dataCaptionFormat"> <%= _("Management features")%></span>
          <br>
          <br>
          <img src=<%= enablePic %> alt="Click to disable"> <small> <%= _("Enabled feature")%></small>
          <br>
          <img src=<%= disablePic %> alt="Click to enable"> <small> <%= _("Disabled feature")%></small>
        </td>
        <td bgcolor="white" width="100%" class="blacktext" style="padding-left:20px">
            <table align="left">
            <tr>
              <td>
				<%= tasksManagement %>
              </td>
            </tr>
            </table>
        </td>
    </tr>
    <tr><td></td></tr>
    <tr>
      <td colspan="3" class="horizontalLine">&nbsp;</td>
    </tr>-->
    </table>
  </td>
</tr>
<tr>
  <td>
    <table width="90%" align="left" border="0">
    <tr>
      <td class="dataCaptionTD">
	<span class="dataCaptionFormat"> <%= _("Contents")%></span>
      </td>
      <td>
	<form action="<%= removeItemsURL %>" name="contentForm" method="POST">
	<%= locator %>
	<table width="100%">
	<tr>
	  <td bgcolor="white" width="100%">
	    <%= items %>
	  </td>
	  <td align="center">
	    <table cellspacing="0" cellpadding="0" align="right">
	    <tr>
	      <td align="right" valign="bottom">
		<input type="submit" class="btn" name="sort" value="<%= _("sort alphabetically")%>">
	      </td>
	    </tr>
	    <tr>
	      <td align="right" valign="bottom">
		<input type="submit" class="btn" name="remove" value="<%= _("remove")%>">
	      </td>
	    </tr>
	    <tr>
	      <td align="right" valign="bottom">
		<input type="submit" class="btn" name="reallocate" value="<%= _("re-allocate")%>">
	      </td>
	    </tr>
	    <tr>
	      <td align="right" valign="bottom">
		<input type="submit" class="btn" value="<%= _("add subcateg")%>" onClick="this.form.action='<%= addSubCategoryURL %>';">
	      </td>
	    </tr>
	    </table>
	  </td>
	</tr>
	</table>
	</form>
      </td>
    </tr>
    <tr>
      <td colspan="2" class="horizontalLine">&nbsp;</td>
    </tr>
    </table>
  </td>
</tr>
</table>

<script type="text/javascript">

function selectAll()
{
	if (!document.contentForm.selectedConf.length){
		document.contentForm.selectedConf.checked=true
    } else {
		for (i = 0; i < document.contentForm.selectedConf.length; i++) {
		    document.contentForm.selectedConf[i].checked=true
    	}
	}
}

function deselectAll()
{
	if (!document.contentForm.selectedConf.length)	{
	    document.contentForm.selectedConf.checked=false
    } else {
	   for (i = 0; i < document.contentForm.selectedConf.length; i++) {
	       document.contentForm.selectedConf[i].checked=false
       }
	}
}

</script>