# Generated by Django 5.1 on 2024-08-30 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='localsol',
            name='save_first',
            field=models.TextField(default='1724981822032533000', verbose_name='date first saved'),
        ),
    ]
