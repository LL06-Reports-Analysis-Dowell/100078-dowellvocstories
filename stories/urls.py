from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import QrGen, Record,Sample,Sample1,Home,Priview,ShowVideo,SendMail

urlpatterns = [
    path('',Home.as_view()),
    path('qrgen',QrGen.as_view()),
    path('priview',Priview.as_view()),
    path('showvideo',ShowVideo.as_view()),
    path('brandurl',Record.as_view()),
    path('sample',Sample.as_view()),
    path('sample1',Sample1.as_view()),
    path('sendmail',SendMail.as_view())
]

if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,
                                document_root=settings.MEDIA_ROOT)