from django.urls import path
from .views import recommend_page

urlpatterns = [
    path("recommend-page/", recommend_page, name="recommend-page"),
]