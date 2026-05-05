from django.db import models
from django.conf import settings
from django.db.models import Avg


class Property(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255, default="")
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    bedrooms = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    max_guests = models.IntegerField(default=2)
    amenities = models.TextField(default="", blank=True)
    image = models.ImageField(upload_to="property_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def average_rating(self):
        avg = self.reviews.all().aggregate(Avg("rating"))["rating__avg"]
        return round(avg, 2) if avg else 0

    @property
    def total_reviews(self):
        return self.reviews.count()

    def __str__(self):
        return self.title