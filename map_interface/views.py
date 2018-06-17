from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.conf.urls.static import static
from .models import Stop
import random

def index(request):
    return render(request, 'index.html')


def dbTest(request):
    return HttpResponse(Stop.objects.all())
    # return HttpResponse("test")


def extend(request):
    html_var = "F-strings"
    html_ = f"""<!DOCTYPE html>
    <html lang=en>
    <head>
    </head>
    <body>
    <h1>Hello, world</h1>
    <p>THis is {html_var} coming through!</p>
    </body>
    </html>
    """
    return HttpResponse(html_)


def use_template(request):
    num = random.randint(0, 100000)
    my_bool = True if num >= 50000 else False
    html_var = "myVar"
    my_list = [random.randint(0, 100000),
               random.randint(0, 100000),
               random.randint(0, 100000)]
    context = {"html_var": html_var,
               "my_bool": my_bool,
               "cool_num": num,
               "my_list": my_list}

    return render(request, "use_template.html", context)
