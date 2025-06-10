from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note
from .models import Client, Room, Document

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only":True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user 

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}



class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at')

    def validate(self, data):
        required_fields = ['first_name', 'last_name', 'passport', 'room_number']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Это поле обязательно"})
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class ClientShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'first_name', 'last_name', 'passport', 'room_number']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'doc_type', 'check_in_date', 'check_out_date', 
                'total_amount', 'content', 'client', 'author', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']