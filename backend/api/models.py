from django.db import models
from django.contrib.auth.models import User     

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    author = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "notes")

    def __str__(self):
        return self.title

class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="clients")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    passport = models.CharField(max_length=50, unique=True)
    room_number = models.CharField(max_length=10)
    check_in_date = models.DateTimeField(auto_now_add=True)
    check_out_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

class Room(models.Model):
    ROOM_TYPES = (
        ('standard', 'Стандарт'),
        ('comfort', 'Комфорт'),
        ('lux', 'Люкс'),
        ('suite', 'Сьют'),
    )
    
    number = models.CharField(max_length=10, unique=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    capacity = models.PositiveIntegerField()  # Вместимость (1-4 человека)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image_url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Номер {self.number} ({self.get_room_type_display()})"

class Document(models.Model):
    DOC_TYPES = (
        ('contract', 'Договор'),
        ('invoice', 'Счет'),
        ('act', 'Акт')
    )
    
    author = models.ForeignKey(User, on_delete=models.CASCADE)  # Кто создал документ
    client = models.ForeignKey(Client, on_delete=models.CASCADE)  # Для кого документ
    doc_type = models.CharField(max_length=20, choices=DOC_TYPES)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_doc_type_display()} #{self.id}"
