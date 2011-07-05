from MaKaC.services.implementation import resources
from MaKaC.services.implementation import roomBooking
from MaKaC.services.implementation import error

from MaKaC.services.interface.rpc import description
from MaKaC.plugins import PluginsHolder
from MaKaC.common import DBMgr


def importModule(name):
    mod = __import__(name)
    components = name.split('.')
    for comp in components[1:]:
        mod = getattr(mod, comp)
    return mod

def updateMethodMapWithPlugins():
    methodMap.update(PluginsHolder().getById("ajaxMethodMap").getAJAXDict())

methodMap = {

    "roomBooking.locations.list": roomBooking.RoomBookingListLocations,
    "roomBooking.rooms.list": roomBooking.RoomBookingListRooms,
    "roomBooking.rooms.availabilitySearch": roomBooking.RoomBookingAvailabilitySearchRooms,
    "roomBooking.rooms.fullNameList": roomBooking.RoomBookingFullNameListRooms,
    "roomBooking.locationsAndRooms.list" :roomBooking.RoomBookingListLocationsAndRooms,
    "roomBooking.locationsAndRooms.listWithGuids" :roomBooking.RoomBookingListLocationsAndRoomsWithGuids,
    "roomBooking.getDateWarning" :roomBooking.GetDateWarning,

    "roomBooking.mapaspects.create": roomBooking.RoomBookingMapCreateAspect,
    "roomBooking.mapaspects.update": roomBooking.RoomBookingMapUpdateAspect,
    "roomBooking.mapaspects.remove": roomBooking.RoomBookingMapRemoveAspect,
    "roomBooking.mapaspects.list": roomBooking.RoomBookingMapListAspects,
    "roomBooking.locationsAndRooms.getLink": roomBooking.RoomBookingLocationsAndRoomsGetLink,
    "roombooking.blocking.approve": roomBooking.RoomBookingBlockingApprove,
    "roombooking.blocking.reject": roomBooking.RoomBookingBlockingReject,

    "resources.timezones.getAll": resources.GetTimezones,

    "system.describe": description.describe,
    "system.error.report": error.SendErrorReport
}

endpointMap = {

    "event": importModule("MaKaC.services.implementation.conference"),
    "user": importModule('MaKaC.services.implementation.user'),
    "contribution": importModule('MaKaC.services.implementation.contribution'),
    "session": importModule('MaKaC.services.implementation.session'),
    "schedule": importModule('MaKaC.services.implementation.schedule'),
    "search": importModule('MaKaC.services.implementation.search'),
    "material": importModule('MaKaC.services.implementation.material'),
    "reviewing": importModule('MaKaC.services.implementation.reviewing'),
    "minutes": importModule('MaKaC.services.implementation.minutes'),
    "news": importModule('MaKaC.services.implementation.news'),
    "collaboration": importModule('MaKaC.services.implementation.collaboration'),
    "plugins": importModule('MaKaC.services.implementation.plugins'),
    "category": importModule('MaKaC.services.implementation.category'),
    "upcomingEvents": importModule('MaKaC.services.implementation.upcoming'),
    "timezone": importModule('MaKaC.services.implementation.timezone'),
    "scheduler": importModule('MaKaC.services.implementation.scheduler'),
    "abstractReviewing": importModule('MaKaC.services.implementation.abstractReviewing'),

    # Tests - just for remote testing of JSON-RPC
    "test": importModule('MaKaC.services.implementation.test')
}
