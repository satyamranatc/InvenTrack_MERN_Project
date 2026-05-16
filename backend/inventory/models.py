from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    costPrice = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    stock = models.IntegerField(default=0)
    minStockThreshold = models.IntegerField(default=10)
    batchNumber = models.CharField(max_length=50, blank=True, null=True)
    expiryDate = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, default='Warehouse A')
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    unit = models.CharField(max_length=50, default='Pieces')

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Returned', 'Returned'),
    ]
    customerName = models.CharField(max_length=200)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField()
    orderDate = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.customerName} - {self.product.name}"

class InventoryLog(models.Model):
    TYPE_CHOICES = [
        ('Inbound', 'Inbound'),
        ('Outbound', 'Outbound'),
        ('Adjustment', 'Adjustment'),
    ]
    timestamp = models.DateTimeField(auto_now_add=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, related_name='logs', null=True)
    productName = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantityChange = models.IntegerField()
    newStock = models.IntegerField()
    reason = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.type} - {self.productName} - {self.timestamp}"
