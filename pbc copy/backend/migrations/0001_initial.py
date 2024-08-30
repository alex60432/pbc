# Generated by Django 5.1 on 2024-08-29 21:14

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='guest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identity', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='puzzle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.IntegerField(default=0)),
                ('pub_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='date published')),
                ('score', models.IntegerField(default=0)),
                ('like', models.IntegerField(default=0)),
                ('started', models.IntegerField(default=0)),
                ('name', models.CharField(max_length=50)),
                ('describe', models.TextField(default='')),
                ('img', models.TextField(default='')),
                ('ans', models.TextField(default='')),
                ('guestlikedby', models.ManyToManyField(blank=True, related_name='guest_liked', to='backend.guest')),
            ],
        ),
        migrations.AddField(
            model_name='guest',
            name='guestcompleted',
            field=models.ManyToManyField(blank=True, related_name='guest_completed_this', to='backend.puzzle'),
        ),
        migrations.AddField(
            model_name='guest',
            name='guestcompleting',
            field=models.ManyToManyField(blank=True, related_name='guest_completing_this', to='backend.puzzle'),
        ),
        migrations.AddField(
            model_name='guest',
            name='guestnotstarted',
            field=models.ManyToManyField(blank=True, related_name='guest_starteded_this', to='backend.puzzle'),
        ),
        migrations.CreateModel(
            name='user',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=50)),
                ('userid', models.CharField(default='', max_length=50)),
                ('password', models.CharField(max_length=250)),
                ('img', models.TextField(default='')),
                ('email', models.EmailField(max_length=254)),
                ('completed', models.ManyToManyField(blank=True, related_name='users_completed_this', to='backend.puzzle')),
                ('completing', models.ManyToManyField(blank=True, related_name='users_completing_this', to='backend.puzzle')),
                ('notstarted', models.ManyToManyField(blank=True, related_name='users_starteded_this', to='backend.puzzle')),
            ],
        ),
        migrations.CreateModel(
            name='savedpuzzle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('save_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='date saved')),
                ('progress', models.TextField(default='')),
                ('guestsavedby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.guest')),
                ('savedof', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.puzzle')),
                ('savedby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.user')),
            ],
        ),
        migrations.AddField(
            model_name='puzzle',
            name='createdby',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='user_created', to='backend.user'),
        ),
        migrations.AddField(
            model_name='puzzle',
            name='likedby',
            field=models.ManyToManyField(blank=True, related_name='user_liked', to='backend.user'),
        ),
        migrations.CreateModel(
            name='localsol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.TextField(default='')),
                ('save_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='date saved')),
                ('save_first', models.TextField(default='1724966075455638000', verbose_name='date first saved')),
                ('title', models.CharField(max_length=50)),
                ('localans', models.TextField(default='')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.user')),
            ],
        ),
    ]
