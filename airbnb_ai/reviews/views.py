from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from bookings.models import Booking
from .models import Review
from .serializers import ReviewSerializer


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        property_obj = serializer.validated_data["property"]

        has_booking = Booking.objects.filter(
            property=property_obj,
            guest=self.request.user
        ).exists()

        if not has_booking:
            raise ValidationError("You can only review properties you have booked.")

        serializer.save(guest=self.request.user)