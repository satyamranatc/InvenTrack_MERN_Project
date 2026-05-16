from rest_framework import serializers
from .models import Category, Product, Order, InventoryLog

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'costPrice', 'category', 'category_name', 
            'stock', 'minStockThreshold', 'batchNumber', 'expiryDate', 
            'location', 'image', 'unit'
        ]

class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Order
        fields = [
            'id', 'customerName', 'product', 'product_name', 
            'quantity', 'orderDate', 'status'
        ]

class InventoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryLog
        fields = '__all__'
