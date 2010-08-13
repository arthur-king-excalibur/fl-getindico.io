<tr>
    <td nowrap class="titleCellTD"><span class="titleCellFormat"> <%= _("Current status")%></span></td>
    <td bgcolor="white" width="100%%" valign="top" class="blacktext">
        <div class="ACStatusDiv">
            <%= _("The 'Home' Category is currently") %>
            <% if privacy == 'INHERITING' : %>
                <span class="ACStatus" style="color: #128F33;"><%= _("PUBLIC") %></span>
            <% end %>
            <% elif privacy == 'PRIVATE' : %>
                <span class="ACStatus" style="color: #B02B2C;"><%= _("PRIVATE") %></span>
            <% end %>
            .
        </div>
        <div class="ACStatusDescDiv">
            <% if privacy == 'INHERITING' :%>
                <%= _("This means that it can be viewed by all the users.") %>
            <% end %>
            <% elif privacy == 'PRIVATE' :%>
                <%= _("This means that it can be viewed only by the users you specify in the following list.") %>
            <% end %>
        </div>
        <% if privacy == 'PRIVATE' :%>
        <div class="ACUserListDiv">
            <div class="ACUserListWrapper" id="ACUserListWrapper">
            </div>
        </div>

        <script type="text/javascript">

            var allowedList = <%= offlineRequest(self._rh, 'category.protection.getAllowedUsersList', {'category': self._rh._target.getId()}) %>;

            var removeUser = function(user, setResult){
                jsonRpc(Indico.Urls.JsonRpcService, "category.protection.removeAllowedUser",
                        {'category': <%= self._rh._target.getId() %>, value: {'id': user.get('id')}},
                        function(result, error){
                            if (exists(error)) {
                                IndicoUtil.errorReport(error);
                                setResult(false);
                            } else {
                                setResult(true);
                            }
                        });
            };

            var addUsers = function(list, setResult){
                jsonRpc(Indico.Urls.JsonRpcService, "category.protection.addAllowedUsers",
                        {'category': <%= self._rh._target.getId() %>, value: list },
                        function(result, error){
                            if (exists(error)) {
                                IndicoUtil.errorReport(error);
                                setResult(false);
                            } else {
                                setResult(true);
                            }
                        });
            };

            // ---- List of users allowed to view the categ/event/material/resource

            var allowedUsersList = new UserListField(
                    'userListDiv', 'userList',
                    allowedList, true, null,
                    true, true, null, null,
                    false, false, false,
                    addUsers, null, removeUser);

            // ---- On Load

            IndicoUI.executeOnLoad(function()
            {
                $E('ACUserListWrapper').set(allowedUsersList.draw());
            });

        </script>
        <% end %>
    </td>
</tr>
<tr>
    <td nowrap class="titleCellTD"><span class="titleCellFormat"> <%= _("Modify status")%></span></td>
    <td bgcolor="white" width="100%%" valign="top" class="blacktext">
    <div class="ACModifDiv">
        <form action="<%= setPrivacyURL %>" method="POST">
            <%= locator %>
            <div class="ACModifButtonsDiv">
                <% if privacy == 'PRIVATE' :%>
                <div class="ACModifButtonEntry">
                    <%= _("Make it")%> <input type="submit" class="btn" name="visibility" value="<%= _("PUBLIC")%>"> <%= _("(viewable by all the users). This operation may take a while to complete.") %>
                </div>
                <% end %>
                <% if privacy == 'INHERITING': %>
                <div class="ACModifButtonEntry">
                    <%= _("Make it")%> <input type="submit" class="btn" name="visibility" value="<%= _("PRIVATE")%>"> <%= _("(viewable only by the users you choose). This operation may take a while to complete.") %>
                </div>
                <% end %>
            </div>
            <input type="hidden" name="type" value=<%= type %>>
        </form>
    </div>
    </td>
</tr>