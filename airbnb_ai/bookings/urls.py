from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    MyBookingsView,
    HostBookingsView,
)

urlpatterns = [
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("my-bookings/", MyBookingsView.as_view(), name="my-bookings"),
    path("host-bookings/", HostBookingsView.as_view(), name="host-bookings"),
]