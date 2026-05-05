from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from datetime import datetime
from .models import Property
from .serializers import PropertySerializer
from bookings.models import Booking
from bookings.serializers import BookingSerializer
from django.db.models import Count, Sum, Avg
from rest_framework.permissions import IsAuthenticated, AllowAny


class PropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Property.objects.all()

        city = self.request.GET.get("city")
        min_price = self.request.GET.get("min_price")
        max_price = self.request.GET.get("max_price")

        if city:
            queryset = queryset.filter(city__icontains=city)
        if min_price:
            queryset = queryset.filter(price_per_night__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_night__lte=max_price)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertySerializer
    queryset = Property.objects.all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.owner:
            raise PermissionDenied("You can only update your own properties.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.owner:
            raise PermissionDenied("You can only delete your own properties.")
        instance.delete()


class MyPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)


class PropertyAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        check_in = request.GET.get("check_in")
        check_out = request.GET.get("check_out")

        if not check_in or not check_out:
            return Response({"error": "Dates required"}, status=400)

        check_in = datetime.strptime(check_in, "%Y-%m-%d").date()
        check_out = datetime.strptime(check_out, "%Y-%m-%d").date()

        overlapping = Booking.objects.filter(
            property_id=pk
        ).filter(
            Q(check_in_date__lt=check_out) & Q(check_out_date__gt=check_in)
        )

        return Response({"available": not overlapping.exists()})


class HostStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = request.user.properties.all()

        total_properties = properties.count()

        bookings = Booking.objects.filter(property__owner=request.user)

        total_bookings = bookings.count()

        total_revenue = bookings.aggregate(
            total=Sum("total_price")
        )["total"] or 0

        average_rating = properties.aggregate(
            avg=Avg("average_rating")
        )["avg"] or 0

        return Response({
            "total_properties": total_properties,
            "total_bookings": total_bookings,
            "total_revenue": total_revenue,
            "avg_rating": round(average_rating, 2)
        })


class HostDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = request.user.properties.all()

        total_properties = properties.count()

        bookings = Booking.objects.filter(property__owner=request.user)

        total_bookings = bookings.count()

        total_revenue = bookings.aggregate(
            total=Sum("total_price")
        )["total"] or 0

        average_rating = properties.aggregate(
            avg=Avg("average_rating")
        )["avg"] or 0

        return Response({
            "total_properties": total_properties,
            "total_bookings": total_bookings,
            "total_revenue": total_revenue,
            "avg_rating": round(average_rating, 2)
        })


class PropertyBookingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        """Get all bookings for a specific property"""
        try:
            property_obj = Property.objects.get(pk=pk)
            bookings = Booking.objects.filter(property=property_obj)
            serializer = BookingSerializer(bookings, many=True)
            return Response(serializer.data)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=404)