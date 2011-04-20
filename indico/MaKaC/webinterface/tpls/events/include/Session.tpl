<%page args="item, parent=None, minutes=False, titleClass='topLevelTitle'"/>

<%namespace name="common" file="Common.tpl"/>

<% session = item.getSession() %>

<li class="meetingSession">
    <span class="containerTitle confModifPadding">
        <a name="${session.getId()}"></a>
        <%include file="ManageButton.tpl" args="item=item, alignRight=True"/>
        <span class="topLevelTime">
            ${getTime(item.getAdjustedStartDate(timezone))} - ${getTime(item.getAdjustedEndDate(timezone))}
        </span>
        <span class="${titleClass}">
        % if item.getTitle() != "" and item.getTitle() != session.getTitle():
            ${session.getTitle()}: ${item.getTitle()}
        % else:
            ${session.getTitle()}
        % endif
        </span>
    </span>

    % if session.getDescription():
    <span class="description">${common.renderDescription(session.getDescription())}</span>
    % endif

    <table class="sessionDetails">
        <tbody>
        % if len(item.getConvenerList()) > 0 or session.getConvenerText():
            <tr>
                <td class="leftCol">Convener${'s' if len(session.getConvenerList()) > 1 else ''}:</td>
                <td>${common.renderUsers(item.getConvenerList(), unformatted=session.getConvenerText())}</td>
            </tr>
        % endif

        % if getLocationInfo(item) != getLocationInfo(item.getOwner()):
            <tr>
                <td class="leftCol">Location:</td>
                <td>${common.renderLocation(item, parent=item.getOwner())}</td>
            </tr>
        % endif

        % if len(session.getAllMaterialList()) > 0:
        <tr>
            <td class="leftCol">Material:</td>
            <td>
            % for material in session.getAllMaterialList():
                % if material.canView(accessWrapper):
                <%include file="Material.tpl" args="material=material, sessionId=session.getId()"/>
                % endif
            % endfor
            </td>
        </tr>
        % endif
        </tbody>
    </table>

    % if minutes:
        % for minutesText in extractMinutes(session.getAllMaterialList()):
            <div class="minutesTable">
                <h2>Minutes</h2>
                <span>${common.renderDescription(minutesText)}</span>
            </div>
        % endfor
    % endif

    % if len(item.getSchedule().getEntries()) > 0:
    <ul class="meetingSubTimetable">
        % for subitem in item.getSchedule().getEntries():
            <%
                if subitem.__class__.__name__ != 'BreakTimeSchEntry':
                    subitem = subitem.getOwner()
            %>
            <%include file="${getItemType(subitem)}.tpl"
                args="item=subitem, parent=item, minutes=minutes, hideEndTime='true',
                timeClass='subEventLevelTime', titleClass='subEventLevelTitle',
                abstractClass='subEventLevelAbstract', scListClass='subEventLevelSCList'"/>
        % endfor
    </ul>
    % endif
</li>