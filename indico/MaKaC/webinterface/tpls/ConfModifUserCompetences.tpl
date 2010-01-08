<% import MaKaC.webinterface.urlHandlers as urlHandlers %>

<% if not ConfReview.hasReviewing(): %>
<table align="center"><tr><td><%= _("Type of reviewing has not been chosen yet")%></td></tr></table>
<% end %>
<% elif ConfReview.getAllUserCompetences() == []: %>
<table align="center"><tr><td><%= _("The Reviewing Team has not been assigned yet.")%></td></tr></table>
<% end %>
<%else:%>
<div style="padding-top:10px; padding-bottom: 10px;padding-left: 10px">
<em><%= _("Here you can define competences for every team member, if needed.")%></em>
</div>
<table class="Revtab" width="90%%" cellspacing="0" align="center" border="0" style="padding-left:2px; padding-top: 20px;">
    <tr>
        <td nowrap class="groupTitle" colspan=5>
            <%= _("Paper Reviewing Team competences")%>
            <span id="competencesHelp"></span> 
        </td>
    </tr>
    <tr>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 10px; padding-bottom: 10px;"><%= _("Id")%></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 10px; padding-bottom: 10px;"><%= _("Name")%></td>
        <td nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 10px; padding-bottom: 10px;"><%= _("Responsabilities")%></td>
        <td colspan=2 nowrap class="titleCellFormat" style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 10px; padding-bottom: 10px;"><%= _("Competences")%></td>
    </tr>
   
    
    <% for user, competences in ConfReview.getAllUserCompetences(): %>
    <% if ConfReview.isPaperReviewManager(user) or ConfReview.isReferee(user) or ConfReview.isEditor(user) or ConfReview.isReviewer(user):%>
        <tr valign="top">
            <td style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 5px;"><%= user.getId() %></td>
            <td style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 5px;"><%= user.getFullName()%></td>
            <td style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF; padding-top: 5px;">
                <%= ", ".join(ConfReview.getUserReviewingRoles(user)) %>
            </td>
            <td  style="padding-top: 5px;">
                <span id="competences_<%= user.getId() %>"></span>
            </td>
        </tr>
    <% end %>
    <% end %>
    <tr><td colspan=5 style="padding-top: 15px;">
            <em><%= _("To assign contributions for paper reviewing, please click on 'Assign Contributions'")%></em>
   </td></tr>
</table>

<script type="text/javascript">

var keyWordfieldList = new Array()
<% for user, competences in ConfReview.getAllUserCompetences(): %>
 <% if ConfReview.isPaperReviewManager(user) or ConfReview.isReferee(user) or ConfReview.isEditor(user) or ConfReview.isReviewer(user):%>
    new IndicoUI.Widgets.Generic.keywordField(
        $E('competences_<%= user.getId() %>'),
        'oneLineListItem',
        'reviewing.conference.changeCompetences',
        {
            conference: '<%= Conference.getId() %>',
            user: '<%= user.getId() %>'
        }
    );
 <% end %>    
<% end %>
</script>
<% end %>