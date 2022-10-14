


from . import views

from django.urls import include, path

urlpatterns = [
    path('', views.index, name='index'),
    path('nc/', views.getNumber , name='number'),
    #path('number/', views.move , name='move'),
]
