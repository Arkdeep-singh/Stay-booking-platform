from rest_framework import serializers
from .models import Property
from reviews.serializers import ReviewSerializer


class PropertySerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "id", "owner", "title", "description", "city", "address",
            "price_per_night", "bedrooms", "bathrooms", "max_guests",
            "amenities", "image", "average_rating", "total_reviews",
            "reviews", "created_at"
        ]
        read_only_fields = ("owner", "created_at")

    def get_average_rating(self, obj):
        return obj.average_rating

    def get_total_reviews(self, obj):
        return obj.total_reviews