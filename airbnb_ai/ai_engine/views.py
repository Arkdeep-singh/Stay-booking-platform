from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from properties.models import Property

def recommend_page(request):
    properties = Property.objects.all()

    budget = request.GET.get("budget")
    location = request.GET.get("location")
    guests = request.GET.get("guests")

    if budget:
        properties = properties.filter(price_per_night__lte=budget)

    if location:
        properties = properties.filter(location__icontains=location)

    if guests:
        properties = properties.filter(max_guests__gte=guests)

    properties = properties.order_by("-average_rating")[:6]

    return render(request, "ai_engine/recommend.html", {
        "properties": properties
    }) 