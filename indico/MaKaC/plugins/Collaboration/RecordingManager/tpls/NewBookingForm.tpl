<div><span>
<a id="scroll_down" name="top"></a>
<br />
</span></div>

<% declareTemplate(newTemplateStyle=True) %>

<table>
  <tr>
    <td width="400px" valign="top">
        <b><%= _("1. Select a record:") %></b>
        <br /> <!-- line breaks to make the pretty boxes below to line up -->
        <br />
        <br />
        <div class="RMMatchPane">
            <% for talk in Talks: %>
                <% IndicoID = talk["IndicoID"] %>
                <div id="div<%= IndicoID %>" class="RMtalkDisplay" onclick="RMtalkSelect('<%= IndicoID %>')" onmouseover="RMtalkBoxOnHover('<%= IndicoID %>');" onmouseout="RMtalkBoxOffHover('<%= IndicoID %>');">
                  <span>
                    <table cellspacing="0" cellpadding="0" border="0">
                    <tr>
                    <td width="350px">
<!--
                        <tt><b><%= {'conference':      "E&nbsp;",
                                 'session':         "&nbsp;S&nbsp;",
                                 'contribution':    "&nbsp;&nbsp;C&nbsp;",
                                 'subcontribution': "&nbsp;&nbsp;&nbsp;SC&nbsp;"}[talk["type"]] %></b></tt>
                        <%= talk["titleshort"] %><br />&nbsp;
-->
                        <tt><b><%= {'conference':      "E&nbsp;",
                                 'session':         "S&nbsp;&nbsp;",
                                 'contribution':    "C&nbsp;&nbsp;&nbsp;",
                                 'subcontribution': "SC&nbsp;&nbsp;&nbsp;&nbsp;"}[talk["type"]] %></b></tt>
                        <%= talk["titleshort"] %><br />&nbsp;
                        <tt><%= {'conference':      "&nbsp;&nbsp;",
                                 'session':         "&nbsp;&nbsp;&nbsp;",
                                 'contribution':    "&nbsp;&nbsp;&nbsp;&nbsp;",
                                 'subcontribution': "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}[talk["type"]] %></b></tt>
                        <% if talk["speakers"] != '': %>
                        <%=    talk["speakers"] %>
                        <% end %>
                    </td>
                    <td align="top">
                        <% if talk["LOID"] != '': %>
                        <b><tt>M</tt></b>
                        <% end %>
                    </td>
                    <td align="top">
                        <% if talk["CDS"] != '': %>
                        <b><tt>C</tt></b>
                        <% end %>
                    </td>
                    </tr>
                    </table>
                    </span>
                </div>
            <% end %>
        </div>
    </td>
    <td width="620px" valign="top">
        <b><%= _("2. Select content type: ") %></b>
        <span id="RMbuttonPlainVideo" class="RMbuttonDisplay" onclick="RMbuttonModeSelect('plain_video')" onmouseover="RMbuttonModeOnHover('plain_video');" onmouseout="RMbuttonModeOffHover('plain_video')"><%= _("plain video") %></span>
        &nbsp;<%= _(" or ") %>&nbsp;
        <span id="RMbuttonWebLecture" class="RMbuttonDisplay" onclick="RMbuttonModeSelect('web_lecture')" onmouseover="RMbuttonModeOnHover('web_lecture');" onmouseout="RMbuttonModeOffHover('web_lecture')"><%= _("web lecture") %></span>
        <div id="RMrightPaneWebLecture" class="RMHolderPaneDefaultInvisible">
            <br />
            <b><%= _("3. Select an orphan lecture object: ") %></b>
        <div class="RMMatchPane">
            <% for orphan in Orphans: %>
                <% lectureDBid = orphan["id"] %>
                <% LOID        = orphan["LOID"] %>
                <div id="lo<%= lectureDBid %>" class="RMLODisplay" onclick="RMLOSelect(<%= lectureDBid %>)" onmouseover="RMLOBoxOnHover(<%= lectureDBid %>);" onmouseout="RMLOBoxOffHover(<%= lectureDBid %>);">
                    <table>
                        <tr width="100%">
                            <td width="30%" valign="top">
                                time: <%= orphan["time"] %><br />
                                date: <%= orphan["date"] %><br />
                                box:  <%= orphan["box"]  %>
                            </td>
                            <td width="70%" align="right">
                                <img src="http://lectureprocessing01.cern.ch/previews/<%= LOID %>/video0001.jpg">
                                <img src="http://lectureprocessing01.cern.ch/previews/<%= LOID %>/video0002.jpg"><br />
                            </td>
                        </tr>
                        <tr width="100%">
                            <td width="100%" colspan="2">
                            <img src="http://lectureprocessing01.cern.ch/previews/<%= LOID %>/content0001.jpg">
                            <img src="http://lectureprocessing01.cern.ch/previews/<%= LOID %>/content0002.jpg">
                            <img src="http://lectureprocessing01.cern.ch/previews/<%= LOID %>/content0003.jpg">
                            <img src="http://lectureprocessing01.cern.ch/previews/<%= LOID %>/content0004.jpg">
                            </td>
                        </tr>
                    </table>
                </div>
            <% end %>
        </div>
        </div>
        <div id="RMrightPanePlainVideo" class="RMHolderPaneDefaultInvisible">
            <br />
            <b><%= _("3. Select options: ") %></b>
            <div class="RMMatchPane" style="height: 200px;">
                Select video aspect ratio:
                <input type="radio" name="talks" value="4/3" id="RMvideoFormat4to3" onclick="RMchooseVideoFormat('4/3')" checked>
                <label for="RMvideoFormat4to3">4/3</label>
                &nbsp;&nbsp;&nbsp;
                <input type="radio" name="talks" value="16/9" id="RMvideoFormat16to9" onclick="RMchooseVideoFormat('16/9')">
                <label for="RMvideoFormat16to9">16/9</label>
            </div>
        </div>
    </td>
  </tr>
<table>
<div id="RMlowerPane" class="RMHolderPaneDefaultVisible" style="margin-left: 150px;">
    <span>
        <br />
        <b><%= _("4. Create CDS record (and update micala database)") %></b>
        <br />
        <button onclick="RMCreateCDSRecord()">Create CDS record</button>
    </span>
    <br />
    <br />
    <br />
    <span>
        <b><%= _("5. Create Indico link to CDS record") %></b>
        <br />
        <button onclick="RMcreateIndicoLink()">Create Indico link</button>
    </span>
</div>

<br />
<br />
<br />
<div id="RMStatusMessageID" class="RMStatusMessage">
    <span>Put update messages here</span>
</div>

<script type="text/javascript">
    var isLecture = <%= jsBoolean(IsLecture) %>;
    var RR_contributions = <%= jsonEncode(Contributions) %>;
    var RR_contributionsLoaded = <%= jsBoolean(DisplayTalks or not HasTalks) %>;
    var RM_orphans = <%= jsonEncode(Orphans) %>;
</script>
