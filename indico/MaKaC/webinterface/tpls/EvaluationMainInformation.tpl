<table>
  <tr>
    <td>
      <table>
        <tr>
          <td nowrap class="title"><center> <%= _("Evaluation")%></center></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <table>
        <tr>
          <td class="displayField"><b><%= _("Evaluation opening day")%>:</b></td>
          <td ><%=startDate%></td>
        </tr>
        <tr>
          <td class="displayField"><b><%= _("Evaluation deadline")%>:</b></td>
          <td ><%=endDate%></td>
        </tr>
        <% if submissionsLimit>0 : %>
          <tr>
            <td class="displayField"><b><%= _("Max Nb of submissions")%>:</b></td>
            <td><%=submissionsLimit%></td>
          </tr>
        <% end %>
        <% if contactInfo.strip()!="" : %>
          <tr>
            <td class="displayField"><b><%= _("Contact info")%>:</b></td>
            <td><%=contactInfo%></td>
          </tr>
        <% end %>
      </table>
    </td>
  </tr>
  <tr>
    <td><br/></td>
  </tr>
  <tr>
    <td>
      <table>
        <tr>
          <td><pre><%=announcement%></pre></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <table style="padding-top:20px">
        <tr>
          <td>
            <% if actionsShow: %>
              <b> <%= _("Possible actions you can carry out")%>:</b>
              <ul>
                <% if actionsDisplayEval!=None: %>
                  <li><a href="<%=actionsDisplayEval%>"> <%= _("Show evaluation form.")%></a></li>
                <% end %>
                <% if actionsModifyEval!=None: %>
                  <li><a href="<%=actionsModifyEval%>"> <%= _("Modify your submitted evaluation.")%></a></li>
                <% end %>
              </ul>
            <% end %>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<br/>
