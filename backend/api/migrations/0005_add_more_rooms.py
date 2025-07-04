# Generated by Django 5.2.1 on 2025-06-05 19:11

from django.db import migrations


def create_initial_rooms(apps, schema_editor):
    Room = apps.get_model('api', 'Room')
    
    initial_rooms = [
    {
        'number': '2',
        'room_type': 'standard',
        'capacity': 1,
        'price_per_night': 1800,
        'description': 'Уютный стандартный номер для одного гостя'
    },
    {
        'number': '3',
        'room_type': 'comfort',
        'capacity': 2,
        'price_per_night': 3500,
        'description': 'Просторный комфорт-номер с двуспальной кроватью'
    },
    {
        'number': '4',
        'room_type': 'comfort',
        'capacity': 3,
        'price_per_night': 4500,
        'description': 'Комфорт-номер с дополнительным местом для третьего гостя'
    },
    {
        'number': '5',
        'room_type': 'lux',
        'capacity': 2,
        'price_per_night': 6500,
        'description': 'Роскошный люкс с панорамным видом и джакузи'
    },
    {
        'number': '6',
        'room_type': 'lux',
        'capacity': 4,
        'price_per_night': 8500,
        'description': 'Просторный люкс с двумя спальнями и гостиной зоной'
    },
    {
        'number': '7',
        'room_type': 'suite',
        'capacity': 2,
        'price_per_night': 10000,
        'description': 'Элитный сьют с отдельной террасой и VIP-обслуживанием'
    },
    {
        'number': '8',
        'room_type': 'suite',
        'capacity': 4,
        'price_per_night': 15000,
        'description': 'Президентский сьют с камином, кухней и видом на море'
    },
    {
        'number': '9',
        'room_type': 'standard',
        'capacity': 4,
        'price_per_night': 4000,
        'description': 'Семейный стандартный номер с двумя двуспальными кроватями'
    },
    {
        'number': '10',
        'room_type': 'comfort',
        'capacity': 1,
        'price_per_night': 2800,
        'description': 'Комфорт-номер для одного гостя с улучшенной звукоизоляцией'
    },
    {
        'number': '11',
        'room_type': 'lux',
        'capacity': 4,
        'price_per_night': 9500,
        'description': 'Люкс с открытой планировкой и панорамными окнами'
    }
    ]
    
    for room_data in initial_rooms:
        Room.objects.create(**room_data)

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_add_initial_rooms'),
    ]
    
    operations = [
        migrations.RunPython(create_initial_rooms),
    ]
