from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
from cryptography.fernet import Fernet
from . import models
from . import qrcodegen
from PIL import Image
import random
from django.core.mail import send_mail
from django.http import HttpResponse,HttpRequest
from django.core.files.base import ContentFile
# Create your views here.

key="l6h8C92XGJmQ_aXpPN7_VUMzA8LS8Bg50A83KNcrVhQ="
def encode(key,text):
    cipher_suite = Fernet(key.encode())
    encoded_text = cipher_suite.encrypt(text.encode())
    return encoded_text
def decode(key,decodetext):
    cipher_suite = Fernet(key.encode())
    decoded_text = cipher_suite.decrypt(decodetext.encode())
    return decoded_text.decode()

class Home(View):
    template_name = 'stories/stories_home.html'
    def get(self, request):
        return render(request, self.template_name)
    
class Priview(View):
    template_name = 'stories/stories_preview.html'
    def get(self, request):
        return render(request,self.template_name)
    
class ShowVideo(View):
    template_name = 'stories/stories_show_video.html'
    def get(self, request):
        return render(request,self.template_name)
class QrGen(View):
    template_name1 = 'stories/stories_emcode.html'
    template_name2 = 'stories/stories_showqr.html'
    def get(self,request):
        return render(request,self.template_name1)
    def post(self, request):
        brand1 = request.POST['brand']
        product1 = request.POST['product']
        is_accept = request.POST['checkbox']
        brand=encode(key,brand1)
        product=encode(key,product1)
        rand_num = random.randrange(1,10000)
        obj = models.QrCode.objects.create(brand=brand, product=product,is_accept=is_accept,link=f"http://127.0.0.1:8000/brandurl?brand={brand.decode()}&product={product.decode()}")
        obj.genQr = f'qrcodes/{brand1}{rand_num}.png'
        obj.save()
        qrcodegen.qrgen("http://127.0.0.1:8000/brandurl",brand.decode(),product.decode(),f"media/qrcodes/{brand1}{rand_num}.png")
        with Image.open(f"media/qrcodes/{brand1}{rand_num}.png") as image:
            image.thumbnail((128,128))
            image.save(f"media/qrcodes/thumbnails/{brand1}{rand_num}.png","JPEG")
        context = {}
        context["linkurl"]=f"http://127.0.0.1:8000/brandurl?brand={brand.decode()}&product={product.decode()}"
        context['brnd'] = brand1
        context['prd'] = product1
        context['img'] = f"{brand1}{rand_num}"
        return render(request,self.template_name2,context)
        return HttpResponse('success')
    
class ShowQr(View):
    template_name = 'stories/stories_showqr.html'
    def get(self,request):
        return render(request,self.template_name)

class Record(View):
    template_name = 'stories/stories_record.html'
    def get(self,request):
        context = {}
        brand=request.GET.get('brand',None)
        context["brand"]=decode(key,brand)
        brand1 = decode(key,brand)
        product=request.GET.get('product',None)
        product1 = decode(key,product)
        context["product"]=decode(key,product)
        return render(request,self.template_name, context)
    def post(self,request):
        video = request.FILES['file']
        content_file = ContentFile(video.read(), name=video.name)
        file = models.Video.objects.create(video = content_file)
        return JsonResponse({'success':"success"})
    
class SendMail(View):
    template_name = 'stories/stories_qrsend.html'
    def post(self, request):
        email = request.POST['email']
        user = request.POST['user']
        img = request.POST['imager']
        urlim = request.POST['urlsr']
        context={}
        context["email"]=email
        htmlgen = f"Dear {user}, <br> QR code link  is <strong>http://127.0.0.1:8000/media/qrcodes/{img}.png</strong> <br/> <h2><br> Embed this code to your website copy this and paste your website</h2><br>&lt;iframe width='300' height='500' style='background-color:white' src='{urlim}' style='-webkit-transform:scale(0.7);-moz-transform-scale(0.7);' FRAMEBORDER='no' BORDER='0' SCROLLING='no'&gt;&lt;/iframe&gt;>"
        send_mail('Embed your code to your website',"Thank You",'dowelllogintest@gmail.com',[email], fail_silently=False, html_message=htmlgen)
        context["user"]=user
        context["email"]=email
        context["urlm"]=urlim
        return render(request,self.template_name,context)
