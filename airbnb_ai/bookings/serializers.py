from decimal import Decimal
from rest_framework import serializers
from django.utils import timezone
from django.db.models import Q
from .models import Booking
from properties.models import Property
from properties.serializers import PropertySerializer
from users.serializers import UserSerializer


class BookingSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    guest = UserSerializer(read_only=True)
    property_title = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ("guest", "total_price", "number_of_nights", "created_at", "property_title")

    def get_property_title(self, obj):
        """Get the title of the property"""
        return obj.property.title if obj.property else None

    def validate(self, data):
        request = self.context["request"]
        property_obj = data["property"]
        check_in = data["check_in_date"]
        check_out = data["check_out_date"]

        # 1️⃣ check_out must be after check_in
        if check_out <= check_in:
            raise serializers.ValidationError(
                {"non_field_errors": ["Check-out must be after check-in."]}
            )

        # 2️⃣ Cannot book in the past
        if check_in < timezone.now().date():
            raise serializers.ValidationError(
                {"non_field_errors": ["Cannot book past dates."]}
            )

        # 3️⃣ Host cannot book own property
        if property_obj.owner == request.user:
            raise serializers.ValidationError(
                {"non_field_errors": ["You cannot book your own property."]}
            )

        # 4️⃣ Overlapping booking check
        overlapping = Booking.objects.filter(
            property=property_obj
        ).filter(
            Q(check_in_date__lt=check_out) & Q(check_out_date__gt=check_in)
        )

        if overlapping.exists():
            raise serializers.ValidationError(
                {"non_field_errors": ["Property already booked for these dates."]}
            )

        return data

    def create(self, validated_data):
        property_obj = validated_data["property"]
        check_in = validated_data["check_in_date"]
        check_out = validated_data["check_out_date"]

        days = (check_out - check_in).days
        total_price = Decimal(str(days * property_obj.price_per_night))

        return Booking.objects.create(
            guest=self.context["request"].user,
            property=property_obj,
            check_in_date=check_in,
            check_out_date=check_out,
            total_price=total_price,
            number_of_nights=days,
        )