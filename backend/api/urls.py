from django.urls import path
from . import views
from .views import ( 
    NoteListCreate,
    NoteDelete,
    ClientListCreate,
    ClientDetail,
    ClientDelete,
    ClientViewSet,
    RoomViewSet,
    DocumentViewSet
)

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>", views.NoteDelete.as_view(), name="delete-note"),

    path("clients/", views.ClientListCreate.as_view(), name="client-list"),
    path("clients/<int:pk>/", views.ClientDetail.as_view(), name="client-detail"),
    path("clients/delete/<int:pk>/", views.ClientDelete.as_view(), name="client-delete"),

    path("rooms/", views.RoomViewSet.as_view({
    'get': 'list',
    'post': 'create'
}), name="room-list"),

    path('documents/', DocumentViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='document-list'),
    path('documents/<int:pk>/', DocumentViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='document-detail'),
]
