from django.db import models
import datetime
import time
# Create your models here. 
    
class user(models.Model):
    username = models.CharField(max_length=50)
    userid = models.CharField(default='',max_length=50)
    password=models.CharField(max_length=250)
    img=models.TextField(default='')
    email=models.EmailField()
    notstarted = models.ManyToManyField('puzzle',related_name='users_starteded_this',blank=True)
    completed = models.ManyToManyField('puzzle' ,related_name='users_completed_this',blank=True)
    completing = models.ManyToManyField('puzzle',related_name='users_completing_this',blank=True)

class guest(models.Model):
    identity=models.IntegerField(default=0)
    guestnotstarted = models.ManyToManyField('puzzle',related_name='guest_starteded_this',blank=True)
    guestcompleted = models.ManyToManyField('puzzle' ,related_name='guest_completed_this',blank=True)
    guestcompleting = models.ManyToManyField('puzzle',related_name='guest_completing_this',blank=True)

class puzzle(models.Model):
    code=models.IntegerField(default=0)
    pub_date = models.DateTimeField("date published", default=datetime.datetime.now)
    score=models.IntegerField(default=0)
    like = models.IntegerField(default=0)
    started = models.IntegerField(default=0)
    name=models.CharField(max_length=50)
    describe=models.TextField(default='')
    img=models.TextField(default='')
    ans=models.TextField(default='')
    likedby=models.ManyToManyField('user',related_name='user_liked', blank=True)
    guestlikedby=models.ManyToManyField('guest',related_name='guest_liked', blank=True)
    createdby=models.ForeignKey('user',related_name='user_created',on_delete=models.PROTECT, null=True)

class savedpuzzle(models.Model):
    save_date = models.DateTimeField("date saved", default=datetime.datetime.now)
    progress=models.TextField(default='')
    savedby=models.ForeignKey('user',on_delete=models.CASCADE, null=True)
    guestsavedby=models.ForeignKey('guest',on_delete=models.CASCADE, null=True)
    savedof=models.ForeignKey('puzzle',on_delete=models.CASCADE, null=True)

class localsol(models.Model):
    user=models.ForeignKey('user',on_delete=models.CASCADE)
    img=models.TextField(default='')
    save_date = models.DateTimeField("date saved", default=datetime.datetime.now)
    save_first = models.TextField("date first saved", default=str(time.time_ns()))
    title=models.CharField(max_length=50)
    localans=models.TextField(default='')
