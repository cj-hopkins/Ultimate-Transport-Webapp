# Generated by Django 2.0.6 on 2018-06-15 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map_interface', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stop',
            fields=[
                ('stop_id', models.IntegerField(primary_key=True, serialize=False)),
                ('stop_name', models.CharField(max_length=200)),
                ('stop_lat', models.FloatField(max_length=200)),
                ('stop_long', models.FloatField()),
            ],
        ),
        migrations.DeleteModel(
            name='Question',
        ),
    ]
