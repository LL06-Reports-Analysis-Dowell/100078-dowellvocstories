from django.db import models

# Create your models here.


class QrCode(models.Model):
    brand = models.CharField(max_length=50)
    product = models.CharField(max_length=50)
    is_accept = models.BooleanField(default=False)
    link = models.CharField(max_length=500)
    genQr = models.ImageField(upload_to='qrcodes/')

    def __str__(self):
        return self.brand


class Video(models.Model):
    video = models.FileField(upload_to='videos_uploaded',null=True,blank=True)
    def __str__(self):
        return (f"{self.video}")