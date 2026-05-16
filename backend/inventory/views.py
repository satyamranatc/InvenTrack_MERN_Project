from rest_framework import viewsets, status, response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Category, Product, Order, InventoryLog
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, InventoryLogSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # permission_classes = [IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        product = serializer.save()
        InventoryLog.objects.create(
            product=product,
            productName=product.name,
            type='Inbound',
            quantityChange=product.stock,
            newStock=product.stock,
            reason='Initial Stock Entry'
        )

    def perform_update(self, serializer):
        old_stock = self.get_object().stock
        product = serializer.save()
        new_stock = product.stock
        
        if old_stock != new_stock:
            quantity_change = new_stock - old_stock
            log_type = 'Inbound' if quantity_change > 0 else 'Outbound'
            if 'adjustment' in self.request.data.get('reason', '').lower():
                log_type = 'Adjustment'
            
            InventoryLog.objects.create(
                product=product,
                productName=product.name,
                type=log_type,
                quantityChange=quantity_change,
                newStock=new_stock,
                reason=self.request.data.get('reason', 'Manual Update')
            )

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.save()
        product = order.product
        
        # Deduct stock
        product.stock -= order.quantity
        product.save()
        
        # Log movement
        InventoryLog.objects.create(
            product=product,
            productName=product.name,
            type='Outbound',
            quantityChange=-order.quantity,
            newStock=product.stock,
            reason=f'Order #{order.id} for {order.customerName}'
        )

class InventoryLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InventoryLog.objects.all().order_by('-timestamp')
    serializer_class = InventoryLogSerializer
    # permission_classes = [IsAuthenticated]
