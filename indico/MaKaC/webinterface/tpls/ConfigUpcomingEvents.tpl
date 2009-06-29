<table>
  <tr>
    <td class="titleCellTD">
      <span class="titleCellFormat"><%= _("Number of items")%></span>
    </td>
    <td id="inPlaceNumberItems"></td>
  </tr>

  <tr>
    <td class="titleCellTD">
      <span class="titleCellFormat"><%= _("Cache TTL (minutes)")%></span>
    </td>
    <td id="inPlaceCacheTTL"></td>
  </tr>

  <tr>
    <td class="titleCellTD">
      <span class="titleCellFormat"><%= _("Observed Events/Categories")%></span>
    </td>
    <td id="categoryEventList"></td>
  </tr>


</table>

<script type="text/javascript">
  <%= macros.genericField(macros.FIELD_TEXT, 'inPlaceCacheTTL', 'upcomingEvents.admin.changeCacheTTL', {}, preCache=True, rh=self._rh) %>

  <%= macros.genericField(macros.FIELD_TEXT, 'inPlaceNumberItems', 'upcomingEvents.admin.changeNumberItems', {}, preCache=True, rh=self._rh) %>

  var categEventSelector = new UpcomingEventFavoritesWidget();
  $E('categoryEventList').set(categEventSelector.draw());

</script>