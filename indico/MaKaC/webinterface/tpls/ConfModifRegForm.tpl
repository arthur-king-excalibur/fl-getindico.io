<br/>
<table>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Current status")}</span></td>
    <td class="blacktext" colspan="2">
      <form action="${ setStatusURL }" method="POST">
    <div>
      <input name="changeTo" type="hidden" value="${ changeTo }" />
      <b>${ status }</b>
      <small><input type="submit" class="btn" value="${ changeStatus }" /></small>
    </div>
      </form>
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Registration start date")}</span></td>
    <td class="blacktext">
      ${ startDate }
    </td>
    <td rowspan="8" style="align: right; vertical-align: bottom;">
      <form action="${ dataModificationURL }" method="POST">
    <div>
      <input type="submit" class="btn" value="${ _("modify")}" ${ disabled } />
    </div>
      </form>
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Registration end date")}</span></td>
    <td class="blacktext">
      ${ endDate }
      % if extraTimeAmount:
      (${ _("Allow")}&nbsp;${ extraTimeAmount }&nbsp;${ extraTimeUnit }&nbsp;${ _("after")})
      % endif
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat">${ _("Modification end date")}</span></td>
    <td class="blacktext">
      ${ modificationEndDate }
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Title")}</span></td>
    <td class="blacktext">
      ${ title }
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Contact info")}</span></td>
    <td class="blacktext">
      ${ contactInfo }
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Announcement")}</span></td>
    <td class="blacktext">
      <pre>${ announcement }</pre>
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Max No. of registrants")}</span></td>
    <td class="blacktext">
      ${ usersLimit }
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Email notification sender address")}</span></td>
    <td class="blacktext">
      ${ notificationSender }
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Email notification (on new registrations)")}</span></td>
    <td class="blacktext">
      ${ notification }
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Email registrant")}</span></td>
    <td bgcolor="white" width="100%">
      % if activated:
      <table>
        <tr>
          <td align="right"><strong>${ _("After registration")}</strong>:</td>
          <td>${ sendRegEmail }</td>
        </tr>
        <tr>
          <td align="right"><strong>${ _("With a payment summary")}</strong>:</td>
          <td>${ sendReceiptEmail }</td>
        </tr>
        <tr>
          <td align="right"><strong>${ _("After successful payment")}</strong>:</td>
          <td>${ sendPaidEmail }</td>
        </tr>
      </table>
      % endif
    </td>
  </tr>
  <tr>
    <td class="dataCaptionTD"><span class="dataCaptionFormat"> ${ _("Must have account")}</span></td>
    <td class="blacktext">
      ${ mandatoryAccount }
    </td>
  </tr>
  <tr>
    <td colspan="3" class="horizontalLine">&nbsp;</td>
  </tr>
  <tr>
    <td class="dataCaptionTD">
      <a name="sections"></a>
      <span class="dataCaptionFormat">${ _("Sections of the form")}</span>
      <br/>
      <br/>
      <img src=${ enablePic } alt="${ _("Click to disable")}"> <small> ${ _("Enabled section")}</small>
      <br/>
      <img src=${ disablePic } alt="${ _("Click to enable")}"> <small> ${ _("Disabled section")}</small>
    </td>
    <form action=${ actionSectionURL } method="POST">
      <td class="blacktext" style="padding-left:20px">
    ${ sections }
      </td>
      <td>
    <input type="submit" class="btn" name="removeSection" value="${ _("remove sect.")}" />
    <input type="submit" class="btn" name="newSection" value="${ _("new sect.")}" />
      </td>
    </form>
  </tr>
  <tr>
    <td colspan="3" class="horizontalLine">&nbsp;</td>
  </tr>
  <tr>
    <td class="dataCaptionTD">
      <span class="dataCaptionFormat"> ${ _("Custom statuses")}</span>
    </td>
    <td colspan="2">
      <form action=${ actionStatusesURL } method="POST">
    <table>
      <tr>
        <td colspan="2">
          <input type="text" name="caption" value="" size="50" />
          <input type="submit" class="btn" name="addStatus" value="${ _("add status")}" />
        </td>
      </tr>
      <tr>
        <td>${ statuses }</td>
        <td>
          <input type="submit" class="btn" name="removeStatuses" value="${ _("remove status")}" />
        </td>
      </tr>
    </table>
      </form>
    </td>
  </tr>
  <tr>
    <td colspan="3" class="horizontalLine">&nbsp;</td>
  </tr>
</table>
<br/>
