from django.urls import path
from .views import (
    PropertyListCreateView,
    PropertyDetailView,
    PropertyAvailabilityView,
    MyPropertiesView,
    HostStatsView,
    HostDashboardView,
    PropertyBookingsView,
)

urlpatterns = [
    path("", PropertyListCreateView.as_view(), name="property-list-create"),
    path("<int:pk>/", PropertyDetailView.as_view(), name="property-detail"),
    path("<int:pk>/availability/", PropertyAvailabilityView.as_view(), name="property-availability"),
    path("<int:pk>/bookings/", PropertyBookingsView.as_view(), name="property-bookings"),
    path("my-properties/", MyPropertiesView.as_view(), name="my-properties"),
    path("host-stats/", HostStatsView.as_view(), name="host-stats"),
    path("host/dashboard/", HostDashboardView.as_view(), name="host-dashboard"),
]