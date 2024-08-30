from django.urls import path, re_path
from.views import index

urlpatterns = [
    path("start/", index),
    path("background/", index),
    path("login/", index),
    re_path("dash/(.*)", index),
    re_path('create/(.*)',index),
    re_path('solve/(.*)',index),
    re_path('visit/(.*)',index),
    re_path("(.*)", index),
]