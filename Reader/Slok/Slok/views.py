import json
import mimetypes
import os

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from ranged_response import RangedFileResponse


from Slok.settings import PROJECT_ROOT


@csrf_exempt
def index(request):
    textsInfo = _read_json_file('textsInfo')['textsInfo']
    return render(request, 'index.html', {'content1': 'block', 'error_message': '', 'textsInfo': textsInfo})


@csrf_exempt
def mantra(request):
    if request.method != "POST":
        return HttpResponse("Thanks")
    file_name = request.POST.get('name')
    if file_name is None:
        return HttpResponse("Thanks")
    shlokas = _read_json_file(file_name)['shlokas']
    timelines = _read_json_file(file_name + '_timelines')
    data = {}
    data['shlokas'] = shlokas
    data['timelines'] = timelines
    data['name'] = file_name
    return JsonResponse(data, safe=False)


@csrf_exempt
def mantra_audio(request, filename):
    file = os.path.join(PROJECT_ROOT, "static/data/", filename)
    response = RangedFileResponse(
        request, open(file, 'rb'),
        content_type=mimetypes.guess_type(file)[0]
    )
    return response


def _read_json_file(name):
    with open(os.path.join(PROJECT_ROOT, 'static/data/' + name + '.json'), 'r',encoding='utf-8') as myfile:
        data = myfile.read()
    return json.loads(data)
