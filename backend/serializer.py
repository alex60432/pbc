from rest_framework.serializers import ModelSerializer
from .models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['username','password','email','started','completed','completing']

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['username','password','email' ]

class CheckEmailSerializer(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['email']

class SendEmailSerializer(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['email']

class LoginCheckerSerializer(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['email','password']

class PasswordChangeSerializer(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['email','password']

class changeusername(serializers.ModelSerializer):
    newusername = serializers.CharField()
    class Meta():
        model=user
        fields=['newusername']

class changeprofpic(serializers.ModelSerializer):
    class Meta():
        model=user
        fields=['img']

class cookieuser(serializers.Serializer):
        userid=serializers.CharField()

class cookieuserget(serializers.Serializer):
        username=serializers.CharField()
        page=serializers.IntegerField()
        
class cookieguest(serializers.Serializer):
        identity=serializers.IntegerField()

class addnewsave(serializers.ModelSerializer):
    startdate = serializers.CharField()
    class Meta():
        model=localsol 
        fields=('img','title','localans','startdate')

class createpuzzle(serializers.ModelSerializer):
    startdate = serializers.CharField()
    class Meta():
        model=puzzle
        fields=('score','name','describe','img','ans','startdate')

class moredown(serializers.Serializer):
    username = serializers.CharField()
    rank = serializers.CharField()
    
class moreup(serializers.Serializer):
    username = serializers.CharField()
    rank = serializers.CharField()

class getuserinit(serializers.Serializer):
    rank = serializers.CharField()

class gettopinit(serializers.Serializer):
    rank = serializers.CharField()

class getpuzbyname(serializers.Serializer):
    name = serializers.CharField()

class updateprogress(serializers.ModelSerializer):
    name = serializers.CharField()
    class Meta():
        model=savedpuzzle
        fields=('progress','name')

class puzzledone(serializers.Serializer):
    name = serializers.CharField()

class getnewpage(serializers.Serializer):
    page= serializers.IntegerField()
    type= serializers.IntegerField()
    
class getnewpagesearch(serializers.Serializer):
    search= serializers.CharField(allow_blank=True)
    type= serializers.IntegerField()
    page=serializers.IntegerField()
    sort= serializers.IntegerField()

class like(serializers.Serializer):
    name= serializers.CharField()

class visitnewcontent(serializers.Serializer):
    name=serializers.CharField()
    order=serializers.IntegerField()
    page=serializers.IntegerField()
    search= serializers.CharField(allow_blank=True)
    type= serializers.IntegerField()

class alarmchangeusername(serializers.Serializer):
    newname=serializers.CharField()